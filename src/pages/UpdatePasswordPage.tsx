"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);

  useEffect(() => {
    // Lê os parâmetros da hash da URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type !== 'recovery' || !accessToken) {
      toast.error("Link de redefinição de senha inválido ou expirado.");
      navigate("/login");
    }
    // O cliente Supabase deve pegar a sessão automaticamente da hash
    // Não é necessário definir a sessão manualmente aqui, apenas validar a presença dos tokens
  }, [navigate]);

  const validatePassword = (pwd: string) => {
    setHasMinLength(pwd.length >= 8);
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(pwd));
    setHasUpperCase(/[A-Z]/.test(pwd));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (!hasMinLength || !hasSpecialChar || !hasUpperCase) {
      toast.error("A senha não atende a todos os requisitos.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Sua senha foi atualizada com sucesso! Faça login com a nova senha.");
      navigate("/login");
    }
    setLoading(false);
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <p className={cn("text-xs flex items-center gap-1", met ? "text-green-600" : "text-red-500")}>
      {met ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 inline-block text-center">-</span>}
      {text}
    </p>
  );

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Definir Nova Senha</CardTitle>
          <CardDescription>
            Crie uma nova senha para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="grid gap-4">
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Nova Senha</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 mt-3 h-8 w-8 text-gray-500 hover:bg-transparent"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <div className="mt-1 space-y-1">
                <PasswordRequirement met={hasMinLength} text="Mínimo de 8 caracteres" />
                <PasswordRequirement met={hasSpecialChar} text="Pelo menos 1 Caractere especial (!@#$)" />
                <PasswordRequirement met={hasUpperCase} text="Pelo menos 1 letra maiúscula" />
              </div>
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 mt-3 h-8 w-8 text-gray-500 hover:bg-transparent"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="underline">
              Voltar para o Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default UpdatePasswordPage;