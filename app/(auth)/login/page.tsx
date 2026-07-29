"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Brick } from "@/components/ui/Brick";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Mail, Loader2 } from "lucide-react";

function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

type Mode = "idle" | "loading" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setMode("loading");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setMode("error");
    } else {
      setMode("sent");
    }
  }

  async function handleGitHub() {
    setMode("loading");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setMode("error");
    }
  }

  return (
    <div className="h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink tracking-tight leading-none mb-2">
            Signal
          </h1>
          <p className="text-muted text-sm font-ui">
            Where ideas start.
          </p>
        </div>

        <Brick fill="lemon" className="p-6 flex flex-col gap-5">
          <div>
            <Eyebrow>Sign in</Eyebrow>
            <p className="text-ink-2 text-sm font-ui mt-1">
              Enter your email and we&apos;ll send a magic link.
            </p>
          </div>

          {mode === "sent" ? (
            <div className="brick-flat bg-mint p-4 text-sm font-ui text-ink">
              <strong>Check your inbox.</strong> We sent a link to{" "}
              <span className="font-mono">{email}</span>. It expires in 1 hour.
            </div>
          ) : (
            <>
              <form onSubmit={handleMagicLink} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full border-2 border-ink rounded-lg px-3 py-2.5 text-sm font-ui bg-bg text-ink placeholder:text-muted outline-none focus:shadow-[2px_2px_0_0_var(--ink)] transition-shadow"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={mode === "loading"}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {mode === "loading" ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Mail size={15} />
                  )}
                  Send magic link
                </Button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-ink/20" />
                <span className="text-muted text-xs font-ui">or</span>
                <div className="flex-1 h-px bg-ink/20" />
              </div>

              <Button
                variant="default"
                onClick={handleGitHub}
                disabled={mode === "loading"}
                className="w-full flex items-center justify-center gap-2"
              >
                <GitHubIcon size={15} />
                Continue with GitHub
              </Button>
            </>
          )}

          {mode === "error" && (
            <p className="text-hot text-sm font-ui">{errorMsg}</p>
          )}
        </Brick>

        <p className="text-center text-muted text-xs font-ui mt-4">
          No password. No friction. Just write.
        </p>
      </div>
    </div>
  );
}
