import React from 'react';
import '../css/loading.css'; 

const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center w-screen min-h-screen bg-gray-100">
      <div className="flex space-x-1">
        <div className="dot dot-1 w-2 h-2 bg-orange-500 rounded-full"></div>
        <div className="dot dot-2 w-2 h-2 bg-orange-500 rounded-full"></div>
        <div className="dot dot-3 w-2 h-2 bg-orange-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingDots;
