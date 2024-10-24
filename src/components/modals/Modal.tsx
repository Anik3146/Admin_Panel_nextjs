import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-auto w-full max-w-2xl overflow-hidden rounded bg-white shadow-lg">
        {" "}
        {/* Increased width here */}
        <div
          className="max-h-[80vh] overflow-y-auto p-5 dark:bg-dark-2"
          style={{
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#888 transparent", // For Firefox
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              aria-label="Close"
            >
              &times; {/* Cross icon */}
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Custom scrollbar styles for WebKit browsers */}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent; /* Background of the scrollbar track */
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888; /* Color of the scrollbar thumb */
          border-radius: 4px; /* Rounded corners for the thumb */
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #555; /* Darker color on hover */
        }
      `}</style>
    </div>
  );
};

export default Modal;
