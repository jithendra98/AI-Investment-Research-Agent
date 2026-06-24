import { NextResponse } from "next/server";
import { app } from "@/lib/langgraph/graph";

export const maxDuration = 300; 

export async function POST(request: Request) {
  try {
    const { ticker } = await request.json();
    if (!ticker) return NextResponse.json({ error: "Ticker is required" }, { status: 400 });

    const finalState = await app.invoke({ ticker: ticker.toUpperCase(), messages: [] });

    if (finalState.error) {
      return NextResponse.json({ error: finalState.error }, { status: 500 });
    }

    return NextResponse.json(finalState.finalReport);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
