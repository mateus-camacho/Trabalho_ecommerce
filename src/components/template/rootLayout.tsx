import Header from "./header";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="w-full max-w-[1400px] h-full mx-auto flex-1 px-4">
        <Outlet />
        <Toaster />
      </main>
      <Footer />
    </div>
  );
}
