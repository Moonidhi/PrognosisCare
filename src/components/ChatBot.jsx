import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { fetchChatBotResponse } from '../services/geminiService';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Hi! I can help you book appointments or navigate the app. How can I help?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || loading) return;

        const userMsg = { id: Date.now(), role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            // Pass last few messages for context
            const history = messages.slice(-4).map(m => ({ role: m.role, text: m.text }));
            const update = await fetchChatBotResponse(userMsg.text, history);

            const botMsg = { id: Date.now() + 1, role: 'assistant', text: update };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Sorry, I'm having trouble connecting." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="pointer-events-auto bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[500px]"
                        >
                            {/* Header */}
                            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg">
                                        <Sparkles className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">Prognosis AI Support</h3>
                                        <p className="text-[10px] text-slate-400">Online • Helping with appointments</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-[300px]">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-3.5 h-3.5 text-blue-600" />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex gap-2 justify-start">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                                            <Bot className="w-3.5 h-3.5 text-blue-600" />
                                        </div>
                                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-white border-t border-slate-100">
                                <form onSubmit={handleSend} className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Ask about booking..."
                                        className="w-full pl-4 pr-12 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim() || loading}
                                        className="absolute right-1.5 p-1.5 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:bg-slate-300 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="pointer-events-auto h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                    <AnimatePresence mode='wait'>
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X className="w-7 h-7" />
                            </motion.div>
                        ) : (
                            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                <MessageSquare className="w-7 h-7" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </>
    );
}
