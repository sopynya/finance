"use client";
import { useState, useMemo } from 'react'
import styles from './transactions.module.css'
import AddTransactions from './AddTransactions';
export default function Transactions({transactions}) {
    const [sortBy, setSortBy] = useState('latest')
    const [category, setCategory] = useState('all transactions');
    const [showSortBy, setShowSortBy] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAdd, setShowAdd] = useState(false);
    const itemsPerPage = 10;
    const cat = [
        'all transactions',
        'entertainment',
        'bills',
        'groceries',
        'dining out',
        'transportation',
        'personal care',
        'education',
        'lifestyle',
        'shopping',
        'general'
    ]
    const sorts = [
        'latest',
        'oldest',
        'a to z',
        'z to a',
        'highest',
        'lowest'
    ]
    const filteredTransactions =useMemo(() => {
        let result = transactions;
        if(searchTerm) {
            result = result.filter(t => (
                t.name
            ).toLowerCase().includes(searchTerm.toLowerCase()))
        }

        if(sortBy === 'latest') {
            result = [...result].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA
            })
        }
        if(sortBy === 'oldest') {
            result = [...result].sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return  dateA - dateB 
            })
        }
        if(sortBy === 'a to z') {
            result = [...result].sort((a, b) => 
                a.name.localeCompare(b.name)
            )
        }
        if(sortBy === 'z to a') {
            result = [...result].sort((a, b) => 
                b.name.localeCompare(a.name)
            )
        }
        if(sortBy === 'highest') {
            result = [...result].sort((a, b) => 
                a.amount > b.amount
            )
        }
        if(sortBy === 'lowest') {
            result = [...result].sort((a, b) => 
                a.amount < b.amount
            )
        }
        for(let i= 0; i < cat.length; i++) {
            if(category === cat[i] && cat[i] !== 'all transactions') {
                result =result.filter(t => t.category === category)
            }
        }
        return result
    }, [searchTerm, category, sortBy, transactions]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    const getPageNumbers = () => {
        let start = Math.max(currentPage - 2, 1);
        let end = start + 4;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(end - 4, 1);
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };
    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Transactions</h1>
                <button onClick={() => setShowAdd(true)}>+ Add Transaction</button>
            </header>

            <main className={styles.main}>
                <div className={styles.filter}>
                    <div className={styles.searchbar}>
                        <input type='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search transaction' />
                        <img src='/assets/images/icon-search.svg' />
                    </div>
                    <div className={styles.actions}>
                        <label>
                            Sort by
                            <button className={showSortBy ? styles.active : ''} onClick={() => setShowSortBy(!showSortBy)}>{sortBy} <img src='/assets/images/icon-caret-down.svg'/></button>
                            {showSortBy && (
                                <div className={styles.optionsSort}>
                                    {sorts.map((s) => (
                                        <p key={s} onClick={() => setSortBy(s)} className={sortBy === s ? styles.active : ''}>{s}</p>
                                    ))}
                                </div>
                            )}
                        </label>

                        <label>
                            Category
                            <button className={showCategories ? styles.active : ''} onClick={() => setShowCategories(!showCategories)}>{category} <img src='/assets/images/icon-caret-down.svg'/></button>
                            {showCategories && (
                                <div className={styles.optionsCategory}>
                                {cat.map((c) => (
                                    <p onClick={() => setCategory(c)} key={c} className={category === c ? styles.active : ''}>{c}</p>
                                ))}
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {transactions.length === 0 ? <p className={styles.none}>You have no transactions</p> : (
                    <div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Recipient / Sender</th>
                                <th className={styles.categoryth}>Category</th>
                                <th>Transaction Date</th>
                                <th className={styles.amountth}>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((trans) => (
                                <tr key={trans.id}>
                                    <td className={styles.nametd}><img src={trans.icon} />{trans.name}</td>
                                    <td className={styles.categorytd}>{trans.category}</td>
                                    <td className={styles.datetd}>{new Intl.DateTimeFormat("en-GB", {day: "2-digit",month: "short",year: "numeric",}).format(new Date(trans.date))}</td>
                                    <td className={trans.type === 'negative'? styles.negative : styles.positive}>{trans.type === 'negative' ? `-$${trans.amount}` : `+$${trans.amount}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.pagination}>
                            <button className={styles.pn} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                                <img src='/assets/images/icon-caret-left.svg'/>
                                Prev
                            </button>
                            <div className={styles.number}>
                                {getPageNumbers().map((page) => (
                                    <button key={page} onClick={() => setCurrentPage(page)} className={page === currentPage ? styles.active : ""}>
                                    {page}
                                    </button>
                                ))}
                            </div>
                            <button className={styles.pn} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                                Next
                                <img src='/assets/images/icon-caret-right.svg'/>
                            </button>
                    </div>
                    </div>
                )}
            </main>

            {showAdd && <AddTransactions  onClose={() => setShowAdd(false)}/>}
        </div>
    )
}