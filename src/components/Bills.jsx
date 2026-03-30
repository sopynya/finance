"use client"
import styles from './bills.module.css';
import { useState, useMemo } from 'react';
import AddBills from './AddBills';
export default function Bills({bills}) {
    const [sort, setSort] = useState('latest')
    const [searchTerm, setSearchTerm] = useState('');
    const [showSort, setShowSort] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const filteredBills =useMemo(() => {
        let result = bills;
        if(searchTerm) {
            result = result.filter(t => (
                t.name
            ).toLowerCase().includes(searchTerm.toLowerCase()))
        }

        if(sort === 'latest') {
            result = [...result].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA
            })
        }
        if(sort === 'oldest') {
            result = [...result].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return  dateA - dateB 
            })
        }
        if(sort === 'a to z') {
            result = [...result].sort((a, b) => 
                a.name.localeCompare(b.name)
            )
        }
        if(sort === 'z to a') {
            result = [...result].sort((a, b) => 
                b.name.localeCompare(a.name)
            )
        }
        if(sort === 'highest') {
            result = [...result].sort((a, b) => 
                Number(a.amount) > Number(b.amount)
            )
        }
        if(sort === 'lowest') {
            result = [...result].sort((a, b) => 
                Number(a.amount) < Number(b.amount)
            )
        }
        return result
    }, [searchTerm, sort, bills]);
    const getOrdinal = (day) => {
        if (day > 3 && day < 21) return day + "th";

        switch (day % 10) {
            case 1: return day + "st";
            case 2: return day + "nd";
            case 3: return day + "rd";
            default: return day + "th";
        }
    };
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
        let paidCount = 0;
        let paidTotal = 0;

        let upcomingCount = 0;
        let upcomingTotal = 0;

        let soonCount = 0;
        let soonTotal = 0;

        bills.forEach((bill) => {
            const status = getBillStatus(bill.day);

            if (status === "done") {
                paidCount++;
                paidTotal += Number(bill.amount);
            }

            if (status === "normal") {
                upcomingCount++;
                upcomingTotal += Number(bill.amount);
            }

            if (status === "alert") {
                soonCount++;
                soonTotal += Number(bill.amount);
            }
        });

        return {
            paidCount,
            paidTotal,
            upcomingCount,
            upcomingTotal,
            soonCount,
            soonTotal,
        };
    }, [bills]);
    const totalAmount = bills.reduce(
        (acc, b) => acc + Number(b.amount), 0
    );
    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Recurring Bills</h1>
                <button onClick={() => setShowAdd(true)}>+ Add Bill</button>
            </header>
            <main className={styles.main}>
                <div className={styles.info}>
                    <div className={styles.total}>
                        <img src='/assets/images/icon-recurring-bills.svg' alt='Receipt recurring bills icon'/>
                        <div>
                            <p>Total Bills</p>
                            <h1>${totalAmount.toFixed(2)}</h1>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <h2>Summary</h2>
                        <p>Paid Bills <span>{summary.paidCount}(${Number(summary.paidTotal).toFixed(2)})</span></p>
                        <hr />
                        <p>Total Upcoming <span>{summary.upcomingCount}(${Number(summary.upcomingTotal).toFixed(2)})</span></p>
                        <hr/>
                        <p style={{color: '#C94736'}} >Due Soon <span style={{color: '#C94736'}}>{summary.soonCount}(${Number(summary.soonTotal).toFixed(2)})</span></p>
                    </div>
                </div>
                
                <div className={styles.section}>
                    <div className={styles.filter}>
                        <div className={styles.search}>
                            <input type='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search bills' />
                            <img src='/assets/images/icon-search.svg' alt='Search icon' />
                        </div>
                        <div className={styles.actions}>
                            <p>Sort by</p>
                            <div onClick={() => setShowSort(!showSort)}>
                                <button>{sort} <img src='/assets/images/icon-caret-down.svg' alt='Caret down icon'/></button>
                                {showSort && (
                                    <div className={styles.sorts}>
                                    <p onClick={() => setSort('latest')}>Latest</p>
                                    <p onClick={() => setSort('oldest')}>Oldest</p>
                                    <p onClick={() => setSort('a to z')}>A to Z</p>
                                    <p onClick={() => setSort('z to a')}>Z to A</p>
                                    <p onClick={() => setSort('highest')}>Highest</p>
                                    <p onClick={() => setSort('lowest')}>Lowest</p>
                                </div>
                                )}
                            </div>
                            
                        </div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.titleth}>Bill Title</th>
                                <th className={styles.duedateth}>Due Date</th>
                                <th className={styles.amountth}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.map((bill) => {
                                const status = getBillStatus(bill.day);
                                return(

                                <tr key={bill.id}>
                                    <td className={styles.nametd}><img src={bill.icon} alt='Avatar'/>{bill.name}</td>
                                    <td>
                                       <div className={styles.datetd} style={{color: status === "done"? '#277C78' : ''}}>
                                         Monthly-{getOrdinal(bill.day)}
                                        {status === "done" && (
                                            <img src='/assets/images/icon-bill-paid.svg' alt='Paid icon' />
                                        )}
                                        {status === "alert" && (
                                            <img src='/assets/images/icon-bill-due.svg' alt='Due icon' />
                                        )}
                                       </div>
                                    </td>
                                    <td className={status === 'alert' ? styles.alerttd : styles.amountd}>${bill.amount}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>

                </div>
            </main>
            {showAdd && <AddBills onClose={() => setShowAdd(false)}/>}
        </div>
    )
}