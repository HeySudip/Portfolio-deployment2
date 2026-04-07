import { useState } from "react";
import emailjs from "@emailjs/browser";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

const SERVICE_ID = "service_oaxhgqt";
const TEMPLATE_ID = "template_icribnj";
const PUBLIC_KEY = "5AV24pyq_o2NYbwzU";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus("sending");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: name,
          email: email,
          subject: subject,
          message: message,
        },
        PUBLIC_KEY
      );
      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setStatus("idle");
        setOpen(false);
      }, 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          boxShadow: "0 4px 24px rgba(34,197,94,0.4)",
        }}
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
      </button>

      {/* Chat Popup */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: "#111113",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4"
            style={{
              background: "linear-gradient(135deg, #22c55e22, #16a34a11)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3 className="text-white font-semibold text-sm">Send a message</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              I'll get back to you soon
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <textarea
              placeholder="Your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none transition-all resize-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background:
                  status === "sent"
                    ? "rgba(34,197,94,0.2)"
                    : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: status === "sent" ? "#22c55e" : "#ffffff",
                opacity: status === "sending" ? 0.7 : 1,
              }}
            >
              {status === "sending" && <Loader2 size={15} className="animate-spin" />}
              {status === "sent" && "✓ Message sent!"}
              {status === "error" && "Failed, try again"}
              {status === "idle" && (
                <>
                  <Send size={15} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
