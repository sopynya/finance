"use client";
import Link from "next/link";
import { useState } from "react";
import styles from './auth.module.css'
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    async function login(e) {
        e.preventDefault();
        setLoading(true)
        setError("");
        try {
            const res =  await fetch('/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if(res.ok) {
                setLoading(false);
                window.location.href = "/"
            } else {
                setError(data.error);
                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
            setError('Something went wrong')
        }
    }
    return(
        <div className={styles.page}>
            <div className={styles.hero}>
                <img src='/assets/images/logo-large.svg' className={styles.logo} />

                <h2>Keep track of your money and save for your future</h2>
                <p>Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.</p>
            </div>
            <div className={styles.auth}>
                <h1>Login</h1>
                <form onSubmit={login}>
                    <label>Email
                    <input className={styles.input} type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </label>
                    <label>Password
                    <div className={styles.password}>
                        <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        <img onClick={() => setShow(!show)} src={show? '/assets/images/icon-show-password.svg' : '/assets/images/icon-hide-password.svg'}/>
                    </div>
                    </label>
                    <button type='submit' disabled={loading}>{loading ? 'Logging in..' : 'Login'}</button>
                </form>
                {error && <p className={styles.error}>{error}</p>}
                <p className={styles.link}>Need to create an account? <Link href='/register'>Sign Up</Link></p>
            </div>
        </div>
    )
}