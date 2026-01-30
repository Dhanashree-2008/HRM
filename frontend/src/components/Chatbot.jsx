import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Minimize2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: "Hello! I am LiteHR's AI Assistant. How can I help you today?",
            isUser: false,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/chatbot/ask", {
                message: userMessage,
            });

            if (response.data && response.data.message) {
                setMessages((prev) => [
                    ...prev,
                    { text: response.data.message, isUser: false },
                ]);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Chatbot Error:", error);
            toast.error("Failed to get response");
            setMessages((prev) => [
                ...prev,
                {
                    text: "Sorry, I encountered an error. Please try again later.",
                    isUser: false,
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="mb-4 w-[350px] md:w-[400px] h-[500px] max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300"
                    style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)" }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm leading-tight">HR Assistant</h3>
                                <p className="text-[10px] text-indigo-100 opacity-90">Powered by LiteHR AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${msg.isUser ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.isUser
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none"
                                        } ${msg.isError ? "border-red-500 text-red-600 bg-red-50" : ""}`}
                                >
                                    {/* Basic markdown-like parsing could go here, but keeping it simple text for now */}
                                    <div className="whitespace-pre-wrap leading-relaxed text-sm">
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ node, ...props }) => <span className="font-bold" {...props} />,
                                                b: ({ node, ...props }) => <span className="font-bold" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSend}
                        className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0"
                    >
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about leave, policies..."
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${isOpen
                    ? "bg-gray-800 text-white rotate-90"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30"
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} className="fill-current" />}
                {!isOpen && (
                    <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Ask AI Assistant
                    </span>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
