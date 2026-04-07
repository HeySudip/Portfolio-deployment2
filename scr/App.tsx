import { useState, useEffect } from "react";
import Portfolio from "./components/Portfolio";
import AdminPanel from "./components/AdminPanel";

type View = "portfolio" | "admin";

export default function App() {
  const [view, setView] = useState<View>("portfolio");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if URL hash is #/admin or path contains /admin
    const checkAdmin = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === "#/admin" || path === "/admin") {
        setIsAdmin(true);
        setView("admin");
      }
    };
    checkAdmin();
    window.addEventListener("hashchange", checkAdmin);
    return () => window.removeEventListener("hashchange", checkAdmin);
  }, []);

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

  // Only show admin button if isAdmin (accessed via secret URL)
  return <Portfolio key={view} onNavigateAdmin={isAdmin ? () => setView("admin") : undefined} />;
}
