import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#2563EB] mb-4">Deskora</h1>
        <p className="text-xl text-gray-500 mb-8">Your AI Business Assistant</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-[#2563EB] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#10B981] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Get Started.
          </Link>
        </div>
      </div>
    </main>
  );
}