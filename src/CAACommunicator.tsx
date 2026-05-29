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

interface CAACommunicatorProps {
  onBack: () => void;
}

export default function CAACommunicator({ onBack }: CAACommunicatorProps) {
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
        setComposerStatus('Cerco i pittogrammi...');
        setSentence([]);
        setOriginalItalianText(text);

        const newSentence: any[] = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();
            setComposerProgress({ current: i + 1, total: words.length });
            setComposerStatus(`Cerco "${word}"... (${i + 1}/${words.length})`);

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
                    setSearchError('Nessun pittogramma trovato.');
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
                setSearchError('Nessun pittogramma trovato.');
            }
        } catch (err) {
            console.error('Errore ricerca ARASAAC:', err);
            setSearchError('Errore di connessione.');
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
                    <h2 className="text-5xl font-black text-white">Scuola-Famiglia</h2>
                    <p className="text-xl text-blue-100">Comunicatore CAA per facilitare lo scambio tra scuola e famiglia.</p>
                </div>
                <Button variant="outline" onClick={onBack} className="md:absolute md:right-0 rounded-2xl h-14 px-8 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <ChevronLeft size={20} className="mr-2" /> Torna alla scelta
                </Button>
            </div>

            <div className="w-full max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-blue-500/20">
                {/* Sentence Bar */}
                <div className="p-6 border-b-4 border-slate-100 flex items-center min-h-[160px] bg-slate-50/50">
                    <div className="flex-1 flex flex-wrap gap-3 items-center min-h-[100px]">
                        {sentence.length === 0 ? (
                            <div className="flex items-center gap-4 text-slate-300 mx-auto">
                                <MessageSquarePlus size={48} className="opacity-20" />
                                <span className="font-black uppercase tracking-widest text-lg opacity-30">
                                    {activeTab === 'compose' ? 'Scrivi una frase...' : 'Tocca le immagini...'}
                                </span>
                            </div>
                        ) : (
                            sentence.map((s, index) => (
                                <motion.div 
                                    key={`${s.id}-${index}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    onClick={() => removeFromSentence(index)}
                                    className="flex flex-col items-center p-3 bg-white border-2 border-slate-200 rounded-2xl shadow-sm cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all group"
                                >
                                    {s.type === 'arasaac' ? (
                                        <img src={s.imageUrl} alt={s.label} className="w-14 h-14 object-contain" />
                                    ) : s.type === 'text-only' ? (
                                        <div className="w-14 h-14 flex items-center justify-center bg-slate-100 rounded-xl">
                                            <span className="text-2xl font-black text-slate-400">{s.label.charAt(0)}</span>
                                        </div>
                                    ) : (
                                        <s.icon className={cn("w-14 h-14", s.iconColor)} />
                                    )}
                                    <span className="text-[10px] font-black uppercase mt-2 truncate w-20 text-center group-hover:text-red-500">
                                        {s.label}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </div>
                    <div className="flex flex-col gap-3 ml-6">
                        <Button 
                            onClick={playFullSentence} 
                            disabled={sentence.length === 0}
                            className="w-16 h-16 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all font-black"
                        >
                            <Volume2 size={32} />
                        </Button>
                        <Button 
                            onClick={clearAll} 
                            variant="outline"
                            className="w-16 h-12 rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 transition-all font-black"
                        >
                            <Eraser size={24} />
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
                            ✏️ Componi Frase
                        </Button>
                        <Button 
                            variant={activeTab === 'search' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('search')}
                            className={cn("rounded-2xl h-12 px-8 font-black uppercase tracking-wider", activeTab === 'search' ? "bg-emerald-600 font-black" : "")}
                        >
                            🔍 Cerca Simbolo
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
                                    <Send size={16} /> Traduzioni
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
                                        placeholder="Scrivi una frase in italiano..."
                                        value={composerText}
                                        onChange={(e) => setComposerText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !isComposing) composeSentence(); }}
                                        className="w-full h-20 px-8 rounded-[32px] border-4 border-blue-100 bg-slate-50 focus:border-blue-400 outline-none transition-all text-xl font-bold text-slate-800 placeholder:text-slate-300 shadow-inner"
                                    />
                                    {composerText && (
                                        <button onClick={() => setComposerText('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>

                                <Button 
                                    onClick={composeSentence}
                                    disabled={!composerText.trim() || isComposing}
                                    className="w-full h-20 rounded-[32px] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {isComposing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                                            <span>{composerStatus}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Send size={24} /> Componi e Traduci
                                        </div>
                                    )}
                                </Button>

                                {isComposing && composerProgress.total > 0 && (
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
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
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Cerca pittogrammi ARASAAC..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full h-20 pl-16 pr-8 rounded-[32px] border-4 border-blue-100 bg-slate-50 focus:border-blue-400 outline-none transition-all text-xl font-bold text-slate-800 placeholder:text-slate-300"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>

                                {isSearching && (
                                    <div className="flex justify-center items-center gap-3 text-slate-400 font-bold">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                        Cerco su ARASAAC...
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {displayedSymbols.map((symbol, idx) => (
                                        <motion.button 
                                            key={`${symbol.id}-${idx}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => addToSentence(symbol)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-6 bg-white border-[6px] rounded-[3rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95",
                                                symbol.color
                                            )}
                                        >
                                            {symbol.type === 'arasaac' ? (
                                                <img src={symbol.imageUrl} alt={symbol.label} className="w-20 h-20 object-contain" />
                                            ) : (
                                                <symbol.icon className={cn("w-20 h-20", symbol.iconColor)} />
                                            )}
                                            <span className="text-sm font-black uppercase mt-4 tracking-tighter text-slate-800">
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
