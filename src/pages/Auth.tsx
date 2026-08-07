import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, UserPlus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { isAuthenticated, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">THE_KNOT_</div>
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Access denied", description: "Invalid Credentials.", variant: "destructive" });
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Error registering", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account Created", description: "Now you can join or create a Knot!" });
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      
      <img className="max-w-52" src="/LOGO.png" />

      <Card className="w-full max-w-sm tactical-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-lg">
            {mode === "signin" ? "LOG IN" : "CREATE ACCOUNT"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@Theknot.net"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary border-border"
              />
            </div>
            <Button type="submit" className="w-full text-black font-bold" size="lg" disabled={submitting}>
              {mode === "signin" ? (
                <><LogIn className="h-5 w-5 mr-2" /> LOG IN</>
              ) : (
                <><UserPlus className="h-5 w-5 mr-2" /> CREATE ACCOUNT</>
              )}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors mt-4">
            {mode === "signin" ? "Got no account? Register" : "Already got an account? Log In"}
          </button>

        </CardContent>
      </Card>
    </div>
  );
}