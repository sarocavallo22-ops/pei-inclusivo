import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Users,
  Heart,
  ChevronRight,
  ChevronLeft,
  Globe,
  Save,
  Languages,
  CheckCircle2,
  PlusCircle,
  UserCircle,
  Clock,
  Coffee,
  Info,
  MessageSquare,
  Menu,
  FileText,
  Home,
  X,
  RotateCcw,
  Upload,
  CircleDot,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  Smile,
  Frown,
  User,
  Calendar,
  MapPin,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Fingerprint,
  Download,
  Printer,
  Youtube,
  Trash2,
  FileImage,
  Palette,
  Loader2,
  BookCheck,
  FlaskConical,
  Calculator,
  Bath,
  Shirt,
  Utensils,
  Compass,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CAACommunicator from "./CAACommunicator";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Separator } from "./components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import GenogramEditor from "./components/GenogramEditor";
import { DidacticObservation } from "./components/DidacticObservation";
import { SchoolManager } from "./components/SchoolManager";
import { PEIData } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cn } from "./lib/utils";
import countries from "world-countries";
import {
  SoapBubblesGame,
  StressBallGame,
  MemoryGame,
} from "./components/RelaxGames";

const countryList = countries
  .map((c) => ({
    name: c.name.common,
    cca2: c.cca2,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const commonLanguages = [
  "Italiano",
  "Arabo",
  "Spagnolo",
  "Cinese",
  "Inglese",
  "Rumeno",
  "Albanese",
  "Bengalese",
  "Urdu",
  "Punjabi",
  "Wolof",
  "Tagalog",
];

type Language = "it" | "ar" | "es";

const translations = {
  it: {
    title: "my/our PEI",
    subtitle: "",
    welcome: "my/our PEI",
    choose: "scegli da che parte iniziare a raccontarci di voi",
    appRules: "Regolamento e Istruzioni",
    peiExplanation: "Cos'è il PEI?",
    progettoVita: "Progetto di Vita",
    appRulesContent:
      "Benvenuti in myPEI! Ecco come usare l'app:\n\n1. AGENDA VISIVA: Organizza la giornata su sfondo bianco per una migliore visibilità. Ogni attività può avere un timer personalizzato (clicca l'orologio) con un conto alla rovescia a pallini, studiato per aiutare la percezione del tempo. Usa il blu per il lavoro e il giallo per la pausa.\n\n2. TOKEN ATTIVITÀ: Premia i successi! Personalizza il gettone e il traguardo. Puoi gestire un archivio di immagini per i premi e cancellare quelle che non servono più.\n\n3. PULSANTIERA: Divisa in Scelte, Bisogni e Sentimenti. Include archivi per 'Cosa desidero fare', 'Con chi?' e 'Dove?'. La barra gialla e i pallini mostrano visivamente quanto tempo manca alla fine.\n\n4. DIARIO DEL GIORNO: Documenta la giornata con foto e commenti. L'IA può aiutarti a descrivere le attività e puoi tradurre i testi in arabo per favorire la comunicazione con la famiglia.",
    progettoVitaContent:
      "Il Progetto di Vita (L. 328/00) è un documento che accompagna il PEI, ma ha una visione più ampia: riguarda il futuro dell'alunno oltre la scuola. Serve a definire obiettivi di autonomia, inclusione sociale e lavorativa.\n\nNormativa: Il D.Lgs 66/2017 e il D.I. 182/2020 definiscono le modalità di redazione del PEI su base ICF, integrando il Progetto di Vita come orizzonte di senso per ogni intervento educativo.\n\nA cosa serve per l'alunno: Serve a costruire un percorso che rispetti i suoi desideri, le sue passioni e che lo prepari a essere un cittadino attivo e indipendente.",
    caaTitle: "Cos'è la CAA?",
    caaContent:
      "La CAA (Comunicazione Aumentativa Alternativa) è un insieme di strumenti e strategie che aiutano chi ha difficoltà a parlare o capire il linguaggio. Si usano immagini (simboli) per esprimere bisogni, desideri e pensieri.\n\nEsempio: Usare l'immagine di un libro per dire 'voglio leggere' o l'immagine di una sedia per dire 'voglio sedermi'.",
    peiExplanationContent:
      "Il PEI (Piano Educativo Individualizzato) è il documento che descrive il percorso scolastico personalizzato per l'alunno. Serve a garantire che ogni studente riceva il supporto di cui ha bisogno per imparare e stare bene a scuola insieme agli altri.",
    save: "Salva Bozza",
    next: "Avanti",
    prev: "Indietro",
    complete: "Completa",
    helpTitle: "Aiuto Linguistico",
    helpDesc:
      "Hai dubbi su un termine? Clicca sull'icona info per una spiegazione semplice.",
    whatIsPei: "Cos'è il PEI?",
    studentName: "Nome Alunno",
    birthDate: "Data di Nascita",
    originCountry: "Paese di Origine",
    languages: "Lingue parlate in famiglia",
    schoolHistory: "Percorso Scolastico",
    schoolLevels: {
      infanzia: "Scuola dell'Infanzia",
      primaria: "Scuola Primaria",
      media: "Scuola Secondaria di 1° Grado",
      superiore: "Scuola Secondaria di 2° Grado",
    },
    schoolHistoryPlaceholder: "Nome della scuola...",
    schoolYearsPlaceholder: "Anni (es. 2020-2023)",
    freeTime: "Tempo Libero",
    freeTimePlaceholder:
      "Cosa fa l'alunno nel tempo libero? (sport, hobby, amici...)",
    strengths: "Punti di Forza",
    needs: "Bisogni e Difficoltà",
    strengthsPlaceholder: "Cosa piace fare all'alunno?",
    needsPlaceholder: "In quali attività ha bisogno di aiuto?",
    communication: "Comunicazione",
    autonomy: "Autonomia",
    learning: "Apprendimenti",
    relation: "Relazione",
    communicationPlaceholder: "Come comunica l'alunno?",
    autonomyPlaceholder: "Cosa sa fare da solo?",
    learningPlaceholder: "Come apprende nuove cose?",
    relationPlaceholder: "Come si relaziona con gli altri?",
    predefinedTitle: "Suggerimenti (clicca per aggiungere):",
    deaf: "L'alunno è sordo",
    blind: "L'alunno è cieco",
    studentRole: {
      title: "Alunno",
      description: "Esprimiti e comunica i tuoi bisogni attraverso i simboli.",
    },
    school: {
      welcome: "Benvenuto Cdc",
      humanities: "Area Umanistica",
      humanitiesDesc: "Italiano, Storia, Geografia",
      scientific: "Area Scientifico-Tecnologica",
      scientificDesc: "Matematica, Scienze, Tecnologia",
      foreignLanguages: "Lingue Straniere",
      foreignLanguagesDesc: "Inglese, Spagnolo",
      artsMusicSports: "Area Artistica/Musicale/Motoria",
      artsMusicSportsDesc: "Arte e immagine, Musica, Scienze motorie",
      civics: "Insegnamenti trasversali",
      civicsDesc: "Educazione Civica, Alternativa alla religione ed L1/L2",
      educationalSupport: "Educativa Scolastica",
      educationalSupportDesc: "Supporto educativo e assistenza all'autonomia",
      placeholder:
        "Inserisci qui le osservazioni e gli obiettivi per quest'area...",
    },
    genogram: {
      title: "Storia della Famiglia",
      desc: "Trascina i membri per spostarli. I legami sono automatici.",
      addMember: "Aggiungi Parente",
      details: "Dettagli Membro",
      name: "Nome e Cognome",
      relation: "Relazione",
      age: "Età",
      job: "Lavoro",
      gender: "Genere",
      male: "Uomo",
      female: "Donna",
      other: "Altro",
      uploadPhoto: "Carica Foto",
      placeholderSelect: "Seleziona Parente",
      emptyState: "Seleziona un membro nel grafico per modificarne i dettagli.",
      relations: {
        student: "Alunno/a",
        mother: "Madre",
        father: "Padre",
        sister: "Sorella",
        brother: "Fratello",
        gmother_m: "Nonna Materna",
        gfather_m: "Nonno Materno",
        gmother_p: "Nonna Paterna",
        gfather_p: "Nonno Paterno",
        uncle: "Zio",
        aunt: "Zia",
        cousin: "Cugino/a",
      },
    },
    sections: [
      {
        id: "info_history",
        title: "Storia Alunno",
        description:
          "Informazioni base, percorso scolastico, bisogni e risorse",
        rules: [
          "Inserisci i dati anagrafici corretti",
          "Specifica le scuole frequentate in ordine",
          "Indica i punti di forza e i bisogni generali",
        ],
        color: "bg-blue-600",
        lightColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        image: "/alunno.png",
      },
      {
        id: "family",
        title: "Storia della Famiglia",
        description: "Mappa delle parentele e famiglia",
        rules: [
          "Aggiungi i membri principali della famiglia",
          "I legami si creano automaticamente",
          "Puoi caricare le foto dei familiari",
        ],
        color: "bg-blue-600",
        lightColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
        image: "/famiglia.png",
      },
      {
        id: "needs_strengths",
        title: "Bisogni e Risorse",
        description: "Comunicazione, autonomia, apprendimenti e relazione",
        rules: [
          "Descrivi come comunica l'alunno",
          "Indica il livello di autonomia",
          "Specifica come apprende e si relaziona",
        ],
        color: "bg-emerald-600",
        lightColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-blue-600",
        image: "/imparare.png",
      },
      {
        id: "daily_diary",
        title: "Diario del giorno",
        description: "Scrivi come sta oggi l'alunno e aggiorna il termometro",
        rules: [
          "Racconta l'andamento della giornata dell'alunno",
          "Seleziona il livello di agitazione sul termometro emotivo",
        ],
        color: "bg-purple-600",
        lightColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        image: "/sentimenti.png",
      },
    ],
  },
  ar: {
    title: "my/our PEI",
    subtitle: "المشاركة النشطة بين المدرسة والأسرة",
    welcome: "my/our PEI",
    choose: "اختر من أي جهة نبدأ بإخبارنا عنكم",
    appRules: "قواعد التطبيق",
    peiExplanation: "ما هو PEI؟",
    appRulesContent:
      "مرحباً بكم في myPEI! إليكم كيفية استخدام التطبيق:\n1. اختر قسماً من الصفحة الرئيسية.\n2. املأ الحقول المطلوبة (يمكنك استخدام مساعدة الذكاء الاصطناعي للمصطلحات الصعبة).\n3. احفظ المسودة حتى لا تفقد البيانات.\n4. أكمل جميع الأقسام للحصول على صورة كاملة.",
    caaTitle: "ما هو CAA؟",
    caaContent:
      "CAA (التواصل المعزز والبديل) هو مجموعة من الأدوات والاستراتيجيات التي تساعد من يجدون صعوبة في التحدث أو فهم اللغة. تُستخدم الصور للتعبير عن الاحتياجات والرغبات والأفكار.\n\nمثال: استخدام صورة كتاب لقول 'أريد أن أقرأ'.",
    peiExplanationContent:
      "PEI (خطة تعليمية فردية) هي الوثيقة التي تصف المسار المدرسي المخصص للطالب. تهدف لضمان حصول كل طالب على الدعم اللازم للتعلم والعيش بشكل جيد مع الآخرين.",
    save: "حفظ المسودة",
    next: "التالي",
    prev: "السابق",
    complete: "إكمال",
    helpTitle: "مساعدة لغوية",
    helpDesc: "هل لديك شكوك حول مصطلح ما؟ انقر على أيقونة المعلومات لشرح بسيط.",
    whatIsPei: "ما هو PEI؟",
    studentName: "اسم الطالب",
    birthDate: "تاريخ الميلاد",
    originCountry: "بلد الأصل",
    languages: "اللغات المستخدمة في العائلة",
    schoolHistory: "المسار المدرسي",
    schoolLevels: {
      infanzia: "روضة الأطفال",
      primaria: "المدرسة الابتدائية",
      media: "المدرسة الإعدادية",
      superiore: "المدرسة الثانوية",
    },
    schoolHistoryPlaceholder: "اسم المدرسة...",
    schoolYearsPlaceholder: "السنوات (مثلاً 2020-2023)",
    freeTime: "وقت الفراغ",
    freeTimePlaceholder: "ماذا يفعل الطالب في وقت فراغه؟",
    strengths: "نقاط القوة",
    needs: "الاحتياجات والصعوبات",
    strengthsPlaceholder: "ماذا يحب الطالب أن يفعل؟",
    needsPlaceholder: "في أي أنشطة يحتاج مساعدة؟",
    communication: "التواصل",
    autonomy: "الاستقلالية",
    learning: "التعلم",
    relation: "العلاقة",
    deaf: "الطالب أصم",
    blind: "الطالب كفيف",
    studentRole: {
      title: "الطالب",
      description: "عبر عن نفسك وتواصل باحتياجاتك من خلال الرموز.",
    },
    school: {
      welcome: "مرحباً Cdc",
      humanities: "المجال الإنساني",
      scientific: "المجال العلمي التكنولوجي",
      foreignLanguages: "اللغات الأجنبية",
      artsMusicSports: "المجال الفني/الموسيقي/الحركي",
      civics: "التعليم التفاعلي",
      educationalSupport: "الدعم التعليمي",
      placeholder: "أدخل هنا الملاحظات والأهداف لهذا المجال...",
    },
    genogram: {
      title: "تاريخ العائلة",
      details: "تفاصيل العضو",
      name: "الاسم واللقب",
      relation: "العلاقة",
      age: "العمر",
      relations: {
        student: "الطالب/ة",
        mother: "الأم",
        father: "الأب",
        sister: "أخت",
        brother: "أخ",
      },
    },
    sections: [
      {
        id: "info_history",
        title: "تاريخ الطالب",
        description: "المعلومات الأساسية والمسار المدرسي",
        color: "bg-blue-600",
        textColor: "text-blue-600",
        image: "/alunno.png",
      },
      {
        id: "family",
        title: "تاريخ العائلة",
        description: "خريطة القرابة والعائلة",
        color: "bg-blue-600",
        textColor: "text-blue-600",
        image: "/famiglia.png",
      },
      {
        id: "needs_strengths",
        title: "الاحتياجات والموارد",
        description: "التواصل والاستقلالية والتعلم",
        color: "bg-emerald-600",
        textColor: "text-blue-600",
        image: "/imparare.png",
      },
      {
        id: "daily_diary",
        title: "يوميات اليوم",
        description: "اكتب كيف يشعر الطالب اليوم وحدّث مقياس الحرارة",
        rules: [],
        color: "bg-purple-600",
        lightColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        image: "/sentimenti.png",
      },
    ],
  },
  es: {
    title: "my/our PEI",
    subtitle: "",
    welcome: "my/our PEI",
    choose: "elige por dónde empezar a contarnos sobre ti",
    appRules: "Reglas de la App",
    peiExplanation: "¿Qué es el PEI?",
    appRulesContent:
      "¡Bienvenidos a myPEI! Así se usa la app:\n1. Elige una sección en la home.\n2. Completa los campos (usa la IA para términos difíciles).\n3. Guarda para no perder datos.\n4. Completa todo para tener el cuadro completo.",
    caaTitle: "¿Qué es la CAA?",
    caaContent:
      "La CAA (Comunicación Aumentativa y Alternativa) es un conjunto de herramientas y estrategias para quienes tienen dificultad al hablar o entender. Se usan imágenes para expresar necesidades.",
    peiExplanationContent:
      "El PEI es el documento que describe el camino escolar personalizado para el alumno.",
    save: "Guardar",
    next: "Siguiente",
    prev: "Atrás",
    complete: "Completar",
    helpTitle: "Ayuda Lingüística",
    helpDesc: "¿Dudas con un término? Clic en el icono info.",
    whatIsPei: "¿Qué es el PEI?",
    studentName: "Nombre del Alumno",
    birthDate: "Fecha de Nacimiento",
    originCountry: "País de Origen",
    languages: "Idiomas en familia",
    schoolHistory: "Trayectoria Escolar",
    schoolLevels: {
      infanzia: "Escuela Infantil",
      primaria: "Escuela Primaria",
      media: "Educación Secundaria Inferior",
      superiore: "Educación Secundaria Superior",
    },
    freeTime: "Tiempo Libre",
    strengths: "Fortalezas",
    needs: "Necesidades",
    communication: "Comunicación",
    autonomy: "Autonomía",
    learning: "Aprendizaje",
    relation: "Relación",
    deaf: "El alumno es sordo",
    blind: "El alumno es ciego",
    studentRole: {
      title: "Alumno",
      description:
        "Exprésate y comunica tus necesidades a través de los símbolos.",
    },
    school: {
      welcome: "Bienvenido Cdc",
      humanities: "Área de Humanidades",
      scientific: "Área Científico-Tecnológica",
      foreignLanguages: "Lenguas Extranjeras",
      artsMusicSports: "Área de Arte/Música/Deporte",
      civics: "Educación Cívica",
      educationalSupport: "Apoyo Educativo",
      placeholder: "Inserte aquí observaciones y objetivos...",
    },
    genogram: {
      title: "Historia Familiar",
      details: "Detalles del Miembro",
      name: "Nombre y Apellido",
      relation: "Relación",
      age: "Edad",
      relations: {
        student: "Alumno/a",
        mother: "Madre",
        father: "Padre",
        sister: "Hermana",
        brother: "Hermano",
      },
    },
    sections: [
      {
        id: "info_history",
        title: "Historia Alumno",
        description: "Información base y trayectoria",
        color: "bg-blue-600",
        textColor: "text-blue-600",
        image: "/alunno.png",
      },
      {
        id: "family",
        title: "Historia Familiar",
        description: "Mapa de parentesco",
        color: "bg-blue-600",
        textColor: "text-blue-600",
        image: "/famiglia.png",
      },
      {
        id: "needs_strengths",
        title: "Necesidades y Recursos",
        description: "Comunicación y autonomía",
        color: "bg-emerald-600",
        textColor: "text-blue-600",
        image: "/imparare.png",
      },
      {
        id: "daily_diary",
        title: "Diario del día",
        description: "Escribe cómo está el alumno hoy y actualiza el termómetro",
        rules: [],
        color: "bg-purple-600",
        lightColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-600",
        image: "/sentimenti.png",
      },
    ],
  },
};

const predefinedStrengths = [
  "Autonomia",
  "Socializzazione",
  "Comunicazione",
  "Memoria",
  "Creatività",
  "Sport",
  "Musica",
  "Disegno",
  "Matematica",
  "Lingue",
];

const predefinedNeeds = [
  "Comprensione linguistica",
  "Scrittura",
  "Lettura",
  "Interazione con i pari",
  "Rispetto delle regole",
  "Concentrazione",
  "Gestione delle emozioni",
];

const CAA_CATEGORIES = [
  {
    id: "casa",
    title: "CASA",
    items: [
      { id: "stare_seduto", label: "Stare seduto", img: "/stare seduto.png" },
      {
        id: "dormire",
        label: "Dormire",
        img: "https://picsum.photos/seed/sleep/200",
      },
      {
        id: "lavarsi",
        label: "Lavarsi",
        img: "https://picsum.photos/seed/wash/200",
      },
      {
        id: "vestirsi",
        label: "Vestirsi",
        img: "https://picsum.photos/seed/dress/200",
      },
    ],
  },
  {
    id: "cibo",
    title: "CIBO",
    items: [
      {
        id: "mangiare",
        label: "Mangiare",
        img: "https://picsum.photos/seed/eat/200",
      },
      {
        id: "bere",
        label: "Bere",
        img: "https://picsum.photos/seed/drink/200",
      },
      {
        id: "apparecchiare",
        label: "Apparecchiare",
        img: "https://picsum.photos/seed/table/200",
      },
    ],
  },
  {
    id: "sport",
    title: "SPORT",
    items: [
      {
        id: "correre",
        label: "Correre",
        img: "https://picsum.photos/seed/run/200",
      },
      {
        id: "giocare_palla",
        label: "Giocare a palla",
        img: "https://picsum.photos/seed/ball/200",
      },
      {
        id: "nuotare",
        label: "Nuotare",
        img: "https://picsum.photos/seed/swim/200",
      },
    ],
  },
];

const HandwritingMyPEI = () => {
  const [phase, setPhase] = useState<"my" | "our">("my");

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev === "my" ? "our" : "my"));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center min-h-[160px] w-full">
      <div className="relative flex items-center gap-2">
        <div className="relative flex items-end">
          <div className="relative w-[120px] md:w-[180px] flex justify-end">
            <AnimatePresence mode="wait">
              {phase === "my" ? (
                <motion.span
                  key="my"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="font-sans font-black text-white text-6xl md:text-8xl leading-none"
                >
                  my
                </motion.span>
              ) : (
                <motion.span
                  key="our"
                  initial={{ opacity: 0, x: -20, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8, rotate: 5 }}
                  transition={{ duration: 0.5 }}
                  className="font-cursive italic text-yellow-400 text-7xl md:text-9xl leading-none px-2"
                >
                  our
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <span className="font-sans font-black text-white text-6xl md:text-8xl mb-[5px] mx-1">
            /
          </span>
          <span className="font-sans font-black text-white text-6xl md:text-8xl leading-none">
            PEI
          </span>
        </div>
      </div>
    </div>
  );
};

const defaultTaskAnalysis: Record<string, { id: string, text: string, done?: boolean }[]> = {
  bagno: [
    { id: "b1", text: "Entrare in bagno e accendere la luce", done: false },
    { id: "b2", text: "Abbassare i pantaloni e le mutandine", done: false },
    { id: "b3", text: "Sedersi sulla tazza del WC", done: false },
    { id: "b4", text: "Prendere la carta igienica e pulirsi", done: false },
    { id: "b5", text: "Tirarsi su le mutandine e i pantaloni", done: false },
    { id: "b6", text: "Premere il pulsante dello scarico", done: false },
    { id: "b7", text: "Lavarsi le mani con acqua e sapone e asciugarle", done: false }
  ],
  acqua: [
    { id: "w1", text: "Prendere il bicchiere dallo scaffale", done: false },
    { id: "w2", text: "Prendere la bottiglia o aprire il rubinetto", done: false },
    { id: "w3", text: "Riempire il bicchiere fino a metà", done: false },
    { id: "w4", text: "Mettere giù la bottiglia o chiudere il rubinetto", done: false },
    { id: "w5", text: "Bere l'acqua con calma", done: false },
    { id: "w6", text: "Riporre il bicchiere", done: false }
  ],
  cibo: [
    { id: "f1", text: "Chiedere il pacchetto di biscotti", done: false },
    { id: "f2", text: "Prendere la scatola / pacchetto di biscotti", done: false },
    { id: "f3", text: "Aprire delicatamente la confezione", done: false },
    { id: "f4", text: "Prendere un biscotto senza romperlo", done: false },
    { id: "f5", text: "Mangiare il biscotto seduti al tavolo", done: false },
    { id: "f6", text: "Raccogliere le briciole e buttare la carta", done: false }
  ],
  riposo: [
    { id: "r1", text: "Prendere il materassino pieghevole", done: false },
    { id: "r2", text: "Stenderlo dritto sul pavimento nell'area relax", done: false },
    { id: "r3", text: "Togliere le scarpe e sedersi sul materassino", done: false },
    { id: "r4", text: "Sdraiarsi e chiudere gli occhi per rilassarsi", done: false },
    { id: "r5", text: "Ascoltare la musica o la respirazione guidata", done: false },
    { id: "r6", text: "Alzarsi, infilare le scarpe e ripiegare il materassino", done: false }
  ]
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [role, setRole] = useState<
    "family" | "school" | "school-family" | "student" | null
  >(null);
  const [activeNeedTaskAnalysis, setActiveNeedTaskAnalysis] = useState<string | null>(null);
  const [newTaskStep, setNewTaskStep] = useState<string>("");
  const [studentSubSection, setStudentSubSection] = useState<
    | "day"
    | "diary"
    | "passport"
    | "scelte"
    | "bisogni"
    | "sentimenti"
    | "autonomy"
    | "relax"
    | "progetto_vita"
    | "didactic_observation"
    | null
  >(null);
  const [choiceSubTab, setChoiceSubTab] = useState<
    "decision" | "needs" | "feelings"
  >("decision");
  const [dayTab, setDayTab] = useState<"agenda" | "tokens" | "diary">("agenda");
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [showActivityArchive, setShowActivityArchive] = useState(false);
  const [showWhomArchive, setShowWhomArchive] = useState(false);
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);
  const [lang, setLang] = useState<Language>("it");
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [activeInstructionsModal, setActiveInstructionsModal] = useState<
    "strengths" | "needs" | "progetto_vita" | null
  >(null);
  const [activeClassTab, setActiveClassTab] = useState<1 | 2 | 3>(1);
  const [activeRelaxTool, setActiveRelaxTool] = useState<
    "bubbles" | "stressball" | "memory" | null
  >(null);
  const [data, setData] = useState<PEIData>(() => {
    const defaultData: PEIData = {
      studentName: "",
      classTeachers: [
        { id: "1", name: "Prof.ssa Bianchi", subject: "Italiano", status: "in_corso" },
        { id: "2", name: "Prof. Rossi", subject: "Matematica", status: "da_iniziare" },
        { id: "3", name: "Prof.ssa Neri", subject: "Scienze e Tecnologia", status: "in_corso" },
        { id: "4", name: "Prof. Viola", subject: "Lingua Inglese", status: "pronto" },
        { id: "5", name: "Prof. Verdi", subject: "Scienze Motorie", status: "pronto" },
        { id: "6", name: "Prof.ssa Gialli", subject: "Arte e Musica", status: "da_iniziare" },
        { id: "7", name: "Prof. Marrone", subject: "Insegnante di Sostegno", status: "in_corso" }
      ],
      gloDeadlines: [
        { id: "d1", title: "Approvazione Iniziale del PEI", month: "Ottobre", status: "completato", dueDate: "31 Ottobre" },
        { id: "d2", title: "Verifica Intermedia del PEI", month: "Gennaio", status: "completato", dueDate: "31 Gennaio" },
        { id: "d3", title: "Verifica Finale del PEI e Proposte GLO", month: "Giugno", status: "in_corso", dueDate: "30 Giugno" }
      ],
      didacticObservations: [],
      schoolAppointments: [
        { id: "a1", title: "GLO Approvazione del PEI d'Istituto", date: "2026-10-15", time: "16:30", type: "GLO", notes: "Discussione e firma del PEI con i docenti contitolari, la famiglia e gli specialisti." },
        { id: "a2", title: "Consiglio di Classe Straordinario", date: "2026-11-20", time: "15:00", type: "Consiglio", notes: "Verifica adattamento programmazione d'aula coordinato." }
      ],
      schoolDocuments: [
        { id: "doc1", name: "Modello_PEI_Ministeriale_Licei.pdf", uploadedAt: "2026-05-20", size: "1.4 MB", fileType: "pdf", category: "PEI" },
        { id: "doc2", name: "Verbale_GLO_Iniziale_Sottoscritto.pdf", uploadedAt: "2026-05-22", size: "640 KB", fileType: "pdf", category: "Verbale" }
      ],
      birthDate: "",
      originCountry: "",
      languagesSpoken: [],
      familyMembers: [],
      relationships: [],
      schoolHistory: {
        infanzia: "",
        primaria: "",
        media: "",
        superiore: "",
      },
      schoolYears: {
        infanzia: "",
        primaria: "",
        media: "",
        superiore: "",
      },
      freeTime: "",
      strengths: "",
      needs: "",
      communication: "",
      autonomy: "",
      learning: "",
      relation: "",
      lis: null,
      braille: null,
      isDeaf: null,
      isBlind: null,
      schoolAreas: {
        humanities: "",
        scientific: "",
        foreignLanguages: "",
        artsMusicSports: "",
        civics: "",
        educationalSupport: "",
      },
      schoolDisciplineDetails: {},
      didacticGeneralObservations: {},
      schoolObservations: {
        humanities: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
        scientific: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
        foreignLanguages: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
        artsMusicSports: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
        civics: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
        educationalSupport: {
          autonomia_igiene: null,
          autonomia_spazi: null,
          autonomia_aiuto: null,
          autonomia_materiale: null,
          comunicazione_bisogni: null,
          comunicazione_consegne: null,
          comunicazione_caa: null,
          relazionale_comportamento: null,
          relazionale_regole: null,
          relazionale_contatto: null,
          cognitiva_attenzione: null,
          cognitiva_concentrazione: null,
          cognitiva_base: null,
          emotiva_emozioni: null,
          emotiva_frustrazione: null,
          emotiva_motivazione: null,
          emotiva_stereotipie: null,
        },
      },
      agendaImages: Array(6).fill(null),
      agendaWithWhomImages: Array(6).fill(null),
      agendaHours: Array(6).fill(null),
      agendaHourColors: Array(6).fill("blue"),
      agendaActivityArchive: [
        "/leggere.png",
        "/imparare.png",
        "/matita.png",
        "/tablet.png",
        "/biscotti.png",
        "/costruzioni.png",
      ],
      agendaWhomArchive: [
        "/studente.png",
        "/famiglia.png",
        "/chi.png",
        "/alunno.png",
      ],
      agendaDurations: Array(6).fill(0),
      agendaDay: "Lunedì",
      agendaWeather: "Sereno",
      agendaProgress: 0,
      tokenSymbol: null,
      tokenArchive: ["/premio.png", "/biscotti.png", "/tablet.png"],
      tokenRewardImage: null,
      tokenRewardOptions: [],
      agendaObjectives: [],
      choiceImages: Array(4).fill(null),
      choiceArchivio: [
        "/leggere.png",
        "/imparare.png",
        "/tablet.png",
        "/biscotti.png",
        "/costruzioni.png",
      ],
      selectedChoiceIndex: null,
      choiceMood: null,
      removedChoices: [],
      choiceDuration: 0,
      choiceLocation: "",
      choiceLocationArchive: ["/casa.png", "/inizio.png"],
      choiceWithWhom: "",
      choiceWithWhomArchive: ["/famiglia.png", "/chi.png", "/alunno.png"],
      tokenStepsCount: 6,
      tokenStepsStatus: Array(6).fill(false),
      autonomyDiary: [
        {
          id: "a1",
          name: "Igiene Personale",
          activities: [],
          color: "bg-blue-400",
        },
        {
          id: "a2",
          name: "Vestizione",
          activities: [],
          color: "bg-emerald-400",
        },
        {
          id: "a3",
          name: "Alimentazione",
          activities: [],
          color: "bg-orange-400",
        },
      ],
      relaxArea: [],
      needsChoices: [
        {
          id: "bagno",
          label: "Bagno",
          img: "/bagno.png",
        },
        {
          id: "acqua",
          label: "Acqua",
          img: "/bicchiere d'acqua.png",
        },
        {
          id: "cibo",
          label: "Cibo",
          img: "/biscotti.png",
        },
        {
          id: "riposo",
          label: "Riposo",
          img: "/materassino.png",
        },
      ],
      feelingsChoices: [
        {
          id: "felice",
          label: "Felice",
          img: "https://img.icons8.com/color/144/happy.png",
        },
        {
          id: "triste",
          label: "Triste",
          img: "https://img.icons8.com/color/144/sad.png",
        },
        {
          id: "arrabbiato",
          label: "Arrabbiato",
          img: "https://img.icons8.com/color/144/angry.png",
        },
        {
          id: "stanco",
          label: "Stanco",
          img: "https://img.icons8.com/color/144/tired.png",
        },
      ],
      passport: {
        photo: null,
        name: "",
        surname: "",
        birthDate: "",
        birthPlace: "",
        residence: "",
        likes: [],
        dislikes: [],
        strengths: [],
        uniqueness: "",
        youtubeLinks: [],
      },
      schoolDiary: [
        { id: "1", name: "Italiano", activities: [], color: "bg-rose-500" },
        { id: "2", name: "Matematica", activities: [], color: "bg-blue-500" },
        { id: "3", name: "Scienze", activities: [], color: "bg-emerald-500" },
        { id: "4", name: "Arte", activities: [], color: "bg-amber-500" },
      ],
      dailyDiary: [],
      strengthsPhotos: [],
      familyObjectives1: "",
      familyObjectives2: "",
      familyObjectives3: "",
      communication1: "",
      communication2: "",
      communication3: "",
      autonomy1: "",
      autonomy2: "",
      autonomy3: "",
      learning1: "",
      learning2: "",
      learning3: "",
      relation1: "",
      relation2: "",
      relation3: "",
    };

    const saved = localStorage.getItem("mypei_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force reset humanities observations if they were modified (requested)
        if (parsed.schoolObservations && parsed.schoolObservations.humanities) {
          parsed.schoolObservations.humanities =
            defaultData.schoolObservations.humanities;
        }
        // Force reset LIS and Braille (requested)
        parsed.lis = null;
        parsed.braille = null;

        // Migration for likes/dislikes (string[] -> object[])
        if (parsed.passport) {
          if (
            parsed.passport.likes &&
            parsed.passport.likes.length > 0 &&
            typeof parsed.passport.likes[0] === "string"
          ) {
            parsed.passport.likes = parsed.passport.likes.map((l: string) => ({
              type: "text",
              content: l,
            }));
          }
          if (
            parsed.passport.dislikes &&
            parsed.passport.dislikes.length > 0 &&
            typeof parsed.passport.dislikes[0] === "string"
          ) {
            parsed.passport.dislikes = parsed.passport.dislikes.map(
              (d: string) => ({ type: "text", content: d }),
            );
          }
          if (!parsed.passport.youtubeLinks) {
            parsed.passport.youtubeLinks = [];
          }
        }

        if (parsed.communication && !parsed.communication1)
          parsed.communication1 = parsed.communication;
        if (parsed.autonomy && !parsed.autonomy1)
          parsed.autonomy1 = parsed.autonomy;
        if (parsed.learning && !parsed.learning1)
          parsed.learning1 = parsed.learning;
        if (parsed.relation && !parsed.relation1)
          parsed.relation1 = parsed.relation;

        // Deep merge
        return {
          ...defaultData,
          ...parsed,
          passport: { ...defaultData.passport, ...(parsed.passport || {}) },
          schoolDiary: parsed.schoolDiary || defaultData.schoolDiary,
          classTeachers: parsed.classTeachers || defaultData.classTeachers,
          gloDeadlines: parsed.gloDeadlines || defaultData.gloDeadlines,
          didacticObservations: parsed.didacticObservations || defaultData.didacticObservations,
          schoolAppointments: parsed.schoolAppointments || defaultData.schoolAppointments || [],
          schoolDocuments: parsed.schoolDocuments || defaultData.schoolDocuments || [],
          schoolHistory: {
            ...defaultData.schoolHistory,
            ...(parsed.schoolHistory || {}),
          },
          schoolYears: {
            ...defaultData.schoolYears,
            ...(parsed.schoolYears || {}),
          },
          schoolAreas: {
            ...defaultData.schoolAreas,
            ...(parsed.schoolAreas || {}),
          },
          schoolDisciplineDetails: parsed.schoolDisciplineDetails || defaultData.schoolDisciplineDetails || {},
          didacticGeneralObservations: parsed.didacticGeneralObservations || defaultData.didacticGeneralObservations || {},
          schoolObservations: {
            ...defaultData.schoolObservations,
            ...(parsed.schoolObservations || {}),
          },
          communication1: parsed.communication1 || parsed.communication || "",
          autonomy1: parsed.autonomy1 || parsed.autonomy || "",
          learning1: parsed.learning1 || parsed.learning || "",
          relation1: parsed.relation1 || parsed.relation || "",
          communication2: parsed.communication2 || "",
          autonomy2: parsed.autonomy2 || "",
          learning2: parsed.learning2 || "",
          relation2: parsed.relation2 || "",
          communication3: parsed.communication3 || "",
          autonomy3: parsed.autonomy3 || "",
          learning3: parsed.learning3 || "",
          relation3: parsed.relation3 || "",
        };
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return defaultData;
  });

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [amirFeeling, setAmirFeeling] = useState<"calmo" | "agitato" | "sovraccaricato">("calmo");
  const [pulsantieraTab, setPulsantieraTab] = useState<"scelte" | "bisogni">("scelte");
  const [passportTab, setPassportTab] = useState<"passport" | "autonomy">("passport");

  const changeAmirFeeling = (feeling: "calmo" | "agitato" | "sovraccaricato") => {
    setAmirFeeling(feeling);
    setData((prev) => {
      const updated = { ...prev, amirFeeling: feeling };
      localStorage.setItem("mypei_data", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (data && data.amirFeeling && data.amirFeeling !== amirFeeling) {
      setAmirFeeling(data.amirFeeling);
    }
  }, [data?.amirFeeling]);

  const [isExplaining, setIsExplaining] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [activeSchoolArea, setActiveSchoolArea] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAgendaTips, setShowAgendaTips] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [isRewardSelectionOpen, setIsRewardSelectionOpen] = useState(false);

  const t = translations[lang];
  const steps = t.sections;

  const saveToLocalStorage = (newData?: PEIData) => {
    localStorage.setItem("mypei_data", JSON.stringify(newData || data));
    console.log("Data saved automatically");
  };

  const downloadDiaryEntry = (entry: any) => {
    let htmlContent =
      `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Diario Giornaliero - ` +
      entry.date +
      `</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 2rem; max-width: 800px; margin: 0 auto; }
    .card { background: white; border-radius: 1.5rem; padding: 2.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
    .date { font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem; border-bottom: 2px solid #eff6ff; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    h1 { margin-top: 0; color: #0f172a; font-size: 2rem; font-weight: 900; }
    .image-container { margin: 1.5rem 0; text-align: center; border-radius: 1rem; overflow: hidden; max-height: 500px; background: #f1f5f9; border: 1.5px solid #e2e8f0; }
    .image-container img { max-width: 100%; max-height: 500px; object-fit: contain; }
    .section-title { font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    .comment-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 1.25rem; font-size: 1.1rem; line-height: 1.6; border-radius: 0.5rem; font-weight: 600; color: #334155; white-space: pre-wrap; }
    .translation-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 1.25rem; border-radius: 0.5rem; text-align: right; font-size: 1.5rem; font-weight: bold; direction: rtl; }
    .ai-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1.25rem; border-radius: 0.5rem; font-style: italic; color: #1e40af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="date">Diario Giornaliero &bull; ` +
      entry.date +
      `</div>
    <h1>Il mio resoconto</h1>`;

    if (entry.photo) {
      htmlContent +=
        `
    <div class="image-container">
      <img src="` +
        entry.photo +
        `" alt="Foto del diario" />
    </div>`;
    }

    const commentVal = entry.comment || "<i>Nessun commento scritto</i>";
    htmlContent +=
      `
    <div class="section-title">Commento dell'alunno</div>
    <div class="comment-box">` +
      commentVal +
      `</div>`;

    if (entry.translatedComment) {
      htmlContent +=
        `
    <div class="section-title">Traduzione in Arabo</div>
    <div class="translation-box">` +
        entry.translatedComment +
        `</div>`;
    }

    if (entry.aiExplanation) {
      htmlContent +=
        `
    <div class="section-title">Assistente Educativo AI</div>
    <div class="ai-box">"` +
        entry.aiExplanation +
        `"</div>`;
    }

    htmlContent += `
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename =
      "diario-" + entry.date.replace(/\//g, "-") + "-" + entry.id + ".html";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const translateToArabic = async (text: string, index: number) => {
    if (!text) return;
    setIsTranslating(`diary-${index}`);
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Traduci in arabo il seguente testo, fornendo solo la traduzione: "${text}"`;
      const result = await model.generateContent(prompt);
      const translation = result.response.text().trim();

      const newDiary = [...data.dailyDiary];
      newDiary[index].translatedComment = translation;
      setData({ ...data, dailyDiary: newDiary });
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(null);
    }
  };

  const analyzePhotoWithAI = async (photoData: string, index: number) => {
    setIsAnalyzing(`diary-${index}`);
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Data = photoData.includes("base64,")
        ? photoData.split("base64,")[1]
        : photoData;

      const result = await model.generateContent([
        "Spiega cosa rappresenta questa foto per un diario scolastico, in modo semplice per la famiglia. Scrivi in italiano.",
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
      ]);

      const explanation = result.response.text().trim();
      const newDiary = [...data.dailyDiary];
      newDiary[index].aiExplanation = explanation;
      setData({ ...data, dailyDiary: newDiary });
    } catch (error) {
      console.error("AI analysis error:", error);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const downloadPassport = async () => {
    const element = document.getElementById("passport-card");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Passaporto_${data.passport.name || "Alunno"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleReset = () => {
    saveToLocalStorage();
    setCurrentStep(null);
    setRole(null);
    setIsStarted(false);
  };

  const handleNext = () => {
    saveToLocalStorage();
    if (currentStep !== null && currentStep < steps.length - 1)
      setCurrentStep(currentStep + 1);
    else setCurrentStep(null);
  };

  const handlePrev = () => {
    saveToLocalStorage();
    if (currentStep !== null && currentStep > 0)
      setCurrentStep(currentStep - 1);
    else setCurrentStep(null);
  };

  const explainTerm = async (term: string) => {
    setIsExplaining(true);
    setModalTitle(t.helpTitle);
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Spiega il termine "${term}" in modo molto semplice per una famiglia straniera in Italia. Lingua di risposta: ${lang === "it" ? "Italiano" : lang === "ar" ? "Arabo" : "Spagnolo"}. Sii empatico.`;
      const result = await model.generateContent(prompt);
      setAiExplanation(result.response.text());
    } catch (error) {
      setAiExplanation("Error");
    } finally {
      setIsExplaining(false);
    }
  };

  const showStaticModal = (title: string, content: string) => {
    setModalTitle(title);
    setAiExplanation(content);
  };

  const addPredefined = (field: "strengths" | "needs", value: string) => {
    const current = data[field];
    if (current.includes(value)) return;
    setData({
      ...data,
      [field]: current ? `${current}, ${value}` : value,
    });
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === "start-caa-game") {
        setIsGameActive(true);
        setGameStep(0);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const CAAGame = () => {
    const gameData = [
      { id: 1, type: "verbo", word: "LEGGERE", img: "/leggere.png" },
      { id: 2, type: "oggetto", word: "CASA", img: "/casa.png" },
      {
        id: 3,
        type: "animale",
        word: "GATTO",
        img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop",
      },
    ];

    const currentLevel = gameData[gameStep];
    const [isWrong, setIsWrong] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (id: number) => {
      setSelectedId(id);
      if (id === currentLevel.id) {
        if (gameStep < gameData.length - 1) {
          setTimeout(() => {
            setGameStep((prev) => prev + 1);
            setSelectedId(null);
          }, 600);
        } else {
          setTimeout(() => setIsFinished(true), 600);
        }
      } else {
        setIsWrong(true);
        setTimeout(() => {
          setIsWrong(false);
          setSelectedId(null);
        }, 500);
      }
    };

    if (isFinished) {
      return (
        <div className="flex flex-col items-center text-center space-y-6 py-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900">Bravissimo!</h3>
            <p className="text-slate-600">
              Hai capito come funzionano i simboli della CAA.
            </p>
          </div>
          <Button
            onClick={() => {
              setIsGameActive(false);
              setGameStep(0);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-bold mt-4"
          >
            Torna alla spiegazione
          </Button>
        </div>
      );
    }

    const options = [gameData[0], gameData[1], gameData[2]].sort(
      (a, b) => a.id - b.id,
    ); // Fixed order or shuffle? Shuffling is better.

    // We want to make sure the options are random
    const [shuffledOptions, setShuffledOptions] = useState(options);
    useEffect(() => {
      setShuffledOptions([...options].sort(() => Math.random() - 0.5));
    }, [gameStep]);

    return (
      <div className="space-y-8 flex flex-col items-center py-4">
        <div className="w-full flex justify-between items-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsGameActive(false);
              setAiExplanation(null);
            }}
            className="rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft size={16} className="mr-1" />{" "}
            {lang === "it" ? "Esci" : "Back"}
          </Button>
          <div className="text-center space-y-2 flex-1 mr-8">
            <Badge
              variant="outline"
              className="text-blue-600 bg-blue-50 border-blue-100"
            >
              Livello {gameStep + 1} di 3
            </Badge>
            <h3 className="text-2xl font-black text-slate-900">
              Associa la parola al simbolo
            </h3>
          </div>
        </div>

        <div className="text-4xl font-black text-blue-600 mt-2 tracking-widest uppercase bg-blue-50 py-3 px-8 rounded-2xl border-2 border-blue-100 inline-block">
          {currentLevel.word}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-md mx-auto">
          {shuffledOptions.map((opt) => (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "group relative bg-white p-6 rounded-[32px] border-4 transition-all shadow-xl",
                selectedId === opt.id
                  ? opt.id === currentLevel.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-rose-500 bg-rose-50 animate-shake"
                  : "border-slate-100",
              )}
            >
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-inner bg-slate-50 border border-slate-100">
                <img
                  src={opt.img}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 font-black text-slate-300 group-hover:text-blue-400 transition-colors">
                ???
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-sm text-slate-400 font-medium italic">
          Tocca l'immagine che corrisponde a "{currentLevel.word}"
        </p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-500 bg-[#0a192f]",
        lang === "ar" ? "font-sans" : "",
      )}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      {isStarted && (
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger
                  nativeButton={false}
                  render={
                    <div className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg transition-all group-hover:scale-110 overflow-hidden">
                        <img
                          src="/leggere.png"
                          alt="Logo"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h1 className="font-black text-2xl tracking-tighter text-white leading-none">
                          my/<span className="text-yellow-400 italic">our</span>
                          /PEI
                        </h1>
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-0.5 opacity-60">
                          Menu
                        </p>
                      </div>
                    </div>
                  }
                />
                <DropdownMenuContent
                  align="start"
                  className="w-64 mt-2 rounded-2xl p-2 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Opzioni App
                    </span>
                  </div>
                  <DropdownMenuItem
                    onClick={() =>
                      showStaticModal(t.peiExplanation, t.peiExplanationContent)
                    }
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Info size={18} />
                    </div>
                    <span className="font-bold text-slate-700">
                      {t.peiExplanation}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      showStaticModal(t.progettoVita, t.progettoVitaContent)
                    }
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Sparkles size={18} />
                    </div>
                    <span className="font-bold text-slate-700">
                      {t.progettoVita}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      showStaticModal(t.appRules, t.appRulesContent)
                    }
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <BookOpen size={18} />
                    </div>
                    <span className="font-bold text-slate-700">
                      {t.appRules}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRole("school-family")}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100">
                      <img
                        src="/parlare tutti insieme.png"
                        alt="Scuola-Famiglia"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="font-bold text-slate-700">
                      Scuola-Famiglia
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setRole(null);
                      setStudentSubSection(null);
                      setCurrentStep(null);
                    }}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50 text-blue-600"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Home size={18} />
                    </div>
                    <span className="font-bold">Torna alla Home</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(["it", "ar", "es"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as any)}
                  className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-black transition-all",
                    lang === l
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => saveToLocalStorage()}
              className={cn(
                "gap-2 text-white h-10 px-4 rounded-xl font-black text-xs transition-colors",
                currentStep !== null ? steps[currentStep].color : "bg-blue-600",
              )}
            >
              <Save size={16} /> {t.save}
            </Button>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.div
              key="splash-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-screen"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsStarted(true)}
                className="px-20 py-10 transition-all flex flex-col items-center gap-4"
              >
                <HandwritingMyPEI />
              </motion.button>
              <p className="mt-8 text-2xl text-blue-100/60 font-black animate-pulse">
                Tocca per iniziare
              </p>
            </motion.div>
          ) : role === null ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center min-h-[75vh] py-8 space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20"
            >
              <div className="text-center space-y-4 md:space-y-6 lg:space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white drop-shadow-sm tracking-tight text-center md:text-left">
                    my/<span className="text-yellow-400 italic">our</span>/PEI
                  </h2>
                </div>
                <div className="py-2 md:py-4 space-y-2 max-w-none md:max-w-4xl mx-auto px-4">
                  <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 font-medium lowercase tracking-wide text-center leading-relaxed whitespace-nowrap">
                    partecipazione attiva scuola-famiglia per l'alunno
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-blue-400 font-bold lowercase tracking-wider opacity-80">
                    scegli il tuo percorso
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-16 w-full max-w-6xl px-4 sm:px-8">
                {/* Famiglia */}
                <div className="flex flex-col items-center group">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                    Famiglia
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole("family")}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-blue-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                  >
                    <img
                      src="/casa.png"
                      alt="Famiglia"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    Raccontaci la storia e i bisogni dell'alunno dal tuo punto
                    di vista.
                  </p>
                </div>

                {/* Alunno */}
                <div className="flex flex-col items-center group">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                    {(t as any).studentRole.title}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole("student")}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-yellow-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                  >
                    <img
                      src="/studente.png"
                      alt="Alunno"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    {(t as any).studentRole.description}
                  </p>
                </div>

                {/* Scuola */}
                <div className="flex flex-col items-center group">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">
                    Scuola
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole("school")}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-emerald-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                  >
                    <img
                      src="/scuola secondaria.png"
                      alt="Scuola"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    Accedi alla sezione osservazione e monitoraggio scolastico.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : role === "student" ? (
            <motion.div
              key="student-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[80vh] flex flex-col items-center w-full"
            >
              {!studentSubSection ? (
                <>
                  <div className="w-full space-y-6 sm:space-y-12 bg-[#0a192f]/60 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[40px] md:rounded-[60px] shadow-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => setRole(null)}
                        className="rounded-2xl h-12 px-6 font-bold text-white hover:bg-white/20 border border-white/20"
                      >
                        <ChevronLeft size={20} className="mr-2" /> Torna
                      </Button>
                      <h2 className="text-4xl font-black text-white text-center flex-1">
                        Ciao! Scegli cosa vuoi fare:
                      </h2>
                      <div className="w-32"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full pb-8">
                      {[
                        {
                          id: "day",
                          title: "La mia giornata",
                          color: "bg-blue-500",
                          image: "/io.png",
                        },
                        {
                          id: "diary",
                          title: "Il mio zaino",
                          color: "bg-rose-500",
                          image: "/aprire lo zaino.png",
                        },
                        {
                          id: "passport",
                          title: "Passaporto comunicativo",
                          color: "bg-emerald-500",
                          image: "/parlare tutti insieme.png",
                        },
                        {
                          id: "pulsantiera",
                          title: "Pulsantiera",
                          color: "bg-amber-500",
                          image: "/pulsante.png",
                        },
                        {
                          id: "relax",
                          title: "Area relax",
                          color: "bg-indigo-500",
                          image: "/zona relax (1).png",
                        },
                        {
                          id: "progetto_vita",
                          title: "Il mio progetto di vita",
                          color: "bg-yellow-400",
                          image: "/stadi della vita.png",
                        },
                      ].map((sec) => (
                        <motion.button
                          key={sec.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (sec.id === "pulsantiera") {
                              setStudentSubSection("pulsantiera");
                              setPulsantieraTab("scelte");
                            } else if (sec.id === "passport") {
                              setStudentSubSection("passport");
                              setPassportTab("passport");
                            } else {
                              setStudentSubSection(sec.id as any);
                            }
                          }}
                          className="flex flex-col items-center gap-4 w-full group cursor-pointer text-left"
                        >
                          <div
                            className={cn(
                              "w-full aspect-[4/3] rounded-[40px] shadow-2xl border-4 relative overflow-hidden transition-all duration-300 flex items-center justify-center bg-white",
                              sec.id === "progetto_vita"
                                ? "bg-yellow-400/90 border-yellow-300 shadow-yellow-500/15"
                                : "",
                              sec.color === "bg-blue-500"
                                ? "border-blue-100"
                                : sec.color === "bg-rose-500"
                                  ? "border-rose-100"
                                  : sec.color === "bg-emerald-500"
                                    ? "border-emerald-100"
                                    : sec.color === "bg-yellow-500"
                                      ? "border-yellow-100"
                                      : sec.color === "bg-pink-500"
                                        ? "border-pink-100"
                                        : sec.color === "bg-purple-500"
                                          ? "border-purple-100"
                                          : sec.color === "bg-orange-500"
                                            ? "border-orange-100"
                                            : sec.id !== "progetto_vita"
                                              ? "border-indigo-100"
                                              : "",
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
                                {sec.id === "bisogni" ? "🎯" : "📝"}
                              </span>
                            )}
                          </div>
                          <h3
                            className={cn(
                              "text-xl font-black text-center uppercase tracking-tight transition-colors px-4 py-1",
                              sec.id === "progetto_vita"
                                ? "text-yellow-600 group-hover:text-yellow-700 font-extrabold"
                                : "text-slate-700 group-hover:text-slate-900",
                            )}
                          >
                            {sec.title}
                          </h3>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              ) : studentSubSection === "pulsantiera" ? (
                <div className="w-full space-y-6 sm:space-y-8 bg-[#0a192f]/60 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[40px] md:rounded-[60px] min-h-[80vh] shadow-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setStudentSubSection(null);
                          setActiveNeedTaskAnalysis(null);
                        }}
                        className="rounded-2xl h-14 px-8 font-black text-white hover:bg-white/20 border-2 border-white/20"
                      >
                        <ChevronLeft size={24} className="mr-2" /> Indietro
                      </Button>
                      <h2 className="text-4xl font-black text-white capitalize">
                        <div className="flex gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15">
                          <button
                            onClick={() => setPulsantieraTab("scelte")}
                            className={cn(
                              "px-6 py-2 rounded-xl font-black text-xs sm:text-sm uppercase transition-all tracking-wider",
                              pulsantieraTab === "scelte"
                                ? "bg-amber-500 text-white shadow-lg"
                                : "text-slate-300 hover:text-white"
                            )}
                          >
                            Scelte
                          </button>
                          <button
                            onClick={() => setPulsantieraTab("bisogni")}
                            className={cn(
                              "px-6 py-2 rounded-xl font-black text-xs sm:text-sm uppercase transition-all tracking-wider",
                              pulsantieraTab === "bisogni"
                                ? "bg-pink-500 text-white shadow-lg"
                                : "text-slate-300 hover:text-white"
                            )}
                          >
                            Bisogni
                          </button>
                        </div>
                      </h2>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setData({
                          ...data,
                          selectedChoiceIndex: null,
                          choiceMood: null,
                          choiceImages: Array(4).fill(null),
                          removedChoices: [],
                        })
                      }
                      className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold"
                    >
                      <RotateCcw size={20} className="mr-2" /> Ripristina
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-16 py-12">
                    <AnimatePresence mode="wait">
                      {pulsantieraTab === "scelte" && (
                        <motion.div
                          key="decision"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full flex flex-col items-center gap-12"
                        >
                          <div className="flex flex-col items-center gap-12 w-full max-w-4xl">
                            {/* Grid delle Scelte - Centrato */}
                            <div className="space-y-8 w-full">
                              <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-2">
                                  <Sparkles size={32} />
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                  Cosa desidero fare?
                                </h3>
                                <p className="text-blue-200 font-medium max-w-md">
                                  Carica o seleziona le tue scelte!
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                                {data.choiceImages.map((img, idx) => {
                                  const isRemoved =
                                    data.removedChoices.includes(idx);
                                  if (isRemoved) return null;

                                  return (
                                    <div key={idx} className="relative group">
                                      <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        whileHover={{
                                          scale: 1.05,
                                          rotate: idx % 2 === 0 ? 2 : -2,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                          setData({
                                            ...data,
                                            selectedChoiceIndex: idx,
                                          })
                                        }
                                        className={cn(
                                          "w-48 h-48 md:w-64 md:h-64 rounded-[50px] border-8 shadow-2xl overflow-hidden cursor-pointer transition-all flex items-center justify-center relative",
                                          data.selectedChoiceIndex === idx
                                            ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_60px_rgba(253,224,71,0.4)]"
                                            : "border-white/10 bg-white/5 hover:bg-white/10",
                                        )}
                                      >
                                        {img ? (
                                          <>
                                            <img
                                              src={img}
                                              className="w-full h-full object-contain p-4"
                                            />
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newImages = [
                                                  ...data.choiceImages,
                                                ];
                                                newImages[idx] = null;
                                                setData({
                                                  ...data,
                                                  choiceImages: newImages,
                                                });
                                              }}
                                              className="absolute top-4 right-4 w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </>
                                        ) : (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger
                                              render={
                                                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                                  <Plus
                                                    size={48}
                                                    className="text-white/20 mb-4 group-hover:text-white/40 transition-colors"
                                                  />
                                                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center px-4">
                                                    Aggiungi scelta o scegli da
                                                    archivio
                                                  </span>
                                                </div>
                                              }
                                            />
                                            <DropdownMenuContent className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-slate-100 w-80">
                                              <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                  <h4 className="font-black text-slate-900 uppercase italic">
                                                    Archivio Scelte
                                                  </h4>
                                                  <label className="p-2 cursor-pointer bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                                                    <Plus size={18} />
                                                    <input
                                                      type="file"
                                                      className="hidden"
                                                      accept="image/*"
                                                      onChange={(e) => {
                                                        const file =
                                                          e.target.files?.[0];
                                                        if (file) {
                                                          const reader =
                                                            new FileReader();
                                                          reader.onloadend =
                                                            () => {
                                                              const b64 =
                                                                reader.result as string;
                                                              setData({
                                                                ...data,
                                                                choiceArchivio:
                                                                  [
                                                                    ...data.choiceArchivio,
                                                                    b64,
                                                                  ],
                                                              });
                                                            };
                                                          reader.readAsDataURL(
                                                            file,
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </label>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                  {data.choiceArchivio.map(
                                                    (archImg, aIdx) => (
                                                      <div
                                                        key={aIdx}
                                                        className="relative group/item"
                                                      >
                                                        <button
                                                          onClick={() => {
                                                            const newImages = [
                                                              ...data.choiceImages,
                                                            ];
                                                            newImages[idx] =
                                                              archImg;
                                                            setData({
                                                              ...data,
                                                              choiceImages:
                                                                newImages,
                                                            });
                                                          }}
                                                          className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 border-slate-100 hover:border-blue-300 transition-all p-1"
                                                        >
                                                          <img
                                                            src={archImg}
                                                            className="w-full h-full object-contain"
                                                          />
                                                        </button>
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newArch =
                                                              data.choiceArchivio.filter(
                                                                (_, i) =>
                                                                  i !== aIdx,
                                                              );
                                                            setData({
                                                              ...data,
                                                              choiceArchivio:
                                                                newArch,
                                                            });
                                                          }}
                                                          className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-md"
                                                        >
                                                          <X size={12} />
                                                        </button>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </motion.div>

                                      <AnimatePresence>
                                        {data.selectedChoiceIndex === idx &&
                                          data.choiceImages.every(
                                            (i) => i !== null,
                                          ) && (
                                            <motion.div
                                              initial={{
                                                opacity: 0,
                                                scale: 0.5,
                                              }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              exit={{ opacity: 0, scale: 0.5 }}
                                              className="absolute -right-4 -top-4 flex flex-col gap-2 z-20"
                                            >
                                              <Button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setData({
                                                    ...data,
                                                    removedChoices: [
                                                      ...data.removedChoices,
                                                      idx,
                                                    ],
                                                    selectedChoiceIndex: null,
                                                  });
                                                }}
                                                className="w-12 h-12 bg-white text-slate-800 rounded-full shadow-xl hover:bg-rose-50"
                                                size="icon"
                                              >
                                                <X size={20} />
                                              </Button>
                                            </motion.div>
                                          )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Impostazioni Attività - Centrato sotto */}
                            <div className="w-full max-w-4xl space-y-10 bg-white/5 p-12 rounded-[60px] border-4 border-white/10 backdrop-blur-xl shadow-2xl">
                              <div className="flex flex-col items-center gap-2 mb-4">
                                <div className="px-6 py-2 bg-blue-500 rounded-full text-white text-xs font-black uppercase tracking-widest shadow-lg">
                                  Dettagli dell'attività
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Tempo */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between px-2">
                                    <label className="flex items-center gap-2 text-sm font-black text-blue-300 uppercase tracking-[0.2em]">
                                      <Clock size={18} /> Quanto tempo?
                                    </label>
                                    <Button
                                      onClick={() => {
                                        if (data.choiceDuration > 0) {
                                          const interval = setInterval(() => {
                                            setData((prev) => {
                                              if (prev.choiceDuration <= 0) {
                                                clearInterval(interval);
                                                return prev;
                                              }
                                              return {
                                                ...prev,
                                                choiceDuration:
                                                  prev.choiceDuration - 1,
                                              };
                                            });
                                          }, 60000);
                                        }
                                      }}
                                      className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-full font-black text-xs h-8 px-4"
                                    >
                                      Avvio Timer
                                    </Button>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-[40px] shadow-inner">
                                      <Button
                                        variant="ghost"
                                        className="w-16 h-16 rounded-3xl bg-white/10 text-white hover:bg-white/20 text-xl font-black"
                                        onClick={() =>
                                          setData({
                                            ...data,
                                            choiceDuration: Math.max(
                                              0,
                                              data.choiceDuration - 5,
                                            ),
                                          })
                                        }
                                      >
                                        -5
                                      </Button>
                                      <div className="flex-1 text-center">
                                        <span className="text-6xl font-black text-white lining-nums">
                                          {data.choiceDuration}
                                        </span>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                          Minuti
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        className="w-16 h-16 rounded-3xl bg-white/10 text-white hover:bg-white/20 text-xl font-black"
                                        onClick={() =>
                                          setData({
                                            ...data,
                                            choiceDuration:
                                              data.choiceDuration + 5,
                                          })
                                        }
                                      >
                                        +5
                                      </Button>
                                    </div>

                                    {/* Barra gialla che si svuota */}
                                    <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                                      <motion.div
                                        className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                        initial={{ width: "100%" }}
                                        animate={{
                                          width: `${(data.choiceDuration / 60) * 100}%`,
                                        }}
                                        transition={{
                                          duration: 1,
                                          ease: "linear",
                                        }}
                                      />
                                    </div>

                                    {/* Pallini countdown */}
                                    <div className="flex flex-wrap gap-2 justify-center py-2">
                                      {Array.from({ length: 12 }).map(
                                        (_, i) => {
                                          const isActive =
                                            i < data.choiceDuration / 5;
                                          return (
                                            <motion.div
                                              key={i}
                                              animate={
                                                isActive
                                                  ? { scale: [1, 1.2, 1] }
                                                  : { scale: 1 }
                                              }
                                              transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                              }}
                                              className={cn(
                                                "w-4 h-4 rounded-full transition-colors duration-500",
                                                isActive
                                                  ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                                  : "bg-white/10",
                                              )}
                                            />
                                          );
                                        },
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Mood & Social */}
                                <div className="space-y-4">
                                  <label className="flex items-center gap-2 text-sm font-black text-rose-300 uppercase tracking-[0.2em] pl-2 justify-center md:justify-start">
                                    <Smile size={18} /> Come ti senti?
                                  </label>
                                  <div className="flex justify-center items-center h-[96px] bg-black/40 p-2 rounded-[40px] shadow-inner gap-4">
                                    <button
                                      onClick={() =>
                                        setData({
                                          ...data,
                                          choiceMood: "happy",
                                        })
                                      }
                                      className={cn(
                                        "flex-1 h-full rounded-[30px] flex items-center justify-center transition-all",
                                        data.choiceMood === "happy"
                                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                          : "bg-white/5 text-white/20 hover:bg-white/10",
                                      )}
                                    >
                                      <Smile size={40} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setData({ ...data, choiceMood: "sad" })
                                      }
                                      className={cn(
                                        "flex-1 h-full rounded-[30px] flex items-center justify-center transition-all",
                                        data.choiceMood === "sad"
                                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                                          : "bg-white/5 text-white/20 hover:bg-white/10",
                                      )}
                                    >
                                      <Frown size={40} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Removed Dove and Con chi fields */}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {pulsantieraTab === "bisogni" && (
                        <motion.div
                          key="needs-task-analysis-parent"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-4xl space-y-12"
                        >
                          {activeNeedTaskAnalysis === null ? (
                            <>
                              <div className="text-center">
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                                  I miei Bisogni
                                </h3>
                                <p className="text-pink-200 font-medium">
                                  Seleziona un'attività per visualizzare e creare la Task Analysis
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-10 max-w-3xl mx-auto">
                                {data.needsChoices.map((need) => {
                                  let imgUrl = need.img;
                                  if (need.id === "bagno") imgUrl = "/bagno.png";
                                  if (need.id === "acqua") imgUrl = "/bicchiere d'acqua.png";
                                  if (need.id === "cibo") imgUrl = "/biscotti.png";
                                  if (need.id === "riposo") imgUrl = "/materassino.png";

                                  return (
                                    <motion.button
                                      key={need.id}
                                      whileHover={{ scale: 1.05, y: -5 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => {
                                        setActiveNeedTaskAnalysis(need.id);
                                        setData({
                                          ...data,
                                          choiceMood: "happy" as any,
                                        });
                                      }}
                                      className="w-full aspect-square md:aspect-[4/3] rounded-[60px] shadow-2xl border-8 border-pink-100 relative overflow-hidden transition-all duration-300 flex items-center justify-center bg-white group hover:border-pink-300 cursor-pointer"
                                    >
                                      <img
                                        src={imgUrl}
                                        alt={need.label}
                                        className="absolute inset-0 m-auto p-6 max-w-full max-h-[85%] object-contain opacity-100 transition-transform duration-500 group-hover:scale-107 pointer-events-none"
                                        referrerPolicy="no-referrer"
                                      />
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            // TASK ANALYSIS DETAILED WORKSPACE FOR SELECTED NEED
                            (() => {
                              const selectedNeed = data.needsChoices.find(n => n.id === activeNeedTaskAnalysis);
                              if (!selectedNeed) return null;

                              let imgUrl = selectedNeed.img;
                              if (selectedNeed.id === "bagno") imgUrl = "/bagno.png";
                              if (selectedNeed.id === "acqua") imgUrl = "/bicchiere d'acqua.png";
                              if (selectedNeed.id === "cibo") imgUrl = "/biscotti.png";
                              if (selectedNeed.id === "riposo") imgUrl = "/materassino.png";

                              const currentSteps = data.needsTaskAnalysis?.[activeNeedTaskAnalysis] || defaultTaskAnalysis[activeNeedTaskAnalysis] || [];

                              const toggleStep = (stepId: string) => {
                                const updated = currentSteps.map(step => 
                                  step.id === stepId ? { ...step, done: !step.done } : step
                                );
                                const newData = {
                                  ...data,
                                  needsTaskAnalysis: {
                                    ...(data.needsTaskAnalysis || {}),
                                    [activeNeedTaskAnalysis]: updated
                                  }
                                };
                                setData(newData);
                                saveToLocalStorage(newData);
                              };

                              const addStep = (text: string) => {
                                if (!text.trim()) return;
                                const newStep = {
                                  id: `custom_${Date.now()}`,
                                  text: text.trim(),
                                  done: false
                                };
                                const updated = [...currentSteps, newStep];
                                const newData = {
                                  ...data,
                                  needsTaskAnalysis: {
                                    ...(data.needsTaskAnalysis || {}),
                                    [activeNeedTaskAnalysis]: updated
                                  }
                                };
                                setData(newData);
                                saveToLocalStorage(newData);
                                setNewTaskStep("");
                              };

                              const deleteStep = (stepId: string) => {
                                const updated = currentSteps.filter(step => step.id !== stepId);
                                const newData = {
                                  ...data,
                                  needsTaskAnalysis: {
                                    ...(data.needsTaskAnalysis || {}),
                                    [activeNeedTaskAnalysis]: updated
                                  }
                                };
                                setData(newData);
                                saveToLocalStorage(newData);
                              };

                              const restoreDefaults = () => {
                                const defaults = defaultTaskAnalysis[activeNeedTaskAnalysis] || [];
                                const newData = {
                                  ...data,
                                  needsTaskAnalysis: {
                                    ...(data.needsTaskAnalysis || {}),
                                    [activeNeedTaskAnalysis]: defaults.map(d => ({ ...d, done: false }))
                                  }
                                };
                                setData(newData);
                                saveToLocalStorage(newData);
                              };

                              return (
                                <div className="space-y-6">
                                  {/* Header with Back button and Activity Info */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-[36px] border border-white/10">
                                    <button
                                      onClick={() => setActiveNeedTaskAnalysis(null)}
                                      className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-sm uppercase px-6 py-3 rounded-full shadow-lg transition-all cursor-pointer"
                                    >
                                      ← Torna ai Bisogni
                                    </button>
                                    <h4 className="text-2xl font-black text-white text-center uppercase tracking-tight">
                                      Task Analysis: {selectedNeed.label}
                                    </h4>
                                    <button
                                      onClick={restoreDefaults}
                                      className="text-xs bg-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer border border-white/5"
                                    >
                                      Ripristina predefiniti
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                                    {/* Left visually rich Checklist for student/educator */}
                                    <div className="md:col-span-7 bg-white/95 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border-none flex flex-col justify-between space-y-6">
                                      <div>
                                        <div className="flex items-center gap-4 border-b border-pink-100 pb-4 mb-4">
                                          <div className="w-16 h-16 rounded-2xl bg-pink-50 p-2 flex items-center justify-center border border-pink-100">
                                            <img src={imgUrl} className="w-full h-full object-contain" alt="" />
                                          </div>
                                          <div>
                                            <h5 className="text-xl font-bold text-slate-800">Visual Checklist</h5>
                                            <p className="text-xs text-slate-400 font-medium">Segna i passaggi man mano che vengono completati</p>
                                          </div>
                                        </div>

                                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                          {currentSteps.length === 0 ? (
                                            <p className="text-sm text-slate-400 text-center py-8 font-medium">Nessun passaggio definito. Aggiungine uno a destra!</p>
                                          ) : (
                                            currentSteps.map((step, idx) => (
                                              <button
                                                key={step.id}
                                                onClick={() => toggleStep(step.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                                                  step.done
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                                    : 'bg-slate-50 border-slate-100 hover:border-pink-200 text-slate-700'
                                                }`}
                                              >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-black text-sm shrink-0 transition-all ${
                                                  step.done
                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                    : 'border-pink-300 text-pink-500 bg-white'
                                                }`}>
                                                  {step.done ? "✓" : idx + 1}
                                                </div>
                                                <span className={`text-base font-bold leading-snug ${step.done ? 'line-through opacity-70' : ''}`}>
                                                  {step.text}
                                                </span>
                                              </button>
                                            ))
                                          )}
                                        </div>
                                      </div>

                                      {/* Completion progress bar */}
                                      {currentSteps.length > 0 && (
                                        <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200/50">
                                          <div className="flex justify-between text-xs font-black text-slate-700 uppercase tracking-tight mb-2">
                                            <span>Progresso di completamento</span>
                                            <span>
                                              {Math.round((currentSteps.filter(s => s.done).length / currentSteps.length) * 100)}%
                                            </span>
                                          </div>
                                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                            <div
                                              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                                              style={{ width: `${(currentSteps.filter(s => s.done).length / currentSteps.length) * 100}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Right section to CREATE and EDIT (Task Analysis Tool) */}
                                    <div className="md:col-span-5 bg-slate-900/90 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white/10 text-white flex flex-col justify-between space-y-6">
                                      <div>
                                        <h5 className="text-xl font-black uppercase tracking-tight border-b border-white/10 pb-4 mb-4 text-pink-400">
                                          Crea & Modifica
                                        </h5>

                                        {/* Input form to add a new step */}
                                        <div className="space-y-2 mb-6">
                                          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                                            Aggiungi nuovo passaggio:
                                          </label>
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              placeholder="Scrivi una nuova istruzione..."
                                              value={newTaskStep}
                                              onChange={(e) => setNewTaskStep(e.target.value)}
                                              onKeyDown={(e) => e.key === "Enter" && addStep(newTaskStep)}
                                              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 transition-colors"
                                            />
                                            <button
                                              onClick={() => addStep(newTaskStep)}
                                              className="bg-pink-500 hover:bg-pink-600 text-white font-extrabold px-4 rounded-xl transition-colors cursor-pointer text-xl"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>

                                        {/* Steps manager list with deletion */}
                                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Elimina o gestisci passaggi:</p>
                                          {currentSteps.map((step, idx) => (
                                            <div
                                              key={step.id}
                                              className="flex items-center justify-between gap-3 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors"
                                            >
                                              <span className="text-xs font-bold text-slate-400 shrink-0">#{idx + 1}</span>
                                              <span className="text-sm text-slate-200 font-semibold truncate flex-1">
                                                {step.text}
                                              </span>
                                              <button
                                                onClick={() => deleteStep(step.id)}
                                                className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-all shrink-0 cursor-pointer text-sm"
                                                title="Elimina passaggio"
                                              >
                                                🗑️
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="text-center text-xs text-slate-400 font-medium italic border-t border-white/10 pt-4">
                                        Personalizza la sequenza di passaggi adattandola al livello di autonomia dell'alunno.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          )}
                        </motion.div>
                      )}

                      {studentSubSection === "sentimenti" && (
                        <motion.div
                          key="feelings"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-4xl space-y-8"
                        >
                          <div className="text-center">
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                              Misura le tue Emozioni
                            </h3>
                            <p className="text-indigo-200 font-bold uppercase tracking-wider text-xs sm:text-sm">
                              Tocca un pulsante sul tablet per regolare il termometro
                            </p>
                          </div>

                          {/* IMMERSIVE TABLET CONTAINER FRAME */}
                          <div className="bg-slate-900 border-8 border-slate-700 rounded-[48px] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-stretch">
                            
                            {/* Inner camera/sensor bar to sell the tablet look */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-700 rounded-full flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-slate-950" />
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                            </div>

                            {/* COLUMN 1: THE THERMOMETER */}
                            <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-950/70 p-6 rounded-[36px] border border-white/5 relative shadow-inner">
                              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider mb-4">
                                Termometro Interno
                              </span>

                              <div className="flex items-end gap-1 relative">
                                {/* Rule indicators on the left of thermometer */}
                                <div className="flex flex-col justify-between h-72 text-[10px] font-mono text-slate-500 py-2 pr-1 select-none">
                                  <span>100</span>
                                  <span>75</span>
                                  <span>50</span>
                                  <span>25</span>
                                  <span>0</span>
                                </div>

                                {/* Glass tube */}
                                <div className="w-8 h-72 bg-slate-800/80 border-2 border-slate-700 rounded-full relative p-1 shadow-inner flex flex-col justify-end overflow-hidden">
                                  {/* Mercury fluid liquid level */}
                                  <motion.div
                                    animate={{
                                      height:
                                        amirFeeling === "calmo"
                                          ? "33%"
                                          : amirFeeling === "agitato"
                                            ? "66%"
                                            : "100%",
                                      background:
                                        amirFeeling === "calmo"
                                          ? "linear-gradient(to top, #059669, #34d399)"
                                          : amirFeeling === "agitato"
                                            ? "linear-gradient(to top, #d97706, #fbbf24)"
                                            : "linear-gradient(to top, #dc2626, #f87171)",
                                    }}
                                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                    className="w-full rounded-full animate-pulse"
                                  />
                                </div>

                                {/* Rule indicators on the right of thermometer */}
                                <div className="flex flex-col justify-between h-72 text-[9px] font-bold text-slate-500 py-2 pl-1 select-none">
                                  <span className={cn("transition-colors duration-200", amirFeeling === "sovraccaricato" ? "text-rose-400 font-extrabold" : "")}> max </span>
                                  <span className={cn("transition-colors duration-200", amirFeeling === "agitato" ? "text-amber-400 font-extrabold" : "")}> medio </span>
                                  <span className={cn("transition-colors duration-200", amirFeeling === "calmo" ? "text-emerald-400 font-extrabold" : "")}> calmo </span>
                                </div>
                              </div>

                              {/* Big floating bulb at the bottom */}
                              <div className="relative -mt-4 flex items-center justify-center">
                                <motion.div
                                  animate={{
                                    backgroundColor:
                                      amirFeeling === "calmo"
                                        ? "#10b981"
                                        : amirFeeling === "agitato"
                                          ? "#f59e0b"
                                          : "#ef4444",
                                    boxShadow:
                                      amirFeeling === "calmo"
                                        ? "0 0 20px rgba(16, 185, 129, 0.6)"
                                        : amirFeeling === "agitato"
                                          ? "0 0 20px rgba(245, 158, 11, 0.6)"
                                          : "0 0 20px rgba(239, 68, 68, 0.6)",
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="w-16 h-16 rounded-full flex items-center justify-center z-10"
                                >
                                  <span className="text-2xl select-none">
                                    {amirFeeling === "calmo" ? "😊" : amirFeeling === "agitato" ? "😟" : "🤬"}
                                  </span>
                                </motion.div>
                              </div>

                              <span className={cn(
                                "text-sm font-black uppercase tracking-wider mt-5 px-3 py-1.5 rounded-full select-none text-center",
                                amirFeeling === "calmo"
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                                  : amirFeeling === "agitato"
                                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
                                    : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
                              )}>
                                {amirFeeling === "calmo" ? "Stato: Calmo" : amirFeeling === "agitato" ? "Stato: Agitato" : "Stato: Sovraccarico"}
                              </span>
                            </div>

                            {/* COLUMN 2: THE 3 HUGE ARASAAC BUTTONS */}
                            <div className="w-full md:w-2/3 flex flex-col justify-between gap-5 col-span-2">
                              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider text-center md:text-left">
                                Seleziona come ti senti in questo momento:
                              </span>

                              <div className="flex flex-col gap-4 flex-1 justify-center">
                                {/* CALMO / FELICE (GREEN) */}
                                <motion.button
                                  whileHover={{ scale: 1.02, x: 5 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setAmirFeeling("calmo")}
                                  className={cn(
                                    "w-full p-4 sm:p-5 rounded-[28px] border-4 transition-all text-left flex items-center justify-between cursor-pointer shadow-lg",
                                    amirFeeling === "calmo"
                                      ? "bg-emerald-950/70 border-emerald-400 text-emerald-100 ring-4 ring-emerald-500/20"
                                      : "bg-slate-950/60 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-950/90"
                                  )}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl font-bold font-mono shadow-md shadow-emerald-900/40 select-none">
                                      😊
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
                                        Calmo / Felice
                                      </h4>
                                      <p className="text-slate-400 text-xs mt-1">
                                        Mi sento sereno, pronto per l'attività o la lezione.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
                                    {amirFeeling === "calmo" && <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />}
                                  </div>
                                </motion.button>

                                {/* AGITATO / ANSIOSO (YELLOW) */}
                                <motion.button
                                  whileHover={{ scale: 1.02, x: 5 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setAmirFeeling("agitato")}
                                  className={cn(
                                    "w-full p-4 sm:p-5 rounded-[28px] border-4 transition-all text-left flex items-center justify-between cursor-pointer shadow-lg",
                                    amirFeeling === "agitato"
                                      ? "bg-amber-950/70 border-amber-400 text-amber-100 ring-4 ring-amber-500/20"
                                      : "bg-slate-950/60 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-950/90"
                                  )}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-3xl font-bold font-mono shadow-md shadow-amber-900/40 select-none">
                                      😟
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
                                        Agitato / Ansioso
                                      </h4>
                                      <p className="text-slate-400 text-xs mt-1">
                                        Sento energia in eccesso, ansia o difficoltà a stare fermo.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
                                    {amirFeeling === "agitato" && <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />}
                                  </div>
                                </motion.button>

                                {/* SOVRACCARICATO / RABBIA (RED) */}
                                <motion.button
                                  whileHover={{ scale: 1.02, x: 5 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setAmirFeeling("sovraccaricato")}
                                  className={cn(
                                    "w-full p-4 sm:p-5 rounded-[28px] border-4 transition-all text-left flex items-center justify-between cursor-pointer shadow-lg",
                                    amirFeeling === "sovraccaricato"
                                      ? "bg-rose-950/70 border-rose-400 text-rose-100 ring-4 ring-rose-500/20"
                                      : "bg-slate-950/60 border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-950/90"
                                  )}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-rose-500 text-slate-950 flex items-center justify-center text-3xl font-bold font-mono shadow-md shadow-rose-900/40 select-none">
                                      🤬
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
                                        Sovraccaricato / Rabbia
                                      </h4>
                                      <p className="text-slate-400 text-xs mt-1">
                                        Sensazione di meltdown o forte frustrazione. Ho bisogno di aiuto.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full border-2 border-rose-400 flex items-center justify-center shrink-0">
                                    {amirFeeling === "sovraccaricato" && <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />}
                                  </div>
                                </motion.button>
                              </div>

                              {/* HELP/REgulation TRIGGERS IF STATE NOT GREEN */}
                              <AnimatePresence mode="wait">
                                {amirFeeling !== "calmo" && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
                                  >
                                    <div className="flex items-center gap-2.5 text-left">
                                      <span className="text-xl shrink-0">💡</span>
                                      <p className="text-xs font-semibold text-indigo-200">
                                        {amirFeeling === "agitato"
                                          ? "Amir, suggeriamo un piccolo esercizio di respirazione per calmarsi."
                                          : "Amir, ti consigliamo di fare subito una sessione nella bolla relax."}
                                      </p>
                                    </div>
                                    <Button
                                      onClick={() => setStudentSubSection("relax")}
                                      className="rounded-xl text-[10px] font-black uppercase tracking-wider bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2 cursor-pointer shadow-md shrink-0 border-none h-auto"
                                    >
                                      Entra in Bolla Relax 🌀
                                    </Button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-6 sm:space-y-8 bg-[#0a192f]/60 backdrop-blur-md p-4 sm:p-8 md:p-12 rounded-[24px] sm:rounded-[40px] md:rounded-[60px] min-h-[80vh] shadow-2xl border border-white/10">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setStudentSubSection(null);
                        setActiveSubjectId(null);
                      }}
                      className="rounded-2xl h-14 px-8 font-black text-white hover:bg-white/20 border-2 border-white/20"
                    >
                      <ChevronLeft size={24} className="mr-2" /> Indietro
                    </Button>
                    <div className="flex items-center gap-6">
                      <h2 className="text-4xl font-black text-white capitalize">
                        {studentSubSection === "day"
                          ? "La mia giornata"
                          : studentSubSection === "diary"
                            ? "Il mio zaino"
                            : studentSubSection === "passport"
                              ? "Passaporto comunicativo"
                              : studentSubSection === "autonomy"
                                ? "Diario delle autonomie"
                                : studentSubSection === "progetto_vita"
                                  ? "Il mio progetto di vita"
                                  : "Area relax"}
                      </h2>
                      {studentSubSection === "day" && (
                        <Button
                          onClick={() => setShowAgendaTips(!showAgendaTips)}
                          variant="outline"
                          className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Info size={20} className="mr-2" />{" "}
                          {showAgendaTips ? "Nascondi Info" : "Istruzioni"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {studentSubSection === "day" && (
                    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
                      {/* Sub-tab Switcher */}
                      <div className="flex justify-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab("agenda")}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === "agenda"
                              ? "bg-white text-blue-600 shadow-blue-500/20"
                              : "bg-white/10 text-white border border-white/10 hover:bg-white/20",
                          )}
                        >
                          <Calendar size={28} /> Agenda Visiva
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab("tokens")}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === "tokens"
                              ? "bg-white text-blue-600 shadow-blue-500/20"
                              : "bg-white/10 text-white border border-white/10 hover:bg-white/20",
                          )}
                        >
                          <CircleDot size={28} /> Token Attività
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab("diary")}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === "diary"
                              ? "bg-white text-blue-600 shadow-blue-500/20"
                              : "bg-white/10 text-white border border-white/10 hover:bg-white/20",
                          )}
                        >
                          <BookCheck size={28} /> Diario del giorno
                        </motion.button>
                      </div>

                      {/* Top Bar: Weather and Thermometer */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto items-stretch">
                        
                        {/* Day and Weather Selection */}
                        <div className="lg:col-span-2 flex flex-col md:flex-row gap-6 p-8 rounded-[40px] border border-white/10 backdrop-blur-md bg-white/10 items-center justify-between">
                          <div className="flex flex-col gap-6 w-full">
                            <div>
                              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">📅 Scegli il giorno</h4>
                              <p className="text-blue-200 text-xs font-medium">Seleziona il giorno della settimana per l'agenda visiva</p>
                            </div>
                            
                            {/* Day Selection Row */}
                            <div className="flex flex-wrap gap-2 bg-black/20 p-2 rounded-2xl w-fit justify-center">
                              {[
                                "Lun",
                                "Mar",
                                "Mer",
                                "Gio",
                                "Ven",
                                "Sab",
                                "Dom",
                              ].map((d) => (
                                <button
                                  key={d}
                                  onClick={() =>
                                    setData({
                                      ...data,
                                      agendaDay:
                                        d === "Lun"
                                          ? "Lunedì"
                                          : d === "Mar"
                                            ? "Martedì"
                                            : d === "Mer"
                                              ? "Mercoledì"
                                              : d === "Gio"
                                                ? "Giovedì"
                                                : d === "Ven"
                                                  ? "Venerdì"
                                                  : d === "Sab"
                                                    ? "Sabato"
                                                    : "Domenica",
                                    })
                                  }
                                  className={cn(
                                    "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                                    data.agendaDay.startsWith(d)
                                      ? "bg-white text-blue-600 shadow-lg"
                                      : "text-white/60 hover:text-white",
                                  )}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>

                            <hr className="border-white/10" />

                            <div>
                              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1 font-sans">🌤️ Scegli il meteo</h4>
                              <p className="text-blue-200 text-xs font-medium">Seleziona il tempo di oggi</p>
                            </div>

                            {/* Weather Selection Row */}
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit">
                              {[
                                { id: "Sereno", icon: <Sun size={20} /> },
                                { id: "Nuvoloso", icon: <Cloud size={20} /> },
                                { id: "Pioggia", icon: <CloudRain size={20} /> },
                                { id: "Vento", icon: <Wind size={20} /> },
                                { id: "Neve", icon: <Snowflake size={20} /> },
                              ].map((w) => (
                                <button
                                  key={w.id}
                                  onClick={() =>
                                    setData({ ...data, agendaWeather: w.id })
                                  }
                                  className={cn(
                                    "p-3 rounded-xl transition-all",
                                    data.agendaWeather === w.id
                                      ? "bg-blue-600 text-white shadow-lg scale-110"
                                      : "text-slate-300 hover:text-blue-400",
                                  )}
                                  title={w.id}
                                >
                                  {w.icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Feeling Thermometer - MOVED HERE! */}
                        <div className="flex flex-col p-6 rounded-[40px] border border-white/10 bg-slate-900/90 shadow-2xl items-center justify-center relative min-h-[320px]">
                          <span className="text-[11px] font-black uppercase text-indigo-400 tracking-widest mb-3">🌡️ Termometro Emotivo</span>
                          
                          <div className="flex items-end gap-3 relative pb-2 w-full justify-center">
                            {/* Rule indicators on the left of thermometer */}
                            <div className="flex flex-col justify-between h-48 text-[9px] font-mono text-slate-500 py-1 pr-1 select-none">
                              <span>100</span>
                              <span>50</span>
                              <span>0</span>
                            </div>

                            {/* Glass tube */}
                            <div className="w-6 h-48 bg-slate-800 border border-slate-700 rounded-full relative p-0.5 shadow-inner flex flex-col justify-end overflow-hidden">
                              {/* Mercury fluid level */}
                              <motion.div
                                animate={{
                                  height:
                                    (data.amirFeeling || amirFeeling) === "calmo"
                                      ? "33%"
                                      : (data.amirFeeling || amirFeeling) === "agitato"
                                        ? "66%"
                                        : "100%",
                                  background:
                                    (data.amirFeeling || amirFeeling) === "calmo"
                                      ? "linear-gradient(to top, #059669, #34d399)"
                                      : (data.amirFeeling || amirFeeling) === "agitato"
                                        ? "linear-gradient(to top, #d97706, #fbbf24)"
                                        : "linear-gradient(to top, #dc2626, #f87171)",
                                }}
                                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                className="w-full rounded-full animate-pulse"
                              />
                            </div>

                            {/* Rule indicators on the right of thermometer */}
                            <div className="flex flex-col justify-between h-48 text-[10px] font-bold text-slate-400 py-1 pl-1 select-none">
                              <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "sovraccaricato" ? "text-rose-400 font-black" : "")}> sovraccarico </span>
                              <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "agitato" ? "text-amber-400 font-black" : "")}> agitato </span>
                              <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "calmo" ? "text-emerald-400 font-black" : "")}> calmo </span>
                            </div>
                          </div>

                          {/* Quick Interactive Bulb Face */}
                          <div className="relative mt-2 flex items-center justify-center gap-2">
                            {[
                              { id: "calmo", icon: "😊", tooltip: "Calmo", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
                              { id: "agitato", icon: "😟", tooltip: "Agitato", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
                              { id: "sovraccaricato", icon: "🤬", tooltip: "Sovraccarico", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
                            ].map((feel) => (
                              <button
                                key={feel.id}
                                onClick={() => {
                                  changeAmirFeeling(feel.id as any);
                                }}
                                className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center text-xl border transition-all hover:scale-110",
                                  (data.amirFeeling || amirFeeling) === feel.id
                                    ? feel.color + " ring-2 ring-indigo-500 scale-105 font-bold"
                                    : "border-white/5 bg-white/5 text-slate-400"
                                )}
                                title={feel.tooltip}
                              >
                                {feel.icon}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="flex flex-col gap-12 items-start justify-center">
                        {dayTab === "agenda" && (
                          <div className="w-full space-y-8">
                            {/* Agenda Visiva Header - White Background */}
                            <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 space-y-4 md:space-y-0 relative overflow-hidden">
                              <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                                  <Calendar size={32} />
                                </div>
                                <div className="flex flex-col">
                                  <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">
                                    Agenda Visiva
                                  </h2>
                                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                                    Ogni sezione su sfondo bianco per chiarezza
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-end">
                                <div className="flex items-center gap-2 mr-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (data.agendaImages.length > 2) {
                                        setData({
                                          ...data,
                                          agendaImages: data.agendaImages.slice(
                                            0,
                                            -1,
                                          ),
                                          agendaWithWhomImages:
                                            data.agendaWithWhomImages.slice(
                                              0,
                                              -1,
                                            ),
                                          agendaHours: data.agendaHours.slice(
                                            0,
                                            -1,
                                          ),
                                          agendaHourColors:
                                            data.agendaHourColors.slice(0, -1),
                                          agendaDurations:
                                            data.agendaDurations.slice(0, -1),
                                        });
                                      }
                                    }}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl"
                                    title="Togli quadrato"
                                  >
                                    <Minus size={18} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      if (data.agendaImages.length < 10) {
                                        setData({
                                          ...data,
                                          agendaImages: [
                                            ...data.agendaImages,
                                            null,
                                          ],
                                          agendaWithWhomImages: [
                                            ...data.agendaWithWhomImages,
                                            null,
                                          ],
                                          agendaHours: [
                                            ...data.agendaHours,
                                            null,
                                          ],
                                          agendaHourColors: [
                                            ...data.agendaHourColors,
                                            "blue",
                                          ],
                                          agendaDurations: [
                                            ...data.agendaDurations,
                                            0,
                                          ],
                                        });
                                      }
                                    }}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl"
                                    title="Aggiungi quadrato"
                                  >
                                    <Plus size={18} />
                                  </Button>
                                </div>

                                <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-2 flex items-center">
                                  {[
                                    "Lunedì",
                                    "Martedì",
                                    "Mercoledì",
                                    "Giovedì",
                                    "Venerdì",
                                    "Sabato",
                                  ].map((day) => (
                                    <button
                                      key={day}
                                      onClick={() =>
                                        setData({ ...data, agendaDay: day })
                                      }
                                      className={cn(
                                        "px-4 py-2 rounded-2xl font-black text-xs uppercase transition-all whitespace-nowrap",
                                        data.agendaDay === day
                                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                                          : "text-slate-400 hover:text-slate-600",
                                      )}
                                    >
                                      {day.slice(0, 3)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {(showActivityArchive || showWhomArchive) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mb-8"
                                >
                                  <div
                                    className={cn(
                                      "p-8 rounded-[40px] border-4 border-white/20 backdrop-blur-xl shadow-2xl",
                                      showActivityArchive
                                        ? "bg-blue-600/40"
                                        : "bg-purple-600/40",
                                    )}
                                  >
                                    <div className="flex justify-between items-center mb-6">
                                      <div>
                                        <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                                          {showActivityArchive
                                            ? "Archivio Attività"
                                            : "Archivio Con Chi?"}
                                        </h4>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                          Carica o seleziona le immagini per
                                          l'agenda
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <label className="cursor-pointer bg-white text-blue-600 px-6 py-3 rounded-2xl font-black uppercase text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg">
                                          <Upload size={18} /> Carica Immagini
                                          <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => {
                                              const files = Array.from(
                                                e.target.files || [],
                                              ) as File[];
                                              files.forEach((file) => {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                  const res =
                                                    reader.result as string;
                                                  if (showActivityArchive) {
                                                    setData((prev) => ({
                                                      ...prev,
                                                      agendaActivityArchive: [
                                                        ...prev.agendaActivityArchive,
                                                        res,
                                                      ],
                                                    }));
                                                  } else {
                                                    setData((prev) => ({
                                                      ...prev,
                                                      agendaWhomArchive: [
                                                        ...prev.agendaWhomArchive,
                                                        res,
                                                      ],
                                                    }));
                                                  }
                                                };
                                                reader.readAsDataURL(file);
                                              });
                                            }}
                                          />
                                        </label>
                                        <button
                                          onClick={() => {
                                            setShowActivityArchive(false);
                                            setShowWhomArchive(false);
                                          }}
                                          className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                                        >
                                          <X size={24} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                      {(showActivityArchive
                                        ? data.agendaActivityArchive
                                        : data.agendaWhomArchive
                                      ).map((archImg, i) => (
                                        <div
                                          key={i}
                                          className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white/10 hover:border-white transition-all transform hover:-translate-y-1"
                                        >
                                          <img
                                            src={archImg}
                                            alt="Archive"
                                            className="w-full h-full object-contain p-4"
                                          />
                                          <button
                                            onClick={() => {
                                              if (showActivityArchive) {
                                                setData((prev) => ({
                                                  ...prev,
                                                  agendaActivityArchive:
                                                    prev.agendaActivityArchive.filter(
                                                      (_, idx) => idx !== i,
                                                    ),
                                                }));
                                              } else {
                                                setData((prev) => ({
                                                  ...prev,
                                                  agendaWhomArchive:
                                                    prev.agendaWhomArchive.filter(
                                                      (_, idx) => idx !== i,
                                                    ),
                                                }));
                                              }
                                            }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      ))}
                                      {(showActivityArchive
                                        ? data.agendaActivityArchive
                                        : data.agendaWhomArchive
                                      ).length === 0 && (
                                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/40 border-2 border-dashed border-white/10 rounded-3xl">
                                          <FileImage
                                            size={48}
                                            className="mb-3 opacity-20"
                                          />
                                          <p className="font-black uppercase tracking-tighter">
                                            L'archivio è vuoto
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 gap-8">
                              {data.agendaImages.map((img, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "flex flex-col gap-6 group p-6 sm:p-8 rounded-[40px] border transition-all shadow-xl",
                                    data.agendaHourColors[idx] === "yellow"
                                      ? "bg-yellow-100 border-yellow-300 text-slate-900"
                                      : "bg-white border-white/10 backdrop-blur-sm",
                                  )}
                                >
                                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
                                    {/* School Hour Badge/Input */}
                                    <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                                      <div className="flex gap-1 items-center">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger
                                            render={
                                              <button className="w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 hover:scale-110 transition-transform focus:outline-none bg-blue-600 text-white">
                                                {data.agendaHours[idx] ||
                                                  idx + 1}
                                              </button>
                                            }
                                          />
                                          <DropdownMenuContent className="p-2 min-w-[80px] bg-white rounded-2xl shadow-2xl z-50">
                                            {[1, 2, 3, 4, 5, 6].map((h) => (
                                              <DropdownMenuItem
                                                key={h}
                                                onClick={() => {
                                                  const newHours = [
                                                    ...data.agendaHours,
                                                  ];
                                                  newHours[idx] = h;
                                                  setData({
                                                    ...data,
                                                    agendaHours: newHours,
                                                  });
                                                }}
                                                className="rounded-xl font-black text-center justify-center p-2 hover:bg-blue-50 cursor-pointer text-slate-800"
                                              >
                                                {h}
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuContent>
                                        </DropdownMenu>

                                        <button
                                          onClick={() => {
                                            const newColors = [
                                              ...data.agendaHourColors,
                                            ];
                                            newColors[idx] =
                                              newColors[idx] === "blue"
                                                ? "yellow"
                                                : "blue";
                                            setData({
                                              ...data,
                                              agendaHourColors: newColors,
                                            });
                                          }}
                                          className={cn(
                                            "w-6 h-14 rounded-xl shadow-lg border-2 border-white/20 transition-all focus:outline-none",
                                            data.agendaHourColors[idx] ===
                                              "yellow"
                                              ? "bg-yellow-400 border-yellow-500"
                                              : "bg-blue-500/40 border-blue-500/10",
                                          )}
                                          title={
                                            data.agendaHourColors[idx] ===
                                            "yellow"
                                              ? "Pausa (Giallo)"
                                              : "Lavoro (Blu)"
                                          }
                                        />
                                      </div>
                                      <div className="text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap">
                                        Ora / Colore
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6 md:gap-8 lg:gap-10 flex-1 w-full">
                                      {/* Attività */}
                                      <div className="flex flex-col items-center gap-2 w-full">
                                        <div className="w-full aspect-square max-w-[150px] sm:max-w-none bg-white rounded-[32px] shadow-2xl border-4 border-white/20 overflow-hidden relative flex items-center justify-center transition-transform hover:scale-105 group/item">
                                          {/* Fading Background Pattern */}
                                          <div className="absolute inset-0 opacity-5 pointer-events-none group-hover/item:opacity-15 transition-opacity">
                                            <img
                                              src="/attività.png"
                                              alt="pattern"
                                              className="w-full h-full object-cover"
                                            />
                                          </div>

                                          <DropdownMenu>
                                            <DropdownMenuTrigger
                                              render={
                                                <button className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors relative z-10 focus:outline-none">
                                                  {img ? (
                                                    <>
                                                      <img
                                                        src={img}
                                                        alt={`Attività ${idx + 1}`}
                                                        className="w-full h-full object-contain p-2 animate-in fade-in zoom-in duration-500"
                                                      />
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          const newImages = [
                                                            ...data.agendaImages,
                                                          ];
                                                          newImages[idx] = null;
                                                          setData({
                                                            ...data,
                                                            agendaImages:
                                                              newImages,
                                                          });
                                                        }}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-lg"
                                                      >
                                                        <Trash2 size={16} />
                                                      </button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Upload
                                                        size={32}
                                                        className="text-blue-200 mb-2"
                                                      />
                                                      <span className="text-[10px] font-black text-blue-300 uppercase tracking-tighter">
                                                        Scegli
                                                      </span>
                                                    </>
                                                  )}
                                                </button>
                                              }
                                            />
                                            <DropdownMenuContent className="p-4 w-64 max-h-[400px] overflow-y-auto bg-white rounded-[32px] shadow-2xl border-none z-50">
                                              <div className="grid grid-cols-2 gap-3">
                                                {/* Upload new */}
                                                <label className="col-span-2 cursor-pointer bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-center">
                                                  <Plus
                                                    size={24}
                                                    className="mx-auto"
                                                  />
                                                  <span className="text-xs font-black uppercase">
                                                    Nuova Immagine
                                                  </span>
                                                  <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                      const file =
                                                        e.target.files?.[0];
                                                      if (file) {
                                                        const reader =
                                                          new FileReader();
                                                        reader.onloadend =
                                                          () => {
                                                            const res =
                                                              reader.result as string;
                                                            const newImages = [
                                                              ...data.agendaImages,
                                                            ];
                                                            newImages[idx] =
                                                              res;
                                                            setData({
                                                              ...data,
                                                              agendaImages:
                                                                newImages,
                                                              agendaActivityArchive:
                                                                [
                                                                  ...data.agendaActivityArchive,
                                                                  res,
                                                                ],
                                                            });
                                                          };
                                                        reader.readAsDataURL(
                                                          file,
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </label>

                                                {/* Archive items */}
                                                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-1">
                                                  Dall'archivio:
                                                </div>
                                                {data.agendaActivityArchive.map(
                                                  (archImg, i) => (
                                                    <div
                                                      key={i}
                                                      className="group relative aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all p-2 flex items-center justify-center"
                                                    >
                                                      <button
                                                        onClick={() => {
                                                          const newImages = [
                                                            ...data.agendaImages,
                                                          ];
                                                          newImages[idx] =
                                                            archImg;
                                                          setData({
                                                            ...data,
                                                            agendaImages:
                                                              newImages,
                                                          });
                                                        }}
                                                        className="w-full h-full flex items-center justify-center pointer-events-auto"
                                                      >
                                                        <img
                                                          src={archImg}
                                                          alt="Archive"
                                                          className="w-full h-full object-contain"
                                                        />
                                                      </button>
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setData((prev) => ({
                                                            ...prev,
                                                            agendaActivityArchive:
                                                              prev.agendaActivityArchive.filter(
                                                                (_, idx2) =>
                                                                  idx2 !== i,
                                                              ),
                                                          }));
                                                        }}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow cursor-pointer border-none"
                                                        title="Elimina dall'archivio"
                                                      >
                                                        <Trash2 size={12} />
                                                      </button>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                          Attività
                                        </span>
                                      </div>

                                      {/* Con Chi? */}
                                      <div className="flex flex-col items-center gap-2 w-full">
                                        <div className="w-full aspect-square max-w-[150px] sm:max-w-none bg-white rounded-[32px] shadow-2xl border-4 border-white/20 overflow-hidden relative flex items-center justify-center transition-transform hover:scale-105 group/item">
                                          <DropdownMenu>
                                            <DropdownMenuTrigger
                                              render={
                                                <button className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 transition-colors relative z-10 focus:outline-none">
                                                  {data.agendaWithWhomImages[
                                                    idx
                                                  ] ? (
                                                    <>
                                                      <img
                                                        src={
                                                          data
                                                            .agendaWithWhomImages[
                                                            idx
                                                          ]!
                                                        }
                                                        alt={`Con Chi ${idx + 1}`}
                                                        className="w-full h-full object-contain p-2 animate-in fade-in zoom-in duration-500"
                                                      />
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          const newWhom = [
                                                            ...data.agendaWithWhomImages,
                                                          ];
                                                          newWhom[idx] = null;
                                                          setData({
                                                            ...data,
                                                            agendaWithWhomImages:
                                                              newWhom,
                                                          });
                                                        }}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-lg"
                                                      >
                                                        <Trash2 size={16} />
                                                      </button>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Upload
                                                        size={32}
                                                        className="text-purple-200 mb-2"
                                                      />
                                                      <span className="text-[10px] font-black text-purple-300 uppercase tracking-tighter">
                                                        Scegli
                                                      </span>
                                                    </>
                                                  )}
                                                </button>
                                              }
                                            />
                                            <DropdownMenuContent className="p-4 w-64 max-h-[400px] overflow-y-auto bg-white rounded-[32px] shadow-2xl border-none z-50">
                                              <div className="grid grid-cols-2 gap-3">
                                                {/* Upload new */}
                                                <label className="col-span-2 cursor-pointer bg-purple-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-purple-700 transition-colors text-center">
                                                  <Plus
                                                    size={24}
                                                    className="mx-auto"
                                                  />
                                                  <span className="text-xs font-black uppercase">
                                                    Nuovo Contatto
                                                  </span>
                                                  <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                      const file =
                                                        e.target.files?.[0];
                                                      if (file) {
                                                        const reader =
                                                          new FileReader();
                                                        reader.onloadend =
                                                          () => {
                                                            const res =
                                                              reader.result as string;
                                                            const newWhom = [
                                                              ...data.agendaWithWhomImages,
                                                            ];
                                                            newWhom[idx] = res;
                                                            setData({
                                                              ...data,
                                                              agendaWithWhomImages:
                                                                newWhom,
                                                              agendaWhomArchive:
                                                                [
                                                                  ...data.agendaWhomArchive,
                                                                  res,
                                                                ],
                                                            });
                                                          };
                                                        reader.readAsDataURL(
                                                          file,
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </label>

                                                {/* Archive items */}
                                                <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-1">
                                                  Dall'archivio:
                                                </div>
                                                {data.agendaWhomArchive.map(
                                                  (archImg, i) => (
                                                    <div
                                                      key={i}
                                                      className="group relative aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all p-2 flex items-center justify-center"
                                                    >
                                                      <button
                                                        onClick={() => {
                                                          const newWhom = [
                                                            ...data.agendaWithWhomImages,
                                                          ];
                                                          newWhom[idx] =
                                                            archImg;
                                                          setData({
                                                            ...data,
                                                            agendaWithWhomImages:
                                                              newWhom,
                                                          });
                                                        }}
                                                        className="w-full h-full flex items-center justify-center pointer-events-auto"
                                                      >
                                                        <img
                                                          src={archImg}
                                                          alt="Archive"
                                                          className="w-full h-full object-contain"
                                                        />
                                                      </button>
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setData((prev) => ({
                                                            ...prev,
                                                            agendaWhomArchive:
                                                              prev.agendaWhomArchive.filter(
                                                                (_, idx2) =>
                                                                  idx2 !== i,
                                                              ),
                                                          }));
                                                        }}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow cursor-pointer border-none"
                                                        title="Elimina dall'archivio"
                                                      >
                                                        <Trash2 size={12} />
                                                      </button>
                                                    </div>
                                                  ),
                                                )}
                                              </div>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                          Con Chi?
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          const newImages = [
                                            ...data.agendaImages,
                                          ];
                                          newImages[idx] = null;
                                          const newWhomImages = [
                                            ...data.agendaWithWhomImages,
                                          ];
                                          newWhomImages[idx] = null;
                                          setData({
                                            ...data,
                                            agendaImages: newImages,
                                            agendaWithWhomImages: newWhomImages,
                                          });
                                        }}
                                        className="text-rose-400 hover:text-rose-600 hover:bg-rose-50/10 rounded-2xl w-10 h-10"
                                      >
                                        <Trash2 size={20} />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dayTab === "tokens" && (
                          /* Right Panel: Token Economy */
                          <div className="flex-1 w-full space-y-8">
                            {/* Token Economy (Modified from Goose Game) */}
                            <div className="bg-white/95 rounded-[40px] p-10 shadow-2xl border-none">
                              {/* Objectives Section */}
                              <div className="mb-6">
                                <Button
                                  onClick={() =>
                                    setShowObjectives(!showObjectives)
                                  }
                                  variant="ghost"
                                  className="w-full flex justify-between items-center bg-slate-50 p-6 rounded-3xl hover:bg-slate-100 transition-colors"
                                >
                                  <span className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                    OBIETTIVI DELLA GIORNATA
                                  </span>
                                  {showObjectives ? (
                                    <ChevronUp size={24} />
                                  ) : (
                                    <ChevronDown size={24} />
                                  )}
                                </Button>
                                <AnimatePresence>
                                  {showObjectives && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-6 bg-white border-2 border-slate-50 mt-2 rounded-3xl space-y-4">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            placeholder="Aggiungi un obiettivo..."
                                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 font-medium"
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                const val = (
                                                  e.target as HTMLInputElement
                                                ).value;
                                                if (val) {
                                                  setData({
                                                    ...data,
                                                    agendaObjectives: [
                                                      ...data.agendaObjectives,
                                                      val,
                                                    ],
                                                  });
                                                  (
                                                    e.target as HTMLInputElement
                                                  ).value = "";
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          {data.agendaObjectives.map(
                                            (obj, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100/50"
                                              >
                                                <span className="font-bold text-blue-900">
                                                  {obj}
                                                </span>
                                                <button
                                                  onClick={() => {
                                                    const newObjs = [
                                                      ...data.agendaObjectives,
                                                    ];
                                                    newObjs.splice(idx, 1);
                                                    setData({
                                                      ...data,
                                                      agendaObjectives: newObjs,
                                                    });
                                                  }}
                                                  className="text-rose-400 hover:text-rose-600"
                                                >
                                                  <X size={18} />
                                                </button>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-2xl font-black text-slate-900 uppercase">
                                  TOKEN ECONOMY DELLE ATTIVITÀ
                                </h4>
                                <div className="flex items-center gap-4">
                                  <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        setIsTokenSelectionOpen(true)
                                      }
                                      className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2 w-auto h-auto flex items-center gap-2 font-black uppercase text-xs"
                                    >
                                      <PlusCircle size={16} /> Personalizza
                                      Gettone
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        if (data.tokenStepsCount > 1) {
                                          setData({
                                            ...data,
                                            tokenStepsCount:
                                              data.tokenStepsCount - 1,
                                            agendaProgress: Math.min(
                                              data.agendaProgress,
                                              data.tokenStepsCount - 1,
                                            ),
                                          });
                                        }
                                      }}
                                      className="text-slate-600 hover:bg-white rounded-xl w-10 h-10"
                                    >
                                      <Minus size={20} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        if (data.tokenStepsCount < 20) {
                                          setData({
                                            ...data,
                                            tokenStepsCount:
                                              data.tokenStepsCount + 1,
                                          });
                                        }
                                      }}
                                      className="text-slate-600 hover:bg-white rounded-xl w-10 h-10"
                                    >
                                      <Plus size={20} />
                                    </Button>
                                  </div>
                                  <Badge className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg">
                                    {data.agendaProgress} /{" "}
                                    {data.tokenStepsCount}
                                  </Badge>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isTokenSelectionOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full"
                                  >
                                    <div className="bg-white rounded-[40px] p-8 mb-8 shadow-2xl border-4 border-blue-100">
                                      <div className="flex items-center justify-between mb-6">
                                        <div>
                                          <h5 className="text-2xl font-black text-slate-900 uppercase italic">
                                            Archivio Gettoni
                                          </h5>
                                          <p className="text-slate-500 font-bold">
                                            Seleziona o carica l'immagine del
                                            gettone
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {data.tokenSymbol && (
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                setData({
                                                  ...data,
                                                  tokenSymbol: null,
                                                });
                                                setIsTokenSelectionOpen(false);
                                              }}
                                              className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase"
                                            >
                                              Rimuovi Gettone
                                            </Button>
                                          )}
                                          <Button
                                            variant="ghost"
                                            onClick={() =>
                                              setIsTokenSelectionOpen(false)
                                            }
                                            className="rounded-2xl"
                                          >
                                            <X size={24} />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                        {data.tokenArchive.map((token, idx) => (
                                          <div
                                            key={idx}
                                            className="relative group"
                                          >
                                            <button
                                              onClick={() => {
                                                setData({
                                                  ...data,
                                                  tokenSymbol: token,
                                                });
                                                setIsTokenSelectionOpen(false);
                                              }}
                                              className={cn(
                                                "w-full aspect-square rounded-3xl border-4 transition-all overflow-hidden bg-slate-50 p-2",
                                                data.tokenSymbol === token
                                                  ? "border-blue-500 shadow-xl"
                                                  : "border-slate-100 hover:border-blue-200",
                                              )}
                                            >
                                              <img
                                                src={token}
                                                className="w-full h-full object-contain"
                                              />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newArchive =
                                                  data.tokenArchive.filter(
                                                    (_, i) => i !== idx,
                                                  );
                                                setData({
                                                  ...data,
                                                  tokenArchive: newArchive,
                                                  tokenSymbol:
                                                    data.tokenSymbol === token
                                                      ? null
                                                      : data.tokenSymbol,
                                                });
                                              }}
                                              className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg z-10 transition-transform active:scale-95"
                                              title="Rimuovi gettone"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        ))}
                                        <label className="aspect-square rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                                          <Plus
                                            size={24}
                                            className="text-slate-400"
                                          />
                                          <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                  setData({
                                                    ...data,
                                                    tokenArchive: [
                                                      ...data.tokenArchive,
                                                      reader.result as string,
                                                    ],
                                                    tokenSymbol:
                                                      reader.result as string,
                                                  });
                                                };
                                                reader.readAsDataURL(file);
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="flex items-center gap-4 min-w-max pb-4">
                                {/* Start cell */}
                                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shrink-0 overflow-hidden border-4 border-white/20">
                                  <img
                                    src="/inizio.png"
                                    alt="Start"
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {/* Path */}
                                {Array.from({
                                  length: data.tokenStepsCount,
                                }).map((_, idx) => {
                                  const stepsStatus =
                                    data.tokenStepsStatus ||
                                    Array.from({
                                      length: data.tokenStepsCount,
                                    }).map((_, i) => i < data.agendaProgress);
                                  const isReached = !!stepsStatus[idx];
                                  const isCurrent =
                                    idx === stepsStatus.indexOf(false);
                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-4"
                                    >
                                      <div className="w-4 h-1 bg-slate-200 rounded-full" />
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                          const currentStatus = [...stepsStatus];
                                          currentStatus[idx] = !currentStatus[idx];
                                          const newProgress =
                                            currentStatus.filter(Boolean).length;
                                          setData({
                                            ...data,
                                            tokenStepsStatus: currentStatus,
                                            agendaProgress: newProgress,
                                          });
                                        }}
                                        className={cn(
                                          "w-20 h-20 rounded-[28px] border-4 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden shrink-0",
                                          isReached
                                            ? "bg-emerald-500 border-emerald-600 text-white shadow-lg"
                                            : isCurrent
                                              ? "bg-white border-blue-500 border-dashed text-blue-500 animate-pulse"
                                              : "bg-white border-slate-200 text-slate-300",
                                        )}
                                      >
                                        {isReached ? (
                                          data.tokenSymbol ? (
                                            <img
                                              src={data.tokenSymbol}
                                              className="absolute inset-0 w-full h-full object-contain p-2"
                                            />
                                          ) : (
                                            <CheckCircle2
                                              size={32}
                                              className="relative z-10"
                                            />
                                          )
                                        ) : (
                                          <span className="text-xl font-black relative z-10">
                                            {idx + 1}
                                          </span>
                                        )}
                                      </motion.button>
                                    </div>
                                  );
                                })}

                                {/* End cell */}
                                <div className="flex items-center gap-4">
                                  <div className="w-4 h-1 bg-slate-200 rounded-full" />
                                  <div className="relative">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        setIsRewardSelectionOpen(true)
                                      }
                                      className={cn(
                                        "w-32 h-32 rounded-[40px] bg-rose-500 flex items-center justify-center text-white font-black shadow-2xl shrink-0 overflow-hidden border-8 border-white/20 transition-all",
                                        data.agendaProgress >=
                                          data.tokenStepsCount
                                          ? "ring-8 ring-rose-400 ring-offset-4"
                                          : "opacity-30 grayscale-[1]",
                                      )}
                                    >
                                      {data.tokenRewardImage ? (
                                        <img
                                          src={data.tokenRewardImage}
                                          alt="Premio"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <img
                                          src="/premio.png"
                                          alt="Reward Base"
                                          className="w-full h-full object-cover opacity-80"
                                        />
                                      )}
                                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Sparkles
                                          className="text-white"
                                          size={32}
                                        />
                                      </div>
                                    </motion.button>
                                    {data.agendaProgress >=
                                      data.tokenStepsCount && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-4 -right-4 bg-yellow-400 text-white p-3 rounded-2xl shadow-xl z-20"
                                      >
                                        <ThumbsUp size={24} />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isRewardSelectionOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="mt-8 p-8 bg-white rounded-[40px] shadow-xl border-4 border-slate-100"
                                  >
                                    <div className="flex items-center justify-between mb-8">
                                      <div>
                                        <h5 className="text-2xl font-black text-slate-900 uppercase">
                                          Scegli il tuo premio
                                        </h5>
                                        <p className="text-slate-500 font-bold">
                                          Tocca un'immagine per selezionarla
                                          come premio finale
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        onClick={() =>
                                          setIsRewardSelectionOpen(false)
                                        }
                                        className="rounded-2xl w-12 h-12"
                                      >
                                        <X size={24} />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      {[
                                        {
                                          id: "costruzioni",
                                          img: "/costruzioni.png",
                                          label: "Costruzioni",
                                        },
                                        {
                                          id: "biscotti",
                                          img: "/biscotti.png",
                                          label: "Biscotti",
                                        },
                                        {
                                          id: "tablet",
                                          img: "/tablet.png",
                                          label: "Tablet",
                                        },
                                      ].map((reward) => (
                                        <motion.button
                                          key={reward.id}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            setData({
                                              ...data,
                                              tokenRewardImage: reward.img,
                                            });
                                            setIsRewardSelectionOpen(false);
                                          }}
                                          className={cn(
                                            "aspect-square rounded-[32px] overflow-hidden border-4 transition-all relative group",
                                            data.tokenRewardImage === reward.img
                                              ? "border-rose-500 shadow-xl"
                                              : "border-slate-100 bg-slate-50 hover:border-slate-300",
                                          )}
                                        >
                                          <img
                                            src={reward.img}
                                            alt={reward.label}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                          <div className="absolute bottom-2 left-0 right-0 text-center">
                                            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-800 shadow-sm">
                                              {reward.label}
                                            </span>
                                          </div>
                                        </motion.button>
                                      ))}

                                      {data.tokenRewardOptions.map(
                                        (opt, idx) => (
                                          <motion.button
                                            key={`custom-${idx}`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                              setData({
                                                ...data,
                                                tokenRewardImage: opt,
                                              });
                                              setIsRewardSelectionOpen(false);
                                            }}
                                            className={cn(
                                              "aspect-square rounded-[32px] overflow-hidden border-4 transition-all relative group",
                                              data.tokenRewardImage === opt
                                                ? "border-rose-500 shadow-xl"
                                                : "border-slate-100 bg-slate-50 hover:border-slate-300",
                                            )}
                                          >
                                            <img
                                              src={opt}
                                              alt="Custom Reward"
                                              className="w-full h-full object-cover"
                                            />
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newOpts =
                                                  data.tokenRewardOptions.filter(
                                                    (_, i) => i !== idx,
                                                  );
                                                setData({
                                                  ...data,
                                                  tokenRewardOptions: newOpts,
                                                  tokenRewardImage:
                                                    data.tokenRewardImage ===
                                                    opt
                                                      ? null
                                                      : data.tokenRewardImage,
                                                });
                                              }}
                                              className="absolute top-2 right-2 w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-2xl z-20 hover:bg-rose-700 transition-colors pointer-events-auto"
                                              title="Elimina premio caricato"
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </motion.button>
                                        ),
                                      )}

                                      <label className="aspect-square rounded-[32px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                          <Plus size={24} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                          Carica altro
                                        </span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                setData({
                                                  ...data,
                                                  tokenRewardOptions: [
                                                    ...data.tokenRewardOptions,
                                                    reader.result as string,
                                                  ],
                                                  tokenRewardImage:
                                                    reader.result as string,
                                                });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </label>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}

                        {dayTab === "diary" && (
                          <div className="bg-white/95 rounded-[40px] p-10 shadow-2xl space-y-8">
                            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border-4 border-slate-100">
                              <div>
                                <h4 className="text-3xl font-black text-slate-900 uppercase">
                                  Diario Giornaliero
                                </h4>
                                <p className="text-slate-500 font-bold">
                                  Racconta la tua giornata con foto e commenti
                                </p>
                              </div>
                              <Button
                                onClick={() => {
                                  setData({
                                    ...data,
                                    dailyDiary: [
                                      {
                                        id: Math.random()
                                          .toString(36)
                                          .substr(2, 9),
                                        date: new Date().toLocaleDateString(
                                          "it-IT",
                                        ),
                                        photo: null,
                                        comment: "",
                                        translatedComment: "",
                                        aiExplanation: "",
                                      },
                                      ...data.dailyDiary,
                                    ],
                                  });
                                }}
                                className="h-16 px-8 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 font-black uppercase shadow-xl flex items-center gap-3"
                              >
                                <Plus size={24} /> Nuovo Inserimento
                              </Button>
                            </div>

                            {/* Message from Family */}
                            {(data.familyDailyNote || data.amirFeeling) && (
                              <div className="bg-purple-50 rounded-[35px] border-4 border-purple-100 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="text-4xl">🏡</div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <h5 className="text-xl font-black text-purple-900 uppercase">
                                      Messaggio da Casa
                                    </h5>
                                    {data.amirFeeling && (
                                      <span className={cn(
                                        "px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border",
                                        data.amirFeeling === "calmo"
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          : data.amirFeeling === "agitato"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-rose-50 text-rose-700 border-rose-200"
                                      )}>
                                        Stato emotivo: {
                                          data.amirFeeling === "calmo"
                                            ? "😊 Calmo/Felice"
                                            : data.amirFeeling === "agitato"
                                              ? "😟 Agitato/Ansioso"
                                              : "🤬 Sovraccaricato/Rabbia"
                                        }
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-purple-950 font-medium italic leading-relaxed text-md text-left">
                                    "{data.familyDailyNote || "La famiglia non ha scritto commenti, ma ha aggiornato il termometro emotivo di oggi."}"
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="space-y-8">
                              {data.dailyDiary.map((entry, idx) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  key={entry.id}
                                  className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-50 relative group"
                                >
                                  <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                                      <div className="aspect-[4/3] rounded-[30px] border-4 border-dashed border-slate-200 bg-slate-50 overflow-hidden relative flex flex-col items-center justify-center group/photo">
                                        {entry.photo ? (
                                          <>
                                            <img
                                              src={entry.photo}
                                              className="w-full h-full object-cover"
                                            />
                                            <button
                                              onClick={() => {
                                                const newDiary = [
                                                  ...data.dailyDiary,
                                                ];
                                                newDiary[idx].photo = null;
                                                newDiary[idx].aiExplanation =
                                                  "";
                                                setData({
                                                  ...data,
                                                  dailyDiary: newDiary,
                                                });
                                              }}
                                              className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity shadow-lg"
                                            >
                                              <Trash2 size={24} />
                                            </button>
                                          </>
                                        ) : (
                                          <div className="flex flex-col items-center text-slate-300">
                                            <Upload
                                              size={48}
                                              className="mb-2"
                                            />
                                            <span className="font-black uppercase text-xs">
                                              Carica Foto
                                            </span>
                                            <input
                                              type="file"
                                              className="absolute inset-0 opacity-0 cursor-pointer"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file =
                                                  e.target.files?.[0];
                                                if (file) {
                                                  const reader =
                                                    new FileReader();
                                                  reader.onloadend = () => {
                                                    const b64 =
                                                      reader.result as string;
                                                    const newDiary = [
                                                      ...data.dailyDiary,
                                                    ];
                                                    newDiary[idx].photo = b64;
                                                    setData({
                                                      ...data,
                                                      dailyDiary: newDiary,
                                                    });
                                                    analyzePhotoWithAI(
                                                      b64,
                                                      idx,
                                                    );
                                                  };
                                                  reader.readAsDataURL(file);
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>

                                      <div className="space-y-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                            <Calendar size={12} /> Data
                                          </div>
                                          <input
                                            type="text"
                                            value={entry.date}
                                            onChange={(e) => {
                                              const newDiary = [
                                                ...data.dailyDiary,
                                              ];
                                              newDiary[idx].date =
                                                e.target.value;
                                              setData({
                                                ...data,
                                                dailyDiary: newDiary,
                                              });
                                            }}
                                            className="w-full bg-transparent border-none p-0 font-black text-slate-800 focus:ring-0"
                                          />
                                        </div>

                                        {entry.aiExplanation && (
                                          <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-blue-50/50 p-6 rounded-[28px] border border-blue-100 relative group/ai"
                                          >
                                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">
                                              <Sparkles size={12} /> Assistente
                                              AI
                                            </div>
                                            <p className="text-sm font-bold text-blue-800 leading-relaxed italic">
                                              "{entry.aiExplanation}"
                                            </p>
                                          </motion.div>
                                        )}
                                        {isAnalyzing === `diary-${idx}` && (
                                          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl animate-pulse">
                                            <Loader2
                                              size={18}
                                              className="text-blue-500 animate-spin"
                                            />
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                              AI sta analizzando...
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex-1 space-y-6">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                                          Il mio commento
                                        </label>
                                        <textarea
                                          value={entry.comment}
                                          onChange={(e) => {
                                            const newDiary = [
                                              ...data.dailyDiary,
                                            ];
                                            newDiary[idx].comment =
                                              e.target.value;
                                            setData({
                                              ...data,
                                              dailyDiary: newDiary,
                                            });
                                          }}
                                          placeholder="Scrivi qui cosa hai fatto oggi..."
                                          className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-200 transition-all min-h-[150px] shadow-inner"
                                        />
                                      </div>

                                      <div className="flex flex-wrap gap-4 text-white">
                                        <Button
                                          onClick={() =>
                                            translateToArabic(
                                              entry.comment,
                                              idx,
                                            )
                                          }
                                          disabled={
                                            !entry.comment ||
                                            isTranslating === `diary-${idx}`
                                          }
                                          className="h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs flex items-center gap-2 shadow-lg"
                                        >
                                          {isTranslating === `diary-${idx}` ? (
                                            <Loader2
                                              size={16}
                                              className="animate-spin text-white"
                                            />
                                          ) : (
                                            <Globe
                                              size={16}
                                              className="text-white"
                                            />
                                          )}
                                          Traduci in Arabo
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            downloadDiaryEntry(entry)
                                          }
                                          className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95"
                                        >
                                          <Download
                                            size={16}
                                            className="text-white"
                                          />
                                          Scarica Diario
                                        </Button>
                                      </div>

                                      {entry.translatedComment && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="bg-emerald-50/50 p-6 rounded-[30px] border border-emerald-100 relative group/translation"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                              <Languages size={14} /> Traduzione
                                              Araba
                                            </div>
                                            <button
                                              onClick={() => {
                                                const newDiary = [
                                                  ...data.dailyDiary,
                                                ];
                                                newDiary[
                                                  idx
                                                ].translatedComment = "";
                                                setData({
                                                  ...data,
                                                  dailyDiary: newDiary,
                                                });
                                              }}
                                              className="text-emerald-300 hover:text-emerald-500 transition-colors"
                                            >
                                              <X size={14} />
                                            </button>
                                          </div>
                                          <p
                                            className="text-2xl font-bold text-slate-800 text-right font-arabic leading-loose"
                                            style={{ direction: "rtl" }}
                                          >
                                            {entry.translatedComment}
                                          </p>
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => {
                                      const newDiary = data.dailyDiary.filter(
                                        (_, i) => i !== idx,
                                      );
                                      setData({
                                        ...data,
                                        dailyDiary: newDiary,
                                      });
                                    }}
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-rose-500 hover:text-white"
                                  >
                                    <Trash2 size={24} />
                                  </button>
                                </motion.div>
                              ))}

                              {data.dailyDiary.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-24 text-slate-300 gap-6 opacity-50">
                                  <div className="w-40 h-40 rounded-[60px] border-6 border-dashed border-slate-200 flex items-center justify-center bg-slate-50/50">
                                    <BookCheck size={64} />
                                  </div>
                                  <p className="text-2xl font-black uppercase tracking-widest text-center leading-relaxed">
                                    Nessun diario salvato.
                                    <br />
                                    <span className="text-sm">
                                      Inizia a raccontare la tua giornata
                                      toccando il pulsante sopra!
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {studentSubSection === "diary" && (
                    <div className="w-full max-w-7xl mx-auto p-4">
                      {!activeSubjectId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                          {data.schoolDiary.map((subject) => {
                            const Icon =
                              subject.name === "Italiano"
                                ? BookOpen
                                : subject.name === "Matematica"
                                  ? Calculator
                                  : subject.name === "Scienze"
                                    ? FlaskConical
                                    : Palette;
                            return (
                              <motion.button
                                whileHover={{ scale: 1.05, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={cn(
                                  "relative h-64 rounded-[40px] shadow-2xl overflow-hidden group flex flex-col items-center justify-center gap-6 border-8 border-white/20",
                                  subject.color,
                                )}
                              >
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                <div className="z-10 bg-white/20 p-6 rounded-[30px] backdrop-blur-md">
                                  <Icon size={64} className="text-white" />
                                </div>
                                <h3 className="z-10 text-3xl font-black text-white uppercase tracking-tighter">
                                  {subject.name}
                                </h3>
                                <div className="z-10 px-6 py-2 bg-white/10 rounded-full text-white/80 font-bold text-sm backdrop-blur-sm">
                                  {subject.activities.length} attivit
                                  {subject.activities.length === 1 ? "à" : "à"}{" "}
                                  salvate
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="max-w-4xl mx-auto">
                          {data.schoolDiary
                            .filter((s) => s.id === activeSubjectId)
                            .map((subject) => {
                              const Icon =
                                subject.name === "Italiano"
                                  ? BookOpen
                                  : subject.name === "Matematica"
                                    ? Calculator
                                    : subject.name === "Scienze"
                                      ? FlaskConical
                                      : Palette;
                              return (
                                <div
                                  key={subject.id}
                                  className="bg-white rounded-[50px] shadow-2xl overflow-hidden border-8 border-white flex flex-col min-h-[700px]"
                                >
                                  <div
                                    className={cn(
                                      "p-10 text-white",
                                      subject.color,
                                    )}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Button
                                        variant="ghost"
                                        onClick={() => setActiveSubjectId(null)}
                                        className="bg-white/20 hover:bg-white/40 text-white rounded-2xl font-black uppercase text-xs px-6"
                                      >
                                        ← Torna allo zaino
                                      </Button>
                                      <div className="px-4 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Area Alunno
                                      </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-6">
                                      <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/20 rounded-[30px] flex items-center justify-center backdrop-blur-md">
                                          <Icon size={40} />
                                        </div>
                                        <div>
                                          <h3 className="text-5xl font-black uppercase tracking-tighter">
                                            {subject.name}
                                          </h3>
                                          <p className="text-white/70 font-bold uppercase tracking-widest text-sm">
                                            Lo zaino delle mie attività
                                          </p>
                                        </div>
                                      </div>
                                      <div className="relative group">
                                        <Button
                                          size="lg"
                                          className="h-16 px-8 rounded-3xl bg-white text-slate-900 hover:bg-white/90 font-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                        >
                                          <Plus size={24} /> Carica Attività
                                        </Button>
                                        <input
                                          type="file"
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const newDiary =
                                                  data.schoolDiary.map((s) => {
                                                    if (s.id === subject.id) {
                                                      return {
                                                        ...s,
                                                        activities: [
                                                          {
                                                            id: Math.random()
                                                              .toString(36)
                                                              .substr(2, 9),
                                                            type: "image",
                                                            content:
                                                              reader.result as string,
                                                            date: new Date().toLocaleDateString(
                                                              "it-IT",
                                                            ),
                                                          },
                                                          ...s.activities,
                                                        ],
                                                      } as any;
                                                    }
                                                    return s;
                                                  });
                                                setData({
                                                  ...data,
                                                  schoolDiary: newDiary,
                                                });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-1 p-10 bg-slate-50/50 overflow-y-auto max-h-[600px] custom-scrollbar">
                                    {subject.activities.length === 0 ? (
                                      <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6 opacity-50 py-32">
                                        <div className="w-32 h-32 rounded-[40px] border-4 border-dashed border-slate-200 flex items-center justify-center">
                                          <Icon size={48} />
                                        </div>
                                        <p className="text-xl font-black uppercase tracking-widest text-center leading-relaxed">
                                          Non ci sono ancora lavori salvati.
                                          <br />
                                          <span className="text-sm">
                                            Tocca il pulsante in alto per
                                            aggiungere il tuo primo file!
                                          </span>
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {subject.activities.map((act) => (
                                          <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={act.id}
                                            className="bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 group relative overflow-hidden"
                                          >
                                            <div className="relative rounded-[30px] overflow-hidden aspect-video bg-slate-100 mb-6 shadow-inner ring-4 ring-slate-50">
                                              <img
                                                src={act.content}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                              />
                                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                              <button
                                                onClick={() => {
                                                  const newDiary =
                                                    data.schoolDiary.map(
                                                      (s) => {
                                                        if (
                                                          s.id === subject.id
                                                        ) {
                                                          return {
                                                            ...s,
                                                            activities:
                                                              s.activities.filter(
                                                                (a) =>
                                                                  a.id !==
                                                                  act.id,
                                                              ),
                                                          };
                                                        }
                                                        return s;
                                                      },
                                                    );
                                                  setData({
                                                    ...data,
                                                    schoolDiary: newDiary,
                                                  });
                                                }}
                                                className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-rose-600 hover:scale-110 active:scale-95"
                                              >
                                                <Trash2 size={24} />
                                              </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                                  Data caricamento
                                                </span>
                                                <span className="text-lg font-black text-slate-800">
                                                  {act.date}
                                                </span>
                                              </div>
                                              <div
                                                className={cn(
                                                  "w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10",
                                                  subject.color,
                                                )}
                                              >
                                                <div
                                                  className={cn(
                                                    "w-4 h-4 rounded-full",
                                                    subject.color,
                                                  )}
                                                />
                                              </div>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}

                  {studentSubSection === "passport" && (
                    <div className="w-full max-w-7xl mx-auto p-4 flex flex-col items-center">
                      {/* Top Tabs Switcher inside Passaporto comunicativo */}
                      <div className="flex gap-2 bg-white/10 p-1.5 rounded-[20px] border border-white/15 mb-8 print:hidden w-fit">
                        <button
                          onClick={() => {
                            setPassportTab("passport");
                            setActiveSubjectId(null);
                          }}
                          className={cn(
                            "px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase transition-all tracking-wider flex items-center gap-2 cursor-pointer",
                            passportTab === "passport"
                              ? "bg-emerald-500 text-white shadow-lg"
                              : "text-slate-300 hover:text-white"
                          )}
                        >
                          <span>📝</span> Il Mio Passaporto
                        </button>
                        <button
                          onClick={() => {
                            setPassportTab("autonomy");
                            setActiveSubjectId(null);
                          }}
                          className={cn(
                            "px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm uppercase transition-all tracking-wider flex items-center gap-2 cursor-pointer",
                            passportTab === "autonomy"
                              ? "bg-orange-500 text-white shadow-lg"
                              : "text-slate-300 hover:text-white"
                          )}
                        >
                          <span>🛀</span> Diario delle Autonomie
                        </button>
                      </div>

                      {passportTab === "passport" && (
                        <div className="w-full max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => saveToLocalStorage()}
                            className="rounded-2xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold bg-white"
                          >
                            <Save size={18} className="mr-2" /> Salva
                          </Button>
                          <Button
                            variant="outline"
                            onClick={downloadPassport}
                            className="rounded-2xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold bg-white"
                          >
                            <Download size={18} className="mr-2" /> Scarica PDF
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => window.print()}
                          className="rounded-2xl text-white/60 hover:text-white font-bold hover:bg-white/10"
                        >
                          <Printer size={18} className="mr-2" /> Stampa PDF
                        </Button>
                      </div>

                      <div
                        id="passport-card"
                        className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-emerald-500/20 relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/10 -z-0" />

                        <div className="p-10 relative z-10 flex flex-col md:flex-row gap-10">
                          <div className="flex flex-col items-center gap-6 md:w-1/3">
                            <div className="w-48 h-64 bg-slate-100 rounded-3xl border-4 border-slate-200 overflow-hidden relative group shadow-xl">
                              {data.passport.photo ? (
                                <img
                                  src={data.passport.photo}
                                  alt="Student"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                  <User size={64} />
                                  <span className="text-xs font-black uppercase mt-2">
                                    Foto
                                  </span>
                                </div>
                              )}
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setData({
                                        ...data,
                                        passport: {
                                          ...data.passport,
                                          photo: reader.result as string,
                                        },
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>

                            <div className="w-full space-y-4">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                  Nome
                                </label>
                                <input
                                  value={data.passport.name}
                                  onChange={(e) =>
                                    setData({
                                      ...data,
                                      passport: {
                                        ...data.passport,
                                        name: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Inserisci nome"
                                  className="w-full bg-transparent border-none p-0 font-black text-xl text-slate-800 placeholder:text-slate-300 focus:ring-0"
                                />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                  Cognome
                                </label>
                                <input
                                  value={data.passport.surname}
                                  onChange={(e) =>
                                    setData({
                                      ...data,
                                      passport: {
                                        ...data.passport,
                                        surname: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Inserisci cognome"
                                  className="w-full bg-transparent border-none p-0 font-black text-xl text-slate-800 placeholder:text-slate-300 focus:ring-0"
                                />
                              </div>
                            </div>

                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                              className="mt-4 flex items-center justify-center p-4 border-2 border-emerald-500/20 rounded-full bg-emerald-50 text-emerald-600 cursor-help"
                              title="Il mio segno unico"
                            >
                              <Fingerprint size={48} />
                            </motion.div>
                          </div>

                          <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-3xl border-2 border-slate-50 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                                  <Calendar size={20} />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    Data di nascita
                                  </label>
                                  <input
                                    type="date"
                                    value={data.passport.birthDate}
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        passport: {
                                          ...data.passport,
                                          birthDate: e.target.value,
                                        },
                                      })
                                    }
                                    className="w-full bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0"
                                  />
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-3xl border-2 border-slate-50 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                                  <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                                    Residenza
                                  </label>
                                  <input
                                    value={data.passport.residence}
                                    onChange={(e) =>
                                      setData({
                                        ...data,
                                        passport: {
                                          ...data.passport,
                                          residence: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Città"
                                    className="w-full bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100">
                              <div className="flex items-center gap-3 mb-4">
                                <ThumbsUp
                                  className="text-emerald-500"
                                  size={24}
                                />
                                <h4 className="font-black text-emerald-900 uppercase">
                                  Cosa mi piace
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {data.passport.likes.map((item, i) => (
                                  <div key={i} className="group relative">
                                    <Badge className="bg-white text-emerald-600 border-emerald-200 p-1 pr-2 rounded-2xl font-bold shadow-sm flex items-center gap-2 h-14">
                                      {item.type === "image" ? (
                                        <img
                                          src={item.content}
                                          className="w-10 h-10 rounded-xl object-contain bg-slate-50"
                                        />
                                      ) : (
                                        <span className="px-2">
                                          {item.content}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => {
                                          const newLikes = [
                                            ...data.passport.likes,
                                          ];
                                          newLikes.splice(i, 1);
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              likes: newLikes,
                                            },
                                          });
                                        }}
                                        className="ml-1 text-slate-300 hover:text-rose-500 transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  placeholder="Scrivi e premi invio..."
                                  className="flex-1 bg-white border-emerald-100 rounded-2xl px-4 py-3 font-medium focus:ring-emerald-500 shadow-inner"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const val = (e.target as HTMLInputElement)
                                        .value;
                                      if (val) {
                                        setData({
                                          ...data,
                                          passport: {
                                            ...data.passport,
                                            likes: [
                                              ...data.passport.likes,
                                              { type: "text", content: val },
                                            ],
                                          },
                                        });
                                        (e.target as HTMLInputElement).value =
                                          "";
                                      }
                                    }
                                  }}
                                />
                                <div className="relative">
                                  <Button
                                    variant="outline"
                                    className="h-12 border-emerald-100 bg-white text-emerald-600 rounded-2xl hover:bg-emerald-50"
                                  >
                                    <FileImage size={24} />
                                  </Button>
                                  <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              likes: [
                                                ...data.passport.likes,
                                                {
                                                  type: "image",
                                                  content:
                                                    reader.result as string,
                                                },
                                              ],
                                            },
                                          });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-rose-50/50 p-6 rounded-[32px] border border-rose-100">
                              <div className="flex items-center gap-3 mb-4">
                                <ThumbsDown
                                  className="text-rose-500"
                                  size={24}
                                />
                                <h4 className="font-black text-rose-900 uppercase">
                                  Cosa non mi piace
                                </h4>
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {data.passport.dislikes.map((item, i) => (
                                  <div key={i} className="group relative">
                                    <Badge className="bg-white text-rose-600 border-rose-200 p-1 pr-2 rounded-2xl font-bold shadow-sm flex items-center gap-2 h-14">
                                      {item.type === "image" ? (
                                        <img
                                          src={item.content}
                                          className="w-10 h-10 rounded-xl object-contain bg-slate-50"
                                        />
                                      ) : (
                                        <span className="px-2">
                                          {item.content}
                                        </span>
                                      )}
                                      <button
                                        onClick={() => {
                                          const newDis = [
                                            ...data.passport.dislikes,
                                          ];
                                          newDis.splice(i, 1);
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              dislikes: newDis,
                                            },
                                          });
                                        }}
                                        className="ml-1 text-slate-300 hover:text-rose-500 transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input
                                  placeholder="Scrivi e premi invio..."
                                  className="flex-1 bg-white border-rose-100 rounded-2xl px-4 py-3 font-medium focus:ring-rose-500 shadow-inner"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const val = (e.target as HTMLInputElement)
                                        .value;
                                      if (val) {
                                        setData({
                                          ...data,
                                          passport: {
                                            ...data.passport,
                                            dislikes: [
                                              ...data.passport.dislikes,
                                              { type: "text", content: val },
                                            ],
                                          },
                                        });
                                        (e.target as HTMLInputElement).value =
                                          "";
                                      }
                                    }
                                  }}
                                />
                                <div className="relative">
                                  <Button
                                    variant="outline"
                                    className="h-12 border-rose-100 bg-white text-rose-600 rounded-2xl hover:bg-rose-50"
                                  >
                                    <FileImage size={24} />
                                  </Button>
                                  <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              dislikes: [
                                                ...data.passport.dislikes,
                                                {
                                                  type: "image",
                                                  content:
                                                    reader.result as string,
                                                },
                                              ],
                                            },
                                          });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 overflow-hidden">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                  <Youtube size={24} />
                                </div>
                                <h4 className="font-black text-slate-800 uppercase">
                                  Le mie canzoni e video preferiti
                                </h4>
                              </div>
                              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {data.passport.youtubeLinks.map((link, i) => {
                                  // Simple abbreviation helper
                                  const displayLink =
                                    link.length > 30
                                      ? link.substring(0, 27) + "..."
                                      : link;
                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-red-200 transition-colors"
                                    >
                                      <a
                                        href={
                                          link.startsWith("http")
                                            ? link
                                            : `https://${link}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-1 min-w-0"
                                      >
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                          <Youtube size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 truncate underline">
                                          {displayLink}
                                        </span>
                                      </a>
                                      <button
                                        onClick={() => {
                                          const newLinks = [
                                            ...data.passport.youtubeLinks,
                                          ];
                                          newLinks.splice(i, 1);
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              youtubeLinks: newLinks,
                                            },
                                          });
                                        }}
                                        className="text-slate-300 hover:text-rose-500 ml-4 shrink-0 p-2 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Rimuovi link"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="w-full">
                                <div className="relative group">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
                                    <Youtube size={20} />
                                  </div>
                                  <input
                                    placeholder="Incolla link YouTube e premi invio"
                                    className="w-full bg-white border-slate-200 rounded-2xl pl-12 pr-4 py-3 font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-inner text-sm transition-all"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        const val = (
                                          e.target as HTMLInputElement
                                        ).value;
                                        if (val) {
                                          setData({
                                            ...data,
                                            passport: {
                                              ...data.passport,
                                              youtubeLinks: [
                                                ...data.passport.youtubeLinks,
                                                val,
                                              ],
                                            },
                                          });
                                          (e.target as HTMLInputElement).value =
                                            "";
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-500 py-3 px-10 flex justify-between items-center text-white/90 font-black text-[10px] uppercase tracking-widest">
                          <span>Passaporto Comunicativo myPEI</span>
                          <div className="flex gap-4">
                            <span>
                              Codice: ID-
                              {Math.random()
                                .toString(36)
                                .substr(2, 6)
                                .toUpperCase()}
                            </span>
                            <span>Creato con myPEI</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                      {passportTab === "autonomy" && (
                        <div className="w-full max-w-7xl mx-auto">
                      {!activeSubjectId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                          {data.autonomyDiary.map((subject) => {
                            const Icon =
                              subject.name === "Igiene"
                                ? Bath
                                : subject.name === "Abbigliamento"
                                  ? Shirt
                                  : subject.name === "Alimentazione"
                                    ? Utensils
                                    : CheckCircle2;
                            return (
                              <motion.button
                                whileHover={{ scale: 1.05, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={cn(
                                  "relative h-64 rounded-[40px] shadow-2xl overflow-hidden group flex flex-col items-center justify-center gap-6 border-8 border-white/20",
                                  subject.color,
                                )}
                              >
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                <div className="z-10 bg-white/20 p-6 rounded-[30px] backdrop-blur-md">
                                  <Icon size={64} className="text-white" />
                                </div>
                                <h3 className="z-10 text-3xl font-black text-white uppercase tracking-tighter">
                                  {subject.name}
                                </h3>
                                <div className="z-10 px-6 py-2 bg-white/10 rounded-full text-white/80 font-bold text-sm backdrop-blur-sm">
                                  {subject.activities.length} schede salvate
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="max-w-4xl mx-auto">
                          {data.autonomyDiary
                            .filter((s) => s.id === activeSubjectId)
                            .map((subject) => {
                              const Icon =
                                subject.name === "Igiene"
                                  ? Bath
                                  : subject.name === "Abbigliamento"
                                    ? Shirt
                                    : subject.name === "Alimentazione"
                                      ? Utensils
                                      : CheckCircle2;
                              return (
                                <div
                                  key={subject.id}
                                  className="bg-white rounded-[50px] shadow-2xl overflow-hidden border-8 border-white flex flex-col min-h-[700px]"
                                >
                                  <div
                                    className={cn(
                                      "p-10 text-white",
                                      subject.color,
                                    )}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Button
                                        variant="ghost"
                                        onClick={() => setActiveSubjectId(null)}
                                        className="bg-white/20 hover:bg-white/40 text-white rounded-2xl font-black uppercase text-xs px-6"
                                      >
                                        ← Torna alle autonomie
                                      </Button>
                                      <div className="px-4 py-1 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Il mio Diario
                                      </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-6">
                                      <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-white/20 rounded-[30px] flex items-center justify-center backdrop-blur-md">
                                          <Icon size={40} />
                                        </div>
                                        <div>
                                          <h3 className="text-5xl font-black uppercase tracking-tighter">
                                            {subject.name}
                                          </h3>
                                          <p className="text-white/70 font-bold uppercase tracking-widest text-sm">
                                            Le mie conquiste
                                          </p>
                                        </div>
                                      </div>
                                      <div className="relative group">
                                        <Button
                                          size="lg"
                                          className="h-16 px-8 rounded-3xl bg-white text-slate-900 hover:bg-white/90 font-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                                        >
                                          <Plus size={24} /> Aggiungi Foto
                                        </Button>
                                        <input
                                          type="file"
                                          className="absolute inset-0 opacity-0 cursor-pointer"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const newDiary =
                                                  data.autonomyDiary.map(
                                                    (s) => {
                                                      if (s.id === subject.id) {
                                                        return {
                                                          ...s,
                                                          activities: [
                                                            {
                                                              id: Math.random()
                                                                .toString(36)
                                                                .substr(2, 9),
                                                              type: "image",
                                                              content:
                                                                reader.result as string,
                                                              date: new Date().toLocaleDateString(
                                                                "it-IT",
                                                              ),
                                                            },
                                                            ...s.activities,
                                                          ],
                                                        } as any;
                                                      }
                                                      return s;
                                                    },
                                                  );
                                                setData({
                                                  ...data,
                                                  autonomyDiary: newDiary,
                                                });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-1 p-10 bg-slate-50/50 overflow-y-auto max-h-[600px] custom-scrollbar">
                                    {subject.activities.length === 0 ? (
                                      <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6 opacity-50 py-32">
                                        <div className="w-32 h-32 rounded-[40px] border-4 border-dashed border-slate-200 flex items-center justify-center">
                                          <Icon size={48} />
                                        </div>
                                        <p className="text-xl font-black uppercase tracking-widest text-center leading-relaxed">
                                          Carica una foto per questo obiettivo!
                                          <br />
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {subject.activities.map((act) => (
                                          <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={act.id}
                                            className="bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 group relative overflow-hidden"
                                          >
                                            <div className="relative rounded-[30px] overflow-hidden aspect-video bg-slate-100 mb-6 shadow-inner ring-4 ring-slate-50">
                                              <img
                                                src={act.content}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                              />
                                              <button
                                                onClick={() => {
                                                  const newDiary =
                                                    data.autonomyDiary.map(
                                                      (s) => {
                                                        if (
                                                          s.id === subject.id
                                                        ) {
                                                          return {
                                                            ...s,
                                                            activities:
                                                              s.activities.filter(
                                                                (a) =>
                                                                  a.id !==
                                                                  act.id,
                                                              ),
                                                          };
                                                        }
                                                        return s;
                                                      },
                                                    );
                                                  setData({
                                                    ...data,
                                                    autonomyDiary: newDiary,
                                                  });
                                                }}
                                                className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-rose-600 hover:scale-110 active:scale-95"
                                              >
                                                <Trash2 size={24} />
                                              </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-lg font-black text-slate-800">
                                                {act.date}
                                              </span>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                        </div>
                      )}
                    </div>
                  )}

                  {studentSubSection === "relax" && (
                    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-[28px] sm:rounded-[50px] p-4 sm:p-8 md:p-12 border-4 border-white/10">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-12">
                          <div>
                            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter">
                              La mia bolla relax
                            </h3>
                            <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs sm:text-sm mt-1 sm:mt-2">
                              I miei momenti di tranquillità
                            </p>
                          </div>
                          <div className="relative group">
                            <Button
                              size="lg"
                              className="h-16 px-8 rounded-3xl bg-indigo-500 text-white hover:bg-indigo-600 font-black uppercase shadow-2xl flex items-center gap-3"
                            >
                              <Plus size={24} /> Aggiungi attività
                            </Button>
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setData({
                                      ...data,
                                      relaxArea: [
                                        {
                                          id: Math.random()
                                            .toString(36)
                                            .substr(2, 9),
                                          type: "image",
                                          content: reader.result as string,
                                          date: new Date().toLocaleDateString(
                                            "it-IT",
                                          ),
                                        },
                                        ...data.relaxArea,
                                      ],
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {/* Interactive Calming Tools Row */}
                        <div className="mb-12 bg-white/5 p-4 sm:p-8 rounded-[24px] sm:rounded-[40px] border-2 border-white/5 shadow-inner">
                          <h4 className="text-lg font-black text-white uppercase tracking-wider mb-6 text-center md:text-left">
                            Esercizi e Attività Calmanti
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Option 1: Soap Bubbles */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setActiveRelaxTool(
                                  activeRelaxTool === "bubbles"
                                    ? null
                                    : "bubbles",
                                )
                              }
                              className={cn(
                                "p-6 rounded-[32px] border-4 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-lg",
                                activeRelaxTool === "bubbles"
                                  ? "bg-cyan-500 border-cyan-300 text-slate-950 scale-102"
                                  : "bg-slate-900/40 hover:bg-slate-900/60 border-white/10 text-slate-200",
                              )}
                            >
                              <span className="text-4xl">🫧</span>
                              <span className="font-black text-sm uppercase tracking-tight">
                                Bolle di Sapone
                              </span>
                            </motion.button>

                            {/* Option 2: Stress Ball */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setActiveRelaxTool(
                                  activeRelaxTool === "stressball"
                                    ? null
                                    : "stressball",
                                )
                              }
                              className={cn(
                                "p-6 rounded-[32px] border-4 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-lg",
                                activeRelaxTool === "stressball"
                                  ? "bg-rose-500 border-rose-300 text-white scale-102"
                                  : "bg-slate-900/40 hover:bg-slate-900/60 border-white/10 text-slate-200",
                              )}
                            >
                              <span className="text-4xl">🔴</span>
                              <span className="font-black text-sm uppercase tracking-tight">
                                Schiaccia la Pallina
                              </span>
                            </motion.button>

                            {/* Option 3: Memory */}
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setActiveRelaxTool(
                                  activeRelaxTool === "memory"
                                    ? null
                                    : "memory",
                                )
                              }
                              className={cn(
                                "p-6 rounded-[32px] border-4 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-lg",
                                activeRelaxTool === "memory"
                                  ? "bg-yellow-400 border-yellow-200 text-slate-950 scale-102"
                                  : "bg-slate-900/40 hover:bg-slate-900/60 border-white/10 text-slate-200",
                              )}
                            >
                              <span className="text-4xl">🃏</span>
                              <span className="font-black text-sm uppercase tracking-tight">
                                Memory
                              </span>
                            </motion.button>
                          </div>

                          {/* Active Game Display Panel */}
                          {activeRelaxTool && (
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-8 max-w-2xl mx-auto w-full"
                            >
                              {activeRelaxTool === "bubbles" && (
                                <SoapBubblesGame />
                              )}
                              {activeRelaxTool === "stressball" && (
                                <StressBallGame />
                              )}
                              {activeRelaxTool === "memory" && <MemoryGame />}
                            </motion.div>
                          )}
                        </div>

                        {data.relaxArea.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-32 text-indigo-200/40 gap-6">
                            <div className="w-40 h-40 rounded-full border-8 border-dashed border-indigo-200/20 flex items-center justify-center">
                              <Coffee size={64} />
                            </div>
                            <p className="text-2xl font-black uppercase text-center">
                              Cosa ti fa stare bene?
                              <br />
                              <span className="text-sm font-bold opacity-60">
                                Carica foto o video rilassanti
                              </span>
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.relaxArea.map((item) => (
                              <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                key={item.id}
                                className="bg-white p-6 rounded-[40px] shadow-2xl border-b-8 border-indigo-100 group relative"
                              >
                                <div className="aspect-square rounded-[30px] overflow-hidden bg-slate-50 mb-4 shadow-inner ring-4 ring-indigo-50/50">
                                  <img
                                    src={item.content}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                                  <button
                                    onClick={() => {
                                      setData({
                                        ...data,
                                        relaxArea: data.relaxArea.filter(
                                          (a) => a.id !== item.id,
                                        ),
                                      });
                                    }}
                                    className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                  >
                                    <Trash2 size={24} />
                                  </button>
                                </div>
                                <div className="flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse mr-2" />
                                  <span className="text-indigo-500 font-black uppercase text-xs tracking-widest italic">
                                    Momento Relax
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {studentSubSection === "progetto_vita" && (
                    <div className="w-full max-w-6xl mx-auto p-4">
                      <div className="bg-yellow-100/10 backdrop-blur-md rounded-[50px] p-8 md:p-12 border-4 border-yellow-400/20">
                        {/* Header card with gold/orange badge */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-yellow-400 text-slate-900 p-8 rounded-[40px] shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />
                          <div className="space-y-2">
                            <span className="text-[11px] font-black uppercase tracking-widest bg-yellow-950/20 px-3 py-1 rounded-full text-yellow-900">
                              Cresciamo Insieme
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                              Il mio progetto di vita
                            </h3>
                            <p className="text-sm font-medium opacity-90 max-w-xl">
                              Qui puoi scrivere e immaginare il tuo futuro, la
                              tua autonomia e tutto ciò che desideri imparare o
                              fare meglio anno dopo anno!
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveInstructionsModal("progetto_vita")
                            }
                            className="bg-yellow-950/10 hover:bg-yellow-950/20 border border-yellow-950/20 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                          >
                            <Info size={16} /> Note per la Famiglia
                          </button>
                        </div>

                        {/* Middle tabs - Classes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {([1, 2, 3] as const).map((classId) => (
                            <button
                              key={classId}
                              type="button"
                              onClick={() => setActiveClassTab(classId)}
                              className={`p-6 rounded-[35px] border-2 text-left relative overflow-hidden transition-all shadow-sm group ${
                                activeClassTab === classId
                                  ? "border-yellow-500 bg-yellow-400/20 ring-4 ring-yellow-400/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/15"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                                    activeClassTab === classId
                                      ? "bg-yellow-500 text-slate-950"
                                      : "bg-white/20 text-white"
                                  }`}
                                >
                                  {classId}°
                                </span>
                                <span
                                  className={cn(
                                    "text-lg font-black",
                                    activeClassTab === classId
                                      ? "text-yellow-400"
                                      : "text-white",
                                  )}
                                >
                                  Classe{" "}
                                  {classId === 1
                                    ? "Prima"
                                    : classId === 2
                                      ? "Seconda"
                                      : "Terza"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Interactive boxes for 4 domains */}
                        <motion.div
                          key={activeClassTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8"
                        >
                          <h4 className="text-2xl font-black text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
                              {activeClassTab}°
                            </span>
                            I miei traguardi per il {activeClassTab}° anno
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Comunicazione */}
                            <div className="space-y-4 p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-sm relative overflow-hidden group">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🗣️</span>
                                <Label className="text-lg font-black text-white block">
                                  La mia Comunicazione
                                </Label>
                              </div>
                              <textarea
                                className="w-full min-h-[140px] p-5 rounded-2xl border border-white/10 bg-white/5 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all text-sm text-white"
                                placeholder="Come voglio comunicare con i compagni e i professori?"
                                value={
                                  activeClassTab === 1
                                    ? data.communication1 || ""
                                    : activeClassTab === 2
                                      ? data.communication2 || ""
                                      : data.communication3 || ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (activeClassTab === 1)
                                    setData({ ...data, communication1: val });
                                  else if (activeClassTab === 2)
                                    setData({ ...data, communication2: val });
                                  else
                                    setData({ ...data, communication3: val });
                                }}
                              />
                            </div>

                            {/* Autonomia */}
                            <div className="space-y-4 p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-sm relative overflow-hidden group">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🚶</span>
                                <Label className="text-lg font-black text-white block">
                                  La mia Autonomia
                                </Label>
                              </div>
                              <textarea
                                className="w-full min-h-[140px] p-5 rounded-2xl border border-white/10 bg-white/5 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all text-sm text-white"
                                placeholder="Cosa voglio saper fare da solo (es. preparare lo zaino, spostarmi)?"
                                value={
                                  activeClassTab === 1
                                    ? data.autonomy1 || ""
                                    : activeClassTab === 2
                                      ? data.autonomy2 || ""
                                      : data.autonomy3 || ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (activeClassTab === 1)
                                    setData({ ...data, autonomy1: val });
                                  else if (activeClassTab === 2)
                                    setData({ ...data, autonomy2: val });
                                  else setData({ ...data, autonomy3: val });
                                }}
                              />
                            </div>

                            {/* Apprendimenti */}
                            <div className="space-y-4 p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 shadow-sm relative overflow-hidden group">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">📚</span>
                                <Label className="text-lg font-black text-white block">
                                  I miei Apprendimenti
                                </Label>
                              </div>
                              <textarea
                                className="w-full min-h-[140px] p-5 rounded-2xl border border-white/10 bg-white/5 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all text-sm text-white"
                                placeholder="Quali materie o laboratori voglio approfondire?"
                                value={
                                  activeClassTab === 1
                                    ? data.learning1 || ""
                                    : activeClassTab === 2
                                      ? data.learning2 || ""
                                      : data.learning3 || ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (activeClassTab === 1)
                                    setData({ ...data, learning1: val });
                                  else if (activeClassTab === 2)
                                    setData({ ...data, learning2: val });
                                  else setData({ ...data, learning3: val });
                                }}
                              />
                            </div>

                            {/* Relazioni */}
                            <div className="space-y-4 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-sm relative overflow-hidden group">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">🤝</span>
                                <Label className="text-lg font-black text-white block">
                                  Le mie Relazioni
                                </Label>
                              </div>
                              <textarea
                                className="w-full min-h-[140px] p-5 rounded-2xl border border-white/10 bg-white/5 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 outline-none transition-all text-sm text-white"
                                placeholder="Come voglio stare con gli altri, con gli amici e fare gruppo?"
                                value={
                                  activeClassTab === 1
                                    ? data.relation1 || ""
                                    : activeClassTab === 2
                                      ? data.relation2 || ""
                                      : data.relation3 || ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (activeClassTab === 1)
                                    setData({ ...data, relation1: val });
                                  else if (activeClassTab === 2)
                                    setData({ ...data, relation2: val });
                                  else setData({ ...data, relation3: val });
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {![
                    "day",
                    "diary",
                    "passport",
                    "choice",
                    "autonomy",
                    "relax",
                    "progetto_vita",
                  ].includes(studentSubSection as any) &&
                    studentSubSection !== null && (
                      <Card className="bg-white/95 backdrop-blur-md rounded-[40px] p-12 border-none shadow-2xl h-full min-h-[50vh] flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <BookOpen size={48} />
                          </div>
                          <h3 className="text-3xl font-black text-slate-900">
                            Sezione in arrivo
                          </h3>
                          <p className="text-xl text-slate-500">
                            Stiamo preparando questa attività per te!
                          </p>
                        </div>
                      </Card>
                    )}
                </div>
              )}
            </motion.div>
          ) : role === "school-family" ? (
            <motion.div
              key="communicator-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CAACommunicator onBack={() => setRole(null)} />
            </motion.div>
          ) : role === "school" ? (
            <motion.div
              key="school-observation-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4 text-center">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
                  <div className="text-center">
                    <h2 className="text-5xl font-black text-white">
                      {t.school.welcome}
                    </h2>
                    <p className="text-xl text-blue-100">
                      Sezione dedicata agli insegnanti e al personale
                      scolastico.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (activeSchoolArea) {
                        setActiveSchoolArea(null);
                      } else {
                        saveToLocalStorage();
                        setRole(null);
                      }
                    }}
                    className="md:absolute md:right-0 rounded-2xl h-14 px-8 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronLeft size={20} className="mr-2" />{" "}
                    {activeSchoolArea ? "Torna alle aree" : "Torna alla scelta"}
                  </Button>
                </div>
              </div>

              {!activeSchoolArea ? (
                <SchoolManager
                  data={data}
                  onChange={(newData) => {
                    setData(newData);
                    saveToLocalStorage(newData);
                  }}
                  onSelectArea={(areaKey) => setActiveSchoolArea(areaKey)}
                  translations={translations[lang]}
                />
              ) : (
                <div className="max-w-4xl mx-auto">
                  {(() => {
                    const areaKey =
                      activeSchoolArea as keyof typeof data.schoolAreas;
                    const descKey = `${String(areaKey)}Desc` as any;
                    const currentDetail = data.schoolDisciplineDetails?.[areaKey] || {
                      segueProgramma: null,
                      obiettivi: "",
                      verificaPrimoQuadrimestre: "",
                      verificaSecondoQuadrimestre: ""
                    };

                    const handleUpdateDetail = (field: string, val: any) => {
                      const updated = {
                        ...(data.schoolDisciplineDetails || {}),
                        [areaKey]: {
                          ...(data.schoolDisciplineDetails?.[areaKey] || {
                            segueProgramma: null,
                            obiettivi: "",
                            verificaPrimoQuadrimestre: "",
                            verificaSecondoQuadrimestre: ""
                          }),
                          [field]: val
                        }
                      };
                      const newData = {
                        ...data,
                        schoolDisciplineDetails: updated
                      };
                      setData(newData);
                      saveToLocalStorage(newData);
                    };

                    return (
                      <Card className="p-10 rounded-[40px] border-none shadow-2xl bg-white/95 backdrop-blur-sm">
                        <div className="space-y-8 text-slate-800">
                          <div className="space-y-2 text-center pb-6 border-b border-slate-100">
                            <Label className="text-4xl font-black text-blue-600">
                              {t.school[areaKey]}
                            </Label>
                            <p className="text-lg text-slate-400 font-medium">
                              {t.school[descKey]}
                            </p>
                          </div>

                          {/* Sezione Programma di Classe */}
                          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                            <h4 className="text-lg font-black text-slate-900 border-l-4 border-blue-500 pl-4 uppercase tracking-tight">
                              Programma scolastico della classe
                            </h4>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              Specifica se l'alunno segue la programmazione didattica ministeriale prevista per il gruppo classe o se ha un percorso disciplinare individualizzato.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateDetail("segueProgramma", true)}
                                className={cn(
                                  "p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between cursor-pointer",
                                  currentDetail.segueProgramma === true
                                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950"
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50/55"
                                )}
                              >
                                <div className="pr-4 font-normal text-slate-700">
                                  <span className="block text-base font-black uppercase text-slate-900 tracking-tight">Sì, segue il programma</span>
                                  <span className="block text-[11px] font-medium text-slate-400 mt-1">L'alunno segue le linee guida ministeriali ordinarie della classe.</span>
                                </div>
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2",
                                  currentDetail.segueProgramma === true ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                                )}>
                                  {currentDetail.segueProgramma === true && "✓"}
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleUpdateDetail("segueProgramma", false)}
                                className={cn(
                                  "p-5 rounded-2xl text-left border-2 transition-all flex items-center justify-between cursor-pointer",
                                  currentDetail.segueProgramma === false
                                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-950"
                                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50/55"
                                )}
                              >
                                <div className="pr-4 font-normal text-slate-700">
                                  <span className="block text-base font-black uppercase text-slate-900 tracking-tight">No, non segue il programma</span>
                                  <span className="block text-[11px] font-medium text-slate-400 mt-1">L'alunno segue una programmazione didattica semplificata o differenziata.</span>
                                </div>
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-2",
                                  currentDetail.segueProgramma === false ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300"
                                )}>
                                  {currentDetail.segueProgramma === false && "✓"}
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Sezione Obiettivi da Raggiungere */}
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-l-4 border-blue-500 pl-4">
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                Obiettivi da raggiungere per questa materia
                              </h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalTitle("Modello SMART per gli Obiettivi");
                                  setAiExplanation(
                                    `La formulazione degli obiettivi secondo il modello <strong>S.M.A.R.T.</strong> garantisce la chiarezza e l'efficacia del percorso didattico personalizzato:<br/><br/>` +
                                    `• <strong>S - Specific (Specifico):</strong> L'obiettivo descrive esattamente cosa l'alunno deve essere in grado di fare, senza ambiguità. Usa verbi d'azione osservabili (es. scrivere, identificare, scegliere, eseguire), evitando termini vaghi (es. comprendere, migliorare).<br/><br/>` +
                                    `• <strong>M - Measurable (Misurabile):</strong> Deve essere possibile determinare oggettivamente se l'obiettivo è stato raggiunto. Definisci criteri quantitativi o percentuali (es. 'correttamente in 4 casi su 5', 'con un aiuto visivo massimo', 'almeno 3 parole').<br/><br/>` +
                                    `• <strong>A - Achievable (Raggiungibile):</strong> Definisci traguardi realistici basati sulle potenzialità reali dell'alunno, considerando i suoi punti di forza e barriere (un traguardo troppo ambizioso genera frustrazione).<br/><br/>` +
                                    `• <strong>R - Relevant (Rilevante):</strong> L'obiettivo ha importanza concreta per la vita dell'alunno, la sua autonomia scolastica e sociale o per lo sviluppo di abilità funzionali collegate alla sua quotidianità.<br/><br/>` +
                                    `• <strong>T - Time-bound (Temporizzato):</strong> Stabilisci scadenze precise entro cui verificare il traguardo (es. 'entro il primo quadrimestre', 'entro la fine dell'anno scolastico', 'nell'arco di 3 mesi').<br/><br/>` +
                                    `<strong>Esempio SMART:</strong><br/>` +
                                    `<em>«Entro marzo [T], l'alunno identificherà autonomamente [S] i giorni della settimana su un calendario illustrato [A, R] con una precisione di almeno 5 risposte corrette su 7 tentativi [M].»</em>`
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full text-xs font-black uppercase tracking-wider self-start sm:self-center shadow-md shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                              >
                                <Sparkles size={12} /> Guida SMART
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 font-medium pl-4">
                              Indica le competenze e i traguardi d'apprendimento specifici previsti in questo anno per l'alunno:
                            </p>
                            <textarea
                              value={currentDetail.obiettivi || ""}
                              onChange={(e) => handleUpdateDetail("obiettivi", e.target.value)}
                              placeholder="Inserisci traguardi di competenza, abilità minime, facilitatori ed eventuali obiettivi intermedi..."
                              className="w-full min-h-[140px] p-5 rounded-[24px] border-2 border-blue-100 bg-blue-50/20 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base text-slate-900 placeholder-slate-400"
                            />
                          </div>

                          {/* Sezione Verifiche Quadrimestrali */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-black text-slate-900 border-l-4 border-blue-500 pl-4 uppercase tracking-tight">
                              Valutazione & Verifiche Quadrimestrali
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-tight block">
                                  Primo Quadrimestre
                                </label>
                                <textarea
                                  value={currentDetail.verificaPrimoQuadrimestre || ""}
                                  onChange={(e) => handleUpdateDetail("verificaPrimoQuadrimestre", e.target.value)}
                                  placeholder="Inserisci modalità di verifica, esiti ed eventuale livello di autonomia del primo quadrimestre..."
                                  className="w-full min-h-[160px] p-5 rounded-[24px] border-2 border-slate-200 bg-slate-50/50 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 placeholder-slate-400"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-tight block">
                                  Secondo Quadrimestre
                                </label>
                                <textarea
                                  value={currentDetail.verificaSecondoQuadrimestre || ""}
                                  onChange={(e) => handleUpdateDetail("verificaSecondoQuadrimestre", e.target.value)}
                                  placeholder="Inserisci modalità di verifica, esiti finali conseguiti ed eventuale livello di autonomia a fine anno scolastico..."
                                  className="w-full min-h-[160px] p-5 rounded-[24px] border-2 border-slate-200 bg-slate-50/50 focus:border-blue-500 outline-none transition-all text-sm text-slate-900 placeholder-slate-400"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center pt-6">
                            <Button
                              onClick={() => {
                                saveToLocalStorage();
                                setActiveSchoolArea(null);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] h-14 px-12 font-bold text-lg shadow-xl transition-all"
                            >
                              Salva area e continua
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })()}
                </div>
              )}

              <div className="flex justify-center pt-8">
                <Button
                  onClick={() => {
                    saveToLocalStorage();
                    setRole(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-[32px] h-20 px-20 font-black text-2xl shadow-2xl shadow-emerald-200/50 transition-all hover:scale-105 active:scale-95"
                >
                  CONFERMA E CHIUDI PEI
                </Button>
              </div>
            </motion.div>
          ) : currentStep === null ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center space-y-12"
            >
              <div className="w-full max-w-2xl flex justify-start">
                <Button
                  variant="ghost"
                  onClick={() => setRole(null)}
                  className="rounded-2xl h-12 px-6 font-bold text-white hover:bg-white/10"
                >
                  <ChevronLeft size={20} className="mr-2" /> Torna alla scelta
                </Button>
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-white leading-tight">
                  {t.welcome}
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  {t.choose}
                </p>
              </div>

              <div className="flex flex-col gap-6 w-full max-w-2xl">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(index)}
                    className="group relative flex items-center bg-white backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10 text-left p-6 transition-all"
                  >
                    <div className="flex-1 space-y-2">
                      <h3 className={cn("text-2xl font-black", step.textColor)}>
                        {step.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center p-2">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:rotate-6"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* CAA Image and Title Section */}
              <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
                  <img
                    src={steps[currentStep].image}
                    alt="CAA Section"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div
                    className={cn(
                      "inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 text-white",
                      steps[currentStep].color,
                    )}
                  >
                    {t.sections[currentStep].title}
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                    {steps[currentStep].title}
                  </h2>
                  <div className="space-y-2 mb-4">
                    {steps[currentStep].rules?.map((rule, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                      >
                        <CheckCircle2
                          size={16}
                          className={steps[currentStep].textColor}
                        />
                        {rule}
                      </div>
                    ))}
                  </div>
                  <p className="text-lg text-slate-500 max-w-lg">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Content Card */}
              <Card className="p-10 rounded-[40px] border-none shadow-2xl shadow-slate-200/60 bg-white/90 backdrop-blur-sm min-h-[500px]">
                {currentStep === 0 && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-base font-bold flex items-center gap-2">
                          {t.studentName}
                        </Label>
                        <Input
                          value={data.studentName}
                          onChange={(e) =>
                            setData({ ...data, studentName: e.target.value })
                          }
                          placeholder={t.studentName}
                          className="h-14 rounded-2xl border-slate-200 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">
                          {t.birthDate}
                        </Label>
                        <Input
                          type="date"
                          value={data.birthDate}
                          onChange={(e) =>
                            setData({ ...data, birthDate: e.target.value })
                          }
                          className="h-14 rounded-2xl border-slate-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">
                          {t.originCountry}
                        </Label>
                        <div className="flex gap-2">
                          <Select
                            value={data.originCountry}
                            onValueChange={(v) =>
                              setData({ ...data, originCountry: v })
                            }
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-slate-200 flex-1">
                              <SelectValue placeholder={t.originCountry} />
                            </SelectTrigger>
                            <SelectContent>
                              {countryList.map((c) => (
                                <SelectItem key={c.cca2} value={c.name}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {data.originCountry && (
                            <Button
                              variant="outline"
                              className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-red-500"
                              onClick={() =>
                                setData({ ...data, originCountry: "" })
                              }
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">
                          {t.languages}
                        </Label>
                        <div className="space-y-2">
                          <Select
                            onValueChange={(v) => {
                              if (!data.languagesSpoken.includes(v)) {
                                setData({
                                  ...data,
                                  languagesSpoken: [...data.languagesSpoken, v],
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-slate-200">
                              <SelectValue placeholder={t.languages} />
                            </SelectTrigger>
                            <SelectContent>
                              {commonLanguages.map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {data.languagesSpoken.map((l) => (
                              <Badge
                                key={l}
                                variant="secondary"
                                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1"
                              >
                                {l}
                                <button
                                  onClick={() =>
                                    setData({
                                      ...data,
                                      languagesSpoken:
                                        data.languagesSpoken.filter(
                                          (lang) => lang !== l,
                                        ),
                                    })
                                  }
                                  className="hover:text-red-500"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <Label className="text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
                          Dicitura Sensoriale / Codici Comunicativi
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant={data.lis === true ? "default" : "outline"}
                            className={cn(
                              "rounded-xl h-12 font-bold",
                              data.lis === true
                                ? "bg-blue-600 text-white"
                                : "border-slate-200",
                            )}
                            onClick={() =>
                              setData({
                                ...data,
                                lis: data.lis === true ? null : true,
                              })
                            }
                          >
                            LIS
                          </Button>
                          <Button
                            variant={
                              data.braille === true ? "default" : "outline"
                            }
                            className={cn(
                              "rounded-xl h-12 font-bold",
                              data.braille === true
                                ? "bg-blue-600 text-white"
                                : "border-slate-200",
                            )}
                            onClick={() =>
                              setData({
                                ...data,
                                braille: data.braille === true ? null : true,
                              })
                            }
                          >
                            Braille
                          </Button>
                          <Button
                            variant={
                              data.isDeaf === true ? "default" : "outline"
                            }
                            className={cn(
                              "rounded-xl h-12 font-bold",
                              data.isDeaf === true
                                ? "bg-blue-600 text-white"
                                : "border-slate-200",
                            )}
                            onClick={() =>
                              setData({
                                ...data,
                                isDeaf: data.isDeaf === true ? null : true,
                              })
                            }
                          >
                            {t.deaf}
                          </Button>
                          <Button
                            variant={
                              data.isBlind === true ? "default" : "outline"
                            }
                            className={cn(
                              "rounded-xl h-12 font-bold",
                              data.isBlind === true
                                ? "bg-blue-600 text-white"
                                : "border-slate-200",
                            )}
                            onClick={() =>
                              setData({
                                ...data,
                                isBlind: data.isBlind === true ? null : true,
                              })
                            }
                          >
                            {t.blind}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      <Label className="text-base font-bold flex items-center gap-2">
                        {t.schoolHistory}
                      </Label>

                      <div className="grid grid-cols-1 gap-6">
                        {(
                          Object.keys(t.schoolLevels) as Array<
                            keyof typeof t.schoolLevels
                          >
                        ).map((level, idx) => {
                          const colors = [
                            "bg-blue-50 border-blue-100",
                            "bg-blue-100 border-blue-200",
                            "bg-blue-600 border-blue-700",
                            "bg-blue-900 border-blue-950",
                          ];
                          const isDark = idx >= 2;
                          return (
                            <div
                              key={level}
                              className={cn(
                                "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border transition-all",
                                colors[idx],
                              )}
                            >
                              <div className="md:col-span-1 flex items-center">
                                <Label
                                  className={cn(
                                    "text-sm font-bold",
                                    isDark ? "text-white" : "text-blue-900",
                                  )}
                                >
                                  {t.schoolLevels[level]}
                                </Label>
                              </div>
                              <div className="md:col-span-1">
                                <Input
                                  value={data.schoolHistory[level]}
                                  onChange={(e) =>
                                    setData({
                                      ...data,
                                      schoolHistory: {
                                        ...data.schoolHistory,
                                        [level]: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder={t.schoolHistoryPlaceholder}
                                  className={cn(
                                    "h-12 rounded-xl border-none",
                                    isDark
                                      ? "bg-white/20 text-white placeholder:text-white/50"
                                      : "bg-white text-slate-900",
                                  )}
                                />
                              </div>
                              <div className="md:col-span-1">
                                <Input
                                  value={
                                    data.schoolYears
                                      ? (data as any).schoolYears[level]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    setData({
                                      ...data,
                                      schoolYears: {
                                        ...(data as any).schoolYears,
                                        [level]: e.target.value,
                                      },
                                    } as any)
                                  }
                                  placeholder={t.schoolYearsPlaceholder}
                                  className={cn(
                                    "h-12 rounded-xl border-none",
                                    isDark
                                      ? "bg-white/20 text-white placeholder:text-white/50"
                                      : "bg-white text-slate-900",
                                  )}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Coffee size={24} /> {t.freeTime}
                      </Label>
                      <textarea
                        className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                        placeholder={t.freeTimePlaceholder}
                        value={data.freeTime}
                        onChange={(e) =>
                          setData({ ...data, freeTime: e.target.value })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveInstructionsModal("strengths")
                            }
                            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm border border-blue-200/50 group relative"
                            title="Istruzioni Punti di Forza"
                          >
                            <CheckCircle2
                              size={24}
                              className="group-hover:rotate-6 transition-transform"
                            />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center text-[9px] text-white font-black animate-pulse">
                              ?
                            </span>
                          </button>
                          <div className="flex flex-col">
                            <Label
                              className="text-xl font-black text-slate-900 cursor-pointer"
                              onClick={() =>
                                setActiveInstructionsModal("strengths")
                              }
                            >
                              {t.strengths}
                            </Label>
                            <span
                              className="text-[10px] text-blue-600 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                              onClick={() =>
                                setActiveInstructionsModal("strengths")
                              }
                            >
                              Clicca il simbolo per Info
                            </span>
                          </div>
                        </div>
                        <textarea
                          className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                          placeholder={t.strengthsPlaceholder}
                          value={data.strengths}
                          onChange={(e) =>
                            setData({ ...data, strengths: e.target.value })
                          }
                        />

                        {/* Album Fotografico */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-black text-slate-700 uppercase tracking-wider">
                              Album Fotografico delle sue abilità
                            </Label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                id="strengths-photos-upload"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files) {
                                    const filesArray = Array.from(
                                      e.target.files,
                                    ) as File[];
                                    filesArray.forEach((file: File) => {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setData((prev) => ({
                                          ...prev,
                                          strengthsPhotos: [
                                            ...(prev.strengthsPhotos || []),
                                            reader.result as string,
                                          ],
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    });
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  document
                                    .getElementById("strengths-photos-upload")
                                    ?.click()
                                }
                                className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold gap-2"
                              >
                                <Plus size={14} /> Carica Foto
                              </Button>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">
                            Carica le foto delle attività, dei disegni o dei
                            lavori svolti dall'alunno per vedere e documentare
                            cosa sa fare!
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {(data.strengthsPhotos || []).map((photo, pIdx) => (
                              <div
                                key={pIdx}
                                className="relative aspect-square rounded-2xl border-4 border-slate-100 overflow-hidden bg-slate-50 group hover:border-blue-400 transition-all shadow-sm"
                              >
                                <img
                                  src={photo}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPhotos = [
                                      ...(data.strengthsPhotos || []),
                                    ];
                                    newPhotos.splice(pIdx, 1);
                                    setData({
                                      ...data,
                                      strengthsPhotos: newPhotos,
                                    });
                                  }}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold shadow transition-opacity opacity-0 group-hover:opacity-100"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {(data.strengthsPhotos || []).length === 0 && (
                              <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl text-xs text-slate-400 font-bold">
                                Nessuna foto presente. Carica una foto per
                                creare l'album!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveInstructionsModal("needs")}
                            className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-600 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm border border-amber-200/50 group relative"
                            title="Istruzioni Bisogni e Difficoltà"
                          >
                            <Info
                              size={24}
                              className="group-hover:rotate-6 transition-transform"
                            />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border border-white flex items-center justify-center text-[9px] text-white font-black animate-pulse">
                              ?
                            </span>
                          </button>
                          <div className="flex flex-col">
                            <Label
                              className="text-xl font-black text-slate-900 cursor-pointer"
                              onClick={() =>
                                setActiveInstructionsModal("needs")
                              }
                            >
                              {t.needs}
                            </Label>
                            <span
                              className="text-[10px] text-amber-600 font-bold uppercase tracking-wider hover:underline cursor-pointer"
                              onClick={() =>
                                setActiveInstructionsModal("needs")
                              }
                            >
                              Clicca il simbolo per Info
                            </span>
                          </div>
                        </div>
                        <textarea
                          className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                          placeholder={t.needsPlaceholder}
                          value={data.needs}
                          onChange={(e) =>
                            setData({ ...data, needs: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <GenogramEditor
                    members={data.familyMembers}
                    relationships={data.relationships}
                    onChange={(members, relationships) =>
                      setData({
                        ...data,
                        familyMembers: members,
                        relationships: relationships,
                      })
                    }
                    t={t.genogram}
                    lang={lang}
                  />
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                          <Compass className="animate-spin-slow" size={28} />
                        </div>
                        <Label className="text-2xl font-black text-slate-900">
                          Progetto di Vita
                        </Label>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveInstructionsModal("progetto_vita")
                          }
                          className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-600 transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-200"
                          title="Informazioni Progetto di Vita"
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Classe Prima card */}
                      <button
                        type="button"
                        onClick={() => setActiveClassTab(1)}
                        className={`p-6 rounded-[35px] border-2 text-left relative overflow-hidden transition-all shadow-sm group ${
                          activeClassTab === 1
                            ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-50"
                            : "border-slate-100 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full translate-x-1/3 -translate-y-1/3 flex items-center justify-center font-black text-emerald-600/10 text-6xl pointer-events-none">
                          1
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                              activeClassTab === 1
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-300 text-slate-700"
                            }`}
                          >
                            1°
                          </span>
                          <span className="text-lg font-black text-slate-800">
                            Classe Prima
                          </span>
                        </div>
                      </button>

                      {/* Classe Seconda card */}
                      <button
                        type="button"
                        onClick={() => setActiveClassTab(2)}
                        className={`p-6 rounded-[35px] border-2 text-left relative overflow-hidden transition-all shadow-sm group ${
                          activeClassTab === 2
                            ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-50"
                            : "border-slate-100 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full translate-x-1/3 -translate-y-1/3 flex items-center justify-center font-black text-emerald-600/10 text-6xl pointer-events-none">
                          2
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                              activeClassTab === 2
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-300 text-slate-700"
                            }`}
                          >
                            2°
                          </span>
                          <span className="text-lg font-black text-slate-800">
                            Classe Seconda
                          </span>
                        </div>
                      </button>

                      {/* Classe Terza card */}
                      <button
                        type="button"
                        onClick={() => setActiveClassTab(3)}
                        className={`p-6 rounded-[35px] border-2 text-left relative overflow-hidden transition-all shadow-sm group ${
                          activeClassTab === 3
                            ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-50"
                            : "border-slate-100 bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full translate-x-1/3 -translate-y-1/3 flex items-center justify-center font-black text-emerald-600/10 text-6xl pointer-events-none">
                          3
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                              activeClassTab === 3
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-300 text-slate-700"
                            }`}
                          >
                            3°
                          </span>
                          <span className="text-lg font-black text-slate-800">
                            Classe Terza
                          </span>
                        </div>
                      </button>
                    </div>

                    <motion.div
                      key={activeClassTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Comunicazione */}
                        <div className="space-y-3">
                          <Label className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {t.communication}
                          </Label>
                          <textarea
                            className="w-full min-h-[140px] p-5 rounded-3xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm text-slate-950 bg-slate-50/20"
                            placeholder={t.communicationPlaceholder}
                            value={
                              activeClassTab === 1
                                ? data.communication1 || ""
                                : activeClassTab === 2
                                  ? data.communication2 || ""
                                  : data.communication3 || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeClassTab === 1)
                                setData({ ...data, communication1: val });
                              else if (activeClassTab === 2)
                                setData({ ...data, communication2: val });
                              else setData({ ...data, communication3: val });
                            }}
                          />
                        </div>

                        {/* Autonomia */}
                        <div className="space-y-3">
                          <Label className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {t.autonomy}
                          </Label>
                          <textarea
                            className="w-full min-h-[140px] p-5 rounded-3xl border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 outline-none transition-all text-sm text-slate-950 bg-slate-50/20"
                            placeholder={t.autonomyPlaceholder}
                            value={
                              activeClassTab === 1
                                ? data.autonomy1 || ""
                                : activeClassTab === 2
                                  ? data.autonomy2 || ""
                                  : data.autonomy3 || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeClassTab === 1)
                                setData({ ...data, autonomy1: val });
                              else if (activeClassTab === 2)
                                setData({ ...data, autonomy2: val });
                              else setData({ ...data, autonomy3: val });
                            }}
                          />
                        </div>

                        {/* Apprendimento */}
                        <div className="space-y-3">
                          <Label className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            {t.learning}
                          </Label>
                          <textarea
                            className="w-full min-h-[140px] p-5 rounded-3xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm text-slate-950 bg-slate-50/20"
                            placeholder={t.learningPlaceholder}
                            value={
                              activeClassTab === 1
                                ? data.learning1 || ""
                                : activeClassTab === 2
                                  ? data.learning2 || ""
                                  : data.learning3 || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeClassTab === 1)
                                setData({ ...data, learning1: val });
                              else if (activeClassTab === 2)
                                setData({ ...data, learning2: val });
                              else setData({ ...data, learning3: val });
                            }}
                          />
                        </div>

                        {/* Relazione */}
                        <div className="space-y-3">
                          <Label className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            {t.relation}
                          </Label>
                          <textarea
                            className="w-full min-h-[140px] p-5 rounded-3xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm text-slate-950 bg-slate-50/20"
                            placeholder={t.relationPlaceholder}
                            value={
                              activeClassTab === 1
                                ? data.relation1 || ""
                                : activeClassTab === 2
                                  ? data.relation2 || ""
                                  : data.relation3 || ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (activeClassTab === 1)
                                setData({ ...data, relation1: val });
                              else if (activeClassTab === 2)
                                setData({ ...data, relation2: val });
                              else setData({ ...data, relation3: val });
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn text-slate-800">
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-purple-100 text-purple-600">
                          <BookCheck size={28} className="animate-pulse" />
                        </div>
                        <Label className="text-2xl font-black text-slate-900">
                          Diario del Giorno & Termometro Emotivo
                        </Label>
                      </div>
                      <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-3xl">
                        Condividi con la scuola le informazioni sull'inizio della giornata di Amir e compila il suo stato emotivo iniziale.
                        Le informazioni inserite qui aggiorneranno direttamente il termometro dell'alunno ed esporranno la spunta con il livello scelto.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Block: Diary Note */}
                      <div className="p-8 bg-white border-2 border-slate-100 rounded-[40px] shadow-sm space-y-6 flex flex-col justify-between">
                        <div className="space-y-4">
                          <Label className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                            Come sta Amir oggi?
                          </Label>
                          <textarea
                            className="w-full min-h-[180px] p-5 rounded-3xl border border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none transition-all text-sm text-slate-950 bg-slate-50/20 leading-relaxed"
                            placeholder="Scrivi qui una nota per gli insegnanti (es. Ha dormito bene? Come ha fatto colazione? È sereno?)..."
                            value={data.familyDailyNote || ""}
                            onChange={(e) => {
                              setData({ ...data, familyDailyNote: e.target.value });
                            }}
                          />
                        </div>

                        {/* Quick Suggest Buttons */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">💡 Suggerimenti Rapidi</span>
                          <div className="flex flex-wrap gap-2 block">
                            {[
                              "Ha dormito bene ed è tranquillo.",
                              "È un po' stanco questa mattina.",
                              "È molto entusiasta e pronto per le attività.",
                              "È un po' agitato per il cambio d'agenda."
                            ].map((suggest) => (
                              <button
                                key={suggest}
                                type="button"
                                onClick={() => {
                                  const currentText = data.familyDailyNote || "";
                                  const spacer = currentText ? " " : "";
                                  if (!currentText.includes(suggest)) {
                                    setData({ ...data, familyDailyNote: currentText + spacer + suggest });
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50 text-slate-600 hover:text-purple-700 text-xs font-medium transition-all text-left"
                              >
                                + {suggest}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Thermometer & State Selection */}
                      <div className="p-8 bg-slate-950 text-white rounded-[40px] shadow-xl space-y-6 flex flex-col items-center justify-center border-4 border-purple-500/10">
                        <Label className="text-md font-bold uppercase tracking-wider text-purple-400 text-center flex items-center gap-2">
                          🌡️ Compila il Termometro dell'Umore
                        </Label>
                        
                        <div className="flex items-end gap-3 relative pb-2 w-full justify-center">
                          {/* Scale indicators */}
                          <div className="flex flex-col justify-between h-48 text-[9px] font-mono text-slate-600 py-1 pr-1 select-none">
                            <span>100</span>
                            <span>50</span>
                            <span>0</span>
                          </div>

                          {/* Thermometer Tube */}
                          <div className="w-7 h-48 bg-slate-900 border-2 border-slate-800 rounded-full relative p-0.5 shadow-inner flex flex-col justify-end overflow-hidden">
                            {/* Mercury Fluid level */}
                            <motion.div
                              animate={{
                                height:
                                  (data.amirFeeling || amirFeeling) === "calmo"
                                    ? "33%"
                                    : (data.amirFeeling || amirFeeling) === "agitato"
                                      ? "66%"
                                      : "100%",
                                background:
                                  (data.amirFeeling || amirFeeling) === "calmo"
                                    ? "linear-gradient(to top, #059669, #34d399)"
                                    : (data.amirFeeling || amirFeeling) === "agitato"
                                      ? "linear-gradient(to top, #d97706, #fbbf24)"
                                      : "linear-gradient(to top, #dc2626, #f87171)",
                              }}
                              transition={{ type: "spring", stiffness: 60, damping: 15 }}
                              className="w-full rounded-full animate-pulse"
                            />
                          </div>

                          {/* Level Labels */}
                          <div className="flex flex-col justify-between h-48 text-[11px] font-bold text-slate-400 py-1 pl-1 select-none">
                            <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "sovraccaricato" ? "text-rose-400 font-extrabold" : "")}> 🔴 Sovraccarico </span>
                            <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "agitato" ? "text-amber-400 font-extrabold" : "")}> 🟡 Agitato </span>
                            <span className={cn("transition-colors duration-200", (data.amirFeeling || amirFeeling) === "calmo" ? "text-emerald-400 font-extrabold" : "")}> 🟢 Calmo </span>
                          </div>
                        </div>

                        {/* Feeling choices - checks/spunte info */}
                        <div className="flex flex-col w-full gap-3 mt-2">
                          <span className="text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">Spunta lo stato emotivo di oggi:</span>
                          <div className="grid grid-cols-3 gap-3 w-full">
                            {[
                              { id: "calmo", label: "Calmo/Felice", icon: "😊", activeBg: "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20" },
                              { id: "agitato", label: "Agitato/Ansioso", icon: "😟", activeBg: "bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/20" },
                              { id: "sovraccaricato", label: "Sovraccarico/Rabbia", icon: "🤬", activeBg: "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20" }
                            ].map((feel) => (
                              <button
                                key={feel.id}
                                type="button"
                                onClick={() => {
                                  changeAmirFeeling(feel.id as any);
                                }}
                                className={cn(
                                  "p-4 rounded-2xl flex flex-col items-center gap-1.5 justify-center border-2 transition-all hover:scale-105 active:scale-95 text-center font-bold text-xs cursor-pointer",
                                  (data.amirFeeling || amirFeeling) === feel.id
                                    ? feel.activeBg
                                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
                                )}
                              >
                                <span className="text-2xl">{feel.icon}</span>
                                <span>{feel.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-16 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (currentStep === 0) setRole(null);
                      else handlePrev();
                    }}
                    className="gap-2 rounded-2xl px-8 h-14 font-bold text-slate-400 hover:text-slate-900"
                  >
                    <ChevronLeft size={20} /> Torna alla scelta
                  </Button>

                  <div className="flex gap-3">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          currentStep === i
                            ? cn("w-12", steps[currentStep].color)
                            : "w-2 bg-slate-200",
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    onClick={handleNext}
                    className={cn(
                      "gap-2 rounded-2xl px-10 h-14 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95",
                      steps[currentStep].color,
                    )}
                  >
                    {currentStep === steps.length - 1
                      ? lang === "it"
                        ? "Home"
                        : lang === "ar"
                          ? "الرئيسية"
                          : "首页"
                      : t.next}{" "}
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Explanation Modal */}
      <AnimatePresence>
        {aiExplanation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden border border-white"
            >
              <div className="p-10">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-2xl font-black">{modalTitle}</h3>
                  {(lang === "ar" || lang === "es") &&
                    aiExplanation &&
                    !isExplaining && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-12 h-12 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(
                            aiExplanation.replace(/<[^>]*>?/gm, ""),
                          );
                          utterance.lang = lang === "ar" ? "ar-SA" : "es-ES";
                          window.speechSynthesis.speak(utterance);
                        }}
                      >
                        <Globe size={24} />
                      </Button>
                    )}
                </div>
                {isGameActive ? (
                  <CAAGame />
                ) : (
                  <>
                    <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div
                        className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: aiExplanation || "",
                        }}
                      ></div>
                    </div>
                    <Button
                      className={cn(
                        "w-full mt-10 rounded-2xl h-14 text-lg font-bold text-white",
                        currentStep !== null
                          ? steps[currentStep].color
                          : "bg-blue-600",
                      )}
                      onClick={() => {
                        setAiExplanation(null);
                        setIsGameActive(false);
                      }}
                    >
                      {lang === "it"
                        ? "Torna al menu"
                        : lang === "ar"
                          ? "العودة للقائمة"
                          : "返回菜单"}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Section Instructions Modals */}
      <AnimatePresence>
        {activeInstructionsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
            >
              <div className="p-10 relative">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveInstructionsModal(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-all hover:rotate-90 cursor-pointer border border-slate-200/50"
                >
                  <X size={20} />
                </button>

                {activeInstructionsModal === "strengths" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner border border-blue-200/50">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">
                          Guida alla compilazione
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          {t.strengths}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4 text-slate-600 text-sm leading-relaxed pt-2">
                      <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-3xl">
                        <strong className="text-blue-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                          Significato della sezione:
                        </strong>
                        I punti di forza rappresentano le abilità, gli interessi
                        e le cose in cui l'alunno eccelle o che svolge con
                        piacere e motivazione.
                      </div>

                      <div className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl">
                        <strong className="text-emerald-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                          Cosa fare / Come compilare:
                        </strong>
                        Descrivi cosa sa fare meglio, i contesti in cui si sente
                        a suo agio, i suoi talenti naturali e in quali modi
                        l'insegnante può valorizzare queste competenze nel
                        percorso educativo di tutti i giorni.
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 rounded-2xl h-14 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                      onClick={() => setActiveInstructionsModal(null)}
                    >
                      Ho capito, continua
                    </Button>
                  </div>
                ) : activeInstructionsModal === "needs" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner border border-amber-200/50">
                        <Info size={32} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">
                          Guida alla compilazione
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          {t.needs}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4 text-slate-600 text-sm leading-relaxed pt-2">
                      <div className="p-5 bg-amber-50/50 border border-amber-100/50 rounded-3xl">
                        <strong className="text-amber-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                          Significato della sezione:
                        </strong>
                        I bisogni e le difficoltà descrivono le barriere, le
                        aree di fragilità o le attività specifiche in cui
                        l'alunno richiede assistenza, mediazione o un supporto
                        personalizzato.
                      </div>

                      <div className="p-5 bg-rose-50/50 border border-rose-100/50 rounded-3xl">
                        <strong className="text-rose-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                          Cosa fare / Come compilare:
                        </strong>
                        Indica in quali situazioni e compiti l'alunno riscontra
                        maggiori ostacoli, dove ha più bisogno di una figura di
                        supporto/guida, e indica quali canali comunicativi o
                        strumenti concreti ne agevolano il superamento delle
                        barriere.
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 rounded-2xl h-14 text-sm font-black text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20"
                      onClick={() => setActiveInstructionsModal(null)}
                    >
                      Ho capito, continua
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-200/50">
                        <Compass className="animate-spin-slow" size={32} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">
                          Guida alla compilazione
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          Progetto di Vita
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4 text-slate-600 text-sm leading-relaxed pt-2">
                      <div className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl">
                        <strong className="text-emerald-950 font-bold block mb-1 text-xs uppercase tracking-wider">
                          Note per la Famiglia:
                        </strong>
                        Questa sezione raccoglie le vostre aspettative, desideri
                        e visioni sul futuro di vostro figlio.
                      </div>

                      <div className="p-5 bg-blue-50/50 border border-blue-100/50 rounded-3xl">
                        <strong className="text-blue-900 font-bold block mb-1 text-xs uppercase tracking-wider">
                          In un'ottica di Progetto di Vita:
                        </strong>
                        Vi invitiamo a indicare gli obiettivi educativi, di
                        autonomia personale, sociale o relazionale che vi
                        piacerebbe che l'alunno raggiungesse, suddivisi per
                        ciascuno dei tre anni della scuola secondaria di primo
                        grado (scuola media).
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 rounded-2xl h-14 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                      onClick={() => setActiveInstructionsModal(null)}
                    >
                      Ho capito, continua
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
