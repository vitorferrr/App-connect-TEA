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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center border-b border-gray-200">
        <Link to="/home">
          <Button variant="ghost" size="icon" className="text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10 ml-4 bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-800">Profissional Ana</h1>
          <p className="text-sm text-green-500">Online</p>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
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
                "max-w-[70%] p-3 rounded-lg shadow-sm",
                msg.sender === "me"
                  ? "bg-appBlueMedium text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              <span
                className={cn(
                  "block text-xs mt-1",
                  msg.sender === "me" ? "text-blue-100 text-right" : "text-gray-500 text-left"
                )}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Message Input Area */}
      <div className="sticky bottom-16 left-0 right-0 bg-white p-4 border-t border-gray-200 flex items-center">
        <Input
          placeholder="Digite sua mensagem..."
          className="flex-grow rounded-full px-4 py-2 border-gray-300 focus:ring-appBlueMedium focus:border-appBlueMedium"
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
          className="ml-3 rounded-full bg-appBlueMedium hover:bg-appBlueDark text-white"
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