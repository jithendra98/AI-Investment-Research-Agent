import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500/10 mb-6">
          <SettingsIcon className="h-10 w-10 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground max-w-md text-center">
          Agent configuration and user preferences will be managed here.
        </p>
      </main>
      <Footer />
    </div>
  )
}
