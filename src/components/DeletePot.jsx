import styles from './editpot.module.css'
export default function DeletePot({pot, onClose}) {
    async function handleDelete(e) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/pots/${pot.id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete");
            } else {
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
        
    }
    return(
        <div className={styles.bg}>
            <div className={styles.modal}>
                <h1>Delete '{pot.name}'?</h1>
                <img src='/assets/images/icon-close-modal.svg' onClick={onClose} className={styles.close}/>
                <p>Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.</p>
                <button onClick={handleDelete} className={styles.confirm}>Yes, Confirm Deletion</button>
                <button onClick={onClose} className={styles.goback}>No, Go Back</button>
            </div>
        </div>
    )
}