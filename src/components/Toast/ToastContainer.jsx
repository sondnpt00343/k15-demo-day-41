/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toastManager from "./toastManager";
import styles from "./Toast.module.scss";
import clsx from "clsx";

function Toast({ content, options, onRequestClear }) {
    useEffect(() => {
        setTimeout(onRequestClear, options.duration);
    }, [onRequestClear, options.duration]);

    return (
        <div className={clsx(styles.toastItem, styles[options.type])}>
            {content}
        </div>
    );
}

function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsubscribe = toastManager.subscribe((toast) => {
            setToasts((prev) => [...prev, toast]);
        });

        return unsubscribe;
    }, []);

    return (
        <div>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    content={toast.content}
                    options={toast.options}
                    onRequestClear={() => {
                        setToasts((prev) =>
                            prev.filter((_toast) => _toast.id !== toast.id)
                        );
                    }}
                />
            ))}
        </div>
    );
}

export default ToastContainer;
