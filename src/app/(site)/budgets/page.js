"use client";
import Budgets from "@/components/Budgets"
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res =await fetch('/api/budgets');
            const data = await res.json();
            setBudgets(data.budgets);
            setTransactions(data.transactions);
            setLoading(false);
        }
        load();
    }, []);
    if (loading) return <Loading />
    return(<Budgets budgets={budgets} transactions={transactions} />)
}