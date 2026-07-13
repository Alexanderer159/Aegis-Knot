import { Home, Users, Map, Package, BookOpen, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/grupo", icon: Users, label: "Grupo" },
  { to: "/mapa", icon: Map, label: "Mapa" },
  { to: "/insumos", icon: Package, label: "Suministros" },
  { to: "/vault", icon: BookOpen, label: "Vault" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) =>
              cn( "flex flex-col items-center gap-0.5 px-3 py-1.5 text-sm font-heading transition-all duration-500",
                isActive ? "text-primary" : "text-muted-foreground")}>
            <item.icon className="h-5 w-5" />
            <span className="text-white font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
