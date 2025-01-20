import React from 'react';
const Guest = ({children}) => {
  return (
    <div className="w-screen h-auto min-h-screen">
      <div className='flex items-center justify-start px-8 py-12'>
        <h1 className="text-3xl font-bold text-center">Guest Layout</h1>
      </div>
      {children}
    </div>
  );
}

export default Guest;