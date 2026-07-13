import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import {Navbar} from "./Navbar"

export function AppLayout() {
  return (
    <div className="min-h-screen tactical-grid">
      <Navbar />

      <main className="pb-20 px-4 py-4">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
}
