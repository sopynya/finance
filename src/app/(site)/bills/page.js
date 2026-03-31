"use client"
import Bills from "@/components/Bills";
import { useState, useEffect } from "react";
import Loading from "@/components/Loading";
export default function BillsPage() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch('/api/bills');
            if(res.ok) {
                const data = await res.json();
                setBills(data);
                setLoading(false);
            }
        }
        load();
    }, []);
    if (loading) return <Loading />
    return (<Bills bills={bills} />)
}