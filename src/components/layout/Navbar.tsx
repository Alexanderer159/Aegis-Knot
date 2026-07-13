import { Shield, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
        
      <NavLink to="/" className="flex gap-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-lg font-heading font-bold tracking-widest text-foreground">AEGIS KNOT</h1>
      </NavLink>
        
      <NavLink  to="/config" className={({ isActive }) => cn( "p-1 transition-all", isActive ? "text-primary rotate-180" : "text-muted-foreground")}>
        <Settings />
      </NavLink>
   
        
      
        
      </header>
  );
}
