import { useState, useRef, useEffect, useCallback } from 'react';
import RecommendedTestsCard from '../components/RecommendedTestsCard';
import { useApp } from '../context/AppContext';
import { isLikelyHealthSymptomInput } from '../services/geminiService';

function TriagePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const { state, loading, loadRecommendations, analyzeWithDocs } = useApp(); // Destructure analyzeWithDocs

  // State for symptoms and errors
  const [symptoms, setSymptoms] = useState('');
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          setSymptoms((prev) => prev + (prev ? ' ' : '') + final);
        }
        setInterimText(interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please upload an image under 5MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleAnalyze = async () => {
    if (isListening) recognitionRef.current?.stop();
    const cleanSymptoms = symptoms.trim();

    if (!cleanSymptoms) {
      setError('Please enter health symptoms before running triage.');
      return;
    }

    if (!isLikelyHealthSymptomInput(cleanSymptoms)) {
      setError('Please enter valid health-related symptoms (for example: fever, cough, chest pain).');
      return;
    }

    setError('');

    if (selectedFile && analyzeWithDocs) {
      await analyzeWithDocs(cleanSymptoms, selectedFile);
      return;
    }

    await loadRecommendations(cleanSymptoms);
  };

  return (
    <div className="page-shell space-y-4">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-med-600">AI Symptom Analysis</p>
        <h2 className="mt-1 text-2xl font-bold">Medical Assistant Recommendation Engine</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your symptoms, <strong>tap the mic</strong>, or <strong>upload a medical report</strong> for analysis.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Symptoms / Concerns
          <div className="relative mt-2">
            <textarea
              className="input min-h-[110px] pr-14"
              placeholder="Example: chest discomfort for 2 days, dizziness, high BP readings..."
              value={symptoms + (interimText ? ' ' + interimText : '')}
              onChange={(e) => { setSymptoms(e.target.value); setInterimText(''); }}
            />
            {/* ── Mic button inside textarea ── */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-200 animate-pulse'
                  : 'bg-med-100 text-med-700 hover:bg-med-200'
                  }`}
              >
                {isListening ? (
                  /* stop icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="5" y="5" width="10" height="10" rx="1" />
                  </svg>
                ) : (
                  /* mic icon */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </label>

        {/* ── File Upload Section ── */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload Medical Record / EHR (Optional)</label>
          {!selectedFile ? (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">IMG, PNG, JPG (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="relative flex items-center gap-4 p-3 border border-med-200 bg-med-50 rounded-lg">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                {filePreview && <img src={filePreview} alt="Preview" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-med-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-med-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Listening indicator */}
        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 font-medium animate-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Listening… speak your symptoms
          </div>
        )}

        {!voiceSupported && (
          <p className="mt-2 text-xs text-amber-600">
            ⚠️ Voice input is not supported in this browser. Please type your symptoms instead.
          </p>
        )}

        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex items-center gap-3">
          <button type="button" className="btn-primary flex-1 sm:flex-none" onClick={handleAnalyze} disabled={loading.recommendations}>
            {loading.recommendations ? 'Analyzing...' : 'Run AI Triage'}
          </button>

          {voiceSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${isListening
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-med-50 text-med-700 border border-med-300 hover:bg-med-100'
                }`}
            >
              {isListening ? '⏹ Stop' : '🎙️ Voice Input'}
            </button>
          )}
        </div>
      </section>

      {loading.recommendations ? (
        <section className="card text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-med-200 border-t-med-600 mb-4"></div>
          <p className="text-sm font-medium text-slate-700">AI assistant is analyzing your inputs...</p>
          <p className="text-xs text-slate-500 mt-1">Classifying risk & recommending specialists</p>
        </section>
      ) : (
        <RecommendedTestsCard tests={state.recommendedTests} summary={state.recommendationSummary} />
      )}
    </div>
  );
}

export default TriagePage;
