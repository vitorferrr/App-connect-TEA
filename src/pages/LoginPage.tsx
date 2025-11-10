"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Eye, EyeOff } from "lucide-react"; // Importar ícones de olho

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Novo estado para visibilidade da senha
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/home`,
      },
    });

    if (error) {
      toast.error("Erro ao fazer login com o Google: " + error.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Entre na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
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
            <div className="grid gap-2 relative"> {/* Adicionado relative para posicionar o ícone */}
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"} // Alterna o tipo do input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10" // Adiciona padding à direita para o ícone
              />
              <Button
                type="button" // Importante para não submeter o formulário
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)} // Alterna a visibilidade
                className="absolute right-2 top-1/2 -translate-y-1/2 mt-3 h-8 w-8 text-gray-500 hover:bg-transparent"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline text-right -mt-2">
              Esqueceu a senha?
            </Link>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <GoogleSignInButton onClick={handleGoogleSignIn} disabled={loading}>
            Conectar com o Google
          </GoogleSignInButton>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/register" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;