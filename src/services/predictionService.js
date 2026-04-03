const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function fetchPrediction(symptoms) {
    try {
        const response = await fetch(`${BACKEND_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms }),
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map backend response format to what frontend expects (summary, tests)
        return {
            summary: data.summary || `Based on symptoms: ${symptoms}`,
            tests: data.recommended_tests || [],
            disease: data.disease,
            specialty: data.specialty,
            riskLevel: data.risk_level,
            confidenceScore: data?.confidence?.risk_level
        };

    } catch (error) {
        console.warn('Backend prediction failed:', error);
        throw error; // Let AppContext handle fallback
    }
}
