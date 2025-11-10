"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import BottomNavBar from "@/components/BottomNavBar";

const EditProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState<Date | undefined>(undefined);
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Erro ao carregar informações do usuário. Por favor, faça login novamente.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone_number, child_name, child_dob, school_name, class_name')
        .eq('id', user.id)
        .single();

      if (error) {
        toast.error("Erro ao carregar perfil: " + error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhoneNumber(data.phone_number || "");
        setChildName(data.child_name || "");
        setChildDob(data.child_dob ? (isValid(parseISO(data.child_dob)) ? parseISO(data.child_dob) : undefined) : undefined);
        setSchoolName(data.school_name || "");
        setClassName(data.class_name || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Usuário não autenticado. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          child_name: childName,
          child_dob: childDob ? format(childDob, "yyyy-MM-dd") : null,
          school_name: schoolName,
          class_name: className,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast.error("Erro ao atualizar perfil: " + error.message);
      } else {
        toast.success("Perfil atualizado com sucesso!");
        navigate("/profile");
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro inesperado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-appBgLight">
        <p className="text-gray-600">Carregando perfil para edição...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-blue-700">Editar Perfil</h1>
          <p className="text-sm text-gray-500">Atualize suas informações</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</CardTitle>
          <CardContent className="p-0 space-y-4">
            <form onSubmit={handleSaveProfile} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>

              <CardTitle className="text-lg font-semibold text-gray-800 mt-6 mb-4">Informações da Criança</CardTitle>
              <div className="grid gap-2">
                <Label htmlFor="childName">Nome do Filho</Label>
                <Input id="childName" value={childName} onChange={(e) => setChildName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="childDob">Data de Nascimento do Filho</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !childDob && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {childDob ? (
                        format(childDob, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={childDob}
                      onSelect={setChildDob}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schoolName">Nome da Escola</Label>
                <Input id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="className">Turma</Label>
                <Input id="className" value={className} onChange={(e) => setClassName(e.target.value)} />
              </div>

              <Button type="submit" className="w-full mt-6 bg-appBluePrimary hover:bg-appAccent text-white" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default EditProfilePage;