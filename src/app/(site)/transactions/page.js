"use client"
import Transactions from "@/components/Transactions";
import { useEffect, useState } from "react";
export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res =await fetch('/api/transactions');
            const data = await res.json();
            setTransactions(data);
            setLoading(false);
        }
        load();
    }, [])
    return(<Transactions transactions={transactions}/>);
}