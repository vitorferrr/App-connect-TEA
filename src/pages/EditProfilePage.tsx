"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import BottomNavBar from "@/components/BottomNavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import Cropper, { Area } from "react-easy-crop";

/* Helpers para recortar a imagem em canvas */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, crop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível obter o contexto do canvas.");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas vazio ao recortar imagem."));
    }, "image/jpeg");
  });
};

const EditProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState<Date | undefined>(undefined);
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // estados do editor de recorte
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [rawAvatarSrc, setRawAvatarSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error(
          "Erro ao carregar informações do usuário. Por favor, faça login novamente."
        );
        navigate("/login");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, phone_number, child_name, child_dob, school_name, class_name, avatar_url"
        )
        .eq("id", user.id)
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
        setChildDob(
          data.child_dob
            ? isValid(parseISO(data.child_dob))
              ? parseISO(data.child_dob)
              : undefined
            : undefined
        );
        setSchoolName(data.school_name || "");
        setClassName(data.class_name || "");
        setCurrentAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setRawAvatarSrc(result);
        setAvatarPreviewUrl(result); // pré-visualização inicial
        setIsCropDialogOpen(true); // abre o editor de recorte
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setAvatarPreviewUrl(null);
      setRawAvatarSrc(null);
    }
  };

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleConfirmCrop = async () => {
    try {
      if (!rawAvatarSrc || !croppedAreaPixels || !avatarFile) return;

      const croppedBlob = await getCroppedImg(rawAvatarSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], avatarFile.name, {
        type: "image/jpeg",
      });

      setAvatarFile(croppedFile);
      const previewUrl = URL.createObjectURL(croppedBlob);
      setAvatarPreviewUrl(previewUrl);
      setIsCropDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao recortar imagem: " + (error?.message || ""));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Usuário não autenticado. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }

    let newAvatarUrl = currentAvatarUrl;

    // Upload de novo avatar, se selecionado
    if (avatarFile) {
      const fileExtension = avatarFile.name.split(".").pop() || "jpg";
      const fileName = `avatar-${Date.now()}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars") // certifique-se que o bucket 'avatars' existe
        .upload(filePath, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        toast.error(
          "Erro ao fazer upload da foto de perfil: " + uploadError.message
        );
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        newAvatarUrl = publicUrlData.publicUrl;
        setCurrentAvatarUrl(publicUrlData.publicUrl);
      }
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          child_name: childName,
          child_dob: childDob ? format(childDob, "yyyy-MM-dd") : null,
          school_name: schoolName,
          class_name: className,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

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

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return "?";
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return `${f}${l}`.toUpperCase();
  };

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
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
            Foto de Perfil
          </CardTitle>
          <CardContent className="p-0 flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 bg-blue-600 text-white text-3xl font-bold flex items-center justify-center">
              {avatarPreviewUrl ? (
                <AvatarImage
                  src={avatarPreviewUrl}
                  alt="Pré-visualização do Avatar"
                />
              ) : currentAvatarUrl ? (
                <AvatarImage src={currentAvatarUrl} alt="Avatar Atual" />
              ) : (
                <AvatarFallback>
                  {getInitials(firstName, lastName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="avatar">Escolher nova foto</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
            Informações Pessoais
          </CardTitle>
          <CardContent className="p-0 space-y-4">
            <form onSubmit={handleSaveProfile} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <CardTitle className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Informações da Criança
              </CardTitle>
              <div className="grid gap-2">
                <Label htmlFor="childName">Nome do Filho</Label>
                <Input
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                />
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
                        format(childDob, "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    side="top"
                    align="start"
                    sideOffset={4}
                    avoidCollisions={false}
                  >
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
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="className">Turma</Label>
                <Input
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-appBluePrimary hover:bg-appAccent text-white"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Dialog de recorte de imagem */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Recortar foto de perfil</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 bg-black/80 rounded-md overflow-hidden">
            {rawAvatarSrc && (
              <Cropper
                image={rawAvatarSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Label className="text-sm">Zoom</Label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsCropDialogOpen(false);
                setRawAvatarSrc(null);
                setAvatarFile(null);
                setAvatarPreviewUrl(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmCrop}>Concluir recorte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNavBar />
    </div>
  );
};

export default EditProfilePage;
