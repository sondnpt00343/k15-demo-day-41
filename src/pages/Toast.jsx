import { toast } from "@/components/Toast";

function DemoToast() {
    return (
        <div>
            <h1>Demo Toast</h1>
            <button onClick={() => toast("[info] Wow so easy!")}>
                Toast info
            </button>
            <button onClick={() => toast.warning("[warning] Wow so easy!")}>
                Toast warning
            </button>
            <button onClick={() => toast.error("[error] Wow so easy!")}>
                Toast error
            </button>
        </div>
    );
}

export default DemoToast;
