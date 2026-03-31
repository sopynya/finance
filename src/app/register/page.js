"use client";
import Link from "next/link";
import { useState } from "react";
import styles from './auth.module.css'
export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            if (res.ok) {
                setLoading(false);
                window.location.href = "/"
            } else {
                const data = await res.json();
                setError(data.error);
                setLoading(false);
            }

        } catch {
            setLoading(false);
            setError('Something went wrong');
        }
    }
    return(
        <div className={styles.page}>
            <div className={styles.hero}>
                <img src='/assets/images/logo-large.svg' className={styles.logo}  alt='Logo'/>

                <h2>Keep track of your money and save for your future</h2>
                <p>Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.</p>
            </div>

            <div className={styles.auth}>
                <h1>Sign Up</h1>
                <form onSubmit={handleRegister}>
                    <label>
                        Name
                        <input type='text' value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required/>
                    </label>
                    <label>Email
                    <input className={styles.input} type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </label>
                    <label>Password
                    <div className={styles.password}>
                        <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <img onClick={() => setShow(!show)} src={show? '/assets/images/icon-show-password.svg' : '/assets/images/icon-hide-password.svg'} alt='Show/Hide password'/>
                    </div>
                    <p className={styles.signal}>Password must be at least 8 characters</p>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Creating Account..' : 'Create Account'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
                                <p className={styles.link}>Already have an account? <Link href='/login'>Login</Link></p>
            </div>
        </div>
    )
}