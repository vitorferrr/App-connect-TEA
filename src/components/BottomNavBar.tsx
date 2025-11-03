"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/home", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-appBlueDark p-2 flex justify-around items-center z-50 md:hidden h-16">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const IconComponent = item.icon;
        return (
          <Link to={item.path} key={item.path} className="flex flex-col items-center justify-center h-full w-full">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col h-12 w-12 rounded-full",
                isActive ? "bg-appYellowActive text-appBlueDark" : "text-white hover:bg-appBlueMedium",
              )}
            >
              <IconComponent className="h-6 w-6" />
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;