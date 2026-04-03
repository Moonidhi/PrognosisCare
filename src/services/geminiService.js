/**
 * AI recommendation service — calls Google Generative Language API
 * to produce symptom-based triage recommendations.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-flash-preview';

function buildGeminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

function getModelCandidates() {
  const candidates = [
    GEMINI_MODEL,
    'gemini-3-flash-preview',
    'gemini-3.0-flash',
  ].filter(Boolean);

  return [...new Set(candidates)];
}

function withTimeoutSignal(timeoutMs = 12000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}
/**
 * Build the prompt that instructs the AI model to return structured JSON.
 */
function buildPrompt(symptoms, fileData = null) {
  let context = `You are a medical AI triage assistant for Prognosis Care, a healthcare platform in India.

A patient describes the following symptoms:
"${symptoms}"

First determine whether this input is actually health/symptom related.

Based on the symptoms, provide:
1. A short medical triage summary (1-3 sentences).
2. A list of recommended diagnostic tests ONLY if medically needed.
3. A risk assessment (Low/Medium/High) with a confidence score.
4. The most appropriate medical department for consultation.
5. Explainable AI reasoning: List 2-3 key factors explaining why you chose this risk level and department.

IMPORTANT: Respond ONLY with valid JSON in the exact format below — no markdown, no backticks, no extra text:
{
  "isHealthRelated": true,
  "summary": "Your 2-3 sentence medical summary here.",
  "riskLevel": "Low | Medium | High",
  "confidenceScore": 85,
  "recommendedDepartment": "General Medicine | Cardiology | Neurology | Orthopedics | etc.",
  "reasoning": [
    "Factor 1: e.g. Sudden onset of chest pain suggests cardiac issue.",
    "Factor 2: e.g. Age and history of hypertension increase risk."
  ],
  "tests": [
    {
      "id": "test-unique-id",
      "name": "Test Name",
      "reason": "Why this test is recommended for the given symptoms.",
      "priority": "high | medium | low",
      "cost": 1200
    }
  ]
}

Rules:
- If input is NOT health-related (for example: coding, math, random chat, jokes), return:
  - isHealthRelated: false
  - summary: "Please describe your health symptoms (for example: fever, cough, chest pain) so I can help."
  - tests: []
  - riskLevel: "Low"
  - confidenceScore: 0
  - recommendedDepartment: "General"
  - reasoning: []
- For isolated mild back pain/body pain/headache without red-flag symptoms, do not suggest blood tests/CRP/advanced panels by default.
- For mild isolated symptoms (for example only "headache" with no red flags), keep tests minimal or empty.
- Use realistic Indian hospital test costs in INR (₹500–₹5000 range) only when tests are needed.
- Prioritise tests that are clearly medically relevant.
- Do NOT diagnose; only provide triage guidance.
- Respond with pure JSON only.`;

  if (fileData) {
    context += `\n\n[Attached Medical Record/Image Analysis Required]`;
  }

  return context;
}

export function isLikelyHealthSymptomInput(input) {
  const text = (input || '').toLowerCase().trim();
  if (!text) return false;

  const genericOnlyInputs = new Set([
    'health',
    'healthy',
    'symptom',
    'symptoms',
    'medical',
    'doctor',
    'help',
    'hi',
    'hello',
  ]);

  if (genericOnlyInputs.has(text)) return false;

  const healthKeywords = [
    'pain',
    'headache',
    'fever',
    'cough',
    'cold',
    'vomit',
    'nausea',
    'dizziness',
    'breath',
    'chest',
    'bp',
    'blood pressure',
    'sugar',
    'diabetes',
    'fatigue',
    'weakness',
    'infection',
    'injury',
    'swelling',
    'rash',
    'stomach',
    'diarrhea',
    'constipation',
    'anxiety',
    'depression',
    'symptom',
  ];

  const hasHealthKeyword = healthKeywords.some((keyword) => text.includes(keyword));
  if (!hasHealthKeyword) return false;

  const meaningfulWords = text.split(/\s+/).filter(Boolean);
  return meaningfulWords.length >= 2 || text.includes('pain');
}

export function isSimpleLowRiskSymptomInput(input) {
  const text = (input || '').toLowerCase().trim();
  if (!text) return false;

  const lowRiskKeywords = [
    'back pain',
    'lower back pain',
    'body pain',
    'muscle pain',
    'neck pain',
    'headache',
    'mild pain',
    'soreness',
  ];

  const redFlagKeywords = [
    'severe',
    'unbearable',
    'chest pain',
    'shortness of breath',
    'breathing issue',
    'fainting',
    'numbness',
    'weakness in leg',
    'paralysis',
    'injury',
    'trauma',
    'accident',
    'fall',
    'fever',
    'weight loss',
    'blood in urine',
    'loss of bladder control',
    'loss of bowel control',
    'night sweats',
    'persistent vomiting',
  ];

  const hasLowRiskSymptom = lowRiskKeywords.some((keyword) => text.includes(keyword));
  const hasRedFlag = redFlagKeywords.some((keyword) => text.includes(keyword));

  return hasLowRiskSymptom && !hasRedFlag;
}

/**
 * Parse AI response text into a structured { summary, tests, riskLevel, ... } object.
 */
function parseGeminiResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const defaults = {
    isHealthRelated: true,
    summary: 'AI analysis completed. Please review the recommendations below.',
    tests: [],
    riskLevel: 'Low',
    confidenceScore: 50,
    recommendedDepartment: 'General Medicine',
    reasoning: []
  };

  const normalizePriority = (priority) => {
    const value = String(priority || '').toLowerCase();
    if (value === 'high' || value === 'medium' || value === 'low') return value;
    return 'medium';
  };

  const normalizeTests = (input) => {
    let tests = input;

    if (typeof tests === 'string') {
      const trimmed = tests.trim();
      if (!trimmed) return [];

      try {
        tests = JSON.parse(trimmed);
      } catch {
        return [];
      }
    }

    if (!Array.isArray(tests)) return [];

    return tests
      .map((test, index) => ({
        id: test?.id || `test-${index + 1}`,
        name: test?.name || 'Recommended test',
        reason: test?.reason || 'Recommended based on reported symptoms.',
        priority: normalizePriority(test?.priority),
        cost: Number.isFinite(Number(test?.cost)) ? Number(test.cost) : 1200,
      }))
      .filter((test) => Boolean(test.name));
  };

  const hydrateFromParsedObject = (parsedObject) => {
    if (!parsedObject || typeof parsedObject !== 'object') return null;

    const candidate =
      parsedObject.response && typeof parsedObject.response === 'object'
        ? parsedObject.response
        : parsedObject;

    const tests = normalizeTests(candidate.tests ?? candidate.recommendedTests ?? candidate.recommended_tests);
    const summary =
      typeof candidate.summary === 'string'
        ? candidate.summary
        : typeof candidate.triageSummary === 'string'
          ? candidate.triageSummary
          : defaults.summary;

    return {
      ...defaults,
      ...candidate,
      summary,
      tests,
      reasoning: Array.isArray(candidate.reasoning) ? candidate.reasoning : [],
      riskLevel: candidate.riskLevel || defaults.riskLevel,
      confidenceScore: Number.isFinite(Number(candidate.confidenceScore)) ? Number(candidate.confidenceScore) : defaults.confidenceScore,
      recommendedDepartment: candidate.recommendedDepartment || defaults.recommendedDepartment,
    };
  };

  const extractSummaryFromJsonLikeText = (jsonLikeText) => {
    if (!jsonLikeText) return '';

    const quotedSummaryMatch = jsonLikeText.match(/"summary"\s*:\s*"([\s\S]*?)(?<!\\)"/i);
    if (quotedSummaryMatch?.[1]) {
      return quotedSummaryMatch[1].replace(/\\n/g, ' ').trim();
    }

    const looseSummaryMatch = jsonLikeText.match(/summary\s*:\s*([^,}\n]+)/i);
    if (looseSummaryMatch?.[1]) {
      return looseSummaryMatch[1].replace(/^"|"$/g, '').trim();
    }

    return '';
  };

  try {
    const parsed = JSON.parse(cleaned);
    const hydrated = hydrateFromParsedObject(parsed);
    if (hydrated) {
      return hydrated;
    }
  } catch {
    // Attempt regex extraction as last resort
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const fallback = JSON.parse(jsonMatch[0]);
        const hydratedFallback = hydrateFromParsedObject(fallback);
        if (hydratedFallback) {
          return hydratedFallback;
        }
      } catch {
        // fall through to default
      }
    }
  }

  return {
    ...defaults,
    summary: extractSummaryFromJsonLikeText(cleaned) || defaults.summary,
  };
}

/**
 * Call AI API with patient symptoms (and optional file), return analysis.
 */
export async function fetchGeminiRecommendations(symptoms, fileBase64 = null, mimeType = null) {
  if (!GEMINI_API_KEY) {
    throw new Error('AI service key is not configured.');
  }

  const parts = [{ text: buildPrompt(symptoms, fileBase64) }];

  if (fileBase64 && mimeType) {
    parts.push({
      inline_data: {
        mime_type: mimeType,
        data: fileBase64.split(',')[1] || fileBase64 // Ensure only raw base64 is sent
      }
    });
  }

  const models = getModelCandidates().slice(0, 2);
  let lastError = null;

  for (const model of models) {
    const { signal, clear } = withTimeoutSignal(12000);
    try {
      const response = await fetch(buildGeminiUrl(model), {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        lastError = new Error(`AI service request failed (${response.status})`);
        console.error('AI service error:', response.status, errorBody);

        if ([400, 403, 404, 429, 500, 503].includes(response.status)) {
          continue;
        }

        throw lastError;
      }

      const json = await response.json();
      const textContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        lastError = new Error('Empty response from AI service.');
        continue;
      }

      return parseGeminiResponse(textContent);
    } catch (error) {
      lastError = error;
    } finally {
      clear();
    }
  }

  throw lastError || new Error('AI service is currently unavailable.');
}

/**
 * ChatBot specific interaction. 
 * Strictly restricted to App support context.
 */
export async function fetchChatBotResponse(message, history = []) {
  if (!GEMINI_API_KEY) return "I'm sorry, I'm offline right now (API Key missing).";

  // specialized system instruction
  const systemInstruction = `You are the specific AI Support Assistant for "Prognosis Care", a hospital appointment and triage app.
  
  YOUR RESPONSIBILITIES:
  1. Guide users on how to book appointments (Go to "Dashboard" or "Specialists").
  2. Explain how to use the AI Triage feature (Go to "AI Assistant").
  3. Help with viewing Medical Records.
  4. Answer questions about doctors or departments based on general medical knowledge (e.g., "What does a Cardiologist do?").
  
  STRICT RESTRICTIONS:
  - If the user asks about anything unrelated to this app, healthcare, or appointments (e.g., "Write a poem", "Capital of France", "Coding help"), politely REFUSE. Say: "I can only help you with Prognosis Care services and health appointments."
  - Do not hallucinate features we don't have. We have: Appointments, AI Triage, Medical Records, Ambulance, Lab Booking.
  - Keep answers short, friendly, and concise (max 2-3 sentences).
  
  Current User interaction:
  `;

  // Simple history formatting
  const historyText = history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
  const prompt = `${systemInstruction}\n\nChat History:\n${historyText}\n\nUser: ${message}\nAssistant:`;

  try {
    const models = getModelCandidates().slice(0, 2);
    for (const model of models) {
      const { signal, clear } = withTimeoutSignal(10000);
      try {
        const response = await fetch(buildGeminiUrl(model), {
          method: 'POST',
          signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 150,
            },
          }),
        });

        if (!response.ok) {
          if ([400, 403, 404, 429, 500, 503].includes(response.status)) {
            continue;
          }
          throw new Error(`API Error (${response.status})`);
        }

        const json = await response.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } finally {
        clear();
      }
    }

    return "I'm having trouble connecting. Please try again.";
  } catch (error) {
    console.error('ChatBot Error:', error);
    return "I'm sorry, I'm having trouble connecting right now.";
  }
}
