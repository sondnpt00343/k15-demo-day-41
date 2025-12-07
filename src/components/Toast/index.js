export { default as ToastContainer } from "./ToastContainer";
import toastManager from "./toastManager";

const toast = (content, options) => {
    toastManager.emit(content, options);
};

toast.warning = (content, options) => {
    toastManager.emit(content, { ...options, type: "warning" });
};

toast.error = (content, options) => {
    toastManager.emit(content, { ...options, type: "error" });
};

export { toast, toastManager };
