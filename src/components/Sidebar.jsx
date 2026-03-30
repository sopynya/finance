"use client";
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';
import Link from 'next/link';
import { useState } from 'react';
export default function Sidebar() {
    const [show, setShow] = useState(true);
    const path = usePathname();
    return(
        <div>
            {!show && (
                <div className={styles.sb}>
                    <img src='/assets/images/icon-minimize-menu.svg' onClick={() => setShow(true)}/>
                </div>
            )}
        
        {show && (
            <div className={styles.sidebar}>
            <div className={styles.view}>
                <img className={styles.logo} src='/assets/images/logo-large.svg'/>
                <nav className={styles.nav}>
                    <Link href='/' className={path === '/'? styles.active : ''}>
                    <img src={path === '/' ? '/house-fill.svg': '/assets/images/icon-nav-overview.svg'} />
                    <span>Overview</span>
                    </Link>
                    <Link href='/transactions' className={path === '/transactions' ? styles.active : ''}>
                    <img src={path === '/transactions' ? '/transaction.svg' : '/assets/images/icon-nav-transactions.svg'} />
                    <span>Transactions</span>
                    </Link>
                    <Link href='/budgets' className={path === '/budgets' ? styles.active : ''}>
                    <img src={path === '/budgets' ? '/chart-donut-fill.svg' : '/assets/images/icon-nav-budgets.svg'} />
                    <span>Budgets</span>
                    </Link>
                    <Link href='/pots' className={path === '/pots' ? styles.active : ''}>
                    <img src={path === '/pots' ? '/tip-jar-fill.svg' : '/assets/images/icon-nav-pots.svg'} />
                    <span>Pots</span>
                    </Link>
                    <Link href='/bills' className={path === '/bills' ? styles.active : ''}>
                    <img src={path === '/bills' ? '/receipt-fill.svg' : '/assets/images/icon-nav-recurring-bills.svg'} />
                    <span>Recurring Bills</span>
                    </Link>
                </nav>
            </div>
            <p className={styles.minimize} onClick={() => setShow(false)}><img src='/assets/images/icon-minimize-menu.svg'/>Minimize Menu</p>
        </div>
        )}
        </div>
    )
}