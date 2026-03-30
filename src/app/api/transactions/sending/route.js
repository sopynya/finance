import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function POST(req) {
    try {
        const userId = await getUserIdFromToken();
        const {name, category, amount, type, icon} = await req.json();
        if(!name || !category || !amount || !type || !icon) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }
        await sql`INSERT INTO transactions (user_id, name, category, amount, type, icon) VALUES (${userId}, ${name}, ${category}, ${amount}, ${type}, ${icon})`;
        return new NextResponse(null, { status: 201 });
    } catch (error) {
        console.error("Error sending data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}