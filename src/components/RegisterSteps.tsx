"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";

const RegisterSteps = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    firstName: "", // Agora será usado para o nome completo
    age: "", // This field is used for phone_number in profiles table
    address: "",
    complement: "",
    childName: "",
    childDob: undefined as Date | undefined,
    schoolName: "",
    className: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation states
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    setHasMinLength(password.length >= 8);
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setHasUpperCase(/[A-Z]/.test(password));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, childDob: date }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        if (formData.email !== formData.confirmEmail) {
          toast.error("Os e-mails não coincidem.");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("As senhas não coincidem.");
          setLoading(false);
          return;
        }
        if (!hasMinLength || !hasSpecialChar || !hasUpperCase) {
          toast.error("A senha não atende a todos os requisitos.");
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName, // Usando firstName para o nome completo
              user_type: 'responsavel', 
            },
          },
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        if (data.user && !data.session) {
          toast.success("Verifique seu e-mail para confirmar o cadastro. Um código foi enviado.");
          setStep(step + 1); 
        } else if (data.session) {
          toast.success("Cadastro e login realizados com sucesso!");
          navigate("/home");
        }
      } else if (step === 2) {
        if (!formData.firstName || !formData.age || !formData.address) { // Removido lastName da validação
          toast.error("Por favor, preencha todos os campos obrigatórios.");
          setLoading(false);
          return;
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.error("Erro ao obter usuário. Por favor, faça login novamente.");
          navigate("/login");
          setLoading(false);
          return;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName, // Usando firstName para o nome completo
            phone_number: formData.age, 
          })
          .eq('id', user.id);

        if (updateError) {
          toast.error(updateError.message);
          setLoading(false);
          return;
        }
        setStep(step + 1);
      } else if (step === 3) {
        if (!formData.childName || !formData.childDob || !formData.schoolName || !formData.className) {
          toast.error("Por favor, preencha todos os campos obrigatórios.");
          setLoading(false);
          return;
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.error("Erro ao obter usuário. Por favor, faça login novamente.");
          navigate("/login");
          setLoading(false);
          return;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            child_name: formData.childName,
            child_dob: formData.childDob.toISOString().split('T')[0], 
            school_name: formData.schoolName,
            class_name: formData.className,
          })
          .eq('id', user.id);

        if (updateError) {
          toast.error(updateError.message);
          setLoading(false);
          return;
        }
        setStep(step + 1);
      } else if (step === 4) {
        toast.success("Código verificado (simulado).");
        setStep(step + 1);
      }
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinalizeRegistration = async () => {
    setLoading(true);
    try {
      toast.success("Cadastro finalizado com sucesso!");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message || "Ocorreu um erro ao finalizar o cadastro.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <p className={cn("text-xs flex items-center gap-1", met ? "text-green-600" : "text-red-500")}>
      {met ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 inline-block text-center">-</span>}
      {text}
    </p>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input id="email" type="email" placeholder="Ex: mariajose1995@gmail.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmEmail">Confirmar E-mail *</Label>
              <Input id="confirmEmail" type="email" placeholder="Ex: mariajose1995@gmail.com" required value={formData.confirmEmail} onChange={handleChange} />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Ex: Porta12@" required value={formData.password} onChange={handleChange} className="pr-10" />
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
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Ex: Porta12@" required value={formData.confirmPassword} onChange={handleChange} className="pr-10" />
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
          </>
        );
      case 2:
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nome Completo do Responsável *</Label>
              <Input id="firstName" type="text" placeholder="Ex: Maria José dos Santos Silva" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Telefone *</Label>
              <Input id="age" type="text" placeholder="Ex: (XX) XXXXX-XXXX" required value={formData.age} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input id="address" type="text" placeholder="Ex: Rua da Príncipe 24" required value={formData.address} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" type="text" placeholder="Ex: Próximo a Praça" value={formData.complement} onChange={handleChange} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="childName">Nome Completo do Filho *</Label>
              <Input id="childName" type="text" placeholder="Ex: Maria José dos Santos Silva" required value={formData.childName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="childDob">Data de Nascimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.childDob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.childDob ? (
                      format(formData.childDob, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.childDob}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schoolName">Nome da Escola *</Label>
              <Input id="schoolName" type="text" placeholder="Ex: Escola Educandário" required value={formData.schoolName} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="className">Turma *</Label>
              <Input id="className" type="text" placeholder="Ex: 12B" required value={formData.className} onChange={handleChange} />
            </div>
          </>
        );
      case 4:
        return (
          <div className="text-center">
            <p className="mb-4 text-gray-700">
              Digite o código enviado para o email <span className="font-semibold">{formData.email}</span>
            </p>
            <InputOTP maxLength={6} value={formData.otp} onChange={(value) => setFormData((prev) => ({ ...prev, otp: value }))}>
              <InputOTPGroup className="justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 text-gray-700">
            <h3 className="text-lg font-semibold text-blue-800">Confirmação de Dados</h3>
            <p><strong>E-mail:</strong> {formData.email}</p>
            <p><strong>Senha:</strong> ********</p>
            <p><strong>Nome Completo do Responsável:</strong> {formData.firstName}</p> {/* Atualizado */}
            <p><strong>Telefone:</strong> {formData.age}</p>
            <p><strong>Endereço:</strong> {formData.address}</p>
            {formData.complement && <p><strong>Complemento:</strong> {formData.complement}</p>}
            <p><strong>Nome Completo do Filho:</strong> {formData.childName}</p>
            <p><strong>Data de Nascimento:</strong> {formData.childDob ? format(formData.childDob, "dd/MM/yyyy") : "N/A"}</p>
            <p><strong>Nome da Escola:</strong> {formData.schoolName}</p>
            <p><strong>Turma:</strong> {formData.className}</p>

            <div className="flex justify-between gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200">
                Revisar Informações
              </Button>
              <Button onClick={handleFinalizeRegistration} className="flex-1 bg-green-500 hover:bg-green-600 text-white" disabled={loading}>
                {loading ? "Finalizando..." : "Finalizar"}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="bg-appBlueDark text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
          {step > 1 && step < 5 && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-appBlueMedium">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          <CardTitle className="text-xl flex-grow text-center">
            {step === 5 ? "Confirmação de Dados" : "Cadastro do Responsável"}
          </CardTitle>
          {step > 1 && step < 5 && <div className="w-6"></div>} {/* Spacer */}
        </CardHeader>
        <CardContent className="p-6">
          {step < 5 && (
            <div className="flex justify-center items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      s <= step ? "bg-appBluePrimary border-appBluePrimary text-black" : "border-gray-300 text-black"
                    )}
                  >
                    {s < step ? <CheckCircle2 className="h-4 w-4" /> : <span className="font-bold">{s}</span>}
                  </div>
                  {s < 4 && <div className={cn("h-0.5 w-8", s < step ? "bg-appBluePrimary" : "bg-gray-300")} />}
                </React.Fragment>
              ))}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4">
            {renderStepContent()}
            {step < 5 && (
              <Button type="button" onClick={handleNext} className="w-full bg-green-500 hover:bg-green-600 text-white mt-4" disabled={loading}>
                {loading ? "Carregando..." : "Próxima Página"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterSteps;