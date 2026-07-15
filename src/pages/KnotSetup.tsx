import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Shield, Users, KeyRound, Plus, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { roleLabels, roleDescriptions, type RoleType } from "@/lib/store";

const roles: RoleType[] = ["medic", "navigator", "comms", "quartermaster", "builder"];

export default function KnotSetup() {
  const { isSetup, createKnot, joinKnot } = useLocalUser();
  const { session, signOut } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [submitting, setSubmitting] = useState(false);

  // Create knot state
  const [createName, setCreateName] = useState("");
  const [knotName, setKnotName] = useState("");

  // Join knot state
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinRole, setJoinRole] = useState<RoleType>("medic");

  // No session at all → back to login
  if (!session) return <Navigate to="/auth" replace />;

  // Once a members row exists (knot created or joined), leave this page
  if (isSetup) return <Navigate to="/" replace />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    setSubmitting(true);
    const { error, code } = await createKnot(createName.trim(), knotName.trim() || undefined);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error creating Knot", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Knot created", description: `Code: ${code}. Share it with your group.` });
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim() || !joinCode.trim()) return;
    setSubmitting(true);
    const { error } = await joinKnot(joinCode.trim(), joinRole, joinName.trim());
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't join Knot", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Joined the Knot", description: `Role: ${roleLabels[joinRole]}` });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-10 w-10 text-primary" />
        <h1 className="text-3xl font-heading font-black tracking-wider">AEGIS KNOT</h1>
      </div>

      {mode === "choose" && (
        <Card className="w-full max-w-sm tactical-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Initial Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => setMode("create")} variant="safe" className="w-full text-white" size="lg">
              <Plus className="h-5 w-5 mr-2" /> CREATE A KNOT
            </Button>
            <Button onClick={() => setMode("join")} variant="outline" className="w-full" size="lg">
              <KeyRound className="h-5 w-5 mr-2" /> JOIN WITH CODE
            </Button>
            <Button onClick={signOut} variant="ghost" className="w-full text-muted-foreground" size="sm">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === "create" && (
        <Card className="w-full max-w-sm tactical-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-primary" /> CREATE KNOT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Full Name" required className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Knot's Name (optional)</Label>
                <Input value={knotName} onChange={e => setKnotName(e.target.value)} placeholder="The crew" className="bg-secondary border-border" />
              </div>
              <p className="text-xs text-muted-foreground">
                You'll be assigned as <span className="text-primary font-semibold">Vanguard</span> (leader) automatically.
              </p>
              <Button type="submit" variant="safe" className="w-full text-white" size="lg" disabled={submitting}>
                {submitting ? "Creating..." : "CREATE KNOT"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("choose")}>
                Go Back
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {mode === "join" && (
        <Card className="w-full max-w-sm tactical-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> JOIN A KNOT
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input value={joinName} onChange={e => setJoinName(e.target.value)} placeholder="Full Name" required className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Knot's Code</Label>
                <Input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="X7K2P9" required maxLength={6} className="bg-secondary border-border font-mono tracking-widest" />
              </div>
              <div className="space-y-2">
                <Label>Your role</Label>
                <Select value={joinRole} onValueChange={(v) => setJoinRole(v as RoleType)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(r => (
                      <SelectItem key={r} value={r}>{roleLabels[r]} — {roleDescriptions[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="safe" className="w-full text-white" size="lg" disabled={submitting}>
                {submitting ? "Joining..." : "JOIN"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("choose")}>
                Go Back
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}