import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCurrentUser } from "@/lib/workflows";

type AuthPageProps = {
  mode: "signin" | "signup";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState(mode === "signup" ? "Desk Operator" : "Trader");
  const [email, setEmail] = useState("");

  const submitLabel = mode === "signup" ? "Create Workspace" : "Enter Workspace";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentUser(name || "Trader");
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="rounded-[34px] border-white/70 bg-stone-950 p-8 text-stone-50 shadow-[0_28px_100px_rgba(28,25,23,0.15)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">{mode === "signup" ? "New desk" : "Welcome back"}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">
          {mode === "signup" ? "Spin up a trading automation workspace." : "Return to your workflow desk."}
        </h1>
        <p className="mt-4 text-stone-300">
          These auth screens are frontend-only for now. Submitting the form stores a local user name and unlocks the dashboard flow.
        </p>
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
            <Input className="border-stone-300 bg-stone-50" type="password" placeholder="Enter any password for demo mode" required />
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full bg-stone-950 text-amber-300 hover:bg-stone-800">
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
