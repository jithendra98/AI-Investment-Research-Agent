"use client"

import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="w-full">
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Built for{" "}
          <span className="font-medium text-foreground/80">
            InsideIIM × Altuni AI Labs Assignment
          </span>
        </p>
        <p className="text-xs text-muted-foreground/70">
          Powered by LangGraph &amp; GPT-4o
        </p>
      </div>
    </footer>
  )
}
