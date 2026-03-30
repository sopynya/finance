import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function GET(req) {
    const userId = await getUserIdFromToken();
    const bills = await sql`SELECT * FROM bills WHERE user_id = ${userId}`;
    return NextResponse.json(bills);
}
export async function POST(req) {
    try {
        const userId = await getUserIdFromToken();
        const {name, amount, day, icon } = await req.json();
        if(!name || !amount|| !day || !icon) {
            return NextResponse.json(
                { error: "Invalid data" },
                { status: 400 }
            );
        }
        await sql`INSERT INTO bills (user_id, name, amount, day, icon) VALUES (${userId}, ${name}, ${amount}, ${day}, ${icon})`;
        return new NextResponse(null, { status: 201 });
    } catch (error) {
        console.error("Error sending data:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}