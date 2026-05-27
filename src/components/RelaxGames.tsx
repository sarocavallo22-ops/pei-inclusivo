import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Sparkles, Trash2, Globe, Heart, Play, RefreshCw, Upload } from "lucide-react";

// 1. SOAP BUBBLES GAME
export function SoapBubblesGame() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; color: string; popped: boolean }[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);

  useEffect(() => {
    const initialBubbles = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 65,
      size: 50 + Math.random() * 50,
      color: [
        "rgba(56, 189, 248, 0.45)", 
        "rgba(232, 121, 249, 0.45)", 
        "rgba(34, 211, 238, 0.45)", 
        "rgba(129, 140, 248, 0.45)"
      ][Math.floor(Math.random() * 4)],
      popped: false
    }));
    setBubbles(initialBubbles);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(c => c + 1);
    
    setTimeout(() => {
      setBubbles(prev => {
        const remaining = prev.filter(b => b.id !== id);
        const newBubble = {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80,
          y: 15 + Math.random() * 65,
          size: 50 + Math.random() * 50,
          color: [
            "rgba(56, 189, 248, 0.45)", 
            "rgba(232, 121, 249, 0.45)", 
            "rgba(34, 211, 238, 0.45)", 
            "rgba(129, 140, 248, 0.45)"
          ][Math.floor(Math.random() * 4)],
          popped: false
        };
        return [...remaining, newBubble];
      });
    }, 400);
  };

  return (
    <div className="bg-slate-900 border-4 border-cyan-400 rounded-[40px] p-8 relative overflow-hidden min-h-[460px] shadow-2xl text-white flex flex-col justify-between w-full h-full">
      <div className="flex justify-between items-center z-10">
        <div>
          <h4 className="text-2xl font-black uppercase tracking-tight text-cyan-300">🫧 Bolle di Sapone</h4>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-0.5">Tocca le bolle per farle scoppiare!</p>
        </div>
        <div className="bg-cyan-950/80 border border-cyan-800 px-5 py-2 rounded-2xl shadow-lg">
          <span className="font-sans text-cyan-200 font-bold uppercase text-xs">Punti: <strong className="text-lg text-white font-black ml-1">{poppedCount}</strong></span>
        </div>
      </div>

      <div className="relative flex-1 w-full min-h-[280px] my-4 select-none">
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            onClick={() => !bubble.popped && popBubble(bubble.id)}
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              backgroundColor: bubble.color
            }}
            animate={bubble.popped ? { scale: [1, 1.4, 0], opacity: [1, 0.7, 0] } : { y: [0, -10, 0] }}
            transition={bubble.popped ? { duration: 0.25 } : { repeat: Infinity, duration: 3.5 + Math.random() * 2.5, ease: "easeInOut" }}
            className="absolute rounded-full border-2 border-white/75 cursor-pointer flex items-center justify-center shadow-xl backdrop-blur-[1px] transition-transform active:scale-95 z-10"
          >
            {!bubble.popped ? (
              <div className="absolute top-1 left-2 w-1/4 h-1/4 bg-white/45 rounded-full" />
            ) : (
              <span className="text-xs font-black uppercase text-cyan-200 scale-125">POP!</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center z-10">
        <Button 
          onClick={() => {
            const extraBubble = {
              id: Date.now() + Math.random(),
              x: 10 + Math.random() * 80,
              y: 15 + Math.random() * 65,
              size: 50 + Math.random() * 50,
              color: "rgba(232, 121, 249, 0.45)",
              popped: false
            };
            setBubbles(prev => [...prev, extraBubble]);
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black rounded-2xl uppercase text-xs px-6 py-4 shadow-lg border-2 border-white/20"
        >
          Soffia Bolla 🫧
        </Button>
      </div>
    </div>
  );
}

// 2. STRESS BALL GAME
export function StressBallGame() {
  const [squeezeCount, setSqueezeCount] = useState(0);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [ballColor, setBallColor] = useState("#f43f5e");
  const colors = ["#f43f5e", "#a855f7", "#3b82f6", "#10b981", "#fbbf24"];

  const handleSqueezeStart = () => {
    setIsSqueezing(true);
    setSqueezeCount(c => c + 1);
  };

  const handleSqueezeEnd = () => {
    setIsSqueezing(false);
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    setBallColor(nextColor);
  };

  return (
    <div className="bg-slate-900 border-4 border-rose-400 rounded-[40px] p-8 min-h-[460px] shadow-2xl text-white flex flex-col justify-between w-full h-full">
      <div className="flex justify-between items-center z-10">
        <div>
          <h4 className="text-2xl font-black uppercase tracking-tight text-rose-300">🛑 Pallina Antistress</h4>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-0.5">Schiaccia e tieni premuto la pallina!</p>
        </div>
        <div className="bg-rose-950/80 border border-rose-800 px-5 py-2 rounded-2xl shadow-lg">
          <span className="font-sans text-rose-200 font-bold uppercase text-xs">Schiacciate: <strong className="text-lg text-white font-black ml-1">{squeezeCount}</strong></span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center my-6">
        <motion.div
          onMouseDown={handleSqueezeStart}
          onMouseUp={handleSqueezeEnd}
          onMouseLeave={() => isSqueezing && handleSqueezeEnd()}
          onTouchStart={(e) => { e.preventDefault(); handleSqueezeStart(); }}
          onTouchEnd={handleSqueezeEnd}
          style={{
            backgroundColor: ballColor,
            boxShadow: isSqueezing 
              ? "inset 0 12px 24px rgba(0,0,0,0.6), 0 4px 6px rgba(0,0,0,0.1)" 
              : "inset 0 -18px 36px rgba(0,0,0,0.35), 0 25px 45px rgba(0,0,0,0.45)",
          }}
          animate={isSqueezing 
            ? { scaleX: 1.35, scaleY: 0.65, borderRadius: "38% 46% 36% 32% / 32% 34% 44% 42%" }
            : { scaleX: 1, scaleY: 1, borderRadius: "50%" }
          }
          className="w-44 h-44 cursor-pointer flex flex-col items-center justify-center border-4 border-white/35 transition-all duration-150 select-none relative group shadow-2xl"
        >
          <div className="absolute top-4 left-6 w-10 h-5 bg-white/25 rounded-full filter blur-[0.5px]" />
          <Heart size={36} className={`${isSqueezing ? 'animate-pulse scale-90 text-white/50' : 'text-white/80'} transition-transform`} />
          <span className="text-xs font-black uppercase text-white tracking-widest mt-2 select-none drop-shadow-md">
            Spremi!
          </span>
        </motion.div>
      </div>

      <div className="text-center font-bold text-slate-400 text-xs uppercase bg-slate-950/50 p-2 rounded-2xl border border-slate-800">
        Premi per liberare l'energia e calmarti! 🌸
      </div>
    </div>
  );
}

// 3. RETRO-INSPIRED CUSTOM memory matching game
interface CardItem {
  uniqueId: number;
  source: string;
  isEmoji: boolean;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MemoryGame() {
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("relax_memory_images");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [feedback, setFeedback] = useState("Tocca le carte per trovare le coppie!");

  const initGame = () => {
    const defaults = ["🐶", "🍉", "🚀", "🍦", "🎨", "⚽"];
    const activeSources = [...uploadedImages];
    while (activeSources.length < 3) {
      activeSources.push(defaults[activeSources.length]);
    }
    // Limit to 3 sources for 6 cards total (3 pairs)
    const chosenSources = activeSources.slice(0, 3);

    // Duplicate sources to make exactly 6 cards
    let gameCards = chosenSources.concat(chosenSources).map((src, i) => ({
      uniqueId: i,
      source: src,
      isEmoji: !src.startsWith("data:"),
      isFlipped: false,
      isMatched: false,
    }));

    // Shuffle gameCards
    for (let j = gameCards.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      const temp = gameCards[j];
      gameCards[j] = gameCards[k];
      gameCards[k] = temp;
    }

    setCards(gameCards);
    setSelectedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, [uploadedImages]);

  const handleCardClick = (idx: number) => {
    if (
      cards[idx].isFlipped ||
      cards[idx].isMatched ||
      selectedCards.length === 2
    ) {
      return;
    }

    const updated = [...cards];
    updated[idx].isFlipped = true;
    setCards(updated);

    const nextSelected = [...selectedCards, idx];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      const firstIdx = nextSelected[0];
      const secondIdx = nextSelected[1];

      if (cards[firstIdx].source === cards[secondIdx].source) {
        // MATCH found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          
          const gameOver = matchedCards.every((c) => c.isMatched);
          if (gameOver) {
            setFeedback("Bravissimo! Hai abbinato tutte le carte! 🎉");
          } else {
            setFeedback("Ottimo lavoro! Continua così! 🌟");
          }
        }, 300);
      } else {
        // MISMATCH
        setFeedback("Riprova, cerca lo stesso disegno!");
        setTimeout(() => {
          const resetFlipped = [...cards];
          resetFlipped[firstIdx].isFlipped = false;
          resetFlipped[secondIdx].isFlipped = false;
          setCards(resetFlipped);
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const readPromises = Array.from(files).map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            newImages.push(reader.result);
          }
          resolve();
        };
        reader.readAsDataURL(file as Blob);
      });
    });

    Promise.all(readPromises).then(() => {
      const updated = [...uploadedImages, ...newImages].slice(0, 9);
      setUploadedImages(updated);
      try {
        localStorage.setItem("relax_memory_images", JSON.stringify(updated));
      } catch (err) {
        console.error("Storage full or unavailable: ", err);
      }
      setFeedback("Immagini caricate! Le coppie sono pronte.");
    });
  };

  const deleteImage = (idxToDelete: number) => {
    const updated = uploadedImages.filter((_, idx) => idx !== idxToDelete);
    setUploadedImages(updated);
    try {
      localStorage.setItem("relax_memory_images", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setFeedback("Immagine eliminata!");
  };

  const isCompleted = cards.length > 0 && cards.every((c) => c.isMatched);

  return (
    <div className="bg-slate-900 border-4 border-yellow-400 rounded-[40px] p-8 min-h-[460px] shadow-2xl text-white flex flex-col justify-between w-full h-full relative">
      <div className="flex justify-between items-center z-10">
        <div>
          <h4 className="text-2xl font-black uppercase tracking-tight text-yellow-300">
            🃏 Gioco delle Coppie (Memory)
          </h4>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-0.5">
            Cerca e abbina le 6 carte sul tavolo!
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs text-yellow-300 font-black">
            Mosse: {moves}
          </div>
          <button
            onClick={initGame}
            className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-transform text-slate-950 font-black rounded-2xl uppercase text-[10px] px-4 py-2 flex items-center gap-1.5"
          >
            <RefreshCw size={10} />
            Reset
          </button>
        </div>
      </div>

      {isCompleted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center gap-4 z-10 py-8"
        >
          <span className="text-6xl animate-bounce">🏆</span>
          <h5 className="text-3xl font-black text-yellow-300 uppercase italic tracking-tighter">
            Super Bravissimo!
          </h5>
          <p className="text-slate-300 font-bold max-w-xs text-sm">
            Hai completato il Memory con solo {moves} mosse! Ti senti più calmo
            e felice?
          </p>
          <Button
            onClick={initGame}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black uppercase rounded-2xl text-xs px-6 py-4 shadow-lg border-2 border-white/20 mt-2"
          >
            Riprova 🎯
          </Button>
        </motion.div>
      ) : (
        <div className="flex-1 my-6 flex flex-col justify-center">
          {/* 3x2 Grid for 6 cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full px-2">
            {cards.map((card, idx) => (
              <div
                key={card.uniqueId}
                onClick={() => handleCardClick(idx)}
                className="aspect-square relative cursor-pointer select-none"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Back face (Question Mark) */}
                  <div
                    className="absolute inset-0 bg-slate-850 hover:bg-slate-800 border-4 border-yellow-400/40 rounded-3xl flex items-center justify-center font-black text-3xl text-yellow-400 shadow-xl transition-all"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    ❓
                  </div>

                  {/* Front face (Actual Item/Image) */}
                  <div
                    className="absolute inset-0 bg-slate-950 border-4 border-yellow-400 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {card.isEmoji ? (
                      <span className="text-4xl">{card.source}</span>
                    ) : (
                      <img
                        src={card.source}
                        alt="Carta memory"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload and Delete card section */}
      <div className="bg-slate-950/60 p-4 rounded-[28px] border border-slate-800 mb-4 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h5 className="font-black text-xs uppercase text-yellow-400 tracking-wider">
              📸 Carica le tue Immagini Personalizzate
            </h5>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Puoi caricare foto per usarle come carte nel gioco!
            </p>
          </div>
          <div>
            <label className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-transform text-slate-950 font-black rounded-xl uppercase text-[10px] px-3.5 py-2 cursor-pointer flex items-center justify-center gap-1.5 self-start">
              <Upload size={12} />
              Scegli Foto
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadedImages.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 max-h-24 overflow-y-auto pr-1">
            {uploadedImages.map((img, idx) => (
              <div
                key={idx}
                className="w-14 h-14 rounded-xl border-2 border-slate-700 overflow-hidden relative group/img shrink-0"
              >
                <img
                  src={img}
                  alt="Caricata"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteImage(idx)}
                  className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                  title="Elimina"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] font-bold text-slate-500 uppercase italic">
            Nessuna immagine personalizzata caricata. Sto usando le icone di default (🐶, 🍉, 🚀).
          </p>
        )}
      </div>

      <div className="text-center bg-slate-950/60 p-3 rounded-2xl border border-slate-800 font-bold text-xs uppercase text-slate-300 z-10 leading-normal">
        {feedback}
      </div>
    </div>
  );
}

// Utility class concatenator
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
