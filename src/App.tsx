import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Users, 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Globe, 
  Info,
  Save,
  Languages,
  CheckCircle2,
  PlusCircle
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import GenogramEditor from './components/GenogramEditor';
import { PEIData } from './types';
import { GoogleGenAI } from "@google/genai";
import { cn } from './lib/utils';

type Language = 'it' | 'ar' | 'zh';

const translations = {
  it: {
    title: "PEI Inclusivo",
    subtitle: "Supporto Famiglie",
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
    schoolHistory: "Percorso Scolastico Precedente",
    schoolHistoryPlaceholder: "Descrivi brevemente le scuole frequentate...",
    strengths: "Punti di Forza",
    needs: "Bisogni e Difficoltà",
    strengthsPlaceholder: "Cosa piace fare all'alunno?",
    needsPlaceholder: "In quali attività ha bisogno di aiuto?",
    predefinedTitle: "Suggerimenti (clicca per aggiungere):",
    genogram: {
      title: "Genogramma Familiare",
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
      { id: 'info_history', title: 'Dati e Storia', description: 'Informazioni base e percorso scolastico', color: 'bg-blue-600', lightColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', image: '/storia.png' },
      { id: 'family', title: 'Genogramma', description: 'Mappa delle parentele e famiglia', color: 'bg-rose-600', lightColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700', image: '/famiglia.png' },
      { id: 'needs_strengths', title: 'Bisogni e Risorse', description: 'Cosa serve e cosa sa fare', color: 'bg-emerald-600', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', image: '/bisogni.png' },
    ]
  },
  ar: {
    title: "PEI الشامل",
    subtitle: "دعم الأسر",
    save: "حفظ المسودة",
    next: "التالي",
    prev: "السابق",
    complete: "إكمال",
    helpTitle: "مساعدة لغوية",
    helpDesc: "هل لديك شكوك حول مصطلح ما؟ انقر على أيقونة المعلومات للحصول على شرح بسيط.",
    whatIsPei: "ما هو PEI؟",
    studentName: "اسم الطالب",
    birthDate: "تاريخ الميلاد",
    originCountry: "بلد الأصل",
    languages: "اللغات المستخدمة في الأسرة",
    schoolHistory: "التاريخ المدرسي السابق",
    schoolHistoryPlaceholder: "صف بإيجاز المدارس التي التحق بها...",
    strengths: "نقاط القوة",
    needs: "الاحتياجات والصعوبات",
    strengthsPlaceholder: "ماذا يحب الطالب أن يفعل؟",
    needsPlaceholder: "في أي أنشطة يحتاج إلى مساعدة؟",
    predefinedTitle: "اقتراحات (انقر للإضافة):",
    genogram: {
      title: "شجرة العائلة",
      desc: "اسحب الأعضاء لتحريكهم. الروابط تلقائية.",
      addMember: "إضافة قريب",
      details: "تفاصيل العضو",
      name: "الاسم واللقب",
      relation: "العلاقة",
      age: "العمر",
      job: "العمل",
      gender: "الجنس",
      male: "ذكر",
      female: "أنثى",
      other: "آخر",
      uploadPhoto: "تحميل صورة",
      placeholderSelect: "اختر قريب",
      emptyState: "اختر عضواً من الرسم لتعديل تفاصيله.",
      relations: {
        student: "الطالب/ة",
        mother: "الأم",
        father: "الأب",
        sister: "الأخت",
        brother: "الأخ",
        gmother_m: "الجدة (من الأم)",
        gfather_m: "الجد (من الأم)",
        gmother_p: "الجدة (من الأب)",
        gfather_p: "الجد (من الأب)",
        uncle: "الخال/العم",
        aunt: "الخالة/العمة",
        cousin: "ابن/ابنة العم/الخال"
      }
    },
    sections: [
      { id: 'info_history', title: 'البيانات والتاريخ', description: 'المعلومات الأساسية والمسار المدرسي', color: 'bg-blue-600', lightColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', image: '/storia.png' },
      { id: 'family', title: 'شجرة العائلة', description: 'خريطة القرابة والعائلة', color: 'bg-rose-600', lightColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700', image: '/famiglia.png' },
      { id: 'needs_strengths', title: 'الاحتياجات والموارد', description: 'ما هو مطلوب وما يمكن القيام به', color: 'bg-emerald-600', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', image: '/bisogni.png' },
    ]
  },
  zh: {
    title: "包容性 PEI",
    subtitle: "家庭支持",
    save: "保存草稿",
    next: "下一步",
    prev: "上一步",
    complete: "完成",
    helpTitle: "语言帮助",
    helpDesc: "对某个术语有疑问？点击信息图标获取简单解释。",
    whatIsPei: "什么是 PEI？",
    studentName: "学生姓名",
    birthDate: "出生日期",
    originCountry: "原籍国",
    languages: "家庭语言",
    schoolHistory: "过往就学经历",
    schoolHistoryPlaceholder: "简要描述曾就读的学校...",
    strengths: "优势",
    needs: "需求与困难",
    strengthsPlaceholder: "学生喜欢做什么？",
    needsPlaceholder: "在哪些活动中需要帮助？",
    predefinedTitle: "建议（点击添加）：",
    genogram: {
      title: "家谱图",
      desc: "拖动成员以移动。连接是自动的。",
      addMember: "添加亲属",
      details: "成员详情",
      name: "姓名",
      relation: "关系",
      age: "年龄",
      job: "工作",
      gender: "性别",
      male: "男",
      female: "女",
      other: "其他",
      uploadPhoto: "上传照片",
      placeholderSelect: "选择亲属",
      emptyState: "在图中选择一个成员以修改其详情。",
      relations: {
        student: "学生",
        mother: "母亲",
        father: "父亲",
        sister: "姐妹",
        brother: "兄弟",
        gmother_m: "外祖母",
        gfather_m: "外祖父",
        gmother_p: "祖母",
        gfather_p: "祖父",
        uncle: "叔伯舅",
        aunt: "姑姨婶",
        cousin: "堂表亲"
      }
    },
    sections: [
      { id: 'info_history', title: '数据与历史', description: '基本信息与就学路径', color: 'bg-blue-600', lightColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', image: '/storia.png' },
      { id: 'family', title: '家谱图', description: '亲属关系与家庭地图', color: 'bg-rose-600', lightColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700', image: '/famiglia.png' },
      { id: 'needs_strengths', title: '需求与资源', description: '所需内容与能力', color: 'bg-emerald-600', lightColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', image: '/bisogni.png' },
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

export default function App() {
  const [lang, setLang] = useState<Language>('it');
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [data, setData] = useState<PEIData>({
    studentName: '',
    birthDate: '',
    originCountry: '',
    languagesSpoken: [],
    familyMembers: [],
    relationships: [],
    schoolHistory: '',
    strengths: '',
    needs: '',
  });

  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const t = translations[lang];
  const steps = t.sections;

  const handleNext = () => {
    if (currentStep !== null && currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else setCurrentStep(null);
  };

  const handlePrev = () => {
    if (currentStep !== null && currentStep > 0) setCurrentStep(currentStep - 1);
    else setCurrentStep(null);
  };

  const explainTerm = async (term: string) => {
    setIsExplaining(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Spiega il termine "${term}" in modo molto semplice per una famiglia straniera in Italia. Lingua di risposta: ${lang === 'it' ? 'Italiano' : lang === 'ar' ? 'Arabo' : 'Cinese'}. Sii empatico.`;
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setAiExplanation(result.text || "Error");
    } catch (error) {
      setAiExplanation("Error");
    } finally {
      setIsExplaining(false);
    }
  };

  const addPredefined = (field: 'strengths' | 'needs', value: string) => {
    const current = data[field];
    if (current.includes(value)) return;
    setData({
      ...data,
      [field]: current ? `${current}, ${value}` : value
    });
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      currentStep !== null ? steps[currentStep].lightColor : "bg-slate-50",
      lang === 'ar' ? 'font-sans' : ''
    )} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep(null)}>
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors", 
              currentStep !== null ? steps[currentStep].color : "bg-blue-600"
            )}>
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">{t.title}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg mr-4">
              {(['it', 'ar', 'zh'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-bold transition-all",
                    lang === l ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Button size="sm" className={cn("gap-2 text-white transition-colors", currentStep !== null ? steps[currentStep].color : "bg-blue-600")}>
              <Save size={16} /> {t.save}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {currentStep === null ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black text-slate-900 leading-tight">
                  {lang === 'it' ? 'Benvenuti nel PEI Inclusivo' : lang === 'ar' ? 'مرحباً بكم في PEI الشامل' : '欢迎来到包容性 PEI'}
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  {lang === 'it' ? 'Seleziona una sezione per iniziare a compilare il documento per tuo figlio.' : lang === 'ar' ? 'اختر قسماً للبدء في ملء الوثيقة لطفلك.' : '选择一个部分开始为您孩子填写文件。'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <motion.button
                    key={step.id}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(index)}
                    className="group relative flex flex-col bg-white rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 border border-white text-left"
                  >
                    <div className={cn("aspect-[4/3] overflow-hidden flex items-center justify-center p-6", step.lightColor)}>
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 space-y-3">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4", step.color)}>
                        {index === 0 ? <BookOpen size={24} /> : index === 1 ? <Users size={24} /> : <Heart size={24} />}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed">{step.description}</p>
                      <div className={cn("pt-4 flex items-center gap-2 font-bold text-sm uppercase tracking-wider", step.textColor)}>
                        {t.next} <ChevronRight size={16} />
                      </div>
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
                          <button onClick={() => explainTerm(t.studentName)} className={cn("hover:opacity-70", steps[currentStep].textColor)}>
                            <Info size={16} />
                          </button>
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
                        <Input 
                          value={data.originCountry}
                          onChange={(e) => setData({...data, originCountry: e.target.value})}
                          placeholder={t.originCountry} 
                          className="h-14 rounded-2xl border-slate-200"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-bold">{t.languages}</Label>
                        <Input 
                          placeholder={t.languages} 
                          className="h-14 rounded-2xl border-slate-200"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-base font-bold flex items-center gap-2">
                        {t.schoolHistory}
                        <button onClick={() => explainTerm(t.schoolHistory)} className={cn("hover:opacity-70", steps[currentStep].textColor)}>
                          <Info size={16} />
                        </button>
                      </Label>
                      <textarea 
                        className="w-full min-h-[180px] p-6 rounded-[32px] border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg"
                        placeholder={t.schoolHistoryPlaceholder}
                        value={data.schoolHistory}
                        onChange={(e) => setData({...data, schoolHistory: e.target.value})}
                      />
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
                      <Label className="text-xl font-black text-emerald-600 flex items-center gap-2">
                        <CheckCircle2 size={24} /> {t.strengths}
                      </Label>
                      <textarea 
                        className="w-full min-h-[250px] p-6 rounded-[32px] border-2 border-emerald-100 bg-emerald-50/20 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-lg"
                        placeholder={t.strengthsPlaceholder}
                        value={data.strengths}
                        onChange={(e) => setData({...data, strengths: e.target.value})}
                      />
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.predefinedTitle}</p>
                        <div className="flex flex-wrap gap-2">
                          {predefinedStrengths.map(s => (
                            <button 
                              key={s} 
                              onClick={() => addPredefined('strengths', s)}
                              className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold hover:bg-emerald-200 transition-colors flex items-center gap-2"
                            >
                              <PlusCircle size={14} /> {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Label className="text-xl font-black text-amber-600 flex items-center gap-2">
                        <Info size={24} /> {t.needs}
                      </Label>
                      <textarea 
                        className="w-full min-h-[250px] p-6 rounded-[32px] border-2 border-amber-100 bg-amber-50/20 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-lg"
                        placeholder={t.needsPlaceholder}
                        value={data.needs}
                        onChange={(e) => setData({...data, needs: e.target.value})}
                      />
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.predefinedTitle}</p>
                        <div className="flex flex-wrap gap-2">
                          {predefinedNeeds.map(n => (
                            <button 
                              key={n} 
                              onClick={() => addPredefined('needs', n)}
                              className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-bold hover:bg-amber-200 transition-colors flex items-center gap-2"
                            >
                              <PlusCircle size={14} /> {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-16 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrev} 
                    className="gap-2 rounded-2xl px-8 h-14 font-bold text-slate-400 hover:text-slate-900"
                  >
                    <ChevronLeft size={20} /> {currentStep === 0 ? (lang === 'it' ? 'Home' : lang === 'ar' ? 'الرئيسية' : '首页') : t.prev}
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
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white", currentStep !== null ? steps[currentStep].color : "bg-blue-600")}>
                    <Info size={32} />
                  </div>
                  <h3 className="text-2xl font-black">{t.helpTitle}</h3>
                </div>
                <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {aiExplanation}
                </div>
                <Button 
                  className={cn("w-full mt-10 rounded-2xl h-14 text-lg font-bold text-white", currentStep !== null ? steps[currentStep].color : "bg-blue-600")}
                  onClick={() => setAiExplanation(null)}
                >
                  {lang === 'it' ? 'Ho capito, grazie!' : lang === 'ar' ? 'فهمت، شكراً!' : '我明白了，谢谢！'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading State for AI */}
      <AnimatePresence>
        {isExplaining && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="flex flex-col items-center gap-6">
              <div className={cn(
                "w-16 h-16 border-4 border-t-transparent rounded-full animate-spin", 
                currentStep !== null ? steps[currentStep].textColor.replace('text', 'border') : "border-blue-600"
              )} />
              <p className={cn(
                "font-black text-xl animate-pulse", 
                currentStep !== null ? steps[currentStep].textColor : "text-blue-600"
              )}>
                {lang === 'it' ? 'Sto preparando una spiegazione...' : lang === 'ar' ? 'جاري التحضير...' : '正在准备解释...'}
              </p>
            </div>
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
