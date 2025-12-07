class ToastManager {
    constructor() {
        this.listeners = [];
        this.defaultOptions = { type: "info", duration: 3000 };
    }

    subscribe(listener) {
        this.listeners.push(listener);

        return () => {
            this.listeners = this.listeners.filter(
                (_listener) => _listener !== listener
            );
        };
    }

    emit(content, options) {
        options = { ...this.defaultOptions, ...options };
        const toast = {
            id: Math.random(),
            content,
            options,
        };
        this.listeners.forEach((listener) => listener(toast));
    }
}

const toastManager = new ToastManager();

export default toastManager;
