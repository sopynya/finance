import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await sql`
      DELETE FROM pots
      WHERE id = ${id};
    `;

    return new NextResponse(null, { status: 200 });

  } catch (error) {
    console.error("Error deleting budget:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}