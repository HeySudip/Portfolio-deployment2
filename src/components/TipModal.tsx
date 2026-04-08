import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { X } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "../store/supabase";

const RECIPIENT = "7sbFzwdXHouwVkZkyXyAjmSJDRTg5iyEdoPxmo9CN7H7";
const CYAN = "#06b6d4";
const HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=77582c7a-e21b-40ec-9c88-8fea68aef115";
const EMAILJS_SERVICE = "service_oaxhgqt";
const EMAILJS_TEMPLATE = "template_8keri5q";
const EMAILJS_PUBLIC_KEY = "5AV24pyq_o2NYbwzU";

const PRESETS = [
  { sol: 0.01, label: "1 coffee", emoji: "☕" },
  { sol: 0.05, label: "3 coffees", emoji: "🚀" },
  { sol: 0.1, label: "5 coffees", emoji: "🔥" },
];

export type TipEntry = {
  id?: number;
  sender: string;
  amount: number;
  message: string;
  tx: string;
  created_at?: string;
};

export async function fetchTips(): Promise<TipEntry[]> {
  const { data } = await supabase
    .from("tips")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  return (data as TipEntry[]) || [];
}

async function saveTip(tip: Omit<TipEntry, "id" | "created_at">) {
  await supabase.from("tips").insert(tip);
}

export function useTipFeed() {
  const [tips, setTips] = useState<TipEntry[]>([]);

  useEffect(() => {
    fetchTips().then(setTips);

    // Realtime subscription
    const channel = supabase
      .channel("tips-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tips" }, (payload) => {
        setTips((prev) => [payload.new as TipEntry, ...prev.slice(0, 9)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return tips;
}

function TipForm({ onClose }: { onClose: () => void }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amount, setAmount] = useState(0.01);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<Omit<TipEntry, "id" | "created_at"> | null>(null);
  const [error, setError] = useState("");

  const final = custom.trim() !== "" ? parseFloat(custom) : amount;

  const send = useCallback(async () => {
    const finalAmt = custom.trim() !== "" ? parseFloat(custom) : amount;
    if (!publicKey || !finalAmt || finalAmt <= 0) return;
    setLoading(true);
    setError("");
    try {
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(RECIPIENT),
          lamports: Math.floor(finalAmt * LAMPORTS_PER_SOL),
        })
      );
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;
      const sig = await sendTransaction(tx, connection, { skipPreflight: false, preflightCommitment: "confirmed" });
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");

      // Verify tx actually succeeded on-chain (confirmTransaction doesn't catch on-chain errors)
      const txDetails = await connection.getTransaction(sig, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
      if (!txDetails || txDetails.meta?.err !== null) {
        throw new Error("Transaction failed on-chain. No SOL was sent.");
      }

      const tip: Omit<TipEntry, "id" | "created_at"> = {
        sender: publicKey.toBase58(),
        amount: finalAmt,
        message: message.trim(),
        tx: sig,
      };

      // Save to Supabase (realtime will update feed for everyone)
      await saveTip(tip);

      // Send email notification
      emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          amount: `${finalAmt} SOL`,
          sender: publicKey.toBase58(),
          tx_hash: sig,
          tip_message: message.trim() || "(no message)",
        },
        EMAILJS_PUBLIC_KEY
      ).catch(() => {}); // silent fail — don't block success

      setSuccess({ ...tip });
      setMessage("");
      setCustom("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("rejected") || msg.includes("User rejected")) {
        setError("Cancelled.");
      } else {
        setError(msg.slice(0, 120) || "Transaction failed.");
      }
    } finally {
      setLoading(false);
    }
  }, [publicKey, amount, custom, message, connection, sendTransaction]);

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
            ☕ buy me a coffee
          </h2>
          <p style={{ fontSize: "11px", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            powered by solana
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px" }}
        >
          <X size={18} />
        </button>
      </div>

      {success ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: "44px", marginBottom: "12px" }}>🎉</div>
          <p style={{ color: CYAN, fontWeight: 700, marginBottom: "4px" }}>thank you so much!</p>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "16px", fontFamily: "monospace" }}>
            {success.amount} SOL sent · notification sent to owner
          </p>
          <a
            href={`https://solscan.io/tx/${success.tx}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "11px", color: CYAN, fontFamily: "monospace" }}
          >
            view on solscan →
          </a>
          <br /><br />
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: `rgba(6,182,212,0.15)`, color: CYAN, cursor: "pointer", fontSize: "13px",
            }}
          >
            close
          </button>
        </div>
      ) : (
        <>
          {/* Wallet */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              01 — connect wallet
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <WalletMultiButton style={{ background: `linear-gradient(135deg, ${CYAN}, #0891b2)`, borderRadius: "10px", fontSize: "13px", height: "40px" }} />
            </div>
            {connected && publicKey && (
              <p style={{ textAlign: "center", marginTop: "6px", fontSize: "10px", fontFamily: "monospace", color: CYAN }}>
                {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
              </p>
            )}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              02 — pick amount
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginBottom: "8px" }}>
              {PRESETS.map((p) => (
                <button
                  key={p.sol}
                  onClick={() => { setAmount(p.sol); setCustom(""); }}
                  style={{
                    padding: "10px 6px", borderRadius: "10px", cursor: "pointer",
                    border: (!custom && amount === p.sol) ? `1px solid rgba(6,182,212,0.5)` : "1px solid rgba(255,255,255,0.07)",
                    background: (!custom && amount === p.sol) ? `rgba(6,182,212,0.1)` : "rgba(255,255,255,0.03)",
                    color: (!custom && amount === p.sol) ? CYAN : "rgba(255,255,255,0.6)",
                    fontSize: "11px", fontFamily: "monospace", transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: "16px", marginBottom: "3px" }}>{p.emoji}</div>
                  <div style={{ fontWeight: 600 }}>{p.sol} SOL</div>
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="custom (SOL)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: "8px",
                border: custom ? `1px solid rgba(6,182,212,0.3)` : "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.04)", color: "#fff",
                fontSize: "12px", fontFamily: "monospace", outline: "none",
              }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              03 — say something (optional)
            </p>
            <input
              type="text"
              placeholder="leave a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={80}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.04)", color: "#fff",
                fontSize: "12px", fontFamily: "monospace", outline: "none",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "11px", color: "#ef4444", fontFamily: "monospace", marginBottom: "10px" }}>{error}</p>
          )}

          <button
            onClick={send}
            disabled={!connected || loading}
            style={{
              width: "100%", padding: "13px", borderRadius: "10px", border: "none",
              background: connected ? `linear-gradient(135deg, ${CYAN}, #0891b2)` : "rgba(255,255,255,0.05)",
              color: connected ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: "14px", fontWeight: 700, fontFamily: "monospace",
              cursor: connected ? "pointer" : "not-allowed", transition: "all 0.2s",
            }}
          >
            {loading ? "sending..." : !connected ? "connect wallet first" : `send ${final || 0} SOL ☕`}
          </button>
        </>
      )}
    </div>
  );
}

export default function TipModal({ onClose }: { onClose: () => void }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: "360px",
          backgroundColor: "#111113",
          border: "1px solid rgba(6,182,212,0.15)",
          borderRadius: "20px",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ConnectionProvider endpoint={HELIUS_RPC}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <TipForm onClose={onClose} />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </div>
    </div>
  );
}
