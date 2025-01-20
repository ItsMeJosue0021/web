import React from "react";
import Logout from "../components/Logout";

const Admin = ({ children }) => {
  return (
    <div className="w-screen h-auto min-h-screen">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-3xl font-bold text-center">Admin Layout</h1>
        <Logout />
      </div>
      {children}
    </div>
  );
}

export default Admin;