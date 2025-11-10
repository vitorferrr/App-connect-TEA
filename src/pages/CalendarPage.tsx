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
}

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activities, setActivities] = useState<{ [key: string]: Activity[] }>({});
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityDescription, setNewActivityDescription] = useState("");
  const [newActivityLocation, setNewActivityLocation] = useState("");
  const [newActivityHour, setNewActivityHour] = useState("09");
  const [newActivityMinute, setNewActivityMinute] = useState("00");
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

    const newActivity: Activity = {
      id: Date.now().toString(),
      title: newActivityTitle.trim(),
      description: newActivityDescription.trim(),
      location: newActivityLocation.trim(),
      time: `${newActivityHour}:${newActivityMinute}`,
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

  const calendarCardBgClass = useMemo(() => getRandomAppRandomBgColorClass(), []);
  const calendarCardBorderClass = useMemo(() => getRandomAppRandomBorderColorClass(), []);

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
                    <li key={activity.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                        {activity.description && (
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        )}
                        {(activity.location || activity.time) && (
                          <p className="text-xs text-gray-500">
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
                        className="text-red-500 hover:text-red-700"
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