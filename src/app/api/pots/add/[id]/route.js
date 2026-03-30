import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const {amount } = await req.json(); 

    await sql`
      UPDATE pots
      SET savings = savings + ${amount}
      WHERE id = ${id};
    `;

    return new NextResponse(null, { status: 200 });

  } catch (error) {
    console.error("Error updating budget:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}