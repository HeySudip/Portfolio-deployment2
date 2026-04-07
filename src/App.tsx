import { useState, useEffect } from "react";
import Portfolio from "./components/Portfolio";
import AdminPanel from "./components/AdminPanel";
import ChatWidget from "./components/ChatWidget";

type View = "portfolio" | "admin" | "passcode";

const ADMIN_PASSCODE = "7643";

export default function App() {
  const [view, setView] = useState<View>("portfolio");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === "#/admin" || path === "/admin") {
        setView("passcode");
      }
    };
    checkAdmin();
    window.addEventListener("hashchange", checkAdmin);
    return () => window.removeEventListener("hashchange", checkAdmin);
  }, []);

  const handlePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setView("admin");
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
      setPasscodeInput("");
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  // Passcode screen
  if (view === "passcode") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0a0a0b" }}
      >
        <div
          className="w-80 p-8 rounded-2xl"
          style={{
            backgroundColor: "rgba(17,17,19,0.95)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
          }}
        >
          <h2 className="text-white font-bold text-lg mb-1">Admin Access</h2>
          <p className="text-xs font-mono mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
            Enter passcode to continue
          </p>
          <form onSubmit={handlePasscode} className="space-y-3">
            <input
              type="password"
              placeholder="Passcode"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              autoFocus
              className="w-full text-sm px-4 py-3 rounded-xl outline-none transition-all text-center tracking-widest font-mono"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: passcodeError
                  ? "1px solid rgba(239,68,68,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: "#ffffff",
              }}
            />
            {passcodeError && (
              <p className="text-xs text-center font-mono" style={{ color: "#ef4444" }}>
                Wrong passcode
              </p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#ffffff",
              }}
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => {
                setView("portfolio");
                window.location.hash = "";
              }}
              className="w-full py-2 text-xs font-mono transition-all"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              ← Back to portfolio
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === "admin" && isAdmin) {
    return (
      <AdminPanel
        onNavigateBack={() => {
          setView("portfolio");
          setIsAdmin(false);
          window.location.hash = "";
        }}
      />
    );
  }

  return (
    <>
      <Portfolio key={view} onNavigateAdmin={undefined} />
      <ChatWidget />
    </>
  );
}
