import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function GET(req) {
    const userId = await getUserIdFromToken();
    const budgets = await sql`SELECT * FROM budgets WHERE user_id = ${userId}`;
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    return NextResponse.json({budgets, transactions});
}