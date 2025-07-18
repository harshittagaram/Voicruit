// ./components/AlertConfirmation.js

import React, { useState } from "react";

const AlertConfirmation = ({ children, stopInterview }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    if (stopInterview) {
      stopInterview();
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end the interview? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertConfirmation;
