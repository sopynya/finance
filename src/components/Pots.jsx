"use client";
import { useState } from 'react';
import styles from './pots.module.css'
import EditPot from './EditPot';
import DeletePot from './DeletePot';
import AddPot from './AddPot';
export default function Pots({pots}) {
    const [showAdd, setShowAdd] = useState(null);
    const [showWithdraw, setShowWithdraw] = useState(null);
    const [showActions, setShowActions] = useState(null);
    const [showEdit, setShowEdit] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const [showNew, setShowNew] = useState(false);
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
    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Pots</h1>
                <button onClick={() => setShowNew(true)}>+ Add New Pot</button>
            </header>

            <main className={styles.main}>
                {pots.map((p) => {
                    const safeGoal = Number(p.goal) || 0;
                    const percentage = safeGoal ? (p.savings / safeGoal) * 100 : 0
                    return(
                        <div key={p.id} className={styles.pot}>
                            <div className={styles.head}>
                                <h2><span style={{backgroundColor: colors[p.color]}}/>{p.name}</h2>
                                <img src='/assets/images/icon-ellipsis.svg' alt='See more icon' onClick={() => setShowActions(p.id)}/>
                                {showActions === p.id && (
                                    <div className={styles.editsection}>
                                    <button onClick={() => setShowEdit(p.id)}>Edit Pot</button>
                                    <hr />
                                    <button style={{color: '#C94736'}} onClick={() => setShowDelete(p.id)}>Delete pot</button>
                                </div>
                                )}
                            </div>
                            <div className={styles.total}>
                                <p>Total Saved</p>
                                <h3>${Number(p.savings).toFixed(2)}</h3>
                            </div>
                            <div className={styles.percentage}>
                                <div style={{backgroundColor: colors[p.color], width: `${percentage}%`}}/>
                            </div>
                            <div className={styles.data}>
                                <p>{percentage.toFixed(2)}%</p>
                                <span>Target of ${p.goal}</span>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => setShowAdd(p.id)}>+ Add Money</button>
                                <button onClick={() => setShowWithdraw(p.id)}>Withdraw</button>
                            </div>
                            {showAdd === p.id && (<AddMoney pot={p} onClose={() => setShowAdd(null)}/>)}
                            {showWithdraw === p.id && (<WithdrawMoney pot={p} onClose={() => setShowWithdraw(null)} />)}
                            {showEdit === p.id && (<EditPot  pot={p} onClose={() => setShowEdit(null)}/>)}
                            {showDelete === p.id && (<DeletePot pot={p} onClose={() => setShowDelete(null)} />)}
                        </div>
                    )
                })}
            </main>
            {showNew && (<AddPot onClose={() => setShowNew(false)}/>)}
        </div>
    )
}

function AddMoney({pot, onClose}) {
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const pr = (Number(pot.savings) / Number(pot.goal)) * 100;
    const plus = (amount / Number(pot.goal)) * 100;
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setAmount(0);
            return;
        }

        setAmount(parseInt(value));
    };
    async function handleAdd(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (amount <= 0 || !amount) {
                setError('Enter a valid amount');
                return
            }
            const res = await fetch(`/api/pots/add/${pot.id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({amount})
            });
            if(!res.ok) {
                const data = await res.json();
                setError(data.error);
            }
        }catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className={styles.bg}>
            <div className={styles.modal}>
                <h1>Add to &apos;{pot.name}&apos;</h1>
                <p>Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.</p>
                <img src='/assets/images/icon-close-modal.svg' alt='Close icon' onClick={onClose}/>
                <div className={styles.modalstart}>
                    <p>New Amount</p>
                    <h3>${amount + Number(pot.savings)}</h3>
                </div>
                <div className={styles.percent}>
                    <div className={styles.current} style={{width: `${pr}%`}} />
                    <div className={styles.toadd} style={{width: `${plus}%`}} />
                </div>
                <div className={styles.pin}>
                    <p>{plus.toFixed(2)}%</p>
                    <span>Target of ${pot.goal}</span>
                </div>
                <form className={styles.form} onSubmit={handleAdd}>
                    <label>
                        Amount to Add
                        <div className={styles.value}>
                            <span>$</span>
                            <input type='text' value={amount} onChange={handleChange} onKeyDown={(e) => {
                                const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                ];

                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }} />
                        </div>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Adding...': 'Confirm Addition'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}

function WithdrawMoney({pot, onClose}) {
    const [amount, setAmount] = useState(0);
    const pr = (Number(pot.savings) / Number(pot.goal)) * 100;
    const plus = (amount / pot.savings) * 100;
    const [error, setError]= useState("");
    const [loading, setLoading] = useState(false);
    async function handleAdd(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (amount <= 0 || !amount || amount > pot.savings) {
                setError('Enter a valid amount');
                return;
            }
            const res = await fetch(`/api/pots/withdraw/${pot.id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({amount})
            });
            if(!res.ok) {
                const data = await res.json();
                setError(data.error);
            }
        }catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setAmount(0);
            return;
        }

        setAmount(parseInt(value));
    };
    return(
        <div className={styles.bg}>
        <div className={styles.modal}>
            <h1>Withdraw from &apos;{pot.name}&apos;</h1>
            <p>Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.</p>
            <img src='/assets/images/icon-close-modal.svg' alt='Close icon' onClick={onClose}/>
            <div className={styles.modalstart}>
                <p>New Amount</p>
                <h3>${Number(pot.savings) - amount}</h3>
            </div>
            <div className={styles.percent}>
                <div className={styles.current} style={{width: `${pr}%`, borderRadius: '0 4px 4px 0'}}>
                    <div className={styles.toremove} style={{width: `${plus}%`}} />
                </div>
            </div>
            <div className={styles.pin}>
                <p style={{color: '#C94736'}}>{plus.toFixed(2)}%</p>
                <span>Target of ${pot.goal}</span>
            </div>
            <form className={styles.form} onSubmit={handleAdd}>
                    <label>
                        Amount to Withdraw
                        <div className={styles.value}>
                            <span>$</span>
                            <input type='text' value={amount} onChange={handleChange} onKeyDown={(e) => {
                                const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                ];

                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }} />
                        </div>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Withdrawing...': 'Confirm Withdraw'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
        </div>
        </div>
    )
}