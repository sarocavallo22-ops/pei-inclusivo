import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Utensils
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CAACommunicator from './CAACommunicator';
import { Button } from './components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import GenogramEditor from './components/GenogramEditor';
import { PEIData } from './types';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cn } from './lib/utils';
import countries from 'world-countries';

const countryList = countries.map(c => ({
  name: c.name.common,
  cca2: c.cca2
})).sort((a, b) => a.name.localeCompare(b.name));

const commonLanguages = [
  "Italiano", "Arabo", "Spagnolo", "Cinese", "Inglese",  
  "Rumeno", "Albanese", "Bengalese", "Urdu", "Punjabi", "Wolof", "Tagalog"
];

type Language = 'it' | 'ar' | 'es';

const translations = {
  it: {
    title: "my/our/PEI",
    subtitle: "",
    welcome: "my/our/PEI",
    choose: "scegli da che parte iniziare a raccontarci di voi",
    appRules: "Regolamento e Istruzioni",
    peiExplanation: "Cos'è il PEI?",
    progettoVita: "Progetto di Vita",
    appRulesContent: "Benvenuti in myPEI! Ecco come usare l'app:\n\n1. AGENDA VISIVA: Organizza la giornata su sfondo bianco per una migliore visibilità. Ogni attività può avere un timer personalizzato (clicca l'orologio) con un conto alla rovescia a pallini, studiato per aiutare la percezione del tempo. Usa il blu per il lavoro e il giallo per la pausa.\n\n2. TOKEN ATTIVITÀ: Premia i successi! Personalizza il gettone e il traguardo. Puoi gestire un archivio di immagini per i premi e cancellare quelle che non servono più.\n\n3. PULSANTIERA: Divisa in Scelte, Bisogni e Sentimenti. Include archivi per 'Cosa desidero fare', 'Con chi?' e 'Dove?'. La barra gialla e i pallini mostrano visivamente quanto tempo manca alla fine.\n\n4. DIARIO DEL GIORNO: Documenta la giornata con foto e commenti. L'IA può aiutarti a descrivere le attività e puoi tradurre i testi in arabo per favorire la comunicazione con la famiglia.",
    progettoVitaContent: "Il Progetto di Vita (L. 328/00) è un documento che accompagna il PEI, ma ha una visione più ampia: riguarda il futuro dell'alunno oltre la scuola. Serve a definire obiettivi di autonomia, inclusione sociale e lavorativa.\n\nNormativa: Il D.Lgs 66/2017 e il D.I. 182/2020 definiscono le modalità di redazione del PEI su base ICF, integrando il Progetto di Vita come orizzonte di senso per ogni intervento educativo.\n\nA cosa serve per l'alunno: Serve a costruire un percorso che rispetti i suoi desideri, le sue passioni e che lo prepari a essere un cittadino attivo e indipendente.",
    caaTitle: "Cos'è la CAA?",
    caaContent: "La CAA (Comunicazione Aumentativa Alternativa) è un insieme di strumenti e strategie che aiutano chi ha difficoltà a parlare o capire il linguaggio. Si usano immagini (simboli) per esprimere bisogni, desideri e pensieri.\n\nEsempio: Usare l'immagine di un libro per dire 'voglio leggere' o l'immagine di una sedia per dire 'voglio sedermi'.",
    peiExplanationContent: "Il PEI (Piano Educativo Individualizzato) è il documento che descrive il percorso scolastico personalizzato per l'alunno. Serve a garantire che ogni studente riceva il supporto di cui ha bisogno per imparare e stare bene a scuola insieme agli altri.",
    save: "Salva Bozza",
    next: "Avanti",
    prev: "Indietro",
    complete: "Completa",
    helpTitle: "Aiuto Linguistico",
    helpDesc: "Hai dubbi su un termine? Clicca sull'icona info per una spiegazione semplice.",
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
      superiore: "Scuola Secondaria di 2° Grado"
    },
    schoolHistoryPlaceholder: "Nome della scuola...",
    schoolYearsPlaceholder: "Anni (es. 2020-2023)",
    freeTime: "Tempo Libero",
    freeTimePlaceholder: "Cosa fa l'alunno nel tempo libero? (sport, hobby, amici...)",
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
      placeholder: "Inserisci qui le osservazioni e gli obiettivi per quest'area..."
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
        cousin: "Cugino/a"
      }
    },
    sections: [
      { 
        id: 'info_history', 
        title: 'Storia Alunno', 
        description: 'Informazioni base, percorso scolastico, bisogni e risorse', 
        rules: [
          "Inserisci i dati anagrafici corretti",
          "Specifica le scuole frequentate in ordine",
          "Indica i punti di forza e i bisogni generali"
        ],
        color: 'bg-blue-600', 
        lightColor: 'bg-blue-50', 
        borderColor: 'border-blue-200', 
        textColor: 'text-blue-600', 
        image: '/alunno.png' 
      },
      { 
        id: 'family', 
        title: 'Storia della Famiglia', 
        description: 'Mappa delle parentele e famiglia', 
        rules: [
          "Aggiungi i membri principali della famiglia",
          "I legami si creano automaticamente",
          "Puoi caricare le foto dei familiari"
        ],
        color: 'bg-blue-600', 
        lightColor: 'bg-blue-50', 
        borderColor: 'border-blue-200', 
        textColor: 'text-blue-600', 
        image: '/famiglia.png' 
      },
      { 
        id: 'needs_strengths', 
        title: 'Bisogni e Risorse', 
        description: 'Comunicazione, autonomia, apprendimenti e relazione', 
        rules: [
          "Descrivi come comunica l'alunno",
          "Indica il livello di autonomia",
          "Specifica come apprende e si relaziona"
        ],
        color: 'bg-emerald-600', 
        lightColor: 'bg-emerald-50', 
        borderColor: 'border-emerald-200', 
        textColor: 'text-blue-600', 
        image: '/imparare.png' 
      },
    ]
  },
  ar: {
    title: "my/our/PEI",
    subtitle: "المشاركة النشطة بين المدرسة والأسرة",
    welcome: "my/our/PEI",
    choose: "اختر من أي جهة نبدأ بإخبارنا عنكم",
    appRules: "قواعد التطبيق",
    peiExplanation: "ما هو PEI؟",
    appRulesContent: "مرحباً بكم في myPEI! إليكم كيفية استخدام التطبيق:\n1. اختر قسماً من الصفحة الرئيسية.\n2. املأ الحقول المطلوبة (يمكنك استخدام مساعدة الذكاء الاصطناعي للمصطلحات الصعبة).\n3. احفظ المسودة حتى لا تفقد البيانات.\n4. أكمل جميع الأقسام للحصول على صورة كاملة.",
    caaTitle: "ما هو CAA؟",
    caaContent: "CAA (التواصل المعزز والبديل) هو مجموعة من الأدوات والاستراتيجيات التي تساعد من يجدون صعوبة في التحدث أو فهم اللغة. تُستخدم الصور للتعبير عن الاحتياجات والرغبات والأفكار.\n\nمثال: استخدام صورة كتاب لقول 'أريد أن أقرأ'.",
    peiExplanationContent: "PEI (خطة تعليمية فردية) هي الوثيقة التي تصف المسار المدرسي المخصص للطالب. تهدف لضمان حصول كل طالب على الدعم اللازم للتعلم والعيش بشكل جيد مع الآخرين.",
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
      superiore: "المدرسة الثانوية"
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
      placeholder: "أدخل هنا الملاحظات والأهداف لهذا المجال..."
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
        brother: "أخ"
      }
    },
    sections: [
      { id: 'info_history', title: 'تاريخ الطالب', description: 'المعلومات الأساسية والمسار المدرسي', color: 'bg-blue-600', textColor: 'text-blue-600', image: '/alunno.png' },
      { id: 'family', title: 'تاريخ العائلة', description: 'خريطة القرابة والعائلة', color: 'bg-blue-600', textColor: 'text-blue-600', image: '/famiglia.png' },
      { id: 'needs_strengths', title: 'الاحتياجات والموارد', description: 'التواصل والاستقلالية والتعلم', color: 'bg-emerald-600', textColor: 'text-blue-600', image: '/imparare.png' },
    ]
  },
  es: {
    title: "my/our/PEI",
    subtitle: "",
    welcome: "my/our/PEI",
    choose: "elige por dónde empezar a contarnos sobre ti",
    appRules: "Reglas de la App",
    peiExplanation: "¿Qué es el PEI?",
    appRulesContent: "¡Bienvenidos a myPEI! Así se usa la app:\n1. Elige una sección en la home.\n2. Completa los campos (usa la IA para términos difíciles).\n3. Guarda para no perder datos.\n4. Completa todo para tener el cuadro completo.",
    caaTitle: "¿Qué es la CAA?",
    caaContent: "La CAA (Comunicación Aumentativa y Alternativa) es un conjunto de herramientas y estrategias para quienes tienen dificultad al hablar o entender. Se usan imágenes para expresar necesidades.",
    peiExplanationContent: "El PEI es el documento que describe el camino escolar personalizado para el alumno.",
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
      superiore: "Educación Secundaria Superior"
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
      description: "Exprésate y comunica tus necesidades a través de los símbolos.",
    },
    school: {
      welcome: "Bienvenido Cdc",
      humanities: "Área de Humanidades",
      scientific: "Área Científico-Tecnológica",
      foreignLanguages: "Lenguas Extranjeras",
      artsMusicSports: "Área de Arte/Música/Deporte",
      civics: "Educación Cívica",
      educationalSupport: "Apoyo Educativo",
      placeholder: "Inserte aquí observaciones y objetivos..."
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
        brother: "Hermano"
      }
    },
    sections: [
      { id: 'info_history', title: 'Historia Alumno', description: 'Información base y trayectoria', color: 'bg-blue-600', textColor: 'text-blue-600', image: '/alunno.png' },
      { id: 'family', title: 'Historia Familiar', description: 'Mapa de parentesco', color: 'bg-blue-600', textColor: 'text-blue-600', image: '/famiglia.png' },
      { id: 'needs_strengths', title: 'Necesidades y Recursos', description: 'Comunicación y autonomía', color: 'bg-emerald-600', textColor: 'text-blue-600', image: '/imparare.png' },
    ]
  }
};

const predefinedStrengths = [
  "Autonomia", "Socializzazione", "Comunicazione", "Memoria", "Creatività", 
  "Sport", "Musica", "Disegno", "Matematica", "Lingue"
];

const predefinedNeeds = [
  "Comprensione linguistica", "Scrittura", "Lettura", "Interazione con i pari", 
  "Rispetto delle regole", "Concentrazione", "Gestione delle emozioni"
];

const CAA_CATEGORIES = [
  {
    id: 'casa',
    title: 'CASA',
    items: [
      { id: 'stare_seduto', label: 'Stare seduto', img: '/stare seduto.png' },
      { id: 'dormire', label: 'Dormire', img: 'https://picsum.photos/seed/sleep/200' },
      { id: 'lavarsi', label: 'Lavarsi', img: 'https://picsum.photos/seed/wash/200' },
      { id: 'vestirsi', label: 'Vestirsi', img: 'https://picsum.photos/seed/dress/200' },
    ]
  },
  {
    id: 'cibo',
    title: 'CIBO',
    items: [
      { id: 'mangiare', label: 'Mangiare', img: 'https://picsum.photos/seed/eat/200' },
      { id: 'bere', label: 'Bere', img: 'https://picsum.photos/seed/drink/200' },
      { id: 'apparecchiare', label: 'Apparecchiare', img: 'https://picsum.photos/seed/table/200' },
    ]
  },
  {
    id: 'sport',
    title: 'SPORT',
    items: [
      { id: 'correre', label: 'Correre', img: 'https://picsum.photos/seed/run/200' },
      { id: 'giocare_palla', label: 'Giocare a palla', img: 'https://picsum.photos/seed/ball/200' },
      { id: 'nuotare', label: 'Nuotare', img: 'https://picsum.photos/seed/swim/200' },
    ]
  }
];

const HandwritingMyPEI = () => {
  const [phase, setPhase] = useState<'my' | 'erasing' | 'our'>('my');

  useEffect(() => {
    let t1: any, t2: any, t3: any;
    if (phase === 'my') {
      t1 = setTimeout(() => setPhase('erasing'), 2000);
    } else if (phase === 'erasing') {
      t2 = setTimeout(() => setPhase('our'), 1500);
    } else if (phase === 'our') {
      t3 = setTimeout(() => setPhase('my'), 3000);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  return (
    <div className="relative inline-flex items-center justify-center min-h-[160px] w-full">
      <div className="relative flex items-center gap-2">
        <motion.div
          className="mr-4"
          animate={phase === 'erasing' ? {
            x: [120, 60, 120, 60],
            rotate: [0, -20, 20, -20, 0]
          } : {
            y: [0, -10, 0],
          }}
          transition={{
            duration: phase === 'erasing' ? 1.5 : 2,
            repeat: phase === 'erasing' ? 0 : Infinity,
          }}
        >
          <img 
            src={phase === 'erasing' ? "/gomma.png" : "/matita.png"} 
            alt="Tool" 
            className="w-24 h-24 md:w-36 md:h-36 pointer-events-none"
          />
        </motion.div>

        <div className="relative flex items-end">
          <div className="relative w-[120px] md:w-[180px] flex justify-end">
            <AnimatePresence mode="wait">
              {phase === 'my' ? (
                <motion.span
                  key="my"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.2 }}
                  className="font-sans font-black text-white text-6xl md:text-8xl leading-none"
                >
                  my
                </motion.span>
              ) : phase === 'our' ? (
                <motion.span
                  key="our"
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  className="font-cursive italic text-yellow-400 text-7xl md:text-9xl leading-none px-2"
                >
                  our
                </motion.span>
              ) : (
                <div className="w-full h-10" />
              )}
            </AnimatePresence>
          </div>
          
          <span className="font-sans font-black text-white text-6xl md:text-8xl mb-[5px] mx-1">/</span>
          <span className="font-sans font-black text-white text-6xl md:text-8xl leading-none">
            PEI
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [role, setRole] = useState<'family' | 'school' | 'school-family' | 'student' | null>(null);
  const [studentSubSection, setStudentSubSection] = useState<'day' | 'diary' | 'passport' | 'scelte' | 'bisogni' | 'sentimenti' | 'autonomy' | 'relax' | null>(null);
  const [choiceSubTab, setChoiceSubTab] = useState<'decision' | 'needs' | 'feelings'>('decision');
  const [dayTab, setDayTab] = useState<'agenda' | 'tokens' | 'diary'>('agenda');
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [showActivityArchive, setShowActivityArchive] = useState(false);
  const [showWhomArchive, setShowWhomArchive] = useState(false);
  const [isTokenSelectionOpen, setIsTokenSelectionOpen] = useState(false);
  const [lang, setLang] = useState<Language>('it');
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [data, setData] = useState<PEIData>(() => {
    const defaultData: PEIData = {
      studentName: '',
      birthDate: '',
      originCountry: '',
      languagesSpoken: [],
      familyMembers: [],
      relationships: [],
      schoolHistory: {
        infanzia: '',
        primaria: '',
        media: '',
        superiore: ''
      },
      schoolYears: {
        infanzia: '',
        primaria: '',
        media: '',
        superiore: ''
      },
      freeTime: '',
      strengths: '',
      needs: '',
      communication: '',
      autonomy: '',
      learning: '',
      relation: '',
      lis: null,
      braille: null,
      isDeaf: null,
      isBlind: null,
      schoolAreas: {
        humanities: '',
        scientific: '',
        foreignLanguages: '',
        artsMusicSports: '',
        civics: '',
        educationalSupport: '',
      },
      schoolObservations: {
        humanities: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
        scientific: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
        foreignLanguages: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
        artsMusicSports: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
        civics: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
        educationalSupport: { autonomia_igiene: null, autonomia_spazi: null, autonomia_aiuto: null, autonomia_materiale: null, comunicazione_bisogni: null, comunicazione_consegne: null, comunicazione_caa: null, relazionale_comportamento: null, relazionale_regole: null, relazionale_contatto: null, cognitiva_attenzione: null, cognitiva_concentrazione: null, cognitiva_base: null, emotiva_emozioni: null, emotiva_frustrazione: null, emotiva_motivazione: null, emotiva_stereotipie: null },
      },
      agendaImages: Array(6).fill(null),
      agendaWithWhomImages: Array(6).fill(null),
      agendaHours: Array(6).fill(null),
      agendaHourColors: Array(6).fill('blue'),
      agendaActivityArchive: ['/leggere.png', '/imparare.png', '/matita.png', '/tablet.png', '/biscotti.png', '/costruzioni.png'],
      agendaWhomArchive: ['/studente.png', '/famiglia.png', '/chi.png', '/alunno.png'],
      agendaDurations: Array(6).fill(0),
      agendaDay: 'Lunedì',
      agendaWeather: 'Sereno',
      agendaProgress: 0,
      tokenSymbol: null,
      tokenArchive: ['/premio.png', '/biscotti.png', '/tablet.png'],
      tokenRewardImage: null,
      tokenRewardOptions: [],
      agendaObjectives: [],
      choiceImages: Array(4).fill(null),
      choiceArchivio: ['/leggere.png', '/imparare.png', '/tablet.png', '/biscotti.png', '/costruzioni.png'],
      selectedChoiceIndex: null,
      choiceMood: null,
      removedChoices: [],
      choiceDuration: 0,
      choiceLocation: '',
      choiceLocationArchive: ['/casa.png', '/inizio.png'],
      choiceWithWhom: '',
      choiceWithWhomArchive: ['/famiglia.png', '/chi.png', '/alunno.png'],
      tokenStepsCount: 6,
      autonomyDiary: [
        { id: 'a1', name: 'Igiene Personale', activities: [], color: 'bg-blue-400' },
        { id: 'a2', name: 'Vestizione', activities: [], color: 'bg-emerald-400' },
        { id: 'a3', name: 'Alimentazione', activities: [], color: 'bg-orange-400' }
      ],
      relaxArea: [],
      needsChoices: [
        { id: 'bagno', label: 'Bagno', img: 'https://img.icons8.com/color/144/toilet.png' },
        { id: 'acqua', label: 'Acqua', img: 'https://img.icons8.com/color/144/glass-of-water.png' },
        { id: 'cibo', label: 'Cibo', img: 'https://img.icons8.com/color/144/food-and-wine.png' },
        { id: 'riposo', label: 'Riposo', img: 'https://img.icons8.com/color/144/sleep.png' }
      ],
      feelingsChoices: [
        { id: 'felice', label: 'Felice', img: 'https://img.icons8.com/color/144/happy.png' },
        { id: 'triste', label: 'Triste', img: 'https://img.icons8.com/color/144/sad.png' },
        { id: 'arrabbiato', label: 'Arrabbiato', img: 'https://img.icons8.com/color/144/angry.png' },
        { id: 'stanco', label: 'Stanco', img: 'https://img.icons8.com/color/144/tired.png' }
      ],
      passport: {
        photo: null,
        name: '',
        surname: '',
        birthDate: '',
        birthPlace: '',
        residence: '',
        likes: [],
        dislikes: [],
        strengths: [],
        uniqueness: '',
        youtubeLinks: []
      },
      schoolDiary: [
        { id: '1', name: 'Italiano', activities: [], color: 'bg-rose-500' },
        { id: '2', name: 'Matematica', activities: [], color: 'bg-blue-500' },
        { id: '3', name: 'Scienze', activities: [], color: 'bg-emerald-500' },
        { id: '4', name: 'Arte', activities: [], color: 'bg-amber-500' }
      ],
      dailyDiary: []
    };

    const saved = localStorage.getItem('mypei_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force reset humanities observations if they were modified (requested)
        if (parsed.schoolObservations && parsed.schoolObservations.humanities) {
          parsed.schoolObservations.humanities = defaultData.schoolObservations.humanities;
        }
        // Force reset LIS and Braille (requested)
        parsed.lis = null;
        parsed.braille = null;
        
        // Migration for likes/dislikes (string[] -> object[])
        if (parsed.passport) {
          if (parsed.passport.likes && parsed.passport.likes.length > 0 && typeof parsed.passport.likes[0] === 'string') {
            parsed.passport.likes = parsed.passport.likes.map((l: string) => ({ type: 'text', content: l }));
          }
          if (parsed.passport.dislikes && parsed.passport.dislikes.length > 0 && typeof parsed.passport.dislikes[0] === 'string') {
            parsed.passport.dislikes = parsed.passport.dislikes.map((d: string) => ({ type: 'text', content: d }));
          }
          if (!parsed.passport.youtubeLinks) {
            parsed.passport.youtubeLinks = [];
          }
        }
        
        // Deep merge
        return {
          ...defaultData,
          ...parsed,
          passport: { ...defaultData.passport, ...(parsed.passport || {}) },
          schoolDiary: parsed.schoolDiary || defaultData.schoolDiary,
          schoolHistory: { ...defaultData.schoolHistory, ...(parsed.schoolHistory || {}) },
          schoolYears: { ...defaultData.schoolYears, ...(parsed.schoolYears || {}) },
          schoolAreas: { ...defaultData.schoolAreas, ...(parsed.schoolAreas || {}) },
          schoolObservations: { ...defaultData.schoolObservations, ...(parsed.schoolObservations || {}) },
        };
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    return defaultData;
  });

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
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
    localStorage.setItem('mypei_data', JSON.stringify(newData || data));
    console.log("Data saved automatically");
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
      setData({...data, dailyDiary: newDiary});
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
      
      const base64Data = photoData.includes('base64,') ? photoData.split('base64,')[1] : photoData;
      
      const result = await model.generateContent([
        "Spiega cosa rappresenta questa foto per un diario scolastico, in modo semplice per la famiglia. Scrivi in italiano.",
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        }
      ]);
      
      const explanation = result.response.text().trim();
      const newDiary = [...data.dailyDiary];
      newDiary[index].aiExplanation = explanation;
      setData({...data, dailyDiary: newDiary});
    } catch (error) {
      console.error("AI analysis error:", error);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const downloadPassport = async () => {
    const element = document.getElementById('passport-card');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Passaporto_${data.passport.name || 'Alunno'}.pdf`);
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
    if (currentStep !== null && currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else setCurrentStep(null);
  };

  const handlePrev = () => {
    saveToLocalStorage();
    if (currentStep !== null && currentStep > 0) setCurrentStep(currentStep - 1);
    else setCurrentStep(null);
  };

  const explainTerm = async (term: string) => {
    setIsExplaining(true);
    setModalTitle(t.helpTitle);
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Spiega il termine "${term}" in modo molto semplice per una famiglia straniera in Italia. Lingua di risposta: ${lang === 'it' ? 'Italiano' : lang === 'ar' ? 'Arabo' : 'Spagnolo'}. Sii empatico.`;
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

  const addPredefined = (field: 'strengths' | 'needs', value: string) => {
    const current = data[field];
    if (current.includes(value)) return;
    setData({
      ...data,
      [field]: current ? `${current}, ${value}` : value
    });
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'start-caa-game') {
        setIsGameActive(true);
        setGameStep(0);
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const CAAGame = () => {
    const gameData = [
      { id: 1, type: 'verbo', word: 'LEGGERE', img: '/leggere.png' },
      { id: 2, type: 'oggetto', word: 'CASA', img: '/casa.png' },
      { id: 3, type: 'animale', word: 'GATTO', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop' },
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
            setGameStep(prev => prev + 1);
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
            <p className="text-slate-600">Hai capito come funzionano i simboli della CAA.</p>
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

    const options = [
      gameData[0],
      gameData[1],
      gameData[2]
    ].sort((a, b) => a.id - b.id); // Fixed order or shuffle? Shuffling is better.
    
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
            <ChevronLeft size={16} className="mr-1" /> {lang === 'it' ? 'Esci' : 'Back'}
          </Button>
          <div className="text-center space-y-2 flex-1 mr-8">
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-100">Livello {gameStep + 1} di 3</Badge>
            <h3 className="text-2xl font-black text-slate-900">Associa la parola al simbolo</h3>
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
                selectedId === opt.id ? (opt.id === currentLevel.id ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50 animate-shake") : "border-slate-100",
              )}
            >
              <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-inner bg-slate-50 border border-slate-100">
                <img src={opt.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="mt-4 font-black text-slate-300 group-hover:text-blue-400 transition-colors">???</div>
            </motion.button>
          ))}
        </div>
        
        <p className="text-sm text-slate-400 font-medium italic">Tocca l'immagine che corrisponde a "{currentLevel.word}"</p>
      </div>
    );
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      role === 'student' || currentStep === null ? "bg-[#0a192f]" : (currentStep !== null ? steps[currentStep].lightColor : "bg-[#0a192f]"),
      lang === 'ar' ? 'font-sans' : ''
    )} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      {isStarted && (
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg transition-all group-hover:scale-110 overflow-hidden">
                      <img src="/leggere.png" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-black text-2xl tracking-tighter text-white leading-none">
                        my/<span className="text-yellow-400 italic">our</span>/PEI
                      </h1>
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-0.5 opacity-60">Menu</p>
                    </div>
                  </div>
                } />
                <DropdownMenuContent align="start" className="w-64 mt-2 rounded-2xl p-2 bg-white/95 backdrop-blur-lg border-white/20 shadow-2xl">
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opzioni App</span>
                  </div>
                  <DropdownMenuItem 
                    onClick={() => showStaticModal(t.peiExplanation, t.peiExplanationContent)}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <Info size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{t.peiExplanation}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => showStaticModal(t.progettoVita, t.progettoVitaContent)}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <Sparkles size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{t.progettoVita}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => showStaticModal(t.appRules, t.appRulesContent)}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <BookOpen size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{t.appRules}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setRole('school-family')}
                    className="rounded-xl p-3 flex items-center gap-3 cursor-pointer focus:bg-blue-50"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100">
                      <img src="/parlare tutti insieme.png" alt="Scuola-Famiglia" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="font-bold text-slate-700">Scuola-Famiglia</span>
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
                {(['it', 'ar', 'es'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l as any)}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-black transition-all",
                      lang === l ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <Button 
                size="sm" 
                onClick={() => saveToLocalStorage()}
                className={cn("gap-2 text-white h-10 px-4 rounded-xl font-black text-xs transition-colors", currentStep !== null ? steps[currentStep].color : "bg-blue-600")}
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
              <p className="mt-8 text-2xl text-blue-100/60 font-black animate-pulse">Tocca per iniziare</p>
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
                  <div className="flex gap-4 justify-center">
                    <motion.img 
                      initial={{ rotate: -10, x: -25 }}
                      animate={{ rotate: 0, x: 0 }}
                      src="/matita.png" 
                      alt="" 
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-2xl" 
                    />
                    <motion.img 
                      initial={{ rotate: 10, x: 25 }}
                      animate={{ rotate: 0, x: 0 }}
                      src="/gomma.png" 
                      alt="" 
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain drop-shadow-2xl" 
                    />
                  </div>
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
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">Famiglia</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole('family')}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-blue-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                  >
                    <img src="/casa.png" alt="Famiglia" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    Raccontaci la storia e i bisogni dell'alunno dal tuo punto di vista.
                  </p>
                </div>

                {/* Alunno */}
                <div className="flex flex-col items-center group">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">{(t as any).studentRole.title}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole('student')}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-yellow-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                  >
                    <img src="/studente.png" alt="Alunno" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    {(t as any).studentRole.description}
                  </p>
                </div>

                {/* Scuola */}
                <div className="flex flex-col items-center group">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">Scuola</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRole('school')}
                    className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 lg:w-64 lg:h-64 bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border-4 border-emerald-500/20 overflow-hidden relative shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                  >
                    <img src="/scuola secondaria.png" alt="Scuola" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  </motion.button>
                  <p className="mt-4 md:mt-6 text-blue-100/70 font-medium text-center text-xs sm:text-sm md:text-base leading-relaxed max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                    Accedi alla sezione osservazione e monitoraggio scolastico.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : role === 'student' ? (
            <motion.div
              key="student-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[80vh] flex flex-col items-center w-full"
            >
              {!studentSubSection ? (
                <>
                  <div className="w-full space-y-12 bg-[#0a192f]/60 backdrop-blur-md p-12 rounded-[60px] shadow-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setRole(null)} 
                      className="rounded-2xl h-12 px-6 font-bold text-white hover:bg-white/20 border border-white/20"
                    >
                      <ChevronLeft size={20} className="mr-2" /> Torna
                    </Button>
                    <h2 className="text-4xl font-black text-white text-center flex-1">Ciao! Scegli cosa vuoi fare:</h2>
                    <div className="w-32"></div>
                  </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full pb-8">
                    {[
                      { id: 'day', title: 'La mia giornata', color: 'bg-blue-500' },
                      { id: 'diary', title: 'Il mio zaino', color: 'bg-rose-500' },
                      { id: 'passport', title: 'Passaporto comunicativo', color: 'bg-emerald-500' },
                      { id: 'scelte', title: 'Scelte', color: 'bg-yellow-500' },
                      { id: 'bisogni', title: 'Bisogni', color: 'bg-pink-500' },
                      { id: 'sentimenti', title: 'Sentimenti', color: 'bg-purple-500' },
                      { id: 'autonomy', title: 'Diario delle autonomie', color: 'bg-orange-500' },
                      { id: 'relax', title: 'Area relax', color: 'bg-indigo-500' }
                    ].map((sec) => (
                      <motion.button
                        key={sec.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (sec.id === 'scelte') {
                            setStudentSubSection('scelte');
                            setChoiceSubTab('decision');
                          } else if (sec.id === 'bisogni') {
                            setStudentSubSection('bisogni');
                            setChoiceSubTab('needs');
                          } else if (sec.id === 'sentimenti') {
                            setStudentSubSection('sentimenti');
                            setChoiceSubTab('feelings');
                          } else {
                            setStudentSubSection(sec.id as any);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center p-10 bg-white rounded-[40px] shadow-2xl border-4 group h-64",
                          sec.color === 'bg-blue-500' ? "border-blue-100" : 
                          sec.color === 'bg-rose-500' ? "border-rose-100" : 
                          sec.color === 'bg-emerald-500' ? "border-emerald-100" : 
                          sec.color === 'bg-yellow-500' ? "border-yellow-100" : 
                          sec.color === 'bg-pink-500' ? "border-pink-100" :
                          sec.color === 'bg-purple-500' ? "border-purple-100" :
                          sec.color === 'bg-orange-500' ? "border-orange-100" : 
                          "border-indigo-100"
                        )}
                      >
                        <h3 className="text-2xl font-black text-slate-800 text-center uppercase tracking-tighter">{sec.title}</h3>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            ) : ['scelte', 'bisogni', 'sentimenti'].includes(studentSubSection as string) ? (
                <div className="w-full space-y-8 bg-[#0a192f]/60 backdrop-blur-md p-12 rounded-[60px] min-h-[80vh] shadow-2xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        onClick={() => setStudentSubSection(null)} 
                        className="rounded-2xl h-14 px-8 font-black text-white hover:bg-white/20 border-2 border-white/20"
                      >
                        <ChevronLeft size={24} className="mr-2" /> Indietro
                      </Button>
                      <h2 className="text-4xl font-black text-white capitalize">
                        {studentSubSection === 'scelte' ? 'Scelte' : studentSubSection === 'bisogni' ? 'Bisogni' : 'Sentimenti'}
                      </h2>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setData({...data, selectedChoiceIndex: null, choiceMood: null, choiceImages: Array(4).fill(null), removedChoices: []})}
                      className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold"
                    >
                      <RotateCcw size={20} className="mr-2" /> Ripristina
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-16 py-12">
                    <AnimatePresence mode="wait">
                      {choiceSubTab === 'decision' && (
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
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Cosa desidero fare?</h3>
                                <p className="text-blue-200 font-medium max-w-md">Carica o seleziona le tue scelte!</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                                {data.choiceImages.map((img, idx) => {
                                  const isRemoved = data.removedChoices.includes(idx);
                                  if (isRemoved) return null;

                                  return (
                                    <div key={idx} className="relative group">
                                      <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setData({...data, selectedChoiceIndex: idx})}
                                        className={cn(
                                          "w-48 h-48 md:w-64 md:h-64 rounded-[50px] border-8 shadow-2xl overflow-hidden cursor-pointer transition-all flex items-center justify-center relative",
                                          data.selectedChoiceIndex === idx ? "border-yellow-400 bg-yellow-400/20 shadow-[0_0_60px_rgba(253,224,71,0.4)]" : "border-white/10 bg-white/5 hover:bg-white/10"
                                        )}
                                      >
                                        {img ? (
                                          <>
                                            <img src={img} className="w-full h-full object-contain p-4" />
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newImages = [...data.choiceImages];
                                                newImages[idx] = null;
                                                setData({...data, choiceImages: newImages});
                                              }}
                                              className="absolute top-4 right-4 w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </>
                                        ) : (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger render={
                                              <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors group">
                                                <Plus size={48} className="text-white/20 mb-4 group-hover:text-white/40 transition-colors" />
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center px-4">Aggiungi scelta o scegli da archivio</span>
                                              </div>
                                            } />
                                            <DropdownMenuContent className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-slate-100 w-80">
                                              <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                  <h4 className="font-black text-slate-900 uppercase italic">Archivio Scelte</h4>
                                                  <label className="p-2 cursor-pointer bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                                                    <Plus size={18} />
                                                    <input 
                                                      type="file" 
                                                      className="hidden" 
                                                      accept="image/*"
                                                      onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                          const reader = new FileReader();
                                                          reader.onloadend = () => {
                                                            const b64 = reader.result as string;
                                                            setData({...data, choiceArchivio: [...data.choiceArchivio, b64]});
                                                          };
                                                          reader.readAsDataURL(file);
                                                        }
                                                      }}
                                                    />
                                                  </label>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                  {data.choiceArchivio.map((archImg, aIdx) => (
                                                    <div key={aIdx} className="relative group/item">
                                                      <button
                                                        onClick={() => {
                                                          const newImages = [...data.choiceImages];
                                                          newImages[idx] = archImg;
                                                          setData({...data, choiceImages: newImages});
                                                        }}
                                                        className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 border-slate-100 hover:border-blue-300 transition-all p-1"
                                                      >
                                                        <img src={archImg} className="w-full h-full object-contain" />
                                                      </button>
                                                      <button 
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          const newArch = data.choiceArchivio.filter((_, i) => i !== aIdx);
                                                          setData({...data, choiceArchivio: newArch});
                                                        }}
                                                        className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-md"
                                                      >
                                                        <X size={12} />
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </motion.div>

                                      <AnimatePresence>
                                        {data.selectedChoiceIndex === idx && data.choiceImages.every(i => i !== null) && (
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            className="absolute -right-4 -top-4 flex flex-col gap-2 z-20"
                                          >
                                            <Button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setData({...data, removedChoices: [...data.removedChoices, idx], selectedChoiceIndex: null});
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
                                            setData(prev => {
                                              if (prev.choiceDuration <= 0) {
                                                clearInterval(interval);
                                                return prev;
                                              }
                                              return {...prev, choiceDuration: prev.choiceDuration - 1};
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
                                        onClick={() => setData({...data, choiceDuration: Math.max(0, data.choiceDuration - 5)})}
                                      >
                                        -5
                                      </Button>
                                      <div className="flex-1 text-center">
                                        <span className="text-6xl font-black text-white lining-nums">{data.choiceDuration}</span>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Minuti</div>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        className="w-16 h-16 rounded-3xl bg-white/10 text-white hover:bg-white/20 text-xl font-black"
                                        onClick={() => setData({...data, choiceDuration: data.choiceDuration + 5})}
                                      >
                                        +5
                                      </Button>
                                    </div>
                                    
                                    {/* Barra gialla che si svuota */}
                                    <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                                      <motion.div 
                                        className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                                        initial={{ width: "100%" }}
                                        animate={{ width: `${(data.choiceDuration / 60) * 100}%` }}
                                        transition={{ duration: 1, ease: "linear" }}
                                      />
                                    </div>

                                    {/* Pallini countdown */}
                                    <div className="flex flex-wrap gap-2 justify-center py-2">
                                      {Array.from({ length: 12 }).map((_, i) => {
                                        const isActive = i < (data.choiceDuration / 5);
                                        return (
                                          <motion.div
                                            key={i}
                                            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                            className={cn(
                                              "w-4 h-4 rounded-full transition-colors duration-500",
                                              isActive ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "bg-white/10"
                                            )}
                                          />
                                        );
                                      })}
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
                                      onClick={() => setData({...data, choiceMood: 'happy'})}
                                      className={cn(
                                        "flex-1 h-full rounded-[30px] flex items-center justify-center transition-all",
                                        data.choiceMood === 'happy' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 text-white/20 hover:bg-white/10"
                                      )}
                                    >
                                      <Smile size={40} />
                                    </button>
                                    <button 
                                      onClick={() => setData({...data, choiceMood: 'sad'})}
                                      className={cn(
                                        "flex-1 h-full rounded-[30px] flex items-center justify-center transition-all",
                                        data.choiceMood === 'sad' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 text-white/20 hover:bg-white/10"
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

                      {studentSubSection === 'bisogni' && (
                        <motion.div
                          key="needs"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-4xl space-y-12"
                        >
                          <div className="text-center">
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">I miei Bisogni</h3>
                            <p className="text-pink-200 font-medium">Tocca un'immagine per comunicare un bisogno primario</p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {data.needsChoices.map((need) => (
                              <motion.button
                                key={need.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  // Visual feedback or communication action
                                  setData({...data, choiceMood: 'happy' as any}); // Generic feedback
                                }}
                                className="bg-white p-6 rounded-[60px] shadow-2xl border-4 border-pink-100 flex flex-col items-center gap-6 group hover:border-pink-300 transition-all h-full"
                              >
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] bg-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform p-6">
                                  <img src={need.img} alt={need.label} className="w-full h-full object-contain drop-shadow-xl" />
                                </div>
                                <span className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{need.label}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {studentSubSection === 'sentimenti' && (
                        <motion.div
                          key="feelings"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-4xl space-y-12"
                        >
                          <div className="text-center">
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">Come mi sento?</h3>
                            <p className="text-purple-200 font-medium">Esprimi le tue emozioni con i colori e i simboli</p>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.feelingsChoices.map((feeling) => (
                              <motion.button
                                key={feeling.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setData({...data, choiceMood: (feeling.id === 'felice' ? 'happy' : 'sad') as any})}
                                className={cn(
                                  "p-8 rounded-[60px] shadow-2xl border-8 transition-all flex flex-col items-center gap-6 bg-white",
                                  feeling.id === 'felice' ? "border-emerald-400 ring-4 ring-emerald-500/20" :
                                  feeling.id === 'triste' ? "border-blue-400 ring-4 ring-blue-500/20" :
                                  feeling.id === 'arrabbiato' ? "border-rose-400 ring-4 ring-rose-500/20" :
                                  "border-amber-400 ring-4 ring-amber-500/20"
                                )}
                              >
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40px] flex items-center justify-center group-hover:scale-110 transition-transform p-6">
                                  <img src={feeling.img} alt={feeling.label} className="w-full h-full object-contain" />
                                </div>
                                <span className={cn(
                                  "text-2xl font-black uppercase italic tracking-tighter",
                                  feeling.id === 'felice' ? "text-emerald-700" :
                                  feeling.id === 'triste' ? "text-blue-700" :
                                  feeling.id === 'arrabbiato' ? "text-rose-700" :
                                  "text-amber-700"
                                )}>{feeling.label}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {studentSubSection === 'sentimenti' && (
                        <motion.div
                          key="feelings"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8"
                        >
                          {data.feelingsChoices.map((feeling) => (
                            <motion.button
                              key={feeling.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white p-6 rounded-[40px] shadow-2xl border-4 border-white/20 flex flex-col items-center gap-4 group"
                            >
                              <div className="w-32 h-32 rounded-3xl overflow-hidden group-hover:scale-110 transition-transform">
                                <img src={feeling.img} alt={feeling.label} className="w-full h-full object-contain" />
                              </div>
                              <span className="text-xl font-black text-slate-800 uppercase italic">{feeling.label}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-8 bg-[#0a192f]/60 backdrop-blur-md p-12 rounded-[60px] min-h-[80vh] shadow-2xl border border-white/10">
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
                        {studentSubSection === 'day' ? 'La mia giornata' : 
                         studentSubSection === 'diary' ? 'Il mio zaino' : 
                         studentSubSection === 'passport' ? 'Passaporto comunicativo' :
                         studentSubSection === 'autonomy' ? 'Diario delle autonomie' :
                         'Area relax'}
                      </h2>
                      {studentSubSection === 'day' && (
                         <Button 
                           onClick={() => setShowAgendaTips(!showAgendaTips)}
                           variant="outline"
                           className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                         >
                           <Info size={20} className="mr-2" /> {showAgendaTips ? 'Nascondi Info' : 'Istruzioni'}
                         </Button>
                      )}
                    </div>
                  </div>
                  
                  {studentSubSection === 'day' && (
                    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
                      {/* Sub-tab Switcher */}
                      <div className="flex justify-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab('agenda')}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === 'agenda' ? "bg-white text-blue-600 shadow-blue-500/20" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                          )}
                        >
                          <Calendar size={28} /> Agenda Visiva
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab('tokens')}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === 'tokens' ? "bg-white text-blue-600 shadow-blue-500/20" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                          )}
                        >
                          <CircleDot size={28} /> Token Attività
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDayTab('diary')}
                          className={cn(
                            "flex-1 md:flex-none md:min-w-[200px] p-6 rounded-[32px] font-black text-xl uppercase transition-all shadow-xl flex items-center justify-center gap-3",
                            dayTab === 'diary' ? "bg-white text-blue-600 shadow-blue-500/20" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                          )}
                        >
                          <BookCheck size={28} /> Diario del giorno
                        </motion.button>
                      </div>

                      {/* Top Bar: Weather Selection */}
                      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white/10 p-8 rounded-[40px] border border-white/10 backdrop-blur-md">
                        <div className="flex flex-wrap gap-4 items-center w-full justify-center lg:justify-between">
                          {/* Day Selection */}
                          <div className="flex items-center gap-2 bg-black/20 p-2 rounded-2xl">
                             {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                               <button
                                 key={d}
                                 onClick={() => setData({...data, agendaDay: d === 'Lun' ? 'Lunedì' : d === 'Mar' ? 'Martedì' : d === 'Mer' ? 'Mercoledì' : d === 'Gio' ? 'Giovedì' : d === 'Ven' ? 'Venerdì' : d === 'Sab' ? 'Sabato' : 'Domenica'})}
                                 className={cn(
                                   "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                                   data.agendaDay.startsWith(d) ? "bg-white text-blue-600 shadow-lg" : "text-white/60 hover:text-white"
                                 )}
                               >
                                 {d}
                               </button>
                             ))}
                          </div>

                          {/* Weather Selection */}
                          <div className="flex items-center gap-2 bg-white/90 p-2 rounded-2xl">
                             {[
                               { id: 'Sereno', icon: <Sun size={20} /> },
                               { id: 'Nuvoloso', icon: <Cloud size={20} /> },
                               { id: 'Pioggia', icon: <CloudRain size={20} /> },
                               { id: 'Vento', icon: <Wind size={20} /> },
                               { id: 'Neve', icon: <Snowflake size={20} /> }
                             ].map(w => (
                               <button
                                 key={w.id}
                                 onClick={() => setData({...data, agendaWeather: w.id})}
                                 className={cn(
                                   "p-3 rounded-xl transition-all",
                                   data.agendaWeather === w.id ? "bg-blue-600 text-white shadow-lg scale-110" : "text-slate-400 hover:text-blue-500"
                                 )}
                                 title={w.id}
                               >
                                 {w.icon}
                               </button>
                             ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-12 items-start justify-center">
                        {dayTab === 'agenda' && (
                          <div className="w-full space-y-8">
                            {/* Agenda Visiva Header - White Background */}
                            <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 space-y-4 md:space-y-0 relative overflow-hidden">
                            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                              <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                                <Calendar size={32} />
                              </div>
                              <div className="flex flex-col">
                                <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">Agenda Visiva</h2>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Ogni sezione su sfondo bianco per chiarezza</p>
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
                                        agendaImages: data.agendaImages.slice(0, -1),
                                        agendaWithWhomImages: data.agendaWithWhomImages.slice(0, -1),
                                        agendaHours: data.agendaHours.slice(0, -1),
                                        agendaHourColors: data.agendaHourColors.slice(0, -1),
                                        agendaDurations: data.agendaDurations.slice(0, -1)
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
                                        agendaImages: [...data.agendaImages, null],
                                        agendaWithWhomImages: [...data.agendaWithWhomImages, null],
                                        agendaHours: [...data.agendaHours, null],
                                        agendaHourColors: [...data.agendaHourColors, 'blue'],
                                        agendaDurations: [...data.agendaDurations, 0]
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
                                {['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'].map((day) => (
                                  <button
                                    key={day}
                                    onClick={() => setData({...data, agendaDay: day})}
                                    className={cn(
                                      "px-4 py-2 rounded-2xl font-black text-xs uppercase transition-all whitespace-nowrap",
                                      data.agendaDay === day ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" : "text-slate-400 hover:text-slate-600"
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
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8"
                              >
                                <div className={cn(
                                  "p-8 rounded-[40px] border-4 border-white/20 backdrop-blur-xl shadow-2xl",
                                  showActivityArchive ? "bg-blue-600/40" : "bg-purple-600/40"
                                )}>
                                  <div className="flex justify-between items-center mb-6">
                                    <div>
                                      <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                                        {showActivityArchive ? "Archivio Attività" : "Archivio Con Chi?"}
                                      </h4>
                                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Carica o seleziona le immagini per l'agenda</p>
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
                                            const files = Array.from(e.target.files || []) as File[];
                                            files.forEach(file => {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const res = reader.result as string;
                                                if (showActivityArchive) {
                                                  setData(prev => ({ ...prev, agendaActivityArchive: [...prev.agendaActivityArchive, res] }));
                                                } else {
                                                  setData(prev => ({ ...prev, agendaWhomArchive: [...prev.agendaWhomArchive, res] }));
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            });
                                          }}
                                        />
                                      </label>
                                      <button 
                                        onClick={() => { setShowActivityArchive(false); setShowWhomArchive(false); }}
                                        className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                                      >
                                        <X size={24} />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {(showActivityArchive ? data.agendaActivityArchive : data.agendaWhomArchive).map((archImg, i) => (
                                      <div key={i} className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-white/10 hover:border-white transition-all transform hover:-translate-y-1">
                                        <img src={archImg} alt="Archive" className="w-full h-full object-contain p-4" />
                                        <button 
                                          onClick={() => {
                                            if (showActivityArchive) {
                                              setData(prev => ({ ...prev, agendaActivityArchive: prev.agendaActivityArchive.filter((_, idx) => idx !== i) }));
                                            } else {
                                              setData(prev => ({ ...prev, agendaWhomArchive: prev.agendaWhomArchive.filter((_, idx) => idx !== i) }));
                                            }
                                          }}
                                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))}
                                    { (showActivityArchive ? data.agendaActivityArchive : data.agendaWhomArchive).length === 0 && (
                                      <div className="col-span-full py-12 flex flex-col items-center justify-center text-white/40 border-2 border-dashed border-white/10 rounded-3xl">
                                        <FileImage size={48} className="mb-3 opacity-20" />
                                        <p className="font-black uppercase tracking-tighter">L'archivio è vuoto</p>
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
                                  data.agendaHourColors[idx] === 'yellow' 
                                    ? "bg-yellow-100 border-yellow-300 text-slate-900" 
                                    : "bg-white border-white/10 backdrop-blur-sm"
                                )}
                              >
                                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 w-full">
                                  {/* School Hour Badge/Input */}
                                  <div className="flex flex-col gap-1 items-center justify-center shrink-0">
                                    <div className="flex gap-1 items-center">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger render={
                                          <button className="w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 hover:scale-110 transition-transform focus:outline-none bg-blue-600 text-white">
                                            {data.agendaHours[idx] || (idx + 1)}
                                          </button>
                                        } />
                                        <DropdownMenuContent className="p-2 min-w-[80px] bg-white rounded-2xl shadow-2xl z-50">
                                          {[1,2,3,4,5,6].map(h => (
                                            <DropdownMenuItem 
                                              key={h} 
                                              onClick={() => {
                                                const newHours = [...data.agendaHours];
                                                newHours[idx] = h;
                                                setData({...data, agendaHours: newHours});
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
                                          const newColors = [...data.agendaHourColors];
                                          newColors[idx] = newColors[idx] === 'blue' ? 'yellow' : 'blue';
                                          setData({...data, agendaHourColors: newColors});
                                        }}
                                        className={cn(
                                          "w-6 h-14 rounded-xl shadow-lg border-2 border-white/20 transition-all focus:outline-none",
                                          data.agendaHourColors[idx] === 'yellow' ? "bg-yellow-400 border-yellow-500" : "bg-blue-500/40 border-blue-500/10"
                                        )}
                                        title={data.agendaHourColors[idx] === 'yellow' ? "Pausa (Giallo)" : "Lavoro (Blu)"}
                                      />
                                    </div>
                                    <div className="text-[10px] font-bold uppercase text-slate-500 whitespace-nowrap">Ora / Colore</div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-6 md:gap-8 lg:gap-10 flex-1 w-full">
                                    {/* Attività */}
                                    <div className="flex flex-col items-center gap-2 w-full">
                                      <div className="w-full aspect-square max-w-[150px] sm:max-w-none bg-white rounded-[32px] shadow-2xl border-4 border-white/20 overflow-hidden relative flex items-center justify-center transition-transform hover:scale-105 group/item">
                                        {/* Fading Background Pattern */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none group-hover/item:opacity-15 transition-opacity">
                                          <img src="/attività.png" alt="pattern" className="w-full h-full object-cover" />
                                        </div>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger render={
                                            <button className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 transition-colors relative z-10 focus:outline-none">
                                              {img ? (
                                                <>
                                                  <img src={img} alt={`Attività ${idx + 1}`} className="w-full h-full object-contain p-2 animate-in fade-in zoom-in duration-500" />
                                                  <button 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const newImages = [...data.agendaImages];
                                                      newImages[idx] = null;
                                                      setData({...data, agendaImages: newImages});
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-lg"
                                                  >
                                                    <Trash2 size={16} />
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <Upload size={32} className="text-blue-200 mb-2" />
                                                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-tighter">Scegli</span>
                                                </>
                                              )}
                                            </button>
                                          } />
                                          <DropdownMenuContent className="p-4 w-64 max-h-[400px] overflow-y-auto bg-white rounded-[32px] shadow-2xl border-none z-50">
                                            <div className="grid grid-cols-2 gap-3">
                                              {/* Upload new */}
                                              <label className="col-span-2 cursor-pointer bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-center">
                                                <Plus size={24} className="mx-auto" />
                                                <span className="text-xs font-black uppercase">Nuova Immagine</span>
                                                <input 
                                                  type="file" 
                                                  className="hidden" 
                                                  accept="image/*"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      const reader = new FileReader();
                                                      reader.onloadend = () => {
                                                        const res = reader.result as string;
                                                        const newImages = [...data.agendaImages];
                                                        newImages[idx] = res;
                                                        setData({...data, 
                                                          agendaImages: newImages,
                                                          agendaActivityArchive: [...data.agendaActivityArchive, res]
                                                        });
                                                      };
                                                      reader.readAsDataURL(file);
                                                    }
                                                  }}
                                                />
                                              </label>
                                              
                                              {/* Archive items */}
                                              <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-1">Dall'archivio:</div>
                                              {data.agendaActivityArchive.map((archImg, i) => (
                                                <div key={i} className="group relative aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all p-2 flex items-center justify-center">
                                                  <button 
                                                    onClick={() => {
                                                      const newImages = [...data.agendaImages];
                                                      newImages[idx] = archImg;
                                                      setData({...data, agendaImages: newImages});
                                                    }}
                                                    className="w-full h-full flex items-center justify-center pointer-events-auto"
                                                  >
                                                    <img src={archImg} alt="Archive" className="w-full h-full object-contain" />
                                                  </button>
                                                  <button 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setData(prev => ({
                                                        ...prev,
                                                        agendaActivityArchive: prev.agendaActivityArchive.filter((_, idx2) => idx2 !== i)
                                                      }));
                                                    }}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow cursor-pointer border-none"
                                                    title="Elimina dall'archivio"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attività</span>
                                    </div>

                                    {/* Con Chi? */}
                                    <div className="flex flex-col items-center gap-2 w-full">
                                      <div className="w-full aspect-square max-w-[150px] sm:max-w-none bg-white rounded-[32px] shadow-2xl border-4 border-white/20 overflow-hidden relative flex items-center justify-center transition-transform hover:scale-105 group/item">
                                        {/* Fading Background Pattern */}
                                        <div className="absolute inset-0 opacity-5 pointer-events-none group-hover/item:opacity-15 transition-opacity">
                                          <img src="/famiglia.png" alt="pattern" className="w-full h-full object-cover" />
                                        </div>

                                        <DropdownMenu>
                                          <DropdownMenuTrigger render={
                                            <button className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/50 transition-colors relative z-10 focus:outline-none">
                                              {data.agendaWithWhomImages[idx] ? (
                                                <>
                                                  <img src={data.agendaWithWhomImages[idx]!} alt={`Con Chi ${idx + 1}`} className="w-full h-full object-contain p-2 animate-in fade-in zoom-in duration-500" />
                                                  <button 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const newWhom = [...data.agendaWithWhomImages];
                                                      newWhom[idx] = null;
                                                      setData({...data, agendaWithWhomImages: newWhom});
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-20 shadow-lg"
                                                  >
                                                    <Trash2 size={16} />
                                                  </button>
                                                </>
                                              ) : (
                                                <>
                                                  <Upload size={32} className="text-purple-200 mb-2" />
                                                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-tighter">Scegli</span>
                                                </>
                                              )}
                                            </button>
                                          } />
                                          <DropdownMenuContent className="p-4 w-64 max-h-[400px] overflow-y-auto bg-white rounded-[32px] shadow-2xl border-none z-50">
                                            <div className="grid grid-cols-2 gap-3">
                                              {/* Upload new */}
                                              <label className="col-span-2 cursor-pointer bg-purple-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-purple-700 transition-colors text-center">
                                                <Plus size={24} className="mx-auto" />
                                                <span className="text-xs font-black uppercase">Nuovo Contatto</span>
                                                <input 
                                                  type="file" 
                                                  className="hidden" 
                                                  accept="image/*"
                                                  onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                      const reader = new FileReader();
                                                      reader.onloadend = () => {
                                                        const res = reader.result as string;
                                                        const newWhom = [...data.agendaWithWhomImages];
                                                        newWhom[idx] = res;
                                                        setData({...data, 
                                                          agendaWithWhomImages: newWhom,
                                                          agendaWhomArchive: [...data.agendaWhomArchive, res]
                                                        });
                                                      };
                                                      reader.readAsDataURL(file);
                                                    }
                                                  }}
                                                />
                                              </label>
                                              
                                              {/* Archive items */}
                                              <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-1">Dall'archivio:</div>
                                              {data.agendaWhomArchive.map((archImg, i) => (
                                                <div key={i} className="group relative aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all p-2 flex items-center justify-center">
                                                  <button 
                                                    onClick={() => {
                                                      const newWhom = [...data.agendaWithWhomImages];
                                                      newWhom[idx] = archImg;
                                                      setData({...data, agendaWithWhomImages: newWhom});
                                                    }}
                                                    className="w-full h-full flex items-center justify-center pointer-events-auto"
                                                  >
                                                    <img src={archImg} alt="Archive" className="w-full h-full object-contain" />
                                                  </button>
                                                  <button 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setData(prev => ({
                                                        ...prev,
                                                        agendaWhomArchive: prev.agendaWhomArchive.filter((_, idx2) => idx2 !== i)
                                                      }));
                                                    }}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow cursor-pointer border-none"
                                                    title="Elimina dall'archivio"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              ))}
                                            </div>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Con Chi?</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 shrink-0">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => {
                                        const newImages = [...data.agendaImages];
                                        newImages[idx] = null;
                                        const newWhomImages = [...data.agendaWithWhomImages];
                                        newWhomImages[idx] = null;
                                        setData({...data, agendaImages: newImages, agendaWithWhomImages: newWhomImages});
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

                        {dayTab === 'tokens' && (
                           /* Right Panel: Token Economy */
                           <div className="flex-1 w-full space-y-8">
                             {/* Token Economy (Modified from Goose Game) */}
                             <div className="bg-white/95 rounded-[40px] p-10 shadow-2xl border-none">
                              {/* Objectives Section */}
                              <div className="mb-6">
                                <Button
                                  onClick={() => setShowObjectives(!showObjectives)}
                                  variant="ghost"
                                  className="w-full flex justify-between items-center bg-slate-50 p-6 rounded-3xl hover:bg-slate-100 transition-colors"
                                >
                                  <span className="text-xl font-black text-slate-800 uppercase tracking-tight">OBIETTIVI DELLA GIORNATA</span>
                                  {showObjectives ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </Button>
                                <AnimatePresence>
                                  {showObjectives && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
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
                                              if (e.key === 'Enter') {
                                                const val = (e.target as HTMLInputElement).value;
                                                if (val) {
                                                  setData({...data, agendaObjectives: [...data.agendaObjectives, val]});
                                                  (e.target as HTMLInputElement).value = '';
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          {data.agendaObjectives.map((obj, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                              <span className="font-bold text-blue-900">{obj}</span>
                                              <button 
                                                onClick={() => {
                                                  const newObjs = [...data.agendaObjectives];
                                                  newObjs.splice(idx, 1);
                                                  setData({...data, agendaObjectives: newObjs});
                                                }}
                                                className="text-rose-400 hover:text-rose-600"
                                              >
                                                <X size={18} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div className="flex justify-between items-center mb-8">
                                  <h4 className="text-2xl font-black text-slate-900 uppercase">TOKEN ECONOMY DELLE ATTIVITÀ</h4>
                                  <div className="flex items-center gap-4">
                                    <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => setIsTokenSelectionOpen(true)}
                                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2 w-auto h-auto flex items-center gap-2 font-black uppercase text-xs"
                                      >
                                        <PlusCircle size={16} /> Personalizza Gettone
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => {
                                          if (data.tokenStepsCount > 1) {
                                            setData({
                                              ...data, 
                                              tokenStepsCount: data.tokenStepsCount - 1,
                                              agendaProgress: Math.min(data.agendaProgress, data.tokenStepsCount - 1)
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
                                              tokenStepsCount: data.tokenStepsCount + 1
                                            });
                                          }
                                        }}
                                        className="text-slate-600 hover:bg-white rounded-xl w-10 h-10"
                                      >
                                        <Plus size={20} />
                                      </Button>
                                    </div>
                                    <Badge className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg">
                                       {data.agendaProgress} / {data.tokenStepsCount} 
                                    </Badge>
                                 </div>
                              </div>

                              <AnimatePresence>
                                {isTokenSelectionOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden w-full"
                                  >
                                    <div className="bg-white rounded-[40px] p-8 mb-8 shadow-2xl border-4 border-blue-100">
                                      <div className="flex items-center justify-between mb-6">
                                        <div>
                                          <h5 className="text-2xl font-black text-slate-900 uppercase italic">Archivio Gettoni</h5>
                                          <p className="text-slate-500 font-bold">Seleziona o carica l'immagine del gettone</p>
                                        </div>
                                        <Button variant="ghost" onClick={() => setIsTokenSelectionOpen(false)} className="rounded-2xl">
                                          <X size={24} />
                                        </Button>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                        {data.tokenArchive.map((token, idx) => (
                                          <div key={idx} className="relative group">
                                            <button
                                              onClick={() => {
                                                setData({...data, tokenSymbol: token});
                                                setIsTokenSelectionOpen(false);
                                              }}
                                              className={cn(
                                                "w-full aspect-square rounded-3xl border-4 transition-all overflow-hidden bg-slate-50 p-2",
                                                data.tokenSymbol === token ? "border-blue-500 shadow-xl" : "border-slate-100 hover:border-blue-200"
                                              )}
                                            >
                                              <img src={token} className="w-full h-full object-contain" />
                                            </button>
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newArchive = data.tokenArchive.filter((_, i) => i !== idx);
                                                setData({...data, tokenArchive: newArchive});
                                              }}
                                              className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-xl items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex shadow-lg z-10"
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        ))}
                                        <label className="aspect-square rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                                          <Plus size={24} className="text-slate-400" />
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
                                                    tokenArchive: [...data.tokenArchive, reader.result as string],
                                                    tokenSymbol: reader.result as string
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
                                       <img src="/inizio.png" alt="Start" className="w-full h-full object-cover" />
                                    </div>
                                    
                                    {/* Path */}
                                    {Array.from({ length: data.tokenStepsCount }).map((_, idx) => {
                                      const isReached = idx < data.agendaProgress;
                                      const isCurrent = idx === data.agendaProgress;
                                      return (
                                        <div key={idx} className="flex items-center gap-4">
                                          <div className="w-4 h-1 bg-slate-200 rounded-full" />
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                              if (idx <= data.agendaProgress) {
                                                setData({...data, agendaProgress: idx + 1});
                                              }
                                            }}
                                            className={cn(
                                              "w-20 h-20 rounded-[28px] border-4 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden shrink-0",
                                              isReached ? "bg-emerald-500 border-emerald-600 text-white shadow-lg" : 
                                              isCurrent ? "bg-white border-blue-500 border-dashed text-blue-500 animate-pulse" : 
                                              "bg-white border-slate-200 text-slate-300"
                                            )}
                                          >
                                            {isReached ? (
                                              data.tokenSymbol ? (
                                                <img src={data.tokenSymbol} className="absolute inset-0 w-full h-full object-contain p-2" />
                                              ) : (
                                                <CheckCircle2 size={32} className="relative z-10" />
                                              )
                                            ) : (
                                              <span className="text-xl font-black relative z-10">{idx + 1}</span>
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
                                           onClick={() => setIsRewardSelectionOpen(true)}
                                           className={cn(
                                             "w-32 h-32 rounded-[40px] bg-rose-500 flex items-center justify-center text-white font-black shadow-2xl shrink-0 overflow-hidden border-8 border-white/20 transition-all",
                                             data.agendaProgress >= data.tokenStepsCount ? "ring-8 ring-rose-400 ring-offset-4" : "opacity-30 grayscale-[1]"
                                           )}
                                         >
                                           {data.tokenRewardImage ? (
                                             <img src={data.tokenRewardImage} alt="Premio" className="w-full h-full object-cover" />
                                           ) : (
                                             <img src="/premio.png" alt="Reward Base" className="w-full h-full object-cover opacity-80" />
                                           )}
                                           <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                             <Sparkles className="text-white" size={32} />
                                           </div>
                                         </motion.button>
                                         {data.agendaProgress >= data.tokenStepsCount && (
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
                                           <h5 className="text-2xl font-black text-slate-900 uppercase">Scegli il tuo premio</h5>
                                           <p className="text-slate-500 font-bold">Tocca un'immagine per selezionarla come premio finale</p>
                                         </div>
                                         <Button 
                                           variant="ghost" 
                                           onClick={() => setIsRewardSelectionOpen(false)}
                                           className="rounded-2xl w-12 h-12"
                                         >
                                           <X size={24} />
                                         </Button>
                                       </div>

                                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                         {[
                                           { id: 'costruzioni', img: '/costruzioni.png', label: 'Costruzioni' },
                                           { id: 'biscotti', img: '/biscotti.png', label: 'Biscotti' },
                                           { id: 'tablet', img: '/tablet.png', label: 'Tablet' }
                                         ].map((reward) => (
                                           <motion.button
                                             key={reward.id}
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             onClick={() => {
                                               setData({...data, tokenRewardImage: reward.img});
                                               setIsRewardSelectionOpen(false);
                                             }}
                                             className={cn(
                                               "aspect-square rounded-[32px] overflow-hidden border-4 transition-all relative group",
                                               data.tokenRewardImage === reward.img ? "border-rose-500 shadow-xl" : "border-slate-100 bg-slate-50 hover:border-slate-300"
                                             )}
                                           >
                                             <img src={reward.img} alt={reward.label} className="w-full h-full object-cover" />
                                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                             <div className="absolute bottom-2 left-0 right-0 text-center">
                                               <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-800 shadow-sm">{reward.label}</span>
                                             </div>
                                           </motion.button>
                                         ))}

                                         {data.tokenRewardOptions.map((opt, idx) => (
                                           <motion.button
                                             key={`custom-${idx}`}
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             onClick={() => {
                                               setData({...data, tokenRewardImage: opt});
                                               setIsRewardSelectionOpen(false);
                                             }}
                                             className={cn(
                                               "aspect-square rounded-[32px] overflow-hidden border-4 transition-all relative group",
                                               data.tokenRewardImage === opt ? "border-rose-500 shadow-xl" : "border-slate-100 bg-slate-50 hover:border-slate-300"
                                             )}
                                           >
                                             <img src={opt} alt="Custom Reward" className="w-full h-full object-cover" />
                                             <button 
                                               onClick={(e) => {
                                                 e.stopPropagation();
                                                 const newOpts = data.tokenRewardOptions.filter((_, i) => i !== idx);
                                                 setData({...data, tokenRewardOptions: newOpts, tokenRewardImage: data.tokenRewardImage === opt ? null : data.tokenRewardImage});
                                               }}
                                               className="absolute top-2 right-2 w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-2xl z-20 hover:bg-rose-700 transition-colors pointer-events-auto"
                                               title="Elimina premio caricato"
                                             >
                                               <Trash2 size={20} />
                                             </button>
                                           </motion.button>
                                         ))}

                                         <label className="aspect-square rounded-[32px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                              <Plus size={24} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carica altro</span>
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
                                                      tokenRewardOptions: [...data.tokenRewardOptions, reader.result as string],
                                                      tokenRewardImage: reader.result as string
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

                        {dayTab === 'diary' && (
                           <div className="bg-white/95 rounded-[40px] p-10 shadow-2xl space-y-8">
                             <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border-4 border-slate-100">
                               <div>
                                 <h4 className="text-3xl font-black text-slate-900 uppercase">Diario Giornaliero</h4>
                                 <p className="text-slate-500 font-bold">Racconta la tua giornata con foto e commenti</p>
                               </div>
                               <Button 
                                 onClick={() => {
                                   setData({
                                     ...data,
                                     dailyDiary: [
                                       {
                                         id: Math.random().toString(36).substr(2, 9),
                                         date: new Date().toLocaleDateString('it-IT'),
                                         photo: null,
                                         comment: '',
                                         translatedComment: '',
                                         aiExplanation: ''
                                       },
                                       ...data.dailyDiary
                                     ]
                                   });
                                 }}
                                 className="h-16 px-8 rounded-3xl bg-blue-600 text-white hover:bg-blue-700 font-black uppercase shadow-xl flex items-center gap-3"
                               >
                                 <Plus size={24} /> Nuovo Inserimento
                               </Button>
                             </div>

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
                                             <img src={entry.photo} className="w-full h-full object-cover" />
                                             <button 
                                               onClick={() => {
                                                 const newDiary = [...data.dailyDiary];
                                                 newDiary[idx].photo = null;
                                                 newDiary[idx].aiExplanation = '';
                                                 setData({...data, dailyDiary: newDiary});
                                               }}
                                               className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity shadow-lg"
                                             >
                                               <Trash2 size={24} />
                                             </button>
                                           </>
                                         ) : (
                                           <div className="flex flex-col items-center text-slate-300">
                                              <Upload size={48} className="mb-2" />
                                              <span className="font-black uppercase text-xs">Carica Foto</span>
                                              <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                      const b64 = reader.result as string;
                                                      const newDiary = [...data.dailyDiary];
                                                      newDiary[idx].photo = b64;
                                                      setData({...data, dailyDiary: newDiary});
                                                      analyzePhotoWithAI(b64, idx);
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
                                                const newDiary = [...data.dailyDiary];
                                                newDiary[idx].date = e.target.value;
                                                setData({...data, dailyDiary: newDiary});
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
                                                <Sparkles size={12} /> Assistente AI
                                              </div>
                                              <p className="text-sm font-bold text-blue-800 leading-relaxed italic">
                                                "{entry.aiExplanation}"
                                              </p>
                                            </motion.div>
                                          )}
                                          {isAnalyzing === `diary-${idx}` && (
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl animate-pulse">
                                              <Loader2 size={18} className="text-blue-500 animate-spin" />
                                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI sta analizzando...</span>
                                            </div>
                                          )}
                                       </div>
                                     </div>

                                     <div className="flex-1 space-y-6">
                                       <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Il mio commento</label>
                                          <textarea 
                                            value={entry.comment}
                                            onChange={(e) => {
                                              const newDiary = [...data.dailyDiary];
                                              newDiary[idx].comment = e.target.value;
                                              setData({...data, dailyDiary: newDiary});
                                            }}
                                            placeholder="Scrivi qui cosa hai fatto oggi..."
                                            className="w-full bg-slate-50 border-4 border-slate-100 rounded-3xl p-6 font-bold text-slate-800 focus:ring-blue-500 focus:border-blue-200 transition-all min-h-[150px] shadow-inner"
                                          />
                                       </div>

                                       <div className="flex flex-wrap gap-4 text-white">
                                          <Button 
                                            onClick={() => translateToArabic(entry.comment, idx)}
                                            disabled={!entry.comment || isTranslating === `diary-${idx}`}
                                            className="h-12 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs flex items-center gap-2 shadow-lg"
                                          >
                                            {isTranslating === `diary-${idx}` ? (
                                              <Loader2 size={16} className="animate-spin text-white" />
                                            ) : (
                                              <Globe size={16} className="text-white" />
                                            )}
                                            Traduci in Arabo
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
                                               <Languages size={14} /> Traduzione Araba
                                             </div>
                                             <button 
                                               onClick={() => {
                                                 const newDiary = [...data.dailyDiary];
                                                 newDiary[idx].translatedComment = '';
                                                 setData({...data, dailyDiary: newDiary});
                                               }}
                                               className="text-emerald-300 hover:text-emerald-500 transition-colors"
                                             >
                                               <X size={14} />
                                             </button>
                                           </div>
                                           <p className="text-2xl font-bold text-slate-800 text-right font-arabic leading-loose" style={{ direction: 'rtl' }}>
                                             {entry.translatedComment}
                                           </p>
                                         </motion.div>
                                       )}
                                     </div>
                                   </div>

                                   <button 
                                     onClick={() => {
                                       const newDiary = data.dailyDiary.filter((_, i) => i !== idx);
                                       setData({...data, dailyDiary: newDiary});
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
                                     Nessun diario salvato.<br/>
                                     <span className="text-sm">Inizia a raccontare la tua giornata toccando il pulsante sopra!</span>
                                   </p>
                                 </div>
                               )}
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                  {studentSubSection === 'diary' && (
                    <div className="w-full max-w-7xl mx-auto p-4">
                      {!activeSubjectId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                          {data.schoolDiary.map((subject) => {
                            const Icon = subject.name === 'Italiano' ? BookOpen :
                                         subject.name === 'Matematica' ? Calculator :
                                         subject.name === 'Scienze' ? FlaskConical :
                                         Palette;
                            return (
                              <motion.button
                                whileHover={{ scale: 1.05, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={cn(
                                  "relative h-64 rounded-[40px] shadow-2xl overflow-hidden group flex flex-col items-center justify-center gap-6 border-8 border-white/20",
                                  subject.color
                                )}
                              >
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                <div className="z-10 bg-white/20 p-6 rounded-[30px] backdrop-blur-md">
                                  <Icon size={64} className="text-white" />
                                </div>
                                <h3 className="z-10 text-3xl font-black text-white uppercase tracking-tighter">{subject.name}</h3>
                                <div className="z-10 px-6 py-2 bg-white/10 rounded-full text-white/80 font-bold text-sm backdrop-blur-sm">
                                  {subject.activities.length} attivit{subject.activities.length === 1 ? 'à' : 'à'} salvate
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="max-w-4xl mx-auto">
                          {data.schoolDiary.filter(s => s.id === activeSubjectId).map(subject => {
                            const Icon = subject.name === 'Italiano' ? BookOpen :
                                         subject.name === 'Matematica' ? Calculator :
                                         subject.name === 'Scienze' ? FlaskConical :
                                         Palette;
                            return (
                              <div key={subject.id} className="bg-white rounded-[50px] shadow-2xl overflow-hidden border-8 border-white flex flex-col min-h-[700px]">
                                <div className={cn("p-10 text-white", subject.color)}>
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
                                        <h3 className="text-5xl font-black uppercase tracking-tighter">{subject.name}</h3>
                                        <p className="text-white/70 font-bold uppercase tracking-widest text-sm">Lo zaino delle mie attività</p>
                                      </div>
                                    </div>
                                    <div className="relative group">
                                      <Button size="lg" className="h-16 px-8 rounded-3xl bg-white text-slate-900 hover:bg-white/90 font-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
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
                                              const newDiary = data.schoolDiary.map(s => {
                                                if (s.id === subject.id) {
                                                  return {
                                                    ...s,
                                                    activities: [
                                                      {
                                                        id: Math.random().toString(36).substr(2, 9),
                                                        type: 'image',
                                                        content: reader.result as string,
                                                        date: new Date().toLocaleDateString('it-IT')
                                                      },
                                                      ...s.activities
                                                    ]
                                                  } as any;
                                                }
                                                return s;
                                              });
                                              setData({...data, schoolDiary: newDiary});
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
                                        Non ci sono ancora lavori salvati.<br/>
                                        <span className="text-sm">Tocca il pulsante in alto per aggiungere il tuo primo file!</span>
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
                                            <img src={act.content} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <button 
                                              onClick={() => {
                                                const newDiary = data.schoolDiary.map(s => {
                                                  if (s.id === subject.id) {
                                                    return {
                                                      ...s,
                                                      activities: s.activities.filter(a => a.id !== act.id)
                                                    };
                                                  }
                                                  return s;
                                                });
                                                setData({...data, schoolDiary: newDiary});
                                              }}
                                              className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-rose-600 hover:scale-110 active:scale-95"
                                            >
                                              <Trash2 size={24} />
                                            </button>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Data caricamento</span>
                                              <span className="text-lg font-black text-slate-800">{act.date}</span>
                                            </div>
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10", subject.color)}>
                                              <div className={cn("w-4 h-4 rounded-full", subject.color)} />
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

                  {studentSubSection === 'passport' && (
                    <div className="w-full max-w-4xl mx-auto p-4">
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

                      <div id="passport-card" className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-emerald-500/20 relative">
                        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/10 -z-0" />
                        
                        <div className="p-10 relative z-10 flex flex-col md:flex-row gap-10">
                          <div className="flex flex-col items-center gap-6 md:w-1/3">
                            <div className="w-48 h-64 bg-slate-100 rounded-3xl border-4 border-slate-200 overflow-hidden relative group shadow-xl">
                              {data.passport.photo ? (
                                <img src={data.passport.photo} alt="Student" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                  <User size={64} />
                                  <span className="text-xs font-black uppercase mt-2">Foto</span>
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
                                        passport: { ...data.passport, photo: reader.result as string }
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>
                            
                            <div className="w-full space-y-4">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nome</label>
                                <input 
                                  value={data.passport.name}
                                  onChange={(e) => setData({...data, passport: {...data.passport, name: e.target.value}})}
                                  placeholder="Inserisci nome"
                                  className="w-full bg-transparent border-none p-0 font-black text-xl text-slate-800 placeholder:text-slate-300 focus:ring-0"
                                />
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cognome</label>
                                <input 
                                  value={data.passport.surname}
                                  onChange={(e) => setData({...data, passport: {...data.passport, surname: e.target.value}})}
                                  placeholder="Inserisci cognome"
                                  className="w-full bg-transparent border-none p-0 font-black text-xl text-slate-800 placeholder:text-slate-300 focus:ring-0"
                                />
                              </div>
                            </div>
                            
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
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
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Data di nascita</label>
                                  <input 
                                    type="date"
                                    value={data.passport.birthDate}
                                    onChange={(e) => setData({...data, passport: {...data.passport, birthDate: e.target.value}})}
                                    className="w-full bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0"
                                  />
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-3xl border-2 border-slate-50 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                                  <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Residenza</label>
                                  <input 
                                    value={data.passport.residence}
                                    onChange={(e) => setData({...data, passport: {...data.passport, residence: e.target.value}})}
                                    placeholder="Città"
                                    className="w-full bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100">
                              <div className="flex items-center gap-3 mb-4">
                                <ThumbsUp className="text-emerald-500" size={24} />
                                <h4 className="font-black text-emerald-900 uppercase">Cosa mi piace</h4>
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {data.passport.likes.map((item, i) => (
                                  <div key={i} className="group relative">
                                    <Badge className="bg-white text-emerald-600 border-emerald-200 p-1 pr-2 rounded-2xl font-bold shadow-sm flex items-center gap-2 h-14">
                                      {item.type === 'image' ? (
                                        <img src={item.content} className="w-10 h-10 rounded-xl object-contain bg-slate-50" />
                                      ) : (
                                        <span className="px-2">{item.content}</span>
                                      )}
                                      <button onClick={() => {
                                        const newLikes = [...data.passport.likes];
                                        newLikes.splice(i, 1);
                                        setData({...data, passport: {...data.passport, likes: newLikes}});
                                      }} className="ml-1 text-slate-300 hover:text-rose-500 transition-colors"><X size={14} /></button>
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  placeholder="Scrivi e premi invio..."
                                  className="flex-1 bg-white border-emerald-100 rounded-2xl px-4 py-3 font-medium focus:ring-emerald-500 shadow-inner"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = (e.target as HTMLInputElement).value;
                                      if (val) {
                                        setData({...data, passport: {...data.passport, likes: [...data.passport.likes, { type: 'text', content: val }]}});
                                        (e.target as HTMLInputElement).value = '';
                                      }
                                    }
                                  }}
                                />
                                <div className="relative">
                                  <Button variant="outline" className="h-12 border-emerald-100 bg-white text-emerald-600 rounded-2xl hover:bg-emerald-50">
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
                                          setData({...data, passport: {...data.passport, likes: [...data.passport.likes, { type: 'image', content: reader.result as string }]}});
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
                                <ThumbsDown className="text-rose-500" size={24} />
                                <h4 className="font-black text-rose-900 uppercase">Cosa non mi piace</h4>
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {data.passport.dislikes.map((item, i) => (
                                  <div key={i} className="group relative">
                                    <Badge className="bg-white text-rose-600 border-rose-200 p-1 pr-2 rounded-2xl font-bold shadow-sm flex items-center gap-2 h-14">
                                      {item.type === 'image' ? (
                                        <img src={item.content} className="w-10 h-10 rounded-xl object-contain bg-slate-50" />
                                      ) : (
                                        <span className="px-2">{item.content}</span>
                                      )}
                                      <button onClick={() => {
                                        const newDis = [...data.passport.dislikes];
                                        newDis.splice(i, 1);
                                        setData({...data, passport: {...data.passport, dislikes: newDis}});
                                      }} className="ml-1 text-slate-300 hover:text-rose-500 transition-colors"><X size={14} /></button>
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  placeholder="Scrivi e premi invio..."
                                  className="flex-1 bg-white border-rose-100 rounded-2xl px-4 py-3 font-medium focus:ring-rose-500 shadow-inner"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = (e.target as HTMLInputElement).value;
                                      if (val) {
                                        setData({...data, passport: {...data.passport, dislikes: [...data.passport.dislikes, { type: 'text', content: val }]}});
                                        (e.target as HTMLInputElement).value = '';
                                      }
                                    }
                                  }}
                                />
                                <div className="relative">
                                  <Button variant="outline" className="h-12 border-rose-100 bg-white text-rose-600 rounded-2xl hover:bg-rose-50">
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
                                          setData({...data, passport: {...data.passport, dislikes: [...data.passport.dislikes, { type: 'image', content: reader.result as string }]}});
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
                                <h4 className="font-black text-slate-800 uppercase">Le mie canzoni e video preferiti</h4>
                              </div>
                              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {data.passport.youtubeLinks.map((link, i) => {
                                  // Simple abbreviation helper
                                  const displayLink = link.length > 30 ? link.substring(0, 27) + "..." : link;
                                  return (
                                    <div key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-red-200 transition-colors">
                                      <a 
                                        href={link.startsWith('http') ? link : `https://${link}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-1 min-w-0"
                                      >
                                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                          <Youtube size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-blue-600 truncate underline">{displayLink}</span>
                                      </a>
                                      <button 
                                        onClick={() => {
                                          const newLinks = [...data.passport.youtubeLinks];
                                          newLinks.splice(i, 1);
                                          setData({...data, passport: {...data.passport, youtubeLinks: newLinks}});
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
                                      if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value;
                                        if (val) {
                                          setData({...data, passport: {...data.passport, youtubeLinks: [...data.passport.youtubeLinks, val]}});
                                          (e.target as HTMLInputElement).value = '';
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
                             <span>Codice: ID-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                             <span>Creato con myPEI</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {studentSubSection === 'autonomy' && (
                    <div className="w-full max-w-7xl mx-auto p-4">
                      {!activeSubjectId ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                          {data.autonomyDiary.map((subject) => {
                            const Icon = subject.name === 'Igiene' ? Bath :
                                         subject.name === 'Abbigliamento' ? Shirt :
                                         subject.name === 'Alimentazione' ? Utensils :
                                         CheckCircle2;
                            return (
                              <motion.button
                                whileHover={{ scale: 1.05, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                key={subject.id}
                                onClick={() => setActiveSubjectId(subject.id)}
                                className={cn(
                                  "relative h-64 rounded-[40px] shadow-2xl overflow-hidden group flex flex-col items-center justify-center gap-6 border-8 border-white/20",
                                  subject.color
                                )}
                              >
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                <div className="z-10 bg-white/20 p-6 rounded-[30px] backdrop-blur-md">
                                  <Icon size={64} className="text-white" />
                                </div>
                                <h3 className="z-10 text-3xl font-black text-white uppercase tracking-tighter">{subject.name}</h3>
                                <div className="z-10 px-6 py-2 bg-white/10 rounded-full text-white/80 font-bold text-sm backdrop-blur-sm">
                                  {subject.activities.length} schede salvate
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="max-w-4xl mx-auto">
                          {data.autonomyDiary.filter(s => s.id === activeSubjectId).map(subject => {
                            const Icon = subject.name === 'Igiene' ? Bath :
                                         subject.name === 'Abbigliamento' ? Shirt :
                                         subject.name === 'Alimentazione' ? Utensils :
                                         CheckCircle2;
                            return (
                              <div key={subject.id} className="bg-white rounded-[50px] shadow-2xl overflow-hidden border-8 border-white flex flex-col min-h-[700px]">
                                <div className={cn("p-10 text-white", subject.color)}>
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
                                        <h3 className="text-5xl font-black uppercase tracking-tighter">{subject.name}</h3>
                                        <p className="text-white/70 font-bold uppercase tracking-widest text-sm">Le mie conquiste</p>
                                      </div>
                                    </div>
                                    <div className="relative group">
                                      <Button size="lg" className="h-16 px-8 rounded-3xl bg-white text-slate-900 hover:bg-white/90 font-black uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
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
                                              const newDiary = data.autonomyDiary.map(s => {
                                                if (s.id === subject.id) {
                                                  return {
                                                    ...s,
                                                    activities: [
                                                      {
                                                        id: Math.random().toString(36).substr(2, 9),
                                                        type: 'image',
                                                        content: reader.result as string,
                                                        date: new Date().toLocaleDateString('it-IT')
                                                      },
                                                      ...s.activities
                                                    ]
                                                  } as any;
                                                }
                                                return s;
                                              });
                                              setData({...data, autonomyDiary: newDiary});
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
                                        Carica una foto per questo obiettivo!<br/>
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
                                            <img src={act.content} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <button 
                                              onClick={() => {
                                                const newDiary = data.autonomyDiary.map(s => {
                                                  if (s.id === subject.id) {
                                                    return {
                                                      ...s,
                                                      activities: s.activities.filter(a => a.id !== act.id)
                                                    };
                                                  }
                                                  return s;
                                                });
                                                setData({...data, autonomyDiary: newDiary});
                                              }}
                                              className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:bg-rose-600 hover:scale-110 active:scale-95"
                                            >
                                              <Trash2 size={24} />
                                            </button>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-lg font-black text-slate-800">{act.date}</span>
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

                  {studentSubSection === 'relax' && (
                    <div className="w-full max-w-6xl mx-auto p-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-[50px] p-12 border-4 border-white/10">
                        <div className="flex justify-between items-center mb-12">
                          <div>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">La mia bolla relax</h3>
                            <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm mt-2">I miei momenti di tranquillità</p>
                          </div>
                          <div className="relative group">
                            <Button size="lg" className="h-16 px-8 rounded-3xl bg-indigo-500 text-white hover:bg-indigo-600 font-black uppercase shadow-2xl flex items-center gap-3">
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
                                          id: Math.random().toString(36).substr(2, 9),
                                          type: 'image',
                                          content: reader.result as string,
                                          date: new Date().toLocaleDateString('it-IT')
                                        },
                                        ...data.relaxArea
                                      ]
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        </div>

                        {data.relaxArea.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-32 text-indigo-200/40 gap-6">
                            <div className="w-40 h-40 rounded-full border-8 border-dashed border-indigo-200/20 flex items-center justify-center">
                              <Coffee size={64} />
                            </div>
                            <p className="text-2xl font-black uppercase text-center">Cosa ti fa stare bene?<br/><span className="text-sm font-bold opacity-60">Carica foto o video rilassanti</span></p>
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
                                  <img src={item.content} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                  <button 
                                    onClick={() => {
                                      setData({...data, relaxArea: data.relaxArea.filter(a => a.id !== item.id)});
                                    }}
                                    className="absolute top-4 right-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                  >
                                    <Trash2 size={24} />
                                  </button>
                                </div>
                                <div className="flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse mr-2" />
                                  <span className="text-indigo-500 font-black uppercase text-xs tracking-widest italic">Momento Relax</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!['day', 'diary', 'passport', 'choice', 'autonomy', 'relax'].includes(studentSubSection as any) && studentSubSection !== null && (
                    <Card className="bg-white/95 backdrop-blur-md rounded-[40px] p-12 border-none shadow-2xl h-full min-h-[50vh] flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                          <BookOpen size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">Sezione in arrivo</h3>
                        <p className="text-xl text-slate-500">Stiamo preparando questa attività per te!</p>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </motion.div>
          ) : role === 'school-family' ? (
            <motion.div
              key="communicator-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CAACommunicator onBack={() => setRole(null)} />
            </motion.div>
          ) : role === 'school' ? (
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
                    <h2 className="text-5xl font-black text-white">{t.school.welcome}</h2>
                    <p className="text-xl text-blue-100">Sezione dedicata agli insegnanti e al personale scolastico.</p>
                  </div>
                  <Button variant="outline" onClick={() => {
                    if (activeSchoolArea) {
                      setActiveSchoolArea(null);
                    } else {
                      saveToLocalStorage();
                      setRole(null);
                    }
                  }} className="md:absolute md:right-0 rounded-2xl h-14 px-8 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ChevronLeft size={20} className="mr-2" /> {activeSchoolArea ? 'Torna alle aree' : 'Torna alla scelta'}
                  </Button>
                </div>
              </div>

              {!activeSchoolArea ? (
                <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                  {(['humanities', 'scientific', 'foreignLanguages', 'artsMusicSports', 'civics', 'educationalSupport'] as const).map((areaKey) => (
                    <motion.button
                      key={areaKey}
                      whileHover={{ x: 10, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSchoolArea(areaKey)}
                      className="group relative flex items-center bg-white backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl border border-white/10 text-left p-8 transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-blue-600 mb-1">{t.school[areaKey]}</h3>
                        <p className="text-slate-500 text-sm font-medium">{t.school[`${areaKey}Desc` as keyof typeof t.school]}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ChevronRight size={24} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  {(() => {
                    const areaKey = activeSchoolArea as keyof typeof data.schoolAreas;
                    const descKey = `${String(areaKey)}Desc` as any;
                    const observationCategories = [
                      {
                        title: "Autonomia Personale e Scolastica",
                        items: [
                          { key: 'autonomia_igiene', label: "l'alunno sa gestire l'igiene" },
                          { key: 'autonomia_spazi', label: "muoversi negli spazi scolastici" },
                          { key: 'autonomia_aiuto', label: "chiedere aiuto" },
                          { key: 'autonomia_materiale', label: "organizzare il proprio materiale (quaderni, astuccio)" },
                        ]
                      },
                      {
                        title: "Comunicazione e Linguaggio",
                        items: [
                          { key: 'comunicazione_bisogni', label: "Individuare come esprime i bisogni" },
                          { key: 'comunicazione_consegne', label: "comprende le consegne" },
                          { key: 'comunicazione_caa', label: "utilizza forme comunicative alternative o aumentative (CAA)" },
                        ]
                      },
                      {
                        title: "Area Relazionale-Sociale",
                        items: [
                          { key: 'relazionale_comportamento', label: "comportamento corretto con i compagni e con gli adulti" },
                          { key: 'relazionale_regole', label: "rispetta le regole" },
                          { key: 'relazionale_contatto', label: "accetta il contatto fisico" },
                        ]
                      },
                      {
                        title: "Abilità Cognitive e di Apprendimento",
                        items: [
                          { key: 'cognitiva_attenzione', label: "tempi di attenzione ristretti (inferiori ai 10 minuti)" },
                          { key: 'cognitiva_concentrazione', label: "capacità di concentrazione su un compito" },
                          { key: 'cognitiva_base', label: "padroneggia le abilità di base (lettura, scrittura, calcolo)" },
                        ]
                      },
                      {
                        title: "Sfera Emotivo-Comportamentale",
                        items: [
                          { key: 'emotiva_emozioni', label: "gestione delle emozioni" },
                          { key: 'emotiva_frustrazione', label: "le reazioni alla frustrazione" },
                          { key: 'emotiva_motivazione', label: "la motivazione" },
                          { key: 'emotiva_stereotipie', label: "la presenza di stereotipie e gli interessi specifici" },
                        ]
                      }
                    ] as const;

                    return (
                      <Card className="p-10 rounded-[40px] border-none shadow-2xl bg-white/95 backdrop-blur-sm">
                        <div className="space-y-8">
                          <div className="space-y-2 text-center pb-6 border-b border-slate-100">
                            <Label className="text-4xl font-black text-blue-600">{t.school[areaKey]}</Label>
                            <p className="text-lg text-slate-400 font-medium">{t.school[descKey]}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {observationCategories.map((category) => (
                              <div key={category.title} className="space-y-4">
                                <h4 className="text-lg font-black text-slate-900 border-l-4 border-blue-500 pl-4">{category.title}</h4>
                                <div className="space-y-3">
                                  {category.items.map((obs) => {
                                    const value = (data.schoolObservations[areaKey] as any)[obs.key];
                                    return (
                                      <div key={obs.key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                                        <span className="text-sm font-bold text-slate-700 pr-4">{obs.label}</span>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => {
                                              const newObs = { ...data.schoolObservations[areaKey], [obs.key]: true };
                                              setData({ ...data, schoolObservations: { ...data.schoolObservations, [areaKey]: newObs } });
                                            }}
                                            className={cn(
                                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                              value === true ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : "bg-white text-slate-300 hover:text-blue-500 border border-slate-200"
                                            )}
                                          >
                                            <CheckCircle2 size={24} />
                                          </button>
                                          <button
                                            onClick={() => {
                                              const newObs = { ...data.schoolObservations[areaKey], [obs.key]: false };
                                              setData({ ...data, schoolObservations: { ...data.schoolObservations, [areaKey]: newObs } });
                                            }}
                                            className={cn(
                                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                              value === false ? "bg-rose-500 text-white shadow-lg shadow-rose-200 scale-110" : "bg-white text-slate-300 hover:text-rose-500 border border-slate-200"
                                            )}
                                          >
                                            <PlusCircle size={24} className="rotate-45" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-4 pt-8 border-t border-slate-100">
                            <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                               <MessageSquare size={24} className="text-blue-500" /> Note e Obiettivi
                            </Label>
                            <textarea 
                              className="w-full min-h-[200px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/30 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                              placeholder={t.school.placeholder}
                              value={data.schoolAreas[areaKey]}
                              onChange={(e) => setData({
                                ...data, 
                                schoolAreas: { ...data.schoolAreas, [areaKey]: e.target.value }
                              })}
                            />
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
                 <Button variant="ghost" onClick={() => setRole(null)} className="rounded-2xl h-12 px-6 font-bold text-white hover:bg-white/10">
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
                      <h3 className={cn("text-2xl font-black", step.textColor)}>{step.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
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
                  <div className={cn("inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 text-white", steps[currentStep].color)}>
                    {t.sections[currentStep].title}
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
                    {steps[currentStep].title}
                  </h2>
                  <div className="space-y-2 mb-4">
                    {steps[currentStep].rules?.map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <CheckCircle2 size={16} className={steps[currentStep].textColor} />
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
                          onChange={(e) => setData({...data, studentName: e.target.value})}
                          placeholder={t.studentName} 
                          className="h-14 rounded-2xl border-slate-200 focus:ring-4 focus:ring-blue-100"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">{t.birthDate}</Label>
                        <Input 
                          type="date" 
                          value={data.birthDate}
                          onChange={(e) => setData({...data, birthDate: e.target.value})}
                          className="h-14 rounded-2xl border-slate-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">{t.originCountry}</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={data.originCountry} 
                            onValueChange={(v) => setData({...data, originCountry: v})}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-slate-200 flex-1">
                              <SelectValue placeholder={t.originCountry} />
                            </SelectTrigger>
                            <SelectContent>
                              {countryList.map(c => (
                                <SelectItem key={c.cca2} value={c.name}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {data.originCountry && (
                            <Button 
                              variant="outline" 
                              className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-red-500"
                              onClick={() => setData({...data, originCountry: ''})}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">{t.languages}</Label>
                        <div className="space-y-2">
                          <Select onValueChange={(v) => {
                            if (!data.languagesSpoken.includes(v)) {
                              setData({...data, languagesSpoken: [...data.languagesSpoken, v]});
                            }
                          }}>
                            <SelectTrigger className="h-14 rounded-2xl border-slate-200">
                              <SelectValue placeholder={t.languages} />
                            </SelectTrigger>
                            <SelectContent>
                              {commonLanguages.map(l => (
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {data.languagesSpoken.map(l => (
                              <Badge key={l} variant="secondary" className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                                {l}
                                <button onClick={() => setData({...data, languagesSpoken: data.languagesSpoken.filter(lang => lang !== l)})} className="hover:text-red-500">×</button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                        <Label className="text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Dicitura Sensoriale / Codici Comunicativi</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant={data.lis === true ? 'default' : 'outline'}
                            className={cn("rounded-xl h-12 font-bold", data.lis === true ? "bg-blue-600 text-white" : "border-slate-200")}
                            onClick={() => setData({...data, lis: data.lis === true ? null : true})}
                          >
                            LIS
                          </Button>
                          <Button 
                            variant={data.braille === true ? 'default' : 'outline'}
                            className={cn("rounded-xl h-12 font-bold", data.braille === true ? "bg-blue-600 text-white" : "border-slate-200")}
                            onClick={() => setData({...data, braille: data.braille === true ? null : true})}
                          >
                            Braille
                          </Button>
                          <Button 
                            variant={data.isDeaf === true ? 'default' : 'outline'}
                            className={cn("rounded-xl h-12 font-bold", data.isDeaf === true ? "bg-blue-600 text-white" : "border-slate-200")}
                            onClick={() => setData({...data, isDeaf: data.isDeaf === true ? null : true})}
                          >
                            {t.deaf}
                          </Button>
                          <Button 
                            variant={data.isBlind === true ? 'default' : 'outline'}
                            className={cn("rounded-xl h-12 font-bold", data.isBlind === true ? "bg-blue-600 text-white" : "border-slate-200")}
                            onClick={() => setData({...data, isBlind: data.isBlind === true ? null : true})}
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
                        {(Object.keys(t.schoolLevels) as Array<keyof typeof t.schoolLevels>).map((level, idx) => {
                          const colors = [
                            'bg-blue-50 border-blue-100',
                            'bg-blue-100 border-blue-200',
                            'bg-blue-600 border-blue-700',
                            'bg-blue-900 border-blue-950'
                          ];
                          const isDark = idx >= 2;
                          return (
                            <div key={level} className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border transition-all", colors[idx])}>
                              <div className="md:col-span-1 flex items-center">
                                <Label className={cn("text-sm font-bold", isDark ? "text-white" : "text-blue-900")}>{t.schoolLevels[level]}</Label>
                              </div>
                              <div className="md:col-span-1">
                                <Input 
                                  value={data.schoolHistory[level]}
                                  onChange={(e) => setData({
                                    ...data, 
                                    schoolHistory: { ...data.schoolHistory, [level]: e.target.value }
                                  })}
                                  placeholder={t.schoolHistoryPlaceholder}
                                  className={cn("h-12 rounded-xl border-none", isDark ? "bg-white/20 text-white placeholder:text-white/50" : "bg-white text-slate-900")}
                                />
                              </div>
                              <div className="md:col-span-1">
                                <Input 
                                  value={data.schoolYears ? (data as any).schoolYears[level] : ''}
                                  onChange={(e) => setData({
                                    ...data, 
                                    schoolYears: { ...(data as any).schoolYears, [level]: e.target.value }
                                  } as any)}
                                  placeholder={t.schoolYearsPlaceholder}
                                  className={cn("h-12 rounded-xl border-none", isDark ? "bg-white/20 text-white placeholder:text-white/50" : "bg-white text-slate-900")}
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
                        onChange={(e) => setData({...data, freeTime: e.target.value})}
                      />
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                          <CheckCircle2 size={24} /> {t.strengths}
                        </Label>
                        <textarea 
                          className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                          placeholder={t.strengthsPlaceholder}
                          value={data.strengths}
                          onChange={(e) => setData({...data, strengths: e.target.value})}
                        />
                      </div>

                      <div className="space-y-6">
                        <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                          <Info size={24} /> {t.needs}
                        </Label>
                        <textarea 
                          className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                          placeholder={t.needsPlaceholder}
                          value={data.needs}
                          onChange={(e) => setData({...data, needs: e.target.value})}
                        />
                        
                        <div className="space-y-6 mt-4">
                          {CAA_CATEGORIES.map((cat) => (
                            <div key={cat.id} className="space-y-3">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">{cat.title}</h4>
                              <div className="grid grid-cols-3 gap-3">
                                {cat.items.map((item) => (
                                  <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      const currentNeeds = data.needs;
                                      const newNeeds = currentNeeds ? `${currentNeeds}, ${item.label}` : item.label;
                                      setData({...data, needs: newNeeds});
                                    }}
                                    className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-400 hover:shadow-md transition-all group"
                                  >
                                    <div className="w-12 h-12 mb-2 rounded-lg overflow-hidden bg-slate-50 border border-slate-50">
                                      <img 
                                        src={item.img} 
                                        alt={item.label} 
                                        className="w-full h-full object-cover" 
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.id}/200`;
                                        }}
                                      />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600 text-center leading-tight">{item.label}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <GenogramEditor 
                    members={data.familyMembers}
                    relationships={data.relationships}
                    onChange={(members, relationships) => setData({...data, familyMembers: members, relationships: relationships})}
                    t={t.genogram}
                    lang={lang}
                  />
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {t.communication}
                      </Label>
                      <textarea 
                        className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                        placeholder={t.communicationPlaceholder}
                        value={data.communication}
                        onChange={(e) => setData({...data, communication: e.target.value})}
                      />
                    </div>

                    <div className="space-y-6">
                      <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {t.autonomy}
                      </Label>
                      <textarea 
                        className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                        placeholder={t.autonomyPlaceholder}
                        value={data.autonomy}
                        onChange={(e) => setData({...data, autonomy: e.target.value})}
                      />
                    </div>

                    <div className="space-y-6">
                      <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {t.learning}
                      </Label>
                      <textarea 
                        className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                        placeholder={t.learningPlaceholder}
                        value={data.learning}
                        onChange={(e) => setData({...data, learning: e.target.value})}
                      />
                    </div>

                    <div className="space-y-6">
                      <Label className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {t.relation}
                      </Label>
                      <textarea 
                        className="w-full min-h-[150px] p-6 rounded-[32px] border-2 border-blue-100 bg-blue-50/40 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg text-slate-900"
                        placeholder={t.relationPlaceholder}
                        value={data.relation}
                        onChange={(e) => setData({...data, relation: e.target.value})}
                      />
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
                          currentStep === i ? cn("w-12", steps[currentStep].color) : "w-2 bg-slate-200"
                        )} 
                      />
                    ))}
                  </div>

                  <Button 
                    onClick={handleNext} 
                    className={cn(
                      "gap-2 rounded-2xl px-10 h-14 font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95",
                      steps[currentStep].color
                    )}
                  >
                    {currentStep === steps.length - 1 ? (lang === 'it' ? 'Home' : lang === 'ar' ? 'الرئيسية' : '首页') : t.next} <ChevronRight size={20} />
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
                  {(lang === 'ar' || lang === 'es') && aiExplanation && !isExplaining && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-12 h-12 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(aiExplanation.replace(/<[^>]*>?/gm, ''));
                        utterance.lang = lang === 'ar' ? 'ar-SA' : 'es-ES';
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
                      <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: aiExplanation || '' }}>
                      </div>
                    </div>
                    <Button 
                      className={cn("w-full mt-10 rounded-2xl h-14 text-lg font-bold text-white", currentStep !== null ? steps[currentStep].color : "bg-blue-600")}
                      onClick={() => {
                        setAiExplanation(null);
                        setIsGameActive(false);
                      }}
                    >
                      {lang === 'it' ? 'Torna al menu' : lang === 'ar' ? 'العودة للقائمة' : '返回菜单'}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Sidebar Help (Desktop) */}
      <div className="fixed left-8 bottom-8 hidden xl:block max-w-xs">
        <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white shadow-xl">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-slate-900">
            <Languages size={20} className={currentStep !== null ? steps[currentStep].textColor : "text-blue-600"} /> {t.helpTitle}
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t.helpDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
