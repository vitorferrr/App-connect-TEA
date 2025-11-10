"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getRandomAppRandomBgColorClass, getRandomAppRandomBorderColorClass } from "@/lib/utils"; // Importar funções de cor aleatória

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  color: string; // Nova propriedade para a cor da atividade
}

const predefinedColors = [
  { name: "Azul Primário", value: "bg-appBluePrimary" },
  { name: "Verde Quebra-Cabeça", value: "bg-appPuzzleGreen" },
  { name: "Vermelho Médio", value: "bg-appMidRed" },
  { name: "Amarelo Quebra-Cabeça", value: "bg-appPuzzleYellow" },
  { name: "Azul Escuro", value: "bg-appAccent" },
];

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<{ [key: string]: Activity[] }>({});
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityLocation, setNewActivityLocation] = useState("");
  const [newActivityHour, setNewActivityHour] = useState("09");
  const [newActivityMinute, setNewActivityMinute] = useState("00");
  const [selectedColorOption, setSelectedColorOption] = useState(predefinedColors[0].value); // Default color
  const [customHexColor, setCustomHexColor] = useState("#000000"); // Default custom hex color
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCustomLocationInput, setShowCustomLocationInput] = useState(false);

  const formatDateKey = (d: Date | undefined): string => {
    return d ? format(d, "yyyy-MM-dd") : "";
  };

  const formatDisplayDate = (d: Date | undefined): string => {
    return d ? format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Nenhuma data selecionada";
  };

  const selectedDateKey = useMemo(() => formatDateKey(date), [date]);
  const activitiesForSelectedDate = useMemo(() => activities[selectedDateKey] || [], [activities, selectedDateKey]);

  const handleLocationChange = (value: string) => {
    if (value === "custom") {
      setShowCustomLocationInput(true);
      setNewActivityLocation("");
    } else {
      setShowCustomLocationInput(false);
      setNewActivityLocation(value);
    }
  };

  const handleAddActivity = () => {
    if (!date) {
      toast.error("Selecione uma data para adicionar uma atividade.");
      return;
    }
    if (!newActivityTitle.trim()) {
      toast.error("O título da atividade não pode ser vazio.");
      return;
    }
    if (!newActivityLocation.trim()) {
      toast.error("O local da atividade não pode ser vazio.");
      return;
    }
    if (!newActivityHour || !newActivityMinute) {
      toast.error("O horário da atividade não pode ser vazio.");
      return;
    }

    const finalActivityColor = selectedColorOption === "custom" ? customHexColor : selectedColorOption;

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: newActivityTitle.trim(),
      description: newActivityDescription.trim(),
      location: newActivityLocation.trim(),
      time: `${newActivityHour}:${newActivityMinute}`,
      color: finalActivityColor, // Adiciona a cor final
    };

    setActivities((prevActivities) => ({
      ...prevActivities,
      [selectedDateKey]: [...(prevActivities[selectedDateKey] || []), newActivity],
    }));

    setNewActivityTitle("");
    setNewActivityDescription("");
    setNewActivityLocation("");
    setShowCustomLocationInput(false);
    setNewActivityHour("09");
    setNewActivityMinute("00");
    setSelectedColorOption(predefinedColors[0].value); // Reset color selection
    setCustomHexColor("#000000"); // Reset custom hex color
    setIsDialogOpen(false);
    toast.success("Atividade adicionada com sucesso!");
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!date) return;

    setActivities((prevActivities) => ({
      ...prevActivities,
      [selectedDateKey]: prevActivities[selectedDateKey].filter(
        (activity) => activity.id !== activityId
      ),
    }));
    toast.success("Atividade removida.");
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  // Removendo as chamadas para getRandomAppRandomBgColorClass e getRandomAppRandomBorderColorClass
  // e definindo as classes diretamente para vermelho.
  const calendarCardBgClass = "bg-appMidRed";
  const calendarCardBorderClass = "border-appMidRed/30";

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon" className="text-appBluePrimary hover:bg-appBlueSecondary/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-appBluePrimary ml-4">Cronograma</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-6">
        <p className="text-lg text-appAccent/80 text-center">
          Gerencie as atividades e rotinas.
        </p>

        <Card className={cn("w-full shadow-lg border-2", calendarCardBorderClass)}>
          <CardHeader className={cn("text-white rounded-t-lg", calendarCardBgClass)}>
            <CardTitle className="text-xl">Calendário</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={ptBR}
            />
          </CardContent>
        </Card>

        {date && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl text-blue-800">
                Atividades para {formatDisplayDate(date)}
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-blue-700 hover:text-blue-900">
                    <PlusCircle className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Atividade</DialogTitle>
                    <DialogDescription>
                      Adicione uma nova atividade para {formatDisplayDate(date)}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Título
                      </Label>
                      <Input
                        id="title"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        value={newActivityDescription}
                        onChange={(e) => setNewActivityDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Local
                      </Label>
                      <div className="col-span-3">
                        <Select onValueChange={handleLocationChange} value={showCustomLocationInput ? "custom" : newActivityLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione ou digite um local" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Escola">Escola</SelectItem>
                            <SelectItem value="Casa">Casa</SelectItem>
                            <SelectItem value="Hospital">Hospital</SelectItem>
                            <SelectItem value="custom">Outro (digitar)</SelectItem>
                          </SelectContent>
                        </Select>
                        {showCustomLocationInput && (
                          <Input
                            id="customLocation"
                            value={newActivityLocation}
                            onChange={(e) => setNewActivityLocation(e.target.value)}
                            placeholder="Digite o local"
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Horário
                      </Label>
                      <div className="col-span-3 flex gap-2">
                        <Select onValueChange={setNewActivityHour} value={newActivityHour}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Hora" />
                          </SelectTrigger>
                          <SelectContent>
                            {hourOptions.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select onValueChange={setNewActivityMinute} value={newActivityMinute}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Minuto" />
                          </SelectTrigger>
                          <SelectContent>
                            {minuteOptions.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {/* Nova seção para seleção de cor */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">
                        Cor da Atividade
                      </Label>
                      <div className="col-span-3">
                        <Select onValueChange={(value) => {
                          setSelectedColorOption(value);
                          if (value === "custom") {
                            // Keep customHexColor or set a default if needed
                          }
                        }} value={selectedColorOption}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cor">
                              {selectedColorOption === "custom"
                                ? "Cor Personalizada"
                                : predefinedColors.find(c => c.value === selectedColorOption)?.name || "Selecione uma cor"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {predefinedColors.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <span className={cn("h-4 w-4 rounded-full", color.value)} />
                                  {color.name}
                                </div>
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2">
                                <span className="h-4 w-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                                Cor Personalizada
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedColorOption === "custom" && (
                          <Input
                            type="color"
                            value={customHexColor}
                            onChange={(e) => setCustomHexColor(e.target.value)}
                            className="mt-2 h-8 w-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddActivity}>
                      Salvar Atividade
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {activitiesForSelectedDate.length > 0 ? (
                <ul className="space-y-3">
                  {activitiesForSelectedDate.map((activity) => (
                    <li
                      key={activity.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md shadow-sm text-white", // Default text to white
                        !activity.color.startsWith("#") && activity.color // Apply Tailwind class if not hex
                      )}
                      style={activity.color.startsWith("#") ? { backgroundColor: activity.color } : {}} // Apply inline style for hex
                    >
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        {activity.description && (
                          <p className="text-sm">{activity.description}</p>
                        )}
                        {(activity.location || activity.time) && (
                          <p className="text-xs">
                            {activity.time && `⏰ ${activity.time}`}
                            {activity.time && activity.location && " | "}
                            {activity.location && `📍 ${activity.location}`}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-white hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">Nenhuma atividade para esta data.</p>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
};

export default CalendarPage;