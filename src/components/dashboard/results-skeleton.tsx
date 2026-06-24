"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Recommendation Banner Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="h-24 w-32 rounded-full" />
            <div className="space-y-2 text-right">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Cards Skeleton */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col items-center p-6">
                <Skeleton className="mb-4 h-32 w-32 rounded-full" />
                <Skeleton className="mb-2 h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-36" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2 rounded-lg border border-border/30 p-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-3 w-3 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Skeleton */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-36" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 rounded-lg border border-border/30 p-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
