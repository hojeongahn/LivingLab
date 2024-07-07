import React, { useState } from 'react';

const ModalComponent = ({ isOpen, images, closeModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex" onClick={closeModal}>
      <div className="relative m-auto">
        <div className="flex justify-between items-center">
          {/* Left Arrow Button */}
          <button onClick={prevImage} className="w-16 h-16 p-0 border-0 rounded-sm bg-[rgba(34,34,34,0.7)] absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer left-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" viewBox="0 0 33 32" fill="none">
              <path fill="#FFF" d="M20.132 7.646c.195-.195.512-.195.707 0 .173.174.193.443.058.638l-.058.07-8.133 8.131 8.133 8.132c.173.174.193.443.058.638l-.058.07c-.174.173-.443.192-.638.057l-.07-.058-8.838-8.839 8.839-8.839z" />
            </svg>
          </button>
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex}`}
            className="block w-auto h-auto max-w-[1024px] min-w-[1024px] max-h-[768px] min-h-[768px] mx-auto"
          />
          {/* Right Arrow Button */}
          <button onClick={nextImage} className="w-16 h-16 p-0 border-0 rounded-sm bg-[rgba(34,34,34,0.7)] absolute top-1/2 -translate-y-1/2 z-10 cursor-pointer right-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" viewBox="0 0 33 33" fill="none">
              <path fill="#FFF" d="M11.646 7.646c.174-.173.443-.192.638-.057l.07.057 8.838 8.84-8.838 8.838c-.196.195-.512.195-.708 0-.173-.173-.192-.443-.057-.638l.057-.069 8.132-8.132-8.132-8.131c-.173-.174-.192-.443-.057-.638l.057-.07z" />
            </svg>
          </button>
        </div>
        {/* Close Button */}
        <div className="absolute top-[-20px] right-[-80px] p-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              closeModal();
            }}
            className="focus:outline-none focus:border-none p-2 rounded-md"
          >
            {/* Close icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" style={{ flex: '0 0 auto' }}>
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M35.137 12.863c.26.26.29.665.087.957l-.087.104L25.06 23.999l10.076 10.077c.293.293.293.768 0 1.06-.26.261-.665.29-.957.088l-.104-.087L24 25.06l-9.982 9.983c-.293.293-.768.293-1.06 0-.261-.26-.29-.665-.087-.957l.086-.104 9.982-9.983-9.982-9.981c-.293-.293-.293-.768 0-1.06.26-.261.665-.29.957-.087l.104.086L24 22.938l10.076-10.075c.293-.293.768-.293 1.06 0z" />
              </g>
            </svg>
          </button>
        </div>
        {/* Page Indicator */}
        <div className="text-center text-white pt-4 text-sm leading-6 font-semibold">
          {`${currentImageIndex + 1}/${images.length}`}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;