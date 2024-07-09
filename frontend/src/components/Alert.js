import React from 'react';

const Alert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-2/3 h-1/3 flex flex-col items-center justify-center">
                <p className="text-2xl mb-4">{message}</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default Alert;
