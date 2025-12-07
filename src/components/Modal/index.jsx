/* eslint-disable react/prop-types */
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import styles from "./Modal.module.scss";
import { clsx } from "clsx";
import { createPortal } from "react-dom";

function ModalContent({
    isClosing,
    children,
    shouldCloseOnEsc = true,
    shouldCloseOnOverlayClick = true,
    onRequestClose,
}) {
    useEffect(() => {
        const handle = (e) => {
            console.log("Listen...");

            if (shouldCloseOnEsc && e.code === "Escape") {
                onRequestClose();
            }
        };

        document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, [shouldCloseOnEsc, onRequestClose]);

    return (
        <div
            className={clsx(styles.wrapper, {
                [styles.closing]: isClosing,
            })}
        >
            <div
                className={styles.overlay}
                onClick={() => {
                    shouldCloseOnOverlayClick && onRequestClose();
                }}
            />
            <div className={styles.content}>{children}</div>
        </div>
    );
}

const Modal = forwardRef(
    ({ closeTimeoutMS = 0, onAfterOpen, onAfterClose, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(props.isOpen ?? false);
        const [isClosing, setIsClosing] = useState(false);
        const isMounted = useRef(false);

        const handleClose = useCallback(() => {
            setIsClosing(true);

            return setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
                setTimeout(onAfterClose, 0);
            }, closeTimeoutMS);
        }, [closeTimeoutMS, onAfterClose]);

        useImperativeHandle(
            ref,
            () => ({
                open() {
                    setIsOpen(true);
                },
                close() {
                    handleClose();
                },
            }),
            [handleClose]
        );

        useEffect(() => {
            if (!isMounted.current) return;

            let timer;

            if (props.isOpen) {
                setIsOpen(true);
                setTimeout(onAfterOpen, 0);
            } else {
                timer = handleClose();
            }
            return () => clearTimeout(timer);
        }, [props.isOpen, handleClose, onAfterOpen]);

        useEffect(() => {
            isMounted.current = true;
        }, []);

        if (!isOpen) return null;

        return createPortal(
            <ModalContent {...props} isOpen={isOpen} isClosing={isClosing} />,
            document.body
        );
    }
);

Modal.displayName = "Modal";

export default Modal;
