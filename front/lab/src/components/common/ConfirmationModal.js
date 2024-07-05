import React from 'react';

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={`fixed top-0 left-0 z-[1055] flex h-full w-full items-center justify-center bg-black bg-opacity-20`}>
            <div className="relative bg-white shadow dark:bg-gray-700 opacity-100 w-1/4 rounded-md px-6 min-w-[300px] flex flex-col items-center">
                <div className="w-full text-center bg-warming-400 mt-6 mb-6 pb-2 text-xl border-b-2 border-gray-500">
                    알림
                </div>
                <div className="w-full text-center text-xl pt-4 pb-4">
                    {message}
                </div>
                <div className="w-full flex justify-center">
                    <button className="rounded bg-mainColor my-4 mr-2 px-6 py-2 text-lg text-white hover:bg-teal-600"
                    onClick={onConfirm}>예</button>
                    <button className="rounded bg-slate-400 my-4 px-6 py-2 text-lg text-white hover:bg-slate-500"
                    onClick={onCancel}>아니오</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;