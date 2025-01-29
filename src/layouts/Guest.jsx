import React from 'react';
import Header from '../components/headers/Header';
const Guest = ({children}) => {
  return (
    <div className="bg-gray-50 w-screen h-auto min-h-screen">
      <Header />
      {children}
    </div>
  );
}

export default Guest;