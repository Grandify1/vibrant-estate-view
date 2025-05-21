
import React from "react";

interface AdminContentProps {
  children: React.ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-8 px-4">
      {children}
    </div>
  );
};

export default AdminContent;
