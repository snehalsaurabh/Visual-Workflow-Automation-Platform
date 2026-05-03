import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCurrentUser } from "@/lib/workflows";
import { apiFetch, authStore } from "@/lib/api";

type AuthPageProps = {
  mode: "signin" | "signup";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(mode === "signup" ? "Desk Operator" : "Trader");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitLabel = mode === "signup" ? "Create Workspace" : "Enter Workspace";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
      const result = (await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })) as { token: string };

      authStore.setToken(result.token);
      setCurrentUser(name || "Trader");
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="rounded-[34px] border-white/70 bg-stone-950 p-8 text-stone-50 shadow-[0_28px_100px_rgba(28,25,23,0.15)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">{mode === "signup" ? "New desk" : "Welcome back"}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">
          {mode === "signup" ? "Spin up a trading automation workspace." : "Return to your workflow desk."}
        </h1>
        <p className="mt-4 text-stone-300">Sign in to sync workflows and execution history across devices.</p>
      </Card>

      <Card className="rounded-[34px] border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>{mode === "signup" ? "Workspace Owner" : "Display Name"}</Label>
            <Input className="border-stone-300 bg-stone-50" value={name} onChange={(event) => setName(event.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              className="border-stone-300 bg-stone-50"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="desk@tradeflow.local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              className="border-stone-300 bg-stone-50"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
              required
            />
          </div>

          {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

          <Button disabled={loading} type="submit" size="lg" className="w-full rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800">
            {submitLabel}
            <ArrowRight />
          </Button>
        </form>

        <p className="mt-6 text-sm text-stone-600">
          {mode === "signup" ? "Already have a workspace?" : "Need a fresh workspace?"}{" "}
          <Link className="font-semibold text-stone-950 underline underline-offset-4" to={mode === "signup" ? "/signin" : "/signup"}>
            {mode === "signup" ? "Sign in" : "Create one"}
          </Link>
        </p>
      </Card>
    </div>
  );
}

