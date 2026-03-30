"use client"
import Bills from "@/components/Bills";
import { useState, useEffect } from "react";
export default function BillsPage() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch('/api/bills');
            const data = await res.json();
            setBills(data);
            setLoading(false);
        }
        load();
    }, [])
    return (<Bills bills={bills} />)
}