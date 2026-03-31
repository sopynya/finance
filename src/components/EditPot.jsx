"use client"
import { useState } from 'react'
import styles from './editpot.module.css'
export default function EditPot({pot, onClose}) {
    const [name, setName] = useState(pot.name);
    const [amount, setAmount] = useState(pot.goal);
    const [color, setColor] = useState(pot.color);
    const [loading, setLoading] = useState(false);
    const [showColors, setShowColors] = useState(false);
    const [error, setError] = useState("");
    const chars = 30;
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
    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setAmount(0);
            return;
        }

        setAmount(parseInt(value));
    };
    async function handleEdit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (amount <= 0 || !amount || !name) {
                setError('Fill all fields');
                return;
            }
            const res = await fetch(`/api/pots/edit/${pot.id}`, {
                method: 'PATCH',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name,amount, color})
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
                <img src='/assets/images/icon-close-modal.svg' alt='Close icon' onClick={onClose} className={styles.close} />
                <h1>Edit Pot</h1>
                <p>If your saving targets change, feel free to update your pots.</p>
                <form className={styles.form} onSubmit={handleEdit}>
                    <label className={styles.potname}>
                        Pot Name
                        <input type='text' max={30} value={name} onChange={(e) => setName(e.target.value)} />
                        <span>{chars - name.length} characters left</span>
                    </label>
                    <label>
                        Target
                        <div className={styles.target}>
                            <p>$</p>
                            <input value={amount} onChange={handleChange} onKeyDown={(e) => {
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
                        <div className={styles.theme} onClick={() => setShowColors(!showColors)}>
                            <p><span style={{backgroundColor: colors[color]}}/>{color}</p>
                            <img src='/assets/images/icon-caret-down.svg' alt='Caret down icon'/>
                            {showColors && (
                                <div className={styles.colors}>
                                    {Object.entries(colors).map(([namec, hex]) => (
                                        <p key={hex} onClick={() => setColor(namec)}><span style={{backgroundColor: hex}} />{namec}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>
                    <button type='submit' disabled={loading} className={styles.submit}>{loading ? 'Saving Changes...': 'Save Changes'}</button>
                </form>
                {error && (<p className={styles.error}>{error}</p>)}
            </div>
        </div>
    )
}