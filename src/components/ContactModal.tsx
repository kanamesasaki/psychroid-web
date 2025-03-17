import { useEffect } from 'react';
import { SquareX } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    // Close the modal with the escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            console.log('Key pressed:', e.key);
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            // Disable body's scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            // Enable body's scroll when modal is closed
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
            <div className="w-full flex justify-end p-2 bg-white shadow-sm">
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
                    aria-label="Close modal"
                >
                    <SquareX />
                </button>
            </div>

            <div className="flex-1 w-full bg-white">
                <iframe
                    src="https://docs.google.com/forms/d/e/1FAIpQLSe-f7Yj9cVXuMIUa6qq3-KYdksDXI97Z16K7Rg2lQw4f76FbQ/viewform?embedded=true"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="Contact Form"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                >
                    Loading...
                </iframe>
            </div>
        </div>
    );
};

export default ContactModal;