import { useState } from "react";
import Modal from "@/components/Modal";

function DemoModal() {
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                closeTimeoutMS={1500}
                onAfterOpen={() => {
                    console.log("onAfterOpen");
                }}
                onAfterClose={() => {
                    console.log("onAfterClose");
                }}
            >
                <h2>Hello</h2>
                <button onClick={closeModal}>close</button>
                <div>I am a modal</div>
            </Modal>
        </div>
    );
}

export default DemoModal;
