"use client"
import Link from 'next/link';
import styles from './overview.module.css';
import { useState, useEffect, useMemo } from 'react';
import Loading from './Loading';
export default function Overview() {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);
    const [pots, setPots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [bills, setBills] = useState([]);
    const colors = {
        green: '#277C78',
        yellow: '#F2CDAC',
        cyan: '#82C9D7',
        red: '#C94736',
        navy: '#626070',
        purple: '#826CB0',
        pink: '#AF81BA',
        turquoise: '#597C7C',
        brown: '#93674F',
        magenta: '#934F6F',
        blue: '#3F82B2',
        grey: '#97A0AC',
        army: '#7F9161',
        gold: '#CAB361',
        orange: '#BE6C49'
    }
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch('/api/overview');
            const data = await res.json();
            setCurrentBalance(data.totalBalance);
            setIncome(data.income);
            setExpenses(data.totalExpenses);
            setTotalSavings(data.totalSavings);
            setPots(data.pots)
            setTransactions(data.transactions);
            setBudgets(data.budgets);
            setBills(data.bills)
            setLoading(false);
        }
        load();
    }, []);

    const budgetsWithSpent = useMemo(() => {
            return budgets.map((bud) => {
                const spent = transactions
                .filter((t) => t.category === bud.category)
                .reduce((acc, t) => {
                    if (t.type === "negative") {
                        return acc + Math.abs(t.amount);
                    }       
                    return acc;
                }, 0);
    
                return { ...bud, spent };
            });
        }, [budgets, transactions]);
    
        const total = budgetsWithSpent.reduce(
            (acc, b) => acc + b.spent,
            0
        );
    
        const radius = 90;
        const strokeWidth = 35;
        const circumference = 2 * Math.PI * radius;
    
        const segments = budgetsWithSpent.map((b) => ({
            ...b,
            percentage: total === 0 ? 0 : (b.spent / total) * 100,
        }));

    const getBillStatus = (day) => {
        const now = new Date();

        const due = new Date(now.getFullYear(), now.getMonth(), day);

        const diffTime = due - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "done";

        if (diffDays <= 3) return "alert";

        return "normal";
    };

    const summary = useMemo(() => {
        let paidTotal = 0;
        let upcomingTotal = 0;
        let soonTotal = 0;

        bills.forEach((bill) => {
            const status = getBillStatus(bill.day);

            if (status === "done") {
                paidTotal += Number(bill.amount);
            }

            if (status === "normal") {
                upcomingTotal += Number(bill.amount);
            }

            if (status === "alert") {
                soonTotal += Number(bill.amount);
            }
        });
        return {
            paidTotal,
            upcomingTotal,
            soonTotal,
        };
    }, [bills]);
    if (loading) return <Loading />
    return(
        <div className={styles.page}>
            <h1>Overview</h1>
            <main className={styles.main}>
                <div className={styles.start}>
                    <div className={styles.balance}>
                        <p>Current Balance</p>
                        <h2>${currentBalance}</h2>
                    </div>
                    <div className={styles.income}>
                        <p>Income</p>
                        <h2>${income}</h2>
                    </div>
                    <div className={styles.income}>
                        <p>Expenses</p>
                        <h2>${expenses}</h2>
                    </div>
                </div>

                <div className={styles.data}>
                    <div className={styles.pt}>
                        <div className={styles.pots}>
                            <div className={styles.potsheader}>
                                <h3>Pots</h3>
                                <Link href='/pots'>See Details <img src='/assets/images/icon-caret-right.svg' alt='Caret right icon'/></Link>
                            </div>
                            <div className={styles.potsinfo}>
                                <div className={styles.pottotal}>
                                    <img src='/assets/images/icon-pot.svg' alt='Tip Jar icon'/>
                                    <div>
                                        <p>Total Saved</p>
                                        <h4>${totalSavings}</h4>
                                    </div>
                                </div>

                                <div className={styles.potsdata}>
                                    {pots.slice(0, 4).map((pot) => (
                                        <div className={styles.pot} key={pot.id}>
                                            <span style={{backgroundColor: colors[pot.color]}} />
                                            <div>
                                                <p>{pot.name}</p>
                                                <h4>${pot.savings || 0}</h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.transactions}>
                            <div className={styles.trheader}>
                                <h3>Transactions</h3>
                                <Link href='/transactions'>View All <img src='/assets/images/icon-caret-right.svg' alt='Caret right icon'/></Link>
                            </div>
                            <div className={styles.trsec}>
                                {transactions.slice(0, 5).map((tr) => (
                                    <div className={styles.transaction} key={tr.id}>
                                        <h4><img src={tr.icon} alt='avatar'/>{tr.name}</h4>
                                        <div>
                                            <p style={{color: tr.type === 'negative' ? '#201F24': '#277C78'}}>{tr.type === 'negative' ? '-' : '+'}${tr.amount}</p>
                                            <span>{new Intl.DateTimeFormat("en-GB", {day: "2-digit",month: "short",year: "numeric",}).format(new Date(tr.date))}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.brb}>
                        <div className={styles.budgets}>
                            <div className={styles.trheader}>
                                <h3>Budgets</h3>
                                <Link href='/budgets'>See Details <img src='/assets/images/icon-caret-right.svg' alt='Caret right icon'/></Link>
                            </div>
                            <div className={styles.budgetsinfo}>
                                <div className={styles.chart}>
                                    <svg width="210" height="210" viewBox="-10 -10 220 220">
                                        <g transform="rotate(-90 100 100)">
                                            {(() => {
                                                let offset = 0;
                                                return segments.map((seg, i) => {
                                                    const dash = (seg.percentage / 100) * circumference;
                                                    const circle = (
                                                        <circle key={i} cx="100" cy="100" r={radius} fill="none" stroke={colors[seg.color]} strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={-offset} strokeLinecap="butt" />
                                                    );
                                                    offset += dash;
                                                    return circle;
                                                });
                                            })()}
                                            <circle cx="100" cy="100" r={radius - 23} fill="none" stroke="white" strokeWidth={strokeWidth} opacity="0.25" />
                                        </g>
                                    </svg>
                                    <div className={styles.center}>
                                        <h4>${total.toFixed(0)}</h4>
                                        <p>of ${budgets.reduce((acc, b) => acc + Number(b.max), 0)} limit</p>
                                    </div>
                                </div>

                                <div className={styles.budgetsdata}>
                                    {budgetsWithSpent.slice(0, 4).map((bud) => (
                                        <div className={styles.budget} key={bud.id}>
                                            <span style={{backgroundColor: colors[bud.color]}} />
                                            <div>
                                                <p>{bud.category}</p>
                                                <h3>${Number(bud.spent).toFixed(2)}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>  
                        </div>

                        <div className={styles.bills}>
                            <div className={styles.trheader}>
                                <h3>Recurring Bills</h3>
                                <Link href='/bills'>See Details <img src='/assets/images/icon-caret-right.svg' alt='Caret right icon'/></Link>
                            </div>
                            <div className={styles.billsdata}>
                                <div className={styles.paidb}>
                                    <p>Paid Bills</p>
                                    <span>${summary.paidTotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.upcomingb}>
                                    <p>Total Upcoming</p>
                                    <span>${summary.upcomingTotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.dueb}>
                                    <p>Due Soon</p>
                                    <span>${summary.soonTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}