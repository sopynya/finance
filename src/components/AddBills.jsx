"use client"
import { useState, useMemo } from "react"
import styles from './transactions.module.css'
export default function AddBills({onClose}) {
    const [name, setName] = useState("");
    const [cents, setCents] = useState(0);
    const [day, setDay] = useState(1);
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
    const formatted = useMemo(() => {
        return (cents / 100).toFixed(2);
    }, [cents]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); 

        if (!value) {
            setCents(0);
            return;
        }

        setCents(parseInt(value));
    };
    async function postBill(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {

            const amount = cents / 100;
            if (!name || !icon || cents === 0) {
                setError("Fill all fields");
                setLoading(false);
                return;
            }
            if (day > 31) {
                setError("Due Date must be between 1 and 31");
                setLoading(false);
                return;
            }
            const res = await fetch('/api/bills', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({name, amount, day, icon})
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
    }
    return(
        <div className={styles.bgmodal}>
            <div className={styles.modal}>
                <img src='/assets/images/icon-close-modal.svg' alt='Close icon' onClick={onClose} className={styles.close} />
                <h2>Add New Bill</h2>
                <p>Track your latest bills by adding them and their due date</p>
                <form className={styles.form} onSubmit={postBill}>
                    <label>
                        Icons
                        <div className={styles.iconsChoose}>
                            {fotos.map((f) => (
                                <img key={f} src={`/assets/images/avatars/${f}`} onClick={() => setIcon(`/assets/images/avatars/${f}`)} className={icon === `/assets/images/avatars/${f}` ? styles.active : ''} alt='Avatar'/>
                            ))}
                        </div>
                    </label>
                    <label>Bill Title
                        <input className={styles.inputName} type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sandra Catlyn"/>
                    </label>
                    <label>
                        Category
                        <input type='number' className={styles.inputName} value={day} minLength={1} maxLength={31} min={1} max={31} onChange={(e) => setDay(e.target.value)}/>
                    </label>
                    <label>
                        Amount
                        <div className={styles.value}>
                            <p>$</p>
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

                    <button type='submit' className={styles.submit} disabled={loading}>{loading ? 'Adding Bill...': 'Add Bill'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
    )
}