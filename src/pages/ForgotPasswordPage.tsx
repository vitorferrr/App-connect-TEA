"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/AuthLayout";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setMessage("Verifique seu e-mail para o link de redefinição de senha.");
      toast.success("Link de redefinição enviado! Verifique seu e-mail.");
    }
    setLoading(false);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Esqueceu a Senha?</CardTitle>
          <CardDescription>
            Insira seu e-mail para receber um link de redefinição de senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="grid gap-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Redefinir Senha"}
            </Button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
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

export default ForgotPasswordPage;