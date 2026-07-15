import { useState, useEffect } from "react";
import { User, Bell, Shield, Wifi, WifiOff, Battery, Moon, Volume2, LogOut, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalUser } from "@/hooks/useLocalUser";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { roleLabels } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Config() {
  const { user, updateName } = useLocalUser();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const [nameInput, setNameInput] = useState(user?.displayName ?? "");
  const [knotCode, setKnotCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.knotId) return;
    supabase
      .from("knots")
      .select("code")
      .eq("id", user.knotId)
      .single()
      .then(({ data }) => {
        if (data) setKnotCode(data.code);
      });
  }, [user?.knotId]);

  if (!user) return null; // Gate in App.tsx should prevent reaching here without a knot

  const handleNameBlur = () => {
    if (nameInput.trim() && nameInput !== user.displayName) {
      updateName(nameInput.trim());
    }
  };

  const copyCode = () => {
    if (!knotCode) return;
    navigator.clipboard.writeText(knotCode);
    setCopied(true);
    toast({ title: "Código copiado" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-3xl text-center font-heading tracking-widest">PROFILE</h2>

      {/* Profile */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Operator Name</span>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              className="w-36 h-8 text-xs bg-secondary border-border text-right"
            />
          </div>
          <div className="flex items-center gap-3 px-2 py-2">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Knot Role</span>
            <span className="text-xs font-semibold text-primary">{roleLabels[user.role]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Knot Code */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">Knot Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="text-lg font-mono font-bold tracking-widest flex-1">
              {knotCode ?? "···"}
            </span>
            <Button variant="outline" size="sm" onClick={copyCode} disabled={!knotCode}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground px-2">
            Share this code so others can join your Knot.
          </p>
        </CardContent>
      </Card>

      {/* Connectivity */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Wifi className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Offline Mode</span>
            <Switch />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <WifiOff className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Simulated Web Mesh</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Bell className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Crítical Alerts</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Volume2 className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Notification Sounds</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* System */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Battery className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Energy saving</span>
            <Switch />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Moon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Night Mode</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full border-critical/50 text-critical" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" /> SIGN OUT
      </Button>
    </div>
  );
}