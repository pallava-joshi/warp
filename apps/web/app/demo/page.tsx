import { Navbar } from "../../components/landing";
import { ChatScreen } from "../../components/chat/ChatScreen";
import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0B0F2A]">
      <Navbar />
      <div className="pt-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6D28FF]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              ← Back to home
            </Link>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11152E]/90 backdrop-blur-sm shadow-xl shadow-[#6D28FF]/10 overflow-hidden h-[calc(100vh-12rem)] min-h-[400px]">
            <ChatScreen fill />
          </div>
        </div>
      </div>
    </main>
  );
}
