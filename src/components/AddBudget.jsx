"use client";
import { useState, useMemo } from 'react';
import styles from './addbudget.module.css';
export default function AddBudget({onClose}) {
    const [category, setCategory] = useState("entertainment");
    const [showCategories, setShowCategories] = useState(false);
    const [cents, setCents] = useState(0);
    const [color, setColor] = useState("green");
    const [showColors, setShowColors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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

    const formatted = useMemo(() => {
        return (cents / 100).toFixed(2);
    }, [cents]);

    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setCents(0);
            return;
        }

        setCents(parseInt(value));
    };

    async function handleNewBudget(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const max = cents / 100;
            if(!max || max === 0) {
                setError("Fill all fields");
                setLoading(false);
                return;
            }
            const res = await fetch('/api/budgets/sending', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({category, max, color})
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
                <h1>Add New Budget</h1>
                <img src='/assets/images/icon-close-modal.svg' alt='Close icon' className={styles.close} onClick={onClose}/>
                <p>Choose a category to set a spending budget. These categories can help you monitor spending.</p>

                <form className={styles.form} onSubmit={handleNewBudget}>
                    <label>
                        Budget Category
                        <div className={showCategories ? `${styles.categories} ${styles.active}`: styles.categories} onClick={() => setShowCategories(!showCategories)}>
                            <p>{category}</p>
                            <img src='/assets/images/icon-caret-down.svg' alt='Caret down icon' />
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
                            <input type='text' value={formatted == 0 ? '' : formatted} placeholder='e.g. 2000' onChange={handleChange} onKeyDown={(e) => {
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
                            <img src='/assets/images/icon-caret-down.svg' alt='Caret down icon' />
                            {showColors && (
                            <div className={styles.colors}>
                                {Object.entries(colors).map(([name, hex]) => (
                                    <p key={hex} onClick={() => setColor(name)}><span style={{backgroundColor: hex}} />{name}</p>
                                ))}
                            </div>
                            )}
                        </div>
                    </label>
                    <button className={styles.submit} type='submit' disabled={loading}>{loading ? 'Adding Budget': 'Add Budget'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}