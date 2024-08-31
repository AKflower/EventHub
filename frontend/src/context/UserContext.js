import React, { createContext, useState, useContext } from "react";

// Tạo Context
export const UserContext = createContext();

// Tạo Provider để cung cấp dữ liệu cho các component con
export const UserProvider = ({ children }) => {
  const [sessionInfo, setSessionInfo] = useState();

  return (
    <UserContext.Provider value={{ sessionInfo, setSessionInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để dễ dàng sử dụng Context
export const useUserContext = () => {
  return useContext(UserContext);
};
