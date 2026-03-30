import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function GET(req) {
    const userId = await getUserIdFromToken();
    const pots = await sql`SELECT * FROM pots WHERE user_id = ${userId}`;
    return NextResponse.json(pots)
}
export async function POST(req) {
    try {
        const userId = await getUserIdFromToken();
        const {name, amount, color} = await req.json();
        if(!name || !amount || !color) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }
        await sql`INSERT INTO pots (user_id, name, goal, color) VALUES (${userId}, ${name}, ${amount}, ${color})`;
        return new NextResponse(null, { status: 201 });
    } catch (error) {
        console.error("Error sending data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}