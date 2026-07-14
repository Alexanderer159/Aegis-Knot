import { useState } from "react";
import { User, Bell, Shield, Wifi, WifiOff, Battery, Moon, Volume2, ChevronRight, LogIn, LogOut, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalUser, GROUP_CODE } from "@/hooks/useLocalUser";
import { roleLabels, roleDescriptions, type RoleType } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const allRoles: RoleType[] = ["vanguard", "medic", "navigator", "comms", "quartermaster", "builder"];

export default function Config() {
  const { user, isSetup, setupUser, updateRole, updateName, logout } = useLocalUser();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleType>("vanguard");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.toUpperCase() !== GROUP_CODE) {
      setCodeError(true);
      toast({ title: "Código inválido", description: "El código de grupo no es correcto.", variant: "destructive" });
      return;
    }
    if (!name.trim()) return;
    setupUser(name.trim(), role, code.toUpperCase());
    toast({ title: "¡Bienvenido al Knot!", description: `Rol asignado: ${roleLabels[role]}` });
  };

  // Not setup — show onboarding
  if (!isSetup) {
    return (
      <div className="flex justify-center items-center">

        <Card className="">

          <CardHeader className="">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> UNIRSE A UN KNOT
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Grupo</Label>
                <Input id="code" value={code} onChange={(e) => { setCode(e.target.value); setCodeError(false); }} placeholder="Ingresa el código"
                  className={`bg-secondary border-border font-mono uppercase ${codeError ? "border-critical" : ""}`} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de Operador</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="bg-secondary border-border" required />
              </div>
              <div className="space-y-2">
                <Label>Rol Operativo</Label>
                <Select value={role} onValueChange={(v) => setRole(v as RoleType)}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabels[r]} — {roleDescriptions[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="safe" className="w-full" size="lg">
                <LogIn className="h-5 w-5 mr-2" /> INGRESAR
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already set up — show config
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-heading text-muted-foreground tracking-widest">CONFIGURACIÓN</h2>

      {/* Profile */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">PERFIL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 px-2 py-2">
            <User className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Nombre de Operador</span>
            <Input
              value={user!.displayName}
              onChange={(e) => updateName(e.target.value)}
              className="w-36 h-8 text-xs bg-secondary border-border text-right"
            />
          </div>
          <div className="flex items-center gap-3 px-2 py-2">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Rol Actual</span>
            <Select value={user!.role} onValueChange={(v) => updateRole(v as RoleType)}>
              <SelectTrigger className="w-40 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabels[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connectivity */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">CONECTIVIDAD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Wifi className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Modo Offline</span>
            <Switch />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <WifiOff className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Red Mesh Simulada</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">NOTIFICACIONES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Bell className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Alertas Críticas</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Volume2 className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Señales Acústicas</span>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* System */}
      <Card className="tactical-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground">SISTEMA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Battery className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Ahorro de Energía</span>
            <Switch />
          </div>
          <div className="flex items-center gap-3 px-2 py-2.5">
            <Moon className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm flex-1">Modo Nocturno</span>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full border-critical/50 text-critical" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" /> SALIR DE KNOT
      </Button>

    </div>
  );
}
