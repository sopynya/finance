import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function POST(req) {
    try {
        const userId = await getUserIdFromToken();
        const {category, max, color} = await req.json();
        if(!category || !max || !color) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }
        await sql`INSERT INTO budgets (user_id, category, max, color) VALUES (${userId}, ${category}, ${max}, ${color})`;
        return new NextResponse(null, { status: 201 });
    } catch (error) {
        console.error("Error sending data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}