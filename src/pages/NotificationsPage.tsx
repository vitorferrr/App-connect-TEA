"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700 ml-4">Notificações</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-gray-600 text-center mb-4">
          Aqui você verá suas notificações importantes.
        </p>

        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Nenhuma Notificação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Você não tem novas notificações no momento.</p>
          </CardContent>
        </Card>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default NotificationsPage;