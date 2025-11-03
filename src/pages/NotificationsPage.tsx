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
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-blue-700">Notificações</h1>
          <p className="text-sm text-gray-500">Suas últimas atualizações</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Nenhuma notificação nova</CardTitle>
          <CardContent className="p-0">
            <p className="text-sm text-gray-600">
              Você está em dia com suas notificações.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default NotificationsPage;