"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const GoogleSignInButton = ({ children, className, ...props }: GoogleSignInButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full h-12 border-gray-300 text-gray-700 flex items-center justify-center rounded-full shadow-sm bg-white hover:bg-gray-50",
        className
      )}
      {...props}
    >
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.44 12.22C22.44 11.46 22.38 10.71 22.25 9.97H12V14.25H18.18C17.92 15.67 17.12 16.88 16.01 17.69V20.59H19.7C21.95 18.58 23.25 15.5 23.25 12.22C23.25 11.46 23.19 10.71 23.06 9.97H12V14.25H18.18C17.92 15.67 17.12 16.88 16.01 17.69V20.59H19.7C21.95 18.58 23.25 15.5 23.25 12.22Z" fill="#4285F4"/>
        <path d="M12 23.25C15.24 23.25 17.99 22.19 19.7 20.59L16.01 17.69C15.01 18.38 13.64 18.81 12 18.81C9.09 18.81 6.61 16.81 5.74 14.14H1.95V17.04C3.71 20.59 7.51 23.25 12 23.25Z" fill="#34A853"/>
        <path d="M5.74 14.14C5.52 13.45 5.4 12.73 5.4 12C5.4 11.27 5.52 10.55 5.74 9.86V6.96H1.95C1.21 8.41 0.75 10.14 0.75 12C0.75 13.86 1.21 15.59 1.95 17.04L5.74 14.14Z" fill="#FBBC05"/>
        <path d="M12 5.19C13.64 5.19 15.01 5.71 16.01 6.52L19.7 3.62C17.99 1.91 15.24 0.75 12 0.75C7.51 0.75 3.71 3.41 1.95 6.96L5.74 9.86C6.61 7.19 9.09 5.19 12 5.19Z" fill="#EA4335"/>
      </svg>
      {children}
    </Button>
  );
};

export default GoogleSignInButton;