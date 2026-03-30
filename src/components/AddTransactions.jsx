"use client"
import { useState, useMemo } from "react"
import styles from './transactions.module.css'
export default function AddTransactions({onClose}) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("entertainment");
    const [showCat, setShowCat] = useState(false);
    const [cents, setCents] = useState(0);
    const [isNegative, setIsNegative] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [icon,setIcon] = useState("/assets/images/avatars/technova-innovations.jpg");
    const fotos = [
        'technova-innovations.jpg',
        'swift-ride-share.jpg',
        'spark-electric-solutions.jpg',
        'urban-services-hub.jpg',
        'serenity-spa-and-wellness.jpg',
        'savory-bites-bistro.jpg',
        'pixel-playground.jpg',
        'nimbus-data-storage.jpg',
        'green-plate-eatery.jpg',
        'flavor-fiesta.jpg',
        'elevate-education.jpg',
        'ecofuel-energy.jpg',
        'bytewise.jpg',
        'aqua-flow-utilities.jpg',
        'buzz-marketing-group.jpg'
    ]
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
    async function postTransaction(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {

            const amount = cents / 100;
            const type = isNegative ? 'negative': 'positive';
            if (!name || !icon || cents === 0) {
                setError("Fill all fields");
                setLoading(false);
                return;
            }
            const res = await fetch('/api/transactions/sending', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, category, amount, type, icon})
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
        <div className={styles.bgmodal}>
            <div className={styles.modal}>
                <img src='/assets/images/icon-close-modal.svg' onClick={onClose} className={styles.close} />
                <h2>Add New Transaction</h2>
                <p>Track your latest transactions by adding them</p>
                <form className={styles.form} onSubmit={postTransaction}>
                    <label>
                        Icons
                        <div className={styles.iconsChoose}>
                            {fotos.map((f) => (
                                <img key={f} src={`/assets/images/avatars/${f}`} onClick={() => setIcon(`/assets/images/avatars/${f}`)} className={icon === `/assets/images/avatars/${f}` ? styles.active : ''}/>
                            ))}
                        </div>
                    </label>
                    <label>Recipient / Sender
                        <input className={styles.inputName} type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sandra Catlyn"/>
                    </label>
                    <label>
                        Category
                        <div onClick={() => setShowCat(!showCat)} className={styles.catChoice}>{category}<img src='/assets/images/icon-caret-down.svg'/>
                            {showCat && (
                                <div className={styles.cat}>
                                {cat.map((c) => (
                                    <p key={c} onClick={() => setCategory(c)} className={category === c ? styles.active : ''}>{c}</p>
                                ))}
                            </div>
                            )}
                        </div>
                    </label>
                    <label>
                        <div>
                        <span onClick={() => setIsNegative(false)} style={{textDecoration: !isNegative ? 'underline': '', cursor: 'pointer'}}>Receive</span> / <span onClick={() => setIsNegative(true)} style={{textDecoration: isNegative ? 'underline': '', cursor: 'pointer'}}>Send</span>
                        </div>
                        <div className={styles.value}>
                            <p>{isNegative ? '-' : '+'}</p>
                            <input type='text' value={formatted} onChange={handleChange} onKeyDown={(e) => {
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

                    <button type='submit' className={styles.submit} disabled={loading}>{loading ? 'Adding Transaction...': 'Add Transaction'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}