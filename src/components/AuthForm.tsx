"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica real de autenticação/cadastro.
    // Por enquanto, vamos simular um sucesso e redirecionar para a homepage.
    if (isLogin) {
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } else {
      toast.success("Cadastro realizado com sucesso!");
      navigate("/home");
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{isLogin ? "Login" : "Cadastre-se"}</CardTitle>
        <CardDescription>
          {isLogin ? "Entre na sua conta" : "Crie uma nova conta"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Cadastre-se"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <Link to="#" onClick={() => setIsLogin(!isLogin)} className="underline">
            {isLogin ? "Cadastre-se" : "Login"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;