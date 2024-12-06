import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      <Outlet />
      <Toaster />
    </div>
  );
}
