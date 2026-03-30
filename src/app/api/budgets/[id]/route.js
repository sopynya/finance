import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
export async function PUT(req, {params}) {
    try {
        const { id } = await params;
        const { category, max, color } = await req.json();

        await sql`
            UPDATE budgets
            SET category = ${category},
                max = ${max},
                color = ${color}
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
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await sql`
      DELETE FROM budgets
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