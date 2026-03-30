import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
export async function GET(req) {
    const userId = await getUserIdFromToken();
    const plus = await sql`
        SELECT SUM(amount) AS total
        FROM transactions
        WHERE user_id = ${userId} AND type = 'positive'
    `;
    const minus = await sql`
        SELECT SUM(amount) AS total
        FROM transactions
        WHERE user_id = ${userId} AND type = 'negative'
    `;
    const totalBalance = (plus[0].total || 0) - (minus[0].total || 0);

    const result = await sql`
        SELECT SUM(amount) AS total_amount
        FROM transactions
        WHERE type = 'positive'
            AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND user_id = ${userId};
    `;
    const income = result[0].total_amount || 0;

    const expenses = await sql`SELECT SUM(amount) AS total FROM bills WHERE user_id = ${userId}`;
    const totalExpenses = expenses[0].total || 0;
    const pots = await sql`SELECT * FROM pots WHERE user_id = ${userId}`;
    const savings =  await sql`SELECT SUM(savings) AS total FROM pots WHERE user_id = ${userId}`;
    const totalSavings = savings[0].total || 0;
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    const budgets = await sql`SELECT * FROM budgets WHERE user_id = ${userId}`;
    const bills = await sql`SELECT * FROM bills WHERE user_id = ${userId}`;
    return NextResponse.json({totalBalance, income, totalExpenses, pots, totalSavings, transactions, budgets, bills});
}