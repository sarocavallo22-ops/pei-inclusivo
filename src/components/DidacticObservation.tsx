import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PEIData } from "../types";
import { 
  ChevronLeft, 
  ChevronRight,
  BookOpen, 
  Award, 
  Sliders, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  FileText,
  Bookmark
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface DidacticObservationProps {
  data: PEIData;
  onChange: (newData: PEIData) => void;
  onBack: () => void;
}

const EVALUATION_LEVELS = [
  { id: "forza", label: "Punto di forza", colorClass: "bg-emerald-500 text-slate-950 font-black border-emerald-400" },
  { id: "nessuna", label: "NESSUNA", colorClass: "bg-teal-600 text-white font-black border-teal-500" },
  { id: "lieve", label: "LIEVE", colorClass: "bg-amber-400 text-slate-950 font-black border-amber-300" },
  { id: "media", label: "MEDIA", colorClass: "bg-orange-500 text-white font-black border-orange-400" },
  { id: "grave", label: "GRAVE", colorClass: "bg-rose-500 text-white font-black border-rose-400" },
  { id: "completa", label: "COMPLETA", colorClass: "bg-rose-700 text-white font-black border-rose-600" },
  { id: "criticita", label: "Criticità", colorClass: "bg-[#7f1d1d] text-white font-black border-[#ef4444]" }
];

const DIDACTIC_AREAS = [
  {
    key: "humanities",
    title: "AREA UMANISTICA",
    desc: "Italiano, Storia, Geografia. Questa sezione raccoglie le funzioni cognitive superiori, la memoria storica/geografica e l'intero asse del linguaggio e della comunicazione scritta e letta.",
    indicators: [
      { key: "b1140", title: "b1140 – Orientamento rispetto al tempo", desc: "Consapevolezza di oggi, domani, ieri, della data, del mese e dell'anno (fondamentale per la collocazione degli eventi storici)." },
      { key: "b1141", title: "b1141 – Orientamento rispetto al luogo", desc: "Consapevolezza di dove ci si trova, della città, dello Stato e dei dintorni (fondamentale per la geografia)." },
      { key: "b1441", title: "b1441 – Memoria a lungo termine", desc: "Permette di immagazzinare le informazioni autobiografiche e semantiche." },
      { key: "b1670", title: "b1670 – Recepire il linguaggio", desc: "Decodifica di messaggi in forma orale, scritta o altra per ottenere il loro significato." },
      { key: "b1671", title: "b1671 – Espressione del linguaggio", desc: "Produrre messaggi significativi in forma orale, scritta o altre forme." },
      { key: "d1400", title: "d1400 – Acquisire le abilità di riconoscimento di simboli", desc: "Decodifica di figure, icone, caratteri, lettere dell'alfabeto e parole." },
      { key: "d1402", title: "d1402 – Acquisire le abilità di comprensione di parole e frasi scritte", desc: "Comprensione del significato di testi scritti." },
      { key: "d1661", title: "d1661 – Comprendere il linguaggio scritto", desc: "Afferrare la natura e il significato del linguaggio nella lettura." },
      { key: "d1700", title: "d1700 – Utilizzare le abilità e le strategie generali del processo di scrittura", desc: "Adoperare parole che trasmettono il significato appropriato." },
      { key: "d310", title: "d310 – Comunicare con-ricevere-messaggi verbali", desc: "Comprendere i significati letterali e impliciti nel linguaggio parlato." },
      { key: "d325", title: "d325 – Comunicare con ricevere messaggi scritti", desc: "Comprendere il significato di messaggi comunicati tramite linguaggio scritto." }
    ]
  },
  {
    key: "scientific",
    title: "AREA SCIENTIFICO-TECNOLOGICA",
    desc: "Matematica, Scienze, Tecnologia. Include i processi di calcolo, l'alfabetismo numerico, le abilità logiche di astrazione e la risoluzione di problemi basati su sequenze e procedure.",
    indicators: [
      { key: "b163", title: "b163 – Funzioni cognitive di base", desc: "Acquisizione di base delle conoscenze riguardo agli oggetti, agli eventi e alle esperienze." },
      { key: "b1640", title: "b1640 – Astrazione", desc: "Creare idee, qualità o caratteristiche generali a partire da realtà concrete o casi effettivi." },
      { key: "b1720", title: "b1720 – Calcolo semplice", desc: "Computare con numeri (addizione, sottrazione, moltiplicazione, divisione)." },
      { key: "b1721", title: "b1721 – Calcolo complesso", desc: "Tradurre problemi in parole e formule matematiche in procedure aritmetiche." },
      { key: "d1370", title: "d1370 – Acquisire concetti di base", desc: "Dimensione, forma, quantità, lunghezza, uguale, opposto." },
      { key: "d1371", title: "d1371 – Acquisire concetti complessi", desc: "Concetti di classificazione, raggruppamento, reversibilità, seriazione." },
      { key: "d1500", title: "d1500 – Acquisire le abilità di riconoscimento di numeri, simboli e segni aritmetici", desc: "Riconoscimento e utilizzo." },
      { key: "d1501", title: "d1501 – Acquisire abilità di alfabetismo numerico come contare e ordinare", desc: "Concetto di alfabetismo numerico e degli insiemi." },
      { key: "d1502", title: "d1502 – Acquisire abilità nell'uso delle operazioni elementari", desc: "Addizione, sottrazione, moltiplicazione, divisione." },
      { key: "d1720", title: "d1720 – Utilizzare le abilità e le strategie semplici del processo di calcolo", desc: "Applicare i concetti per eseguire calcoli." },
      { key: "d1721", title: "d1721 – Utilizzare le abilità e le strategie complesse del processo di calcolo", desc: "Adoperare procedure e metodi matematici (algebra, calcolo, geometria)." },
      { key: "d1750", title: "d1750 – Risoluzione di problemi semplici", desc: "Identificare e analizzare una singola questione, sviluppando soluzioni e mettendole in atto." }
    ]
  },
  {
    key: "foreignLanguages",
    title: "LINGUE STRANIERE",
    desc: "Inglese, Spagnolo",
    indicators: [
      { key: "lang_comp", title: "Ascolto e Comprensione (L2)", desc: "Comprende istruzioni, formule di saluto e semplici frasi in lingua." },
      { key: "lang_prod", title: "Lettura e Risposta", desc: "Associa messaggi scritti semplici ad immagini o risponde a brevi domande." },
      { key: "lang_vocab", title: "Produzione Vocale/Mimica", desc: "Si esprime o saluta usando vocaboli fondamentali della L2." }
    ]
  },
  {
    key: "artsMusicSports",
    title: "AREA ARTISTICA/MUSICALE/MOTORIA",
    desc: "Arte e immagine, Musica, Scienze motorie",
    indicators: [
      { key: "art_regole", title: "Coordinazione Motoria e Spaziale", desc: "Si orienta nello spazio palestra, esegue percorsi e controlla la postura." },
      { key: "art_coordin", title: "Rispetto delle Regole del Gioco", desc: "Partecipa ad attività motorie di gruppo rispettando compagni e arbitro." },
      { key: "art_creativ", title: "Espressione Artistica e Manualità", desc: "Utilizza linguaggi grafici, plastici e controlla la motricità fine." },
      { key: "art_music", title: "Linguaggio Musicale", desc: "Riconosce ritmi, suoni, canta o riproduce suoni con piccoli strumenti." }
    ]
  },
  {
    key: "civics",
    title: "INSEGNAMENTI TRASVERSALI",
    desc: "Educazione Civica, Alternativa alla religione ed L1/L2",
    indicators: [
      { key: "civ_regole", title: "Cittadinanza e Relazioni", desc: "Dimostra attitudine alla convivenza civile e solidale con il gruppo classe." },
      { key: "civ_amb", title: "Rispetto dell'Ambiente", desc: "Rispetta e conserva gli arredi, i materiali scolastici e differenzia i rifiuti." },
      { key: "civ_digit", title: "Consapevolezza Digitale", desc: "Utilizza i dispositivi tecnologici con rispetto delle regole comportamentali (Netiquette)." }
    ]
  },
  {
    key: "educationalSupport",
    title: "EDUCATIVA SCOLASTICA",
    desc: "Supporto educativo e assistenza all'autonomia",
    indicators: [
      { key: "edu_auton", title: "Autonomia Personale", desc: "Cura l'igiene del sé, l'alimentazione e la vestizione in modo indipendente." },
      { key: "edu_gestione", title: "Organizzazione dei Materiali", desc: "Prepara l'astuccio, il diario e i quaderni secondo l'orario delle lezioni." },
      { key: "edu_relaz", title: "Gestione dei Tempi e delle Frustrazioni", desc: "Tollera l'attesa, gestisce la frustrazione e chiede aiuto opportunamente." }
    ]
  }
];

export function DidacticObservation({ data, onChange, onBack }: DidacticObservationProps) {
  const [activeAreaKey, setActiveAreaKey] = useState<string | null>(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // Load current values for selected area
  const currentArea = DIDACTIC_AREAS.find(a => a.key === activeAreaKey);
  const existingRecord = (data.didacticObservations || []).find(o => o.area === activeAreaKey) || {
    id: "obs_" + Date.now(),
    subject: currentArea?.title || "",
    pathType: 'A' as 'A' | 'B' | 'C',
    area: activeAreaKey || "",
    indicatorsStatus: {},
    indicatorsNotes: {},
    customObjectives: "",
    assessments: ""
  };

  const handleUpdateRecord = (updates: Partial<typeof existingRecord>) => {
    if (!activeAreaKey) return;
    const list = data.didacticObservations || [];
    const index = list.findIndex(o => o.area === activeAreaKey);

    const updatedRecord = {
      ...existingRecord,
      ...updates,
      area: activeAreaKey,
      subject: currentArea?.title || ""
    };

    const nextList = [...list];
    if (index >= 0) {
      nextList[index] = updatedRecord;
    } else {
      nextList.push(updatedRecord);
    }

    onChange({
      ...data,
      didacticObservations: nextList
    });

    // Auto-save feedback animation triggering
    setShowSaveAlert(true);
  };

  useEffect(() => {
    if (showSaveAlert) {
      const t = setTimeout(() => setShowSaveAlert(false), 1500);
      return () => clearTimeout(t);
    }
  }, [showSaveAlert]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-white relative" id="didactic-ob-root">
      
      <AnimatePresence mode="wait">
        {!activeAreaKey ? (
          /* SINGLE VIEW COMPONENT: Vertical list of 6 beautifully matched white cards */
          <motion.div
            key="area-selector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header section with back option to match main layout */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a192f]/60 backdrop-blur-md px-8 py-6 rounded-[35px] border border-white/10 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-teal-500/15 text-teal-300 border border-teal-550/20 px-3 py-1 rounded-full">
                  DIDATTICA & OSSERVAZIONE
                </span>
                <p className="text-sm font-semibold text-blue-100/70 mt-1.5 leading-relaxed">
                  Griglie d'osservazione e percorsi differenziati per le aree ministeriali d'alunno.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onBack}
                className="rounded-2xl h-11 px-6 font-bold bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <ChevronLeft size={16} /> Torna al Menu
              </Button>
            </div>

            {/* List of 6 Areas - Styled EXACTLY like the user's screenshot */}
            <div className="flex flex-col gap-4 w-full">
              {DIDACTIC_AREAS.map((area) => (
                <motion.button
                  key={area.key}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setActiveAreaKey(area.key)}
                  className="group relative w-full flex items-center justify-between bg-white rounded-[38px] p-7 md:px-9 md:py-8 shadow-xl border border-slate-100 text-left transition-all cursor-pointer"
                >
                  <div className="flex-1 pr-4 min-w-0">
                    <h4 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none">
                      {area.title}
                    </h4>
                    <p className="text-slate-500 text-xs md:text-sm font-semibold mt-2 md:mt-2.5 leading-normal truncate">
                      {area.desc}
                    </p>
                  </div>
                  {/* Chevron Right on pale blue matching screenshot */}
                  <div className="w-11 h-11 rounded-2xl bg-[#edf4fe] flex items-center justify-center text-blue-600 group-hover:bg-[#d5e5fe] group-hover:text-blue-700 transition-colors shrink-0 shadow-sm">
                    <ChevronRight size={20} className="stroke-[3px]" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* DETAILED EDITOR VIEW FOR SELECTED AREA */
          <motion.div
            key="area-editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header dashboard with quick return */}
            <div className="bg-[#0a192f]/85 backdrop-blur-md rounded-[35px] p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setActiveAreaKey(null)}
                  className="rounded-2xl h-11 px-5 font-black text-white hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  <ChevronLeft size={16} className="mr-1" /> Torna alle Aree
                </Button>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400">
                    PROGRAMMAZIONE AREA
                  </span>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mt-1.5 text-white">
                    {currentArea?.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{currentArea?.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-white/5">
                <Sliders size={15} className="text-cyan-400" />
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SALVATAGGIO ATTIVO</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>

            {/* MAIN FORM GROUP */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT GROUP: PATH TYPE (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[35px] p-6 space-y-6 shadow-xl text-slate-100">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider">Sezione 01</span>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-100 flex items-center gap-2 mt-0.5">
                    <BookOpen size={15} /> Tipo di Percorso (PEI)
                  </h4>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { id: 'A', value: 'Percorso A - Ordinario', desc: 'Con verifiche equipollenti e prove d\'esame ordinarie.' },
                    { id: 'B', value: 'Percorso B - Semplificato', desc: 'Verifiche adattate, obiettivi ridotti o dispense mirate.' },
                    { id: 'C', value: 'Percorso C - Differenziato', desc: 'Obiettivi didattici non riconducibili a quelli ministeriali.' }
                  ].map((path) => {
                    const isSelected = existingRecord.pathType === path.id;
                    return (
                      <button
                        key={path.id}
                        type="button"
                        onClick={() => handleUpdateRecord({ pathType: path.id as any })}
                        className={cn(
                          "p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer text-slate-200",
                          isSelected 
                            ? "bg-[#111e3b] border-cyan-400 ring-2 ring-cyan-400/10 shadow-lg text-cyan-100"
                            : "bg-slate-950/80 border-white/5 hover:bg-slate-950 text-slate-400 hover:text-slate-300"
                        )}
                      >
                        <span className="text-xs font-black uppercase tracking-wide">{path.value}</span>
                        <span className="text-[10px] font-semibold text-slate-500 mt-1.5 leading-normal">{path.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT GROUP: INDICATORS GRID (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900/95 border border-white/10 rounded-[35px] p-6 md:p-8 space-y-6 shadow-xl relative text-slate-100">
                
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[9px] font-bold uppercase text-cyan-400 tracking-wider">Sezione 02</span>
                  <h4 className="text-base font-black uppercase tracking-tight text-white mt-0.5">
                    Griglia di Osservazione Qualitativa
                  </h4>
                </div>

                <div className="space-y-6">
                  {currentArea?.indicators.map((indicator, idx) => {
                    const currentStatus = existingRecord.indicatorsStatus[indicator.key] || '';
                    const currentNote = existingRecord.indicatorsNotes[indicator.key] || '';

                    return (
                      <div 
                        key={indicator.key}
                        className="bg-slate-950/70 rounded-[28px] p-5 border border-white/5 hover:border-white/10 transition-colors space-y-4"
                      >
                        <div className="flex flex-col justify-between items-stretch gap-4">
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-extrabold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded">Indicatore {idx + 1}</span>
                            <h5 className="text-sm font-black text-slate-100 uppercase tracking-tight">{indicator.title}</h5>
                            <p className="text-[11px] font-medium text-slate-400 leading-normal">{indicator.desc}</p>
                          </div>

                          {/* 7-State ICF Qualifiers Layout */}
                          <div className="space-y-2 mt-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                              Valutazione dell'allineamento (Qualificatore ICF):
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 items-stretch bg-slate-900 border border-white/5 p-1.5 rounded-2xl w-full">
                              {EVALUATION_LEVELS.map((btn) => {
                                const isActive = currentStatus === btn.id;
                                return (
                                  <button
                                    key={btn.id}
                                    type="button"
                                    onClick={() => {
                                      const updatedStatus = {
                                        ...existingRecord.indicatorsStatus,
                                        [indicator.key]: isActive ? null : btn.id
                                      };
                                      handleUpdateRecord({ indicatorsStatus: updatedStatus });
                                    }}
                                    className={cn(
                                      "text-[9px] font-extrabold uppercase py-2 px-1 rounded-xl cursor-pointer transition-all text-center border-2 border-transparent flex items-center justify-center min-h-[44px]",
                                      isActive
                                        ? btn.colorClass
                                        : "text-slate-400 bg-slate-950/40 border-white/5 hover:text-white hover:bg-slate-800 hover:border-white/10"
                                    )}
                                  >
                                    {btn.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Note & Facilitators input field */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-t border-white/5 pt-3">
                          <div className="md:col-span-3 flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                            <MessageSquare size={13} className="text-cyan-400" />
                            <span>Contesto / Note:</span>
                          </div>
                          <div className="md:col-span-9">
                            <input
                              type="text"
                              value={currentNote}
                              onChange={(e) => {
                                const updatedNotes = {
                                  ...existingRecord.indicatorsNotes,
                                  [indicator.key]: e.target.value
                                };
                                handleUpdateRecord({ indicatorsNotes: updatedNotes });
                              }}
                              placeholder="Fasce d'aiuto, compensazione, facilitatori installati..."
                              className="w-full bg-slate-900 border border-white/10 rounded-xl h-10 px-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 shadow-inner"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional custom text editors */}
                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Bookmark size={13} className="text-cyan-400" /> Obiettivi ed Attività Personalizzate
                    </label>
                    <textarea
                      value={existingRecord.customObjectives || ""}
                      onChange={(e) => handleUpdateRecord({ customObjectives: e.target.value })}
                      placeholder="Traguardi di competenza specifici, abilità attese da raggiungere e facilitazioni stabilite..."
                      className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-slate-800 bg-slate-950/60 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-xs font-medium text-white placeholder-slate-600 resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <FileText size={13} className="text-cyan-400" /> Criteri di Verifica e Valutazione
                    </label>
                    <textarea
                      value={existingRecord.assessments || ""}
                      onChange={(e) => handleUpdateRecord({ assessments: e.target.value })}
                      placeholder="Misure dispensative, tempi aggiuntivi per verifiche, prove adattate concordate prima quadrimestre..."
                      className="w-full min-h-[120px] p-4 rounded-2xl border-2 border-slate-800 bg-slate-950/60 focus:ring-2 focus:ring-cyan-500 outline-none transition-all text-xs font-medium text-white placeholder-slate-600 resize-y"
                    />
                  </div>

                </div>

                {/* Confirm & Return Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setActiveAreaKey(null)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black rounded-2xl h-12 px-8 text-sm uppercase flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Salva e Torna alle Aree
                  </Button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-save notification feedback */}
      <AnimatePresence>
        {showSaveAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 uppercase tracking-wide"
          >
            <Sparkles size={14} className="animate-spin" />
            <span>Modifica Salvata in Tempo Reale</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
