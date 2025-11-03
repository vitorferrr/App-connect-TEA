"use client";

import React from "react";
import { Puzzle } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="w-full bg-appBlueDark text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center z-10">
        <img src="/app-logo-new.png" alt="Connect TEA Logo" className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold">Connect TEA</h1>
      </div>
      {/* O texto de saudação foi movido para HomePage.tsx */}
    </header>
  );
};

export default AppHeader;