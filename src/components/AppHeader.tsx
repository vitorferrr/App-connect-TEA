"use client";

import React from "react";
import { Puzzle, Bell } from "lucide-react"; // Importando Bell
import { Link } from "react-router-dom"; // Importando Link para navegação
import { Button } from "@/components/ui/button"; // Importando Button

const AppHeader = () => {
  return (
    <header className="w-full bg-appBlueDark text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Puzzle className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">Connect TEA</h1>
      </div>
      <div className="flex items-center">
        <p className="text-lg mr-4 hidden sm:block">👋 Olá, Maria! Como vai hoje?</p> {/* Oculta em telas pequenas */}
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="text-white hover:bg-appBlueMedium">
            <Bell className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;