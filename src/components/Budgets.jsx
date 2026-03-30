"use client";
import Link from 'next/link';
import styles from './budgets.module.css'
import { useMemo, useState } from 'react';
import AddBudget from './AddBudget';
import EditBudget from './EditBudget';
export default function Budgets({budgets, transactions}) {
    const [showAdd, setShowAdd] = useState(false);
    const [showActions, setShowActions] = useState("");
    const [edit, setEdit] = useState("");
    const [deletion, setDeletion] = useState("");
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

    let offset = 0;

    const segments = budgetsWithSpent.map((b) => ({
        ...b,
        percentage: total === 0 ? 0 : (b.spent / total) * 100,
    }));


    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Budgets</h1>
                <button onClick={() => setShowAdd(true)}>+ Add New Budget</button>
            </header>
            <main className={styles.main}>
                <div className={styles.summary}>
                    <div className={styles.chart}>
                    <svg width="210" height="210" viewBox="-10 -10 220 220">
                        <g transform="rotate(-90 100 100)">
                            {(() => {
                                let offset = 0;

                                return segments.map((seg, i) => {
                                const dash = (seg.percentage / 100) * circumference;

                                const circle = (
                                    <circle
                                    key={i}
                                    cx="100"
                                    cy="100"
                                    r={radius}
                                    fill="none"
                                    stroke={colors[seg.color]}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={`${dash} ${circumference}`}
                                    strokeDashoffset={-offset}
                                    strokeLinecap="butt"
                                    />
                                );

                                offset += dash;
                                return circle;
                            });
                            })()}
                            
                            <circle
                                cx="100"
                                cy="100"
                                r={radius - 23}
                                fill="none"
                                stroke="white"
                                strokeWidth={strokeWidth}
                                opacity="0.25"
                            />
                            
                        </g>
                    </svg>
                    <div className={styles.center}>
                        <h4>${total.toFixed(0)}</h4>
                        <p>of ${budgets.reduce((acc, b) => acc + Number(b.max), 0)} limit</p>
                    </div>
                    </div>

                    <div className={styles.infosum}>
                        <h2>Spending Summary</h2>
                        {budgets.map((bud) => {
                            const now = new Date();
                            const filteredTransactions = transactions.filter((t) => {
                            const date = new Date(t.date);

                            return (
                                t.category === bud.category &&
                                date.getMonth() === now.getMonth() &&
                                date.getFullYear() === now.getFullYear()
                            );
                        });
                        const spent = filteredTransactions.reduce((acc, t) => {
                            if (t.type === "negative") {
                                return acc + Math.abs(t.amount);
                            }
                            return acc;
                        }, 0);
                        const remaining = Number(bud.max).toFixed(2);
                        return (
                            <div key={bud.id} className={styles.sum}>
                                <div className={styles.sumcat}>
                                    <span style={{backgroundColor: colors[bud.color]}} />
                                    <p>{bud.category}</p>
                                </div>
                                <div className={styles.sumnum}>
                                    <p>${spent.toFixed(2)}</p>
                                    <span>of ${remaining}</span>
                                </div>
                            </div>
                        )
                        })}
                    </div>
                </div>
                <div className={styles.budgets}>
                    {budgets.map((bud) => {
                        const now = new Date();
                        const filteredTransactions = transactions.filter((t) => {
                            const date = new Date(t.date);

                            return (
                                t.category === bud.category &&
                                date.getMonth() === now.getMonth() &&
                                date.getFullYear() === now.getFullYear()
                            );
                        });
                        const spent = filteredTransactions.reduce((acc, t) => {
                            if (t.type === "negative") {
                                return acc + Math.abs(t.amount);
                            }
                            return acc;
                        }, 0);
                        const percentage = (spent / bud.max) * 100;
                        const remaining = bud.max - spent;
                        return (
                        <div key={bud.id} className={styles.budget}>
                            <div className={styles.head}>
                                <h2><span style={{backgroundColor: colors[bud.color]}} />{bud.category}</h2>
                                <img src='/assets/images/icon-ellipsis.svg' onClick={() => setShowActions(showActions === bud.id? '' : bud.id)} />
                                {showActions === bud.id && (
                                <div className={styles.actions}>
                                    <button onClick={() => setEdit(edit === bud.id ? '': bud.id)}>Edit Budget</button>
                                    <hr/>
                                    <button style={{color: '#C94736'}} onClick={() => setDeletion(deletion === bud.id ? '': bud.id)}>Delete Budget</button>
                                </div>
                                )}

                            </div>
                            <p className={styles.budgetMax}>Maximum of ${bud.max}</p>
                            <div className={styles.maxpercentage}>
                                <div className={styles.percentage} style={{width: `${Math.min(percentage, 100)}%`, backgroundColor: colors[bud.color]}} />
                            </div>
                            <div className={styles.spent}>
                                <span  className={styles.lineone} style={{backgroundColor: colors[bud.color]}}/>
                                <div className={styles.info}>
                                    <label>Spent</label>
                                    <p>${spent.toFixed(2)}</p>
                                </div>
                                <span  className={styles.line}/>
                                <div className={styles.info}>
                                    <label>Remaining</label>
                                    <p>${remaining.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className={styles.transactions}>
                                <div className={styles.title}>
                                    <h3>Latest Spending</h3>
                                    <Link href='/transactions'>See All <img src='/assets/images/icon-caret-right.svg'/></Link>
                                </div>
                                {filteredTransactions.slice(0, 3).map((t) => {
                                    if (t.type === 'positive') {
                                        return;
                                    }
                                    const formatted = new Intl.DateTimeFormat("en-GB", {day: "2-digit",month: "short",year: "numeric",}).format(new Date(t.date))
                                    return (
                                    <div key={t.id} className={styles.transaction}>
                                        <div className={styles.maininfo}>
                                            <img src={t.icon} />
                                            <p>{t.name}</p>
                                        </div>
                                        <div className={styles.direct}>
                                            <p>-${t.amount}</p>
                                            <span>{formatted}</span>
                                        </div>
                                    </div>)
                                })}
                            </div>
                            {edit === bud.id && <EditBudget budget={bud} onClose={() => setEdit("")}/>}
                            {deletion === bud.id && <DeleteBudget budget={bud} onClose={() => setDeletion("")} />}
                        </div>)
                    })}
                </div>
            </main>

            {showAdd && <AddBudget onClose={() => setShowAdd(false)}/>}
        </div>
    )
}

function DeleteBudget({budget, onClose}) {
    async function handleDelete(e) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/budgets/${budget.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete");
            } else {
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
        
    }
    return(
        <div className={styles.bg}>
            <div className={styles.modal}>
                <h1>Delete '{budget.category}'?</h1>
                <img src='/assets/images/icon-close-modal.svg' onClick={onClose} />
                <p>Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.</p>
                <button onClick={handleDelete} className={styles.confirm}>Yes, Confirm Deletion</button>
                <button onClick={onClose} className={styles.goback}>No, Go Back</button>
            </div>
        </div>
    )
}