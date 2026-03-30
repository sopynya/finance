"use client";
import Pots from "@/components/Pots";
import { useEffect, useState } from "react";
export default function PotsPage() {
    const [pots, setPots] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch('/api/pots');
            const data = await res.json();
            setPots(data);
            setLoading(false);
        }
        load();
    }, [])
    return(<Pots pots={pots} />);
}