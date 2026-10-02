import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, UploadCloud, Image as ImageIcon, CheckCircle, RefreshCw } from 'lucide-react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 'm-0',
      role: 'assistant',
      text: 'Greetings, Operator. I am TITAN-COPILOT, powered by specialized Gemini maritime robotics models. You can ask me about cutting feeds, gas mixes, AH36 plate metallurgy, or upload a photo of a hull section for AI visual path recommendations.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const suggestedPrompts = [
    'Optimal plasma cut speed for 35mm AH36 steel plate?',
    'How to prevent heat buckling on curved hull sections?',
    'Hong Kong Convention compliance checklist for bilge cutting',
    'Calculate scrap resale margin for 25,000 LDT Bulk Carrier',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedImage(URL.createObjectURL(file));
    }
  };

  const generateAIResponse = (userPrompt, hasImage) => {
    if (hasImage) {
      return `Visual Analysis Complete:
1. Target Section: Transverse internal bulkhead with ~28mm heavy marine steel.
2. Surface Condition: Moderate oxide scale detected, minimal composite contamination.
3. Path Recommendation: 
   - Deploy Crawler Unit with 350A Plasma torch at 120 cm/min.
   - Begin with vertical relief cut at stiffener weld root.
   - Maintain 3.5mm standoff distance to prevent thermal splatter.
4. Estimated Recyclable Recovery: 95.2% clean secondary melt grade.`;
    }

    const lower = userPrompt.toLowerCase();
    if (lower.includes('speed') || lower.includes('plasma') || lower.includes('35mm')) {
      return `For 35mm Marine Grade AH36 high-tensile steel:
• Recommended Plasma Current: 380A - 400A High-Definition Arc
• Gas Mix: Oxygen Plasma with Air Shield (or N2/H2 Mix for non-ferrous)
• Feed Rate: 135 - 145 cm/minute
• Kerf Width: 2.8mm
• Standoff Distance: 3.2mm ± 0.3mm
• Thermal note: Maintain water-mist shroud to prevent hazardous fume escape and reduce localized frame warp.`;
    }

    if (lower.includes('buckling') || lower.includes('deformation')) {
      return `To eliminate plate buckling on curved ship hulls:
1. Sequence Balancing: Cut alternate transverse web frames rather than consecutive lines.
2. Stress Relief Relief Perforations: Pierce pilot expansion slots at 1.5m intervals.
3. Auxiliary Clamping: Engage electromagnetic anchoring pods to hold the plate rigid until kerf separation.`;
    }

    return `Titan Robotics Copilot acknowledged your query: "${userPrompt}". 
Based on shipyard operational database standards, autonomous crawler tracks should be calibrated with dual-frequency ultrasonic feedback, ensuring zero personnel inside confined compartment boundaries. Let me know if you would like me to generate a cut plan or export toolpath G-code.`;
  };

  const handleSend = (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() && !attachedImage) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      image: attachedImage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const hadImage = !!attachedImage;
    setAttachedImage(null);
    setIsTyping(true);

    setTimeout(() => {
      const replyText = generateAIResponse(query, hadImage);
      const botMsg = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="card-surface border border-dark-border bg-dark-card rounded-2xl flex flex-col h-[calc(100vh-8.5rem)] overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-dark-border flex items-center justify-between bg-neutral-950/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              TITAN-COPILOT AI
              <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono">
                GEMINI VISION READY
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400">Autonomous Ship Cutting & Metallurgy Advisor</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-0',
                role: 'assistant',
                text: 'Chat history cleared. How may I assist your cutting operations?',
                timestamp: new Date().toLocaleTimeString(),
              },
            ])
          }
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-neutral-900 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono ${
                m.role === 'user'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed whitespace-pre-line border ${
                m.role === 'user'
                  ? 'bg-neutral-900 text-white border-neutral-700'
                  : 'bg-black text-neutral-200 border-dark-border'
              }`}
            >
              {m.image && (
                <div className="mb-3 rounded-lg overflow-hidden border border-neutral-700 max-h-48">
                  <img src={m.image} alt="Inspection input" className="w-full h-full object-cover" />
                </div>
              )}
              {m.text}
              <div className="text-[10px] text-neutral-500 font-mono text-right mt-2">
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span className="animate-pulse">Titan Copilot is synthesizing trajectory & metallurgy...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Carousel */}
      <div className="px-4 py-2 border-t border-dark-border bg-neutral-950/60 flex items-center gap-2 overflow-x-auto">
        <Sparkles className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] font-mono whitespace-nowrap px-2.5 py-1 rounded-full bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Attached image preview banner */}
      {attachedImage && (
        <div className="px-4 py-2 bg-neutral-900 border-t border-dark-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-mono">Photo attached for visual cut analysis</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="text-red-400 hover:text-red-300 text-xs font-mono"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-dark-border bg-neutral-950 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload inspection photo for AI analysis"
          className="p-2.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-dark-border transition-colors"
        >
          <UploadCloud className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about cutting speeds, torch angles, plate thickness, or upload photo..."
          className="flex-1 bg-neutral-900 border border-dark-border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() && !attachedImage}
          className="btn-primary p-2.5 rounded-lg disabled:opacity-40"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
}
