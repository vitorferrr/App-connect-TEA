"use client";

import React from "react";
import { Puzzle } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="w-full bg-appBlueDark text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Puzzle className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">Connect TEA</h1>
      </div>
      <p className="text-lg">👋 Olá, Maria! Como vai hoje?</p>
    </header>
  );
};

export default AppHeader;