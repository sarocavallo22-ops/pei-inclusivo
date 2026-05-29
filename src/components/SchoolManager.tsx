import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PEIData } from "../types";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Check, 
  Bell, 
  FolderPlus, 
  FileSpreadsheet, 
  CalendarDays, 
  Tag,
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  FileDown,
  Users,
  User,
  MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { DidacticObservation } from "./DidacticObservation";

interface SchoolManagerProps {
  data: PEIData;
  onChange: (newData: PEIData) => void;
  onSelectArea: (areaKey: string) => void;
  t: any;
  lang: string;
}

export function SchoolManager({ data, onChange, onSelectArea, t, lang }: SchoolManagerProps) {
  // Mode selection: menu by default, can go into discipline, calendar, documents, didactic_observation
  const [activeTab, setActiveTab] = useState<"menu" | "discipline" | "calendar" | "documents" | "didactic_observation">("menu");

  const appointments = data.schoolAppointments || [];
  const documents = data.schoolDocuments || [];
  
  const MONTHS = t.schoolManager.months;
  const WEEK_DAYS = t.schoolManager.weekDays;

  const deadlines = data.gloDeadlines || [
    { id: "d1", title: t.schoolManager.milestoneApprovazione, month: MONTHS[9], status: "completato", dueDate: "2026-10-31" },
    { id: "d2", title: t.schoolManager.milestoneVerificaIntermedia, month: MONTHS[0], status: "completato", dueDate: "2026-01-31" },
    { id: "d3", title: t.schoolManager.milestoneVerificaFinale, month: MONTHS[5], status: "in_corso", dueDate: "2026-06-30" }
  ];

  // Google Calendar Month-by-Month State
  const [currentMonth, setCurrentMonth] = useState(4); // Maggio (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-05-24");

  // Appointment Form state - Unified quick add
  const [familyTitle, setFamilyTitle] = useState("");
  const [familyTime, setFamilyTime] = useState("09:00");
  const [familyType, setFamilyType] = useState<'GLO' | 'Consiglio' | 'Incontro Famiglia' | 'Altro'>('Incontro Famiglia');
  const [familyNotes, setFamilyNotes] = useState("");

  // Document Upload State
  const [uploadCategory, setUploadCategory] = useState<'PEI' | 'Verbale' | 'Certificazione' | 'Altro'>('PEI');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Search/Filters
  const [docSearch, setDocSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Handler: Add Appointment from interactive Google-style day cell
  const handleAddFamilyApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyTitle.trim() || !selectedDateStr) return;

    const newAppointment = {
      id: "app_" + Date.now(),
      title: familyTitle.trim(),
      date: selectedDateStr,
      time: familyTime || "09:00",
      type: familyType,
      category: (familyType === "Incontro Famiglia" ? "scuola-famiglia" : "team") as "scuola-famiglia" | "team",
      notes: familyNotes.trim()
    };

    onChange({
      ...data,
      schoolAppointments: [...appointments, newAppointment]
    });

    // Reset Form
    setFamilyTitle("");
    setFamilyTime("09:00");
    setFamilyNotes("");
  };

  // Handler: Delete Appointment
  const handleDeleteAppointment = (id: string) => {
    onChange({
      ...data,
      schoolAppointments: appointments.filter(a => a.id !== id)
    });
  };

  // Handler: Update Appointment Notes
  const handleUpdateNotes = (id: string, updatedNotes: string) => {
    onChange({
      ...data,
      schoolAppointments: appointments.map(a => 
        a.id === id ? { ...a, notes: updatedNotes } : a
      )
    });
  };

  // Handler: Add Document (Simulated upload)
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = documentName.trim() || "Documento_Scolastico_" + Date.now() + ".pdf";
    const newDoc = {
      id: "doc_" + Date.now(),
      name: nameToUse.endsWith(".pdf") ? nameToUse : nameToUse + ".pdf",
      uploadedAt: new Date().toISOString().split('T')[0],
      size: (Math.random() * 2 + 0.1).toFixed(1) + " MB",
      fileType: "pdf",
      category: uploadCategory
    };

    onChange({
      ...data,
      schoolDocuments: [...documents, newDoc]
    });

    setDocumentName("");
    setShowUploadModal(false);
  };

  // Handler: Drag and drop upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newDoc = {
        id: "doc_" + Date.now(),
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        fileType: file.name.split('.').pop() || "pdf",
        category: uploadCategory
      };

      onChange({
        ...data,
        schoolDocuments: [...documents, newDoc]
      });
    }
  };

  // Handler: Delete Document
  const handleDeleteDocument = (id: string) => {
    onChange({
      ...data,
      schoolDocuments: documents.filter(d => d.id !== id)
    });
  };

  // Dynamic grouping and sorting of ALL calendar dates (GLO milestones + manual appointments)
  const combinedCalendarEvents = [
    // Transform GLO deadlines into comparable calendar objects
    ...deadlines.map(d => ({
      id: d.id,
      title: t.schoolManager.prefixMilestone + " " + d.title,
      date: d.dueDate.includes("-") ? d.dueDate : "2026-" + (d.month === MONTHS[9] ? "10" : d.month === MONTHS[0] ? "01" : "06") + "-30",
      time: "17:00",
      type: "GLO" as const,
      category: "team" as "scuola-famiglia" | "team" | undefined,
      isDeadline: true,
      status: d.status,
      notes: t.schoolManager.deadlineNoteTemplate.replace('{month}', d.month).replace('{status}', d.status === "completato" ? t.schoolManager.statusVerificato : t.schoolManager.statusInCorso)
    })),
    ...appointments.map(a => ({
      id: a.id,
      title: a.title,
      date: a.date,
      time: a.time,
      type: a.type,
      category: a.category as "scuola-famiglia" | "team" | undefined,
      notes: a.notes,
      isDeadline: false,
      status: undefined
    }))
  ].sort((a, b) => new Date(a.date + "T" + (a.time || "00:00")).getTime() - new Date(b.date + "T" + (b.time || "00:00")).getTime());

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearch.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const areasKeys = [
    "humanities",
    "scientific",
    "foreignLanguages",
    "artsMusicSports",
    "civics",
    "educationalSupport",
  ] as const;

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto" id="school-manager-root">
      
      {/* Dynamic Animated Content based on selected Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "menu" && (
          <motion.div
            key="school-selection-menu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-8 bg-[#0a192f]/60 backdrop-blur-md p-12 rounded-[60px] shadow-2xl border border-white/10"
          >
            <h2 className="text-3xl font-black text-white text-center pb-2 uppercase tracking-wide">
              {t.schoolManager.gestioneDidatticaClasse}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full pb-8">
              {[
                {
                  id: "didactic_observation",
                  title: t.schoolManager.didatticaOsservazione,
                  subtitle: t.schoolManager.didatticaOsservazioneDesc,
                  color: "bg-teal-500",
                  borderColor: "border-teal-100/80 hover:border-teal-300 shadow-teal-500/10",
                  textColor: "text-teal-400 group-hover:text-teal-300 font-extrabold",
                  image: "/imparare.png"
                },
                {
                  id: "discipline",
                  title: t.schoolManager.disciplineScolastiche,
                  subtitle: t.schoolManager.disciplineScolasticheDesc,
                  color: "bg-blue-500",
                  borderColor: "border-blue-100/80 hover:border-blue-300 shadow-blue-500/10",
                  textColor: "text-blue-400 group-hover:text-blue-300 font-extrabold",
                  emoji: "📚"
                },
                {
                  id: "calendar",
                  title: t.schoolManager.calendarioAppuntamenti,
                  subtitle: t.schoolManager.calendarioAppuntamentiDesc,
                  color: "bg-indigo-500",
                  borderColor: "border-indigo-100/80 hover:border-indigo-300 shadow-indigo-500/10",
                  textColor: "text-indigo-400 group-hover:text-indigo-300 font-extrabold",
                  emoji: "📅"
                },
                {
                  id: "documents",
                  title: t.schoolManager.archivioDocumenti,
                  subtitle: t.schoolManager.archivioDocumentiDesc,
                  color: "bg-emerald-500",
                  borderColor: "border-emerald-100/80 hover:border-emerald-300 shadow-emerald-500/10",
                  textColor: "text-emerald-400 group-hover:text-emerald-300 font-extrabold",
                  emoji: "📂"
                }
              ].map((sec) => (
                <motion.button
                  key={sec.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(sec.id as any);
                  }}
                  className="flex flex-col items-center gap-4 w-full group cursor-pointer text-center"
                >
                  <div
                    className={cn(
                      "w-full aspect-[4/3] rounded-[40px] shadow-2xl border-4 relative overflow-hidden transition-all duration-300 flex items-center justify-center bg-white",
                      sec.borderColor
                    )}
                  >
                    {sec.image ? (
                      <img
                        src={sec.image}
                        alt=""
                        className="absolute inset-0 m-auto p-5 max-w-full max-h-full object-contain opacity-100 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                        {sec.emoji}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "text-xl font-black uppercase tracking-tight transition-colors px-4 py-1",
                        sec.textColor
                      )}
                    >
                      {sec.title}
                    </h3>
                    <p className="text-blue-100/60 text-xs px-4 font-semibold mt-0.5 line-clamp-2 max-w-[280px] mx-auto leading-relaxed">
                      {sec.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 1: DISCIPLINE VIEW */}
        {activeTab === "discipline" && (
          <motion.div
            key="school-discipline-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Local Nav Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("menu")}
                className="rounded-2xl h-11 px-6 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all flex items-center gap-2"
              >
                <ChevronLeft size={16} /> {t.schoolManager.tornaIndietro}
              </Button>
              <span className="text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full">
                {t.schoolManager.sezioneDiscipline}
              </span>
            </div>

            {/* Disciplines container mapping exact style of buttons */}
            <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
              {areasKeys.map((areaKey) => (
                <motion.button
                  key={areaKey}
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectArea(areaKey)}
                  className="group relative flex items-center bg-white backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10 text-left p-7 transition-all cursor-pointer"
                >
                  <div className="flex-1 pr-3">
                    <h4 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      {t.school[areaKey]}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">
                      {t.school[areaKey + "Desc"]}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <ChevronRight size={20} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 2: CALENDARIO VIEW */}
        {activeTab === "calendar" && (
          <motion.div
            key="school-calendar-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Local Nav Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("menu")}
                className="rounded-2xl h-11 px-6 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all flex items-center gap-2"
              >
                <ChevronLeft size={16} /> {t.schoolManager.tornaIndietro}
              </Button>
              <span className="text-xs font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-4 py-1.5 rounded-full">
                {t.schoolManager.calendarioGloScuola}
              </span>
            </div>

            {/* Main title panel */}
            <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/10 text-slate-900">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Calendar className="text-indigo-600" /> {t.schoolManager.agendaIncontriScolastici}
              </h3>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                {t.schoolManager.agendaIncontriDesc}
              </p>
            </div>

            {/* Google Calendar Month Navigation Header */}
            {(() => {
              // Calculate days for the 42-cell monthly layout
              const daysInCurMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
              const firstDayWeeklyIdx = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun, 1=Mon...
              const mondayStartOffset = firstDayWeeklyIdx === 0 ? 6 : firstDayWeeklyIdx - 1;

              const monthGridDays: { dayNum: number; dateString: string; isCurrentMonth: boolean }[] = [];

              // Trailing days from previous month
              const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
              const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
              const daysInPrevMonth = new Date(prevMonthYear, prevMonthIdx + 1, 0).getDate();
              for (let i = mondayStartOffset - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                const dStr = prevMonthYear + "-" + String(prevMonthIdx + 1).padStart(2, '0') + "-" + String(day).padStart(2, '0');
                monthGridDays.push({ dayNum: day, dateString: dStr, isCurrentMonth: false });
              }

              // Days of current month
              for (let d = 1; d <= daysInCurMonth; d++) {
                const realDStr = currentYear + "-" + String(currentMonth + 1).padStart(2, '0') + "-" + String(d).padStart(2, '0');
                monthGridDays.push({ dayNum: d, dateString: realDStr, isCurrentMonth: true });
              }

              // Leading days from next month
              const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
              const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
              let nextMonthDayCounter = 1;
              while (monthGridDays.length < 42) {
                const dStr = nextMonthYear + "-" + String(nextMonthIdx + 1).padStart(2, '0') + "-" + String(nextMonthDayCounter).padStart(2, '0');
                monthGridDays.push({ dayNum: nextMonthDayCounter, dateString: dStr, isCurrentMonth: false });
                nextMonthDayCounter++;
              }

              const getFormattedSelectedDate = () => {
                if (!selectedDateStr) return "";
                const parts = selectedDateStr.split("-");
                if (parts.length < 3) return selectedDateStr;
                const year = parseInt(parts[0], 10);
                const monthIdx = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[2], 10);
                return day + " " + MONTHS[monthIdx] + " " + year;
              };

              const selectedDayEvents = combinedCalendarEvents.filter(evt => evt.date === selectedDateStr);

              return (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="calendar-workspace-grid">
                  
                  {/* LEFT COLUMN: THE GOOGLE CALENDAR MONTH GRID */}
                  <div className="xl:col-span-8 space-y-4">
                    
                    {/* Month Navigator Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-[24px] p-5 shadow-xl border border-slate-100 text-slate-900">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentMonth(4); // Maggio
                            setCurrentYear(2026);
                            setSelectedDateStr("2026-05-24");
                          }}
                          className="h-10 px-4 font-black rounded-xl border border-slate-200/90 text-[11px] text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          {t.schoolManager.oggi}
                        </Button>

                        <div className="flex items-center border border-slate-200/95 rounded-xl overflow-hidden shadow-sm shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (currentMonth === 0) {
                                setCurrentMonth(11);
                                setCurrentYear(currentYear - 1);
                              } else {
                                setCurrentMonth(currentMonth - 1);
                              }
                            }}
                            className="h-10 w-10 flex items-center justify-center hover:bg-slate-50 border-r border-slate-200 text-slate-600 cursor-pointer"
                            title={t.schoolManager.tooltipMesePrec || "Mese precedente"}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (currentMonth === 11) {
                                setCurrentMonth(0);
                                setCurrentYear(currentYear + 1);
                              } else {
                                setCurrentMonth(currentMonth + 1);
                              }
                            }}
                            className="h-10 w-10 flex items-center justify-center hover:bg-slate-50 text-slate-600 cursor-pointer"
                            title={t.schoolManager.tooltipMeseSucc || "Mese successivo"}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight pl-2">
                          {MONTHS[currentMonth]} {currentYear}
                        </h4>
                      </div>

                      {/* Info badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] bg-red-50 text-red-700 border border-red-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {t.schoolManager.ministerialeGlo}
                        </span>
                        <span className="text-[8px] bg-pink-50 text-pink-700 border border-pink-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {t.schoolManager.scuolaFamigliaLabel}
                        </span>
                        <span className="text-[8px] bg-cyan-50 text-cyan-700 border border-cyan-200 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {t.schoolManager.teamConsigli}
                        </span>
                      </div>
                    </div>

                    {/* Weekday Names Header */}
                    <div className="overflow-x-auto w-full rounded-3xl border border-slate-100/90 shadow-xl">
                      <div className="bg-white/95 backdrop-blur-md p-3 text-slate-900 min-w-[700px]">
                        <div className="grid grid-cols-7 gap-1 bg-slate-50 p-2 rounded-2xl border-b border-slate-100/80 mb-2">
                          {WEEK_DAYS.map(dayName => (
                            <div key={dayName} className="text-center font-black text-[10px] uppercase text-slate-400 py-0.5 tracking-widest">
                              {dayName}
                            </div>
                          ))}
                        </div>

                        {/* The monthly grid cells */}
                        <div className="grid grid-cols-7 gap-1.5 min-h-[380px]">
                          {monthGridDays.map((day) => {
                            const dayEvents = combinedCalendarEvents.filter(e => e.date === day.dateString);
                            const isSelected = selectedDateStr === day.dateString;
                            const isToday = day.dateString === "2026-05-24"; // Mock today's clock date

                            return (
                              <button
                                key={day.dateString}
                                type="button"
                                onClick={() => setSelectedDateStr(day.dateString)}
                                className={cn(
                                  "min-h-[88px] p-1.5 flex flex-col justify-between items-stretch rounded-2xl transition-all border text-left cursor-pointer",
                                  day.isCurrentMonth 
                                    ? "bg-white border-slate-100 hover:bg-slate-50/70 text-slate-800" 
                                    : "bg-slate-50/30 text-slate-350 border-slate-100/40 hover:bg-slate-100/30",
                                  isSelected 
                                    ? "ring-2 ring-indigo-600 ring-offset-2 border-white z-10 bg-slate-50/50" 
                                    : ""
                                )}
                              >
                                {/* Day index row */}
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={cn(
                                      "text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full transition-all",
                                      isToday 
                                        ? "bg-indigo-600 text-white shadow-md font-bold text-center"
                                        : day.isCurrentMonth ? "text-slate-700" : "text-slate-455"
                                    )}
                                  >
                                    {day.dayNum}
                                  </span>
                                  {dayEvents.length > 0 && !isToday && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                  )}
                                </div>

                                {/* Day inline events list */}
                                <div className="space-y-1 overflow-hidden flex-1 flex flex-col justify-start">
                                  {dayEvents.slice(0, 2).map((evt) => {
                                    const isGLO = evt.type === "GLO";
                                    const isFamiglia = evt.type === "Incontro Famiglia";
                                    const isConsiglio = evt.type === "Consiglio";

                                    return (
                                      <div
                                        key={evt.id}
                                        className={cn(
                                          "text-[8px] font-black px-1.5 py-0.5 rounded leading-tight w-full shadow-sm text-left truncate border transition-all",
                                          evt.isDeadline
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : isGLO
                                              ? "bg-cyan-50 text-cyan-800 border-cyan-150"
                                              : isFamiglia
                                                ? "bg-pink-50 text-pink-850 border-pink-150"
                                                : isConsiglio
                                                  ? "bg-amber-50 text-amber-800 border-amber-150"
                                                  : "bg-slate-50 text-slate-700 border-slate-200"
                                        )}
                                        title={evt.time + " - " + evt.title}
                                      >
                                        {evt.title}
                                      </div>
                                    );
                                  })}
                                  {dayEvents.length > 2 && (
                                    <div className="text-[8px] font-black text-slate-400 pl-1 text-left mt-0.5">
                                      + {dayEvents.length - 2} {t.schoolManager.altri || "altri"}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: DETTAGLI DI GIORNATA & NUOVO IMPEGNO */}
                  <div className="xl:col-span-4 space-y-4">
                    
                    {/* Event Detail Panel for currently Selected Day */}
                    <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-xl border border-slate-150 text-slate-900 space-y-6">
                      
                      <div className="border-b border-slate-100 pb-3">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 inline-block mb-1.5">
                          {t.schoolManager.impegniGiornalieri}
                        </span>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                          <CalendarDays size={18} className="text-indigo-600" /> {getFormattedSelectedDate()}
                        </h4>
                      </div>

                      {/* List of day events */}
                      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                        {selectedDayEvents.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <CalendarDays size={28} className="mx-auto text-slate-300 mb-1.5 animate-pulse" />
                            <p className="font-extrabold text-[10px] uppercase tracking-wider">{t.schoolManager.nessunImpegno}</p>
                            <p className="text-[9px] text-slate-400 font-semibold px-2">{t.schoolManager.compilaFormAggiungi}</p>
                          </div>
                        ) : (
                          selectedDayEvents.map((evt) => (
                            <div
                              key={evt.id}
                              className={cn(
                                "p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl transition-all space-y-3"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={cn(
                                      "text-[8px] px-2 py-0.5 rounded-full font-black uppercase shrink-0 tracking-wider text-center border leading-none",
                                      evt.type === "GLO" ? "bg-cyan-100 text-cyan-850 border-cyan-200" :
                                      evt.type === "Consiglio" ? "bg-amber-100 text-amber-850 border-amber-200" :
                                      evt.type === "Incontro Famiglia" ? "bg-pink-100 text-pink-850 border-pink-200" :
                                      "bg-slate-150 text-slate-700 border-slate-250"
                                    )}>
                                      {evt.type === "GLO" ? t.schoolManager.typeGlo :
                                       evt.type === "Consiglio" ? t.schoolManager.typeConsiglio :
                                       evt.type === "Incontro Famiglia" ? t.schoolManager.typeFamiglia :
                                       t.schoolManager.typeAltro}
                                    </span>
                                    {evt.isDeadline && (
                                      <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase font-black tracking-wider leading-none">
                                        {t.schoolManager.scadenzaPei}
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-black text-xs text-slate-800 uppercase tracking-tight leading-snug break-words">
                                    {evt.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-extrabold mt-0.5">
                                    <span className="flex items-center gap-0.5"><Clock size={11} /> {evt.time}</span>
                                  </div>
                                </div>

                                {!evt.isDeadline && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAppointment(evt.id)}
                                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                    title={t.schoolManager.tooltipCancella || "Cancella Incontro"}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>

                              {/* Editable Notes Container */}
                              <div className="space-y-1 mt-1 border-t border-slate-205 pt-2">
                                <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                  <MessageSquare size={10} className="text-indigo-600" /> {t.schoolManager.annotazioniRelazione}
                                </label>
                                <textarea
                                  value={evt.notes || ""}
                                  onChange={(e) => {
                                    if (evt.isDeadline && evt.id.startsWith("d")) {
                                      const updatedDeadlines = deadlines.map(d => 
                                        d.id === evt.id ? { ...d, notes: e.target.value } : d
                                      );
                                      onChange({
                                        ...data,
                                        gloDeadlines: updatedDeadlines
                                      });
                                    } else {
                                      handleUpdateNotes(evt.id, e.target.value);
                                    }
                                  }}
                                  placeholder={t.schoolManager.inserisciVerbali}
                                  className="w-full bg-white border border-slate-200 hover:border-indigo-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 rounded-xl p-2 text-[11px] text-slate-700 font-medium focus:outline-none transition-all placeholder:text-slate-400 resize-y min-h-[50px]"
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Collapsible/Inlined Form to Add New Event on Selected Day */}
                      <form onSubmit={handleAddFamilyApp} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-slate-800 space-y-3.5">
                        <h5 className="font-extrabold text-[10px] text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                          <Plus size={12} /> {t.schoolManager.aggiungiImpegno}
                        </h5>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">{t.schoolManager.oggettoTitolo}</label>
                          <input
                            type="text"
                            required
                            value={familyTitle}
                            onChange={(e) => setFamilyTitle(e.target.value)}
                            placeholder={t.schoolManager.placeholderTitoloImpegno}
                            className="w-full bg-white border border-slate-200 rounded-xl h-9 px-3 text-[11px] text-slate-800 font-bold focus:outline-none focus:border-indigo-600 placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-600/10"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">{t.schoolManager.ora}</label>
                            <input
                              type="time"
                              required
                              value={familyTime}
                              onChange={(e) => setFamilyTime(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl h-9 px-3 text-[11px] text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">{t.schoolManager.tipologia}</label>
                            <select
                              value={familyType}
                              onChange={(e) => setFamilyType(e.target.value as any)}
                              className="w-full bg-white border border-slate-200 rounded-xl h-9 px-2 text-[11px] text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                            >
                              <option value="Incontro Famiglia">{t.schoolManager.typeFamiglia}</option>
                              <option value="GLO">{t.schoolManager.typeGlo}</option>
                              <option value="Consiglio">{t.schoolManager.typeConsiglio}</option>
                              <option value="Altro">{t.schoolManager.typeAltro}</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">{t.schoolManager.noteLink}</label>
                          <input
                            type="text"
                            value={familyNotes}
                            onChange={(e) => setFamilyNotes(e.target.value)}
                            placeholder={t.schoolManager.placeholderLinkMeet}
                            className="w-full bg-white border border-slate-200 rounded-xl h-9 px-3 text-[11px] text-slate-800 focus:outline-none focus:border-indigo-600 placeholder:text-slate-400"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition-colors"
                        >
                          {t.schoolManager.salvaInAgenda}
                        </Button>
                      </form>

                    </div>

                    {/* Informative advice flag */}
                    <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl flex gap-3 text-slate-700">
                      <AlertCircle className="text-indigo-600 shrink-0 w-5 h-5 mt-0.5" />
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-indigo-950">
                          {t.schoolManager.sincAnnuale}
                        </h5>
                        <p className="text-[10px] leading-relaxed text-indigo-850 font-medium">
                          {t.schoolManager.sincAnnualeDesc}
                        </p>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()}

          </motion.div>
        )}

        {/* TAB 3: ARCHIVIO DOCUMENTI VIEW */}
        {activeTab === "documents" && (
          <motion.div
            key="school-documents-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Local Nav Header */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("menu")}
                className="rounded-2xl h-11 px-6 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all flex items-center gap-2"
              >
                <ChevronLeft size={16} /> {t.schoolManager.tornaIndietro}
              </Button>
              <span className="text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                {t.schoolManager.archivioDocumentiAula}
              </span>
            </div>

            {/* High contrast glassmorphic container */}
            <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 shadow-3xl text-slate-900 border-none space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                    <FileText className="text-emerald-600" /> {t.schoolManager.fascicoloPeiAlunno}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">
                    {t.schoolManager.fascicoloPeiDesc}
                  </p>
                </div>

                <Button
                  onClick={() => setShowUploadModal(!showUploadModal)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl h-10 px-4 text-xs uppercase cursor-pointer"
                >
                  <Plus size={16} className="mr-1.5" /> {t.schoolManager.caricaDocumento}
                </Button>
              </div>

              {/* Upload Panel container directly visible inside */}
              <AnimatePresence>
                {showUploadModal && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddDocument}
                    className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 shadow-inner grid grid-cols-1 md:grid-cols-12 gap-4 text-xs text-slate-700 overflow-hidden"
                  >
                    <div className="md:col-span-12">
                      <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Upload size={12} className="text-emerald-600" /> {t.schoolManager.caricaFileFascicolo}
                      </h4>
                    </div>

                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{t.schoolManager.nomeIdentificativoFile}</label>
                      <input
                        type="text"
                        required
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        placeholder={t.schoolManager.placeholderNomeFile}
                        className="w-full bg-white border border-slate-300 rounded-xl h-10 px-3 text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 font-bold"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{t.schoolManager.categoria}</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl h-10 px-3 text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 font-bold cursor-pointer"
                      >
                        <option value="PEI">{t.schoolManager.catPei}</option>
                        <option value="Verbale">{t.schoolManager.catVerbale}</option>
                        <option value="Certificazione">{t.schoolManager.catCertificazione}</option>
                        <option value="Altro">{t.schoolManager.catAltro}</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 flex items-end">
                      <Button
                        type="submit"
                        className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase transition-colors shrink-0"
                      >
                        {t.schoolManager.salvaNelCloud}
                      </Button>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={cn(
                        "md:col-span-12 border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer",
                        dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <Upload className="mx-auto text-emerald-600 mb-2" size={24} />
                      <p className="text-slate-700 text-xs font-black uppercase tracking-wide">
                        {t.schoolManager.trascinaQuiFile}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                        {t.schoolManager.supportaFile}
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Filtering & Searching tools */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Search text input */}
                <div className="md:col-span-5 relative">
                  <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.schoolManager.placeholderFiltraDoc}
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 pl-10 pr-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Categories filtering chips */}
                <div className="md:col-span-7 flex flex-wrap gap-1.5 justify-start md:justify-end text-[10px] font-black uppercase tracking-wider">
                  {["All", "PEI", "Verbale", "Certificazione", "Altro"].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-bold",
                        selectedCategory === cat 
                          ? "bg-emerald-600 text-white border-emerald-600 shadow"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      )}
                    >
                      {cat === "All" ? t.schoolManager.tutti :
                       cat === "PEI" ? t.schoolManager.catPei :
                       cat === "Verbale" ? t.schoolManager.catVerbale :
                       cat === "Certificazione" ? t.schoolManager.catCertificazione :
                       t.schoolManager.catAltro}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of uploaded documents */}
              <div className="space-y-3.5">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-sm uppercase tracking-wide">{t.schoolManager.nessunFileArchiviato}</p>
                    <p className="text-xs text-slate-400">{t.schoolManager.nessunFileArchiviatoDesc}</p>
                  </div>
                ) : (
                  filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-slate-50 rounded-3xl border border-slate-200/80 hover:border-slate-300 transition-colors flex items-center justify-between text-sm"
                    >
                      {/* Document identity info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 border border-emerald-100">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-sm text-slate-800 truncate uppercase tracking-tight" title={doc.name}>
                            {doc.name}
                          </h5>
                          <div className="flex gap-2 items-center flex-wrap mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            <span className="bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded">{doc.size}</span>
                            <span>•</span>
                            <span className="text-emerald-600 bg-emerald-50 text-[8px] font-black px-1.5 rounded border border-emerald-100">
                              {doc.category === "PEI" ? t.schoolManager.catPei :
                               doc.category === "Verbale" ? t.schoolManager.catVerbale :
                               doc.category === "Certificazione" ? t.schoolManager.catCertificazione :
                               t.schoolManager.catAltro}
                            </span>
                            <span>•</span>
                            <span>{(t.schoolManager.aggiuntoIl || "Aggiunto il:") + " " + doc.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Download / Delete Action Buttons */}
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button
                          onClick={() => {
                            const dlMsg = t.schoolManager.downloadAlert || "Avvio del download sicuro per il file: {name}";
                            alert(dlMsg.replace('{name}', doc.name));
                          }}
                          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                          title={t.schoolManager.tooltipScarica || "Scarica file"}
                        >
                          <FileDown size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                          title={t.schoolManager.tooltipCancellaFile || "Cancella file"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

              {/* Privacy secure notice */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-3xl flex gap-3 text-slate-700">
                <Lock className="text-emerald-600 shrink-0 w-5 h-5 mt-0.5" />
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-850">
                    {t.schoolManager.gdprTitle}
                  </h5>
                  <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                    {t.schoolManager.gdprDesc}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === "didactic_observation" && (
          <motion.div
            key="school-didactic-observation-tab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <DidacticObservation
              data={data}
              onChange={onChange}
              onBack={() => setActiveTab("menu")}
              t={t}
              lang={lang}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
