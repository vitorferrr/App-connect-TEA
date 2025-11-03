"use client";

import React from "react";
import { Puzzle } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="w-full bg-appBlueDark text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center z-10">
        <Puzzle className="h-8 w-8 mr-2" />
        <h1 className="text-2xl font-bold">Connect TEA</h1>
      </div>
      <p className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">👋 Olá, Maria! Como vai hoje?</p>
    </header>
  );
};

export default AppHeader;