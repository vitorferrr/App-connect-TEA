"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, User } from "lucide-react";

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 flex justify-around items-center z-50 md:hidden">
      <Link to="/chat" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
        <Button variant="ghost" size="icon" className="flex flex-col h-auto p-1">
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Chat</span>
        </Button>
      </Link>
      <Link to="/home" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
        <Button variant="ghost" size="icon" className="flex flex-col h-auto p-1">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Button>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
        <Button variant="ghost" size="icon" className="flex flex-col h-auto p-1">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Perfil</span>
        </Button>
      </Link>
    </nav>
  );
};

export default BottomNavBar;