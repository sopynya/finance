"use client";
import { useState } from 'react';
import styles from './addbudget.module.css'
export default function EditBudget({onClose, budget}) {
    const [category, setCategory] = useState(budget.category);
    const [showCategories, setShowCategories] = useState(false);
    const [amount, setAmount] = useState(budget.max);
    const [color, setColor] = useState(budget.color);
    const [showColors, setShowColors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setAmount(0);
            return;
        }

        setAmount(parseInt(value));
    };

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

    const cat = [
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
    async function handleEdit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if(!amount || amount == 0) {
                setError("Fill all fields");
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/budgets/${budget.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({category, max: amount, color})
            });
            if(!res.ok) {
                const data = await res.json();
                setError(data.error);
            }
        }catch(err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className={styles.bg}>
            <div className={styles.modal}>
                <h1>Edit Budget</h1>
                <img src='/assets/images/icon-close-modal.svg' className={styles.close} onClick={onClose}/>
                <p>As your budgets change, feel free to update your spending limits.</p>

                <form className={styles.form} onSubmit={handleEdit}>
                    <label>
                        Budget Category
                        <div className={showCategories ? `${styles.categories} ${styles.active}`: styles.categories} onClick={() => setShowCategories(!showCategories)}>
                            <p>{category}</p>
                            <img src='/assets/images/icon-caret-down.svg' />
                            {showCategories && (
                                <div className={styles.categorylist}>
                                    {cat.map((c) => (
                                        <p key={c} onClick={() => setCategory(c)} className={category === c ? styles.active : ''}>{c}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <label>
                        Maximum Spend
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
                            }}/>
                        </div>
                    </label>
                    <label>
                        Theme
                        <div className={showColors ? `${styles.color} ${styles.active}` : styles.color} onClick={() => setShowColors(!showColors)}>
                            <p><span style={{backgroundColor: colors[color]}} />{color}</p>
                            <img src='/assets/images/icon-caret-down.svg' />
                            {showColors && (
                            <div className={styles.colors}>
                                {Object.entries(colors).map(([name, hex]) => (
                                    <p key={hex} onClick={() => setColor(name)}><span style={{backgroundColor: hex}} />{name}</p>
                                ))}
                            </div>
                            )}
                        </div>
                    </label>
                    <button type='submit' className={styles.submit} disabled={loading}>{loading ? 'Editing Budget...': 'Edit Budget'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}