"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Minimize2, Send, Copy, Check, MessageSquare, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  retryText?: string;
};

const topicChips: Record<string, string[]> = {
  "Project: Al-Shifa Hospital Appointment Chatbot": ["How did you build the hybrid model?", "See more AI projects"],
  "Project: Plant Disease Detection System": ["What dataset did you use?", "See live demos"],
  "Services offered": ["How does the process work?", "Start a project"],
  "What I do": ["What tech stack do you use?", "Why hire you?"],
  "Tech Stack Summary": ["Do you know Python?", "Tell me about your React experience"],
  "Working Process & Hiring Process": ["What's the timeline?", "How much does it cost?"],
  "Internships and Experience": ["What did you do at Techsila?", "See your resume"],
  "default": ["What services do you offer?", "Show me your projects"]
};

const initialChips = [
  "What services do you offer?",
  "Show me your projects",
  "How can I hire you?",
  "What's your tech stack?"
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm Zain's AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sessionIdRef = useRef("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "success" | "error">("idle");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [currentChips, setCurrentChips] = useState<string[]>(initialChips);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        !isMinimized && 
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setIsMinimized(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Small delay to allow animation to complete before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = ""; 
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, isMinimized]);

  useEffect(() => {
    sessionIdRef.current = `sess_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    
    const handleOpen = () => { setIsOpen(true); setIsMinimized(false); };
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string, retryMsg?: Message) => {
    if (!text.trim()) return;
    
    const userMsg: Message = retryMsg || { id: crypto.randomUUID(), role: "user", content: text };
    
    if (!retryMsg) {
      setMessages(prev => [...prev, userMsg]);
    } else {
      // Remove the error message if retrying
      setMessages(prev => prev.filter(m => !m.isError));
    }
    
    setInput("");
    setIsTyping(true);
    setCurrentChips([]); // Hide chips while typing

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messages: [...messages.filter(m => !m.isError), userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        let errorMsg = "API Error";
        try {
            const errJson = await response.json();
            if (errJson.error) errorMsg = errJson.error;
        } catch {
            // Ignore JSON parsing errors
        }
        throw new Error(errorMsg);
      }

      let topChunk = response.headers.get("X-Top-Chunk");
      if (topChunk) topChunk = decodeURIComponent(topChunk);

      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };
      
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        
        if (fullContent.includes("[SHOW_LEAD_FORM]")) {
          setShowLeadForm(true);
          fullContent = fullContent.replace("[SHOW_LEAD_FORM]", "");
        }

        setMessages(prev => 
          prev.map(msg => msg.id === assistantMsg.id ? { ...msg, content: fullContent } : msg)
        );
      }
      
      setCurrentChips(topicChips[topChunk || ""] || topicChips.default);

    } catch (err: unknown) {
      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(), 
        role: "assistant", 
        content: err instanceof Error ? err.message : "Sorry, I'm having trouble connecting right now.",
        isError: true,
        retryText: text
      }]);
      setIsTyping(false);
    }
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    setLeadStatus("idle");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, source: "chatbot" })
      });
      if (res.ok) {
        setLeadStatus("success");
        setTimeout(() => setShowLeadForm(false), 2000);
      } else {
        setLeadStatus("error");
      }
    } catch {
      setLeadStatus("error");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const userMessageCount = messages.filter(m => m.role === "user").length;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-[#0A0A0F] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(198,244,50,0.4)] z-50 group transition-transform hover:scale-110"
            title="Ask me anything"
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-primary/40 opacity-75"></div>
            <MessageSquare className="w-6 h-6 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: isMinimized ? 'calc(100% - 64px)' : 0, 
              scale: 1 
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] h-[100dvh] md:h-[560px] bg-[#0A0A0F] border border-white/10 md:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            data-lenis-prevent="true"
          >
            {/* Header */}
            <div className="h-16 bg-[#13131A] border-b border-white/5 flex items-center justify-between px-4 shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#13131A]"></div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Zain&apos;s Assistant</h3>
                  <p className="text-xs text-muted-foreground">Online • AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-2 text-muted-foreground hover:text-white transition-colors">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 text-muted-foreground hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-y-contain p-4 space-y-4 scroll-smooth"
                  data-lenis-prevent="true"
                >
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-primary text-[#0A0A0F] rounded-br-none font-medium" : "bg-[#13131A] border border-white/5 rounded-bl-none text-foreground/90"}`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            {msg.isError && msg.retryText && (
                              <button 
                                onClick={() => handleSend(msg.retryText!, { id: crypto.randomUUID(), role: "user", content: msg.retryText! })} 
                                className="mt-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs transition-colors"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        ) : (
                          msg.content
                        )}
                        
                        {msg.role === "assistant" && !msg.isError && (
                          <button 
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="absolute -right-8 top-2 p-1.5 text-muted-foreground hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {showLeadForm && (
                    <div className="bg-primary/10 border border-primary/30 p-4 rounded-2xl max-w-[85%] self-start">
                      <p className="text-sm text-foreground mb-3 font-medium">Leave your email and Zain will get back to you shortly:</p>
                      {leadStatus === "success" ? (
                        <p className="text-sm text-primary flex items-center gap-2"><Check className="w-4 h-4"/> Got it! Talk soon.</p>
                      ) : (
                        <form onSubmit={submitLead} className="flex gap-2">
                          <input 
                            type="email" 
                            required 
                            placeholder="your@email.com" 
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="flex-1 bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
                          />
                          <button type="submit" className="bg-primary text-[#0A0A0F] px-3 rounded-lg text-sm font-bold">
                            Send
                          </button>
                        </form>
                      )}
                      {leadStatus === "error" && <p className="text-xs text-red-400 mt-2">Failed to save. Try the contact form.</p>}
                    </div>
                  )}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 bg-[#13131A] border border-white/5 w-fit px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Chips */}
                {!isTyping && currentChips.length > 0 && (
                  <div className="px-4 pb-3 flex flex-wrap gap-2">
                    {currentChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-xs border border-white/10 bg-[#13131A] hover:border-primary/50 hover:text-primary transition-colors px-3 py-1.5 rounded-full whitespace-nowrap"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Contact Zain CTA after 3 messages */}
                {!isTyping && userMessageCount >= 3 && (
                  <div className="px-4 pb-3 flex justify-center">
                    <Link href="/contact" className="text-xs text-primary underline hover:text-primary/80 transition-colors">
                      Contact Zain Directly
                    </Link>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-[#13131A]">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                    className="relative flex items-center"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isTyping}
                      className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="absolute right-2 p-2 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:opacity-50 transition-colors"
                    >
                      {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
