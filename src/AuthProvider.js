import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [EmployeeRegId, setEmployeeRegId] = useState(null); // Change to an empty string if it stores a single email

  return (
    <AuthContext.Provider value={{ EmployeeRegId, setEmployeeRegId }}>
      {children}
    </AuthContext.Provider>
  );
};