import React from "react";

interface ButtonPropsType {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({ children, isLoading }: ButtonPropsType) {
  return (
    <button disabled={isLoading} className={`btn btn-primary w-full`}>
      {isLoading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        children
      )}
    </button>
  );
}
