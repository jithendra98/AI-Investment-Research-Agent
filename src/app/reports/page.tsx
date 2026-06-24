import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 mb-6">
          <FileText className="h-10 w-10 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Reports</h1>
        <p className="text-muted-foreground max-w-md text-center">
          This page will contain all your previously generated AI investment research reports.
        </p>
      </main>
      <Footer />
    </div>
  )
}
