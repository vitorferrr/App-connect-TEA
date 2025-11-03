"use client";

import AuthForm from "@/components/AuthForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Bem-vindo ao TEA Connect</h1>
        <p className="text-lg text-gray-700">Conectando responsáveis e profissionais para o cuidado TEA.</p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Index;