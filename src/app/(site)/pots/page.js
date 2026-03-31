"use client";
import Pots from "@/components/Pots";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
export default function PotsPage() {
    const [pots, setPots] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch('/api/pots');
            if(res.ok) {
                const data = await res.json();
                setPots(data);
            }
            setLoading(false);
        }
        load();
    }, []);
    if (loading) return <Loading />
    return(<Pots pots={pots} />);
}