import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-10 text-center shadow-2xl shadow-blue-500/5">
          {/* Glow accent */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Saved Reports</h1>

            <p className="text-muted-foreground text-sm leading-relaxed">
              Report persistence is coming soon. Reports are currently generated fresh on each search.
            </p>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary ring-1 ring-primary/20 transition-all hover:bg-primary/20 hover:ring-primary/40"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
