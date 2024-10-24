// components/Modal.jsx
import React from "react";

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-auto max-h-[80vh] w-full max-w-lg overflow-hidden rounded bg-white shadow-lg">
        <div className="h-full overflow-y-auto p-5 dark:bg-dark-2">
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
    </div>
  );
};

export default Modal;
