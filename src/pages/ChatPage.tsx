"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  time: string;
  sender: "me" | "other";
}

const initialMessages: Message[] = [
  {
    id: "1",
    text: "Olá! Como posso ajudar hoje?",
    time: "14:30",
    sender: "other",
  },
  {
    id: "2",
    text: "Gostaria de saber como foi a atividade de hoje.",
    time: "14:32",
    sender: "me",
  },
  {
    id: "3",
    text: "A Maria participou muito bem das atividades em grupo! Ela demonstrou mais interesse em interagir com os colegas.",
    time: "14:33",
    sender: "other",
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        time: timeString,
        sender: "me", // Assuming the user is sending the message
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      // In a real app, you would send this message to a backend/websocket
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight">
      <header className="bg-appBluePrimary shadow-md p-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon" className="text-white hover:bg-appBlueSecondary">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10 ml-4 bg-appPuzzleYellow text-appAccent flex items-center justify-center text-lg font-semibold">
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-white">Profissional Ana</h1>
          <p className="text-sm text-appPuzzleGreen">Online</p>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {/* BETA Feature Notice */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded-md shadow-sm">
          <p className="font-bold">Função em BETA</p>
          <p className="text-sm">Esta função de chat está em fase de testes e pode conter instabilidades.</p>
        </div>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-lg shadow-md",
                msg.sender === "me"
                  ? "bg-appBluePrimary text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border-2 border-appBlueSecondary/20"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <span
                className={cn(
                  "block text-xs mt-1",
                  msg.sender === "me" ? "text-blue-100 text-right" : "text-appAccent/60 text-left"
                )}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </main>

      <div className="sticky bottom-16 left-0 right-0 bg-white p-4 border-t-2 border-appBlueSecondary/20 flex items-center shadow-lg">
        <Input
          placeholder="Digite sua mensagem..."
          className="flex-grow rounded-full px-4 py-2 border-2 border-appBlueSecondary/30 focus:ring-appBluePrimary focus:border-appBluePrimary"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button
          size="icon"
          className="ml-3 rounded-full bg-appBluePrimary hover:bg-appAccent text-white shadow-md transition-all hover:scale-110"
          onClick={handleSendMessage}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default ChatPage;