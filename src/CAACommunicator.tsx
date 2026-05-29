import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Eraser, MessageSquarePlus, Download, 
  Search, X, ArrowDown, DoorOpen, HandHelping, 
  Box, MapPin, Clock, ArrowRight, Home, 
  Droplets, Stethoscope, Mountain, ThumbsUp, 
  ThumbsDown, UserX, Ban, ChevronLeft, Send
} from 'lucide-react';
import { cn } from './lib/utils';
import { Button } from './components/ui/button';

const DEFAULT_SYMBOLS = [
    { id: 'stare', label: 'STARE', icon: ArrowDown, iconColor: 'text-slate-700', color: 'border-blue-400', translations: { en: 'Stay', ar: 'بقاء' }, type: 'default' },
    { id: 'aprire', label: 'APRIRE', icon: DoorOpen, iconColor: 'text-amber-700', color: 'border-red-500', translations: { en: 'Open', ar: 'فتح' }, type: 'default' },
    { id: 'aiutami', label: 'AIUTAMI', icon: HandHelping, iconColor: 'text-orange-500', color: 'border-red-500', translations: { en: 'Help me', ar: 'ساعدني' }, type: 'default' },
    { id: 'mettere', label: 'METTERE', icon: Box, iconColor: 'text-orange-600', color: 'border-gray-500', translations: { en: 'Put', ar: 'وضع' }, type: 'default' },
    { id: 'in', label: 'IN', icon: MapPin, iconColor: 'text-slate-500', color: 'border-slate-300', translations: { en: 'In', ar: 'في' }, type: 'default' },
    { id: 'adesso', label: 'ADESSO', icon: Clock, iconColor: 'text-gray-700', color: 'border-red-500', translations: { en: 'Now', ar: 'الآن' }, type: 'default' },
    { id: 'dopo', label: 'DOPO', icon: ArrowRight, iconColor: 'text-gray-700', color: 'border-green-500', translations: { en: 'After', ar: 'بعد' }, type: 'default' },
    { id: 'casa', label: 'CASA', icon: Home, iconColor: 'text-red-500', color: 'border-slate-400', translations: { en: 'Home', ar: 'منzel' }, type: 'default' },
    { id: 'acqua', label: 'ACQUA', icon: Droplets, iconColor: 'text-blue-500', color: 'border-red-500', translations: { en: 'Water', ar: 'ماء' }, type: 'default' },
    { id: 'dentista', label: 'DENTISTA', icon: Stethoscope, iconColor: 'text-blue-600', color: 'border-green-500', translations: { en: 'Dentist', ar: 'طبيب الأسنان' }, type: 'default' },
    { id: 'montagna', label: 'MONTAGNA', icon: Mountain, iconColor: 'text-teal-600', color: 'border-gray-500', translations: { en: 'Mountain', ar: 'جبل' }, type: 'default' },
    { id: 'mi-piace', label: 'MI PIACE', icon: ThumbsUp, iconColor: 'text-green-500', color: 'border-gray-500', translations: { en: 'I like it', ar: 'يعجبني' }, type: 'default' },
    { id: 'non-mi-piace', label: 'NON MI PIACE', icon: ThumbsDown, iconColor: 'text-red-500', color: 'border-black', translations: { en: "I don't like it", ar: 'لا يعجبني' }, type: 'default' },
    { id: 'non-bravo', label: 'NON BRAVO', icon: UserX, iconColor: 'text-red-600', color: 'border-gray-500', translations: { en: 'Not good', ar: 'ليس جيداً' }, type: 'default' },
    { id: 'non-toccare', label: 'NON TOCCARE', icon: Ban, iconColor: 'text-pink-600', color: 'border-gray-500', translations: { en: "Don't touch", ar: 'لا تلمس' }, type: 'default' },
];

const LANGUAGES = [
    { code: 'ar', label: 'العربية', flag: '🇦🇪', speechCode: 'ar-SA' },
    { code: 'es', label: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
];

const getArasaacImageUrl = (pictogramId: string | number) =>
    `https://static.arasaac.org/pictograms/${pictogramId}/${pictogramId}_300.png`;

const caaTranslations = {
  it: {
    title: "Scuola-Famiglia",
    description: "Comunicatore CAA per facilitare lo scambio tra scuola e famiglia.",
    backToChoice: "Torna alla scelta",
    writeSentence: "Scrivi una frase in italiano...",
    tapImages: "Tocca le immagini...",
    searchPlaceholder: "Cerca un pittogramma...",
    noResults: "Nessun pittogramma trovato.",
    connError: "Errore di connessione.",
    writeItalianText: "Scrivi testo in italiano...",
    searchTab: "Cerca Simbolo",
    composeTab: "Componi Frase",
    composerStatus: "Cerco i pittogrammi...",
    speaking: "Parla",
    erasing: "Cancella",
    download: "Scarica",
    translateBtn: "Traduci",
    translatePanelTitle: "Traduzioni",
    composerStatusPlaceholder: "Scrivi una frase...",
    composeAndTranslate: "Componi e Traduci",
    searchingArasaac: "Cerco su ARASAAC...",
    searchArasaacPlaceholder: "Cerca pittogrammi ARASAAC...",
  },
  ar: {
    title: "المدرسة-العائلة",
    description: "مواصل CAA لتسهيل التبادل بين المدرسة والعائلة.",
    backToChoice: "العودة للاختيار",
    writeSentence: "اكتب جملة بالإيطالية...",
    tapImages: "المس الصور...",
    searchPlaceholder: "ابحث عن رمز...",
    noResults: "لم يتم العثور على رموز.",
    connError: "خطأ في الاتصال.",
    writeItalianText: "اكتب نصاً بالإيطالية...",
    searchTab: "البحث عن رمز",
    composeTab: "تركيب جملة",
    composerStatus: "البحث عن رموز...",
    speaking: "تحدث",
    erasing: "مسح",
    download: "تحميل",
    translateBtn: "ترجم",
    translatePanelTitle: "الترجمات",
    composerStatusPlaceholder: "اكتب جملة...",
    composeAndTranslate: "ركّب وترجم",
    searchingArasaac: "البحث في ARASAAC...",
    searchArasaacPlaceholder: "البحث عن رموز ARASAAC...",
  },
  es: {
    title: "Escuela-Familia",
    description: "Comunicador CAA para facilitar el intercambio entre escuela y familia.",
    backToChoice: "Volver a la selección",
    writeSentence: "Escribe una frase en italiano...",
    tapImages: "Toca las imágenes...",
    searchPlaceholder: "Buscar un pictograma...",
    noResults: "No se encontraron pictogramas.",
    connError: "Error de conexión.",
    writeItalianText: "Escribe texto en italiano...",
    searchTab: "Buscar Pictograma",
    composeTab: "Componer Frase",
    composerStatus: "Buscando pictogramas...",
    speaking: "Hablar",
    erasing: "Borrar",
    download: "Descargar",
    translateBtn: "Traducir",
    translatePanelTitle: "Traducciones",
    composerStatusPlaceholder: "Escribe una frase...",
    composeAndTranslate: "Componer y Traducir",
    searchingArasaac: "Buscando en ARASAAC...",
    searchArasaacPlaceholder: "Buscar pictogramas ARASAAC...",
  }
};

interface CAACommunicatorProps {
  onBack: () => void;
  lang?: 'it' | 'ar' | 'es';
}

export default function CAACommunicator({ onBack, lang = 'it' }: CAACommunicatorProps) {
    const caaT = caaTranslations[lang] || caaTranslations.it;
    const [selectedLanguages, setSelectedLanguages] = useState(['ar', 'es']);
    const [sentence, setSentence] = useState<any[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const searchTimerRef = useRef<any>(null);

    const [composerText, setComposerText] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [composerProgress, setComposerProgress] = useState({ current: 0, total: 0 });
    const [composerStatus, setComposerStatus] = useState('');

    const [translations, setTranslations] = useState<any>({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [originalItalianText, setOriginalItalianText] = useState('');

    const [activeTab, setActiveTab] = useState<'compose' | 'search'>('compose');

    const translateText = useCallback(async (italianText: string) => {
        if (!italianText.trim()) return;

        setIsTranslating(true);
        const newTranslations: any = { it: italianText };

        for (const langCode of selectedLanguages) {
            try {
                const response = await fetch(
                    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(italianText)}&langpair=it|${langCode}`
                );
                const data = await response.json();
                if (data.responseStatus === 200 && data.responseData) {
                    newTranslations[langCode] = data.responseData.translatedText;
                } else {
                    newTranslations[langCode] = '(traduzione non disponibile)';
                }
            } catch (err) {
                console.error(`Errore traduzione ${langCode}:`, err);
                newTranslations[langCode] = '(errore di traduzione)';
            }
        }

        setTranslations(newTranslations);
        setIsTranslating(false);
    }, [selectedLanguages]);

    const composeSentence = useCallback(async () => {
        const text = composerText.trim();
        if (!text) return;

        const words = text
            .replace(/[.,!?;:'"()]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 0);

        if (words.length === 0) return;

        setIsComposing(true);
        setComposerProgress({ current: 0, total: words.length });
        setComposerStatus(caaT.composerStatus);
        setSentence([]);
        setOriginalItalianText(text);

        const newSentence: any[] = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();
            setComposerProgress({ current: i + 1, total: words.length });
            setComposerStatus(`${lang === 'it' ? 'Cerco' : lang === 'ar' ? 'البحث عن' : 'Buscando'} "${word}"... (${i + 1}/${words.length})`);

            try {
                const response = await fetch(
                    `https://api.arasaac.org/api/pictograms/it/search/${encodeURIComponent(word)}`
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const bestMatch = data[0];
                        newSentence.push({
                            id: `composed-${bestMatch._id}-${i}`,
                            arasaacId: bestMatch._id,
                            label: word.toUpperCase(),
                            imageUrl: getArasaacImageUrl(bestMatch._id),
                            color: 'border-violet-400',
                            translations: { it: word, en: word, ar: word, es: word },
                            type: 'arasaac',
                        });
                    } else {
                        newSentence.push({
                            id: `text-${i}`,
                            label: word.toUpperCase(),
                            color: 'border-slate-300',
                            translations: { it: word, en: word, ar: word, es: word },
                            type: 'text-only',
                        });
                    }
                } else {
                    newSentence.push({
                        id: `text-${i}`,
                        label: word.toUpperCase(),
                        color: 'border-slate-300',
                        translations: { it: word, en: word, ar: word, es: word },
                        type: 'text-only',
                    });
                }
            } catch (err) {
                console.error(`Errore ricerca "${word}":`, err);
                newSentence.push({
                    id: `text-${i}`,
                    label: word.toUpperCase(),
                    color: 'border-slate-300',
                    translations: { it: word, en: word, ar: word, es: word },
                    type: 'text-only',
                });
            }
        }

        setSentence(newSentence);
        setIsComposing(false);
        setComposerStatus('');
        setComposerProgress({ current: 0, total: 0 });

        translateText(text);
    }, [composerText, translateText]);

    const searchArasaac = useCallback(async (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) {
            setSearchResults([]);
            setSearchError('');
            return;
        }
        setIsSearching(true);
        setSearchError('');
        try {
            const response = await fetch(
                `https://api.arasaac.org/api/pictograms/it/search/${encodeURIComponent(trimmed)}`
            );
            if (!response.ok) {
                if (response.status === 404) {
                    setSearchResults([]);
                    setSearchError(caaT.noResults);
                } else {
                    throw new Error(`Errore API: ${response.status}`);
                }
                setIsSearching(false);
                return;
            }
            const data = await response.json();
            const symbols = data.slice(0, 30).map((item: any) => {
                const mainKeyword = item.keywords && item.keywords.length > 0
                    ? item.keywords[0].keyword : trimmed;
                return {
                    id: `arasaac-${item._id}`,
                    arasaacId: item._id,
                    label: mainKeyword.toUpperCase(),
                    imageUrl: getArasaacImageUrl(item._id),
                    color: 'border-blue-400',
                    translations: { en: mainKeyword, ar: mainKeyword, it: mainKeyword },
                    type: 'arasaac',
                };
            });
            setSearchResults(symbols);
            if (symbols.length === 0) {
                setSearchError(caaT.noResults);
            }
        } catch (err) {
            console.error('Errore ricerca ARASAAC:', err);
            setSearchError(caaT.connError);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => { searchArasaac(value); }, 500);
    };

    const toggleLanguage = (code: string) => {
        setSelectedLanguages(prev => {
            if (prev.includes(code)) {
                if (prev.length <= 1) return prev;
                return prev.filter(c => c !== code);
            }
            return [...prev, code];
        });
    };

    const speakText = (text: string, langCode = 'it') => {
        const voices = window.speechSynthesis.getVoices();
        const hasVoice = voices.some(v => v.lang.toLowerCase().startsWith(langCode));
        if (voices.length > 0 && !hasVoice) {
            if (langCode === 'ar') {
                alert("الصوت باللغة العربية غير مثبت على هذا الجهاز.\n\nكيفية إضافة حزم اللغات على الهاتف (تعليمات عملية):\nإذا تلقيت هذه الرسالة على هاتفك الذكي، يمكنك تثبيت اللغة مجانًا في بضع ثوانٍ:\n\nعلى نظام أندرويد (Android):\n1. انتقل إلى الإعدادات -> النظام (أو إعدادات إضافية).\n2. اختر اللغة والإدخال -> إخراج تحويل النص إلى كلام (Text-to-Speech).\n3. انقر على أيقونة الترس بجوار المحرك المفضل (مثل خدمات الصوت من Google).\n4. اختر تثبيت البيانات الصوتية وتنزيل حزمة اللغة العربية.\n\nعلى نظام iOS (آيفون/آيباد):\n1. انتقل إلى الإعدادات -> تسهيلات الاستخدام.\n2. اختر المحتوى المقروء -> الأصوات.\n3. اختر اللغة العربية من القائمة وانقر على أيقونة السحابة لتنزيل أحد الأصوات المتاحة.");
            } else if (langCode === 'es') {
                alert("La voz en español no está instalada en este dispositivo.\n\nCómo añadir los paquetes en el teléfono (Instrucciones prácticas):\nSi recibes este mensaje en tu smartphone, puedes instalar el idioma gratis en unos segundos:\n\nEn Android:\n1. Ve a Ajustes -> Sistema (o Ajustes adicionales).\n2. Selecciona Idioma e introducción de texto -> Salida de síntesis de voz (Text-to-Speech).\n3. Haz clic en el icono del engranaje junto a Motor preferido (ej. Servicios de voz de Google).\n4. Selecciona Instalar datos de voz y descarga el paquete para Español.\n\nEn iOS (iPhone/iPad):\n1. Ve a Ajustes -> Accesibilidad.\n2. Selecciona Leer contenido -> Voces.\n3. Elige Español en la lista y toca el icono de la nube para descargar una de las voces disponibles.");
            } else {
                alert("La voce in italiano non è installata su questo dispositivo.\n\nCome si aggiungono i pacchetti sul telefono (Istruzioni pratiche):\nSe ricevi questo messaggio sul tuo smartphone, puoi installare la lingua gratuitamente in pochi secondi:\n\nSu Android:\n1. Vai in Impostazioni -> Sistema (o Impostazioni aggiuntive).\n2. Seleziona Lingua e Inserimento -> Output sintesi vocale (Text-to-Speech).\n3. Clicca sull'icona dell'ingranaggio accanto a Motore preferido (es. Servizi vocali di Google).\n4. Seleziona Installa dati vocali e scarica il pacchetto per l'Italiano.\n\nSu iOS (iPhone/iPad):\n1. Vai in Impostazioni -> Accessibilità.\n2. Seleziona Contenuto letto ad alta voce -> Voci.\n3. Scegli Italiano dall'elenco e tocca l'icona della nuvola per scaricare una delle voci disponibili.");
            }
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const lang = LANGUAGES.find(l => l.code === langCode);
        utterance.lang = lang ? lang.speechCode : 'it-IT';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    const addToSentence = (symbol: any) => {
        if (sentence.length < 20) {
            setSentence(prev => [...prev, symbol]);
            speakText(symbol.translations?.it || symbol.label, 'it');
        }
    };

    const removeFromSentence = (index: number) => {
        setSentence(prev => prev.filter((_, i) => i !== index));
    };

    const playFullSentence = () => {
        if (sentence.length === 0) return;
        const fullText = originalItalianText || sentence.map(s => s.translations?.it || s.label).join(' ');
        setIsSpeaking(true);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'it-IT';
        utterance.rate = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const clearAll = () => {
        setSentence([]);
        setTranslations({});
        setOriginalItalianText('');
        setComposerText('');
    };

    const isSearchActive = searchQuery.trim().length > 0;
    const displayedSymbols = isSearchActive ? searchResults : DEFAULT_SYMBOLS;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative">
                <div className="text-center">
                    <h2 className="text-5xl font-black text-white">{caaT.title}</h2>
                    <p className="text-xl text-blue-100">{caaT.description}</p>
                </div>
                <Button variant="outline" onClick={onBack} className="md:absolute md:right-0 rounded-2xl h-14 px-8 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ChevronLeft size={20} className="mr-2" /> {caaT.backToChoice}
                </Button>
            </div>

            <div className="w-full max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-blue-500/20">
                {/* Sentence Bar */}
                <div className="p-4 sm:p-6 border-b-4 border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center min-h-[120px] sm:min-h-[160px] bg-slate-50/50 gap-4">
                    <div className="flex-1 flex flex-wrap gap-2 sm:gap-3 items-center min-h-[80px] sm:min-h-[100px]">
                        {sentence.length === 0 ? (
                            <div className="flex items-center gap-4 text-slate-300 mx-auto">
                                <MessageSquarePlus size={48} className="opacity-20" />
                                <span className="font-black uppercase tracking-widest text-sm sm:text-lg opacity-30">
                                    {activeTab === 'compose' ? caaT.composerStatusPlaceholder : caaT.tapImages}
                                </span>
                            </div>
                        ) : (
                            sentence.map((s, index) => (
                                <motion.div 
                                    key={`${s.id}-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={() => removeFromSentence(index)}
                                    className="flex flex-col items-center p-2 sm:p-3 bg-white border-2 border-slate-200 rounded-xl sm:rounded-2xl shadow-sm cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all group"
                                >
                                    {s.type === 'arasaac' ? (
                                        <img src={s.imageUrl} alt={s.label} className="w-10 h-10 sm:w-14 sm:h-14 object-contain" />
                                    ) : s.type === 'text-only' ? (
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-100 rounded-xl">
                                            <span className="text-xl sm:text-2xl font-black text-slate-400">{s.label.charAt(0)}</span>
                                        </div>
                                    ) : (
                                        <s.icon className={cn("w-10 h-10 sm:w-14 sm:h-14", s.iconColor)} />
                                    )}
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase mt-1 sm:mt-2 truncate w-14 sm:w-20 text-center group-hover:text-red-500">
                                        {s.label}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                    <div className="flex sm:flex-col flex-row justify-center sm:justify-start gap-3 sm:ml-6">
                        <Button 
                            onClick={playFullSentence} 
                            disabled={sentence.length === 0}
                            className="flex-1 sm:flex-none w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all font-black"
                        >
                            <Volume2 size={28} />
                        </Button>
                        <Button 
                            onClick={clearAll} 
                            variant="outline"
                            className="flex-1 sm:flex-none w-14 h-11 sm:w-16 sm:h-12 rounded-xl sm:rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all font-black"
                        >
                            <Eraser size={20} />
                        </Button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Language Selector */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => toggleLanguage(lang.code)}
                                className={cn(
                                    "px-4 py-3 rounded-2xl font-black text-sm transition-all",
                                    selectedLanguages.includes(lang.code)
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 font-black"
                                        : "bg-slate-50 text-slate-400 border-2 border-slate-100 hover:bg-slate-100"
                                )}
                            >
                                {lang.flag} {lang.label}
                            </button>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-4">
                        <Button 
                            variant={activeTab === 'compose' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('compose')}
                            className={cn("rounded-2xl h-12 px-8 font-black uppercase tracking-wider", activeTab === 'compose' ? "bg-blue-600 font-black" : "")}
                        >
                            {"✏️ " + caaT.composeTab}
                        </Button>
                        <Button 
                            variant={activeTab === 'search' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('search')}
                            className={cn("rounded-2xl h-12 px-8 font-black uppercase tracking-wider", activeTab === 'search' ? "bg-emerald-600 font-black" : "")}
                        >
                            {"🔍 " + caaT.searchTab}
                        </Button>
                    </div>

                    {/* Translations Panel */}
                    <AnimatePresence>
                        {(Object.keys(translations).length > 0 || isTranslating) && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-blue-50 rounded-[32px] p-6 border-2 border-blue-100 space-y-4"
                            >
                                <div className="flex items-center gap-3 text-blue-700 font-black uppercase tracking-widest text-xs">
                                    <Send size={16} /> {caaT.translatePanelTitle}
                                    {isTranslating && <span className="animate-pulse">...</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {translations.it && (
                                        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 flex items-center justify-between shadow-sm">
                                            <div>
                                                <span className="text-[10px] font-black text-blue-400 uppercase">🇮🇹 Italiano</span>
                                                <p className="text-lg font-bold text-slate-800">{translations.it}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => speakText(translations.it, 'it')} className="text-blue-500">
                                                <Volume2 size={20} />
                                            </Button>
                                        </div>
                                    )}
                                    {selectedLanguages.map(langCode => {
                                        const lang = LANGUAGES.find(l => l.code === langCode);
                                        const text = translations[langCode];
                                        if (!text || !lang) return null;
                                        return (
                                            <div key={langCode} className="bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between shadow-sm">
                                                <div className="flex-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{lang.flag} {lang.label}</span>
                                                    <p className="text-lg font-bold text-slate-800" dir={langCode === 'ar' ? 'rtl' : 'ltr'}>{text}</p>
                                                </div>
                                                <Button size="icon" variant="ghost" onClick={() => speakText(text, langCode)} className="text-emerald-500">
                                                    <Volume2 size={20} />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'compose' ? (
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={caaT.writeSentence}
                                        value={composerText}
                                        onChange={(e) => setComposerText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !isComposing) composeSentence(); }}
                                        className="w-full h-14 sm:h-20 px-5 sm:px-8 rounded-2xl sm:rounded-[32px] border-4 border-blue-100 bg-slate-50 focus:border-blue-400 outline-none transition-all text-base sm:text-xl font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                                    />
                                    {composerText && (
                                        <button onClick={() => setComposerText('')} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                            <X size={20} sm={24} />
                                        </button>
                                    )}
                                </div>

                                <Button 
                                    onClick={composeSentence}
                                    disabled={!composerText.trim() || isComposing}
                                    className="w-full h-14 sm:h-20 rounded-2xl sm:rounded-[32px] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm sm:text-lg shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {isComposing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                                            <span className="text-xs sm:text-base">{composerStatus}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Send size={18} sm={24} /> {caaT.composeAndTranslate}
                                        </div>
                                    )}
                                </Button>

                                {isComposing && composerProgress.total > 0 && (
                                    <div className="w-full h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(composerProgress.current / composerProgress.total) * 100}%` }}
                                            className="h-full bg-violet-600"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="max-w-2xl mx-auto relative">
                                    <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} sm={24} />
                                    <input
                                        type="text"
                                        placeholder={caaT.searchArasaacPlaceholder}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full h-14 sm:h-20 pl-12 sm:pl-16 pr-5 sm:pr-8 rounded-2xl sm:rounded-[32px] border-4 border-blue-100 bg-slate-50 focus:border-blue-400 outline-none transition-all text-base sm:text-xl font-bold text-slate-800 placeholder:text-slate-300"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                            <X size={20} sm={24} />
                                        </button>
                                    )}
                                </div>

                                {isSearching && (
                                    <div className="flex justify-center items-center gap-3 text-slate-400 font-bold">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                        {caaT.searchingArasaac}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {displayedSymbols.map((symbol, idx) => (
                                        <motion.button 
                                            key={`${symbol.id}-${idx}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => addToSentence(symbol)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-3 sm:p-6 bg-white border-2 sm:border-[6px] rounded-2xl sm:rounded-[3rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95",
                                                symbol.color
                                            )}
                                        >
                                            {symbol.type === 'arasaac' ? (
                                                <img src={symbol.imageUrl} alt={symbol.label} className="w-12 h-12 sm:w-20 sm:h-20 object-contain" />
                                            ) : (
                                                <symbol.icon className={cn("w-12 h-12 sm:w-20 sm:h-20", symbol.iconColor)} />
                                            )}
                                            <span className="text-[11px] sm:text-sm font-black uppercase mt-2 sm:mt-4 tracking-tighter text-slate-800">
                                                {symbol.label}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
