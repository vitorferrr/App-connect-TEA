"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Puzzle } from "lucide-react"; // Importando o ícone Puzzle
import GoogleSignInButton from "@/components/GoogleSignInButton";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-appBgLight via-blue-50 to-white p-4">
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 bg-appPuzzleYellow/20 blur-3xl rounded-full"></div>
        <Puzzle className="h-28 w-28 mx-auto mb-4 text-appBluePrimary drop-shadow-2xl relative z-10 animate-pulse" />
        <h1 className="text-5xl font-bold text-appBluePrimary mb-2 relative z-10">Connect TEA</h1>
        <p className="text-sm text-appAccent/70 relative z-10">Apoio e desenvolvimento para crianças com TEA</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/login">
          <Button className="w-full h-14 bg-appBluePrimary hover:bg-appAccent text-white text-lg flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-105">
            <User className="h-6 w-6 mr-2" /> Login
          </Button>
        </Link>
        <GoogleSignInButton>
          Conectar com o Google
        </GoogleSignInButton>
        <p className="mt-4 text-center text-sm text-appAccent">
          Não tem uma conta?{" "}
          <Link to="/register" className="underline text-appBluePrimary hover:text-appBlueSecondary font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;