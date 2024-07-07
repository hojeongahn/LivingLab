import React from "react";

const SimpleAlert = ({ message, isVisible, isFadingOut }) => {
  return (
    isVisible && (
      <div className="fixed inset-0 flex items-start justify-center z-50 mt-3">
        <div
          className={`bg-white py-6 px-14 rounded shadow-lg transition-opacity duration-500 ease-in-out ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-gray-800 text-xl">{message}</p>
        </div>
      </div>
    )
  );
};

export default SimpleAlert;
