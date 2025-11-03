"use client";

import React from "react";
import { Puzzle } from "lucide-react"; // Importando o ícone Puzzle

const AppHeader = () => {
  return (
    <header className="w-full bg-appBlueDark text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center z-10">
        <Puzzle className="h-10 w-10 mr-2 text-appYellowActive" /> {/* Usando o ícone Puzzle */}
        <h1 className="text-2xl font-bold">Connect TEA</h1>
      </div>
    </header>
  );
};

export default AppHeader;