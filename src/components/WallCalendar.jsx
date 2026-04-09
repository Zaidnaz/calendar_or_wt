'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WallCalendar = () => {
  // --- 1. STATE ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  
  const [monthlyNotes, setMonthlyNotes] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  
  const [direction, setDirection] = useState(1);
  const [isWindy, setIsWindy] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- 2. PERSISTENCE ---
  useEffect(() => {
    const savedNotes = localStorage.getItem('stack-calendar-notes');
    const savedMarks = localStorage.getItem('stack-marked-dates');
    
    if (savedNotes) {
      try { setMonthlyNotes(JSON.parse(savedNotes)); } 
      catch (e) { localStorage.removeItem('stack-calendar-notes'); }
    }
    
    if (savedMarks) {
      try { setMarkedDates(JSON.parse(savedMarks)); } 
      catch (e) { localStorage.removeItem('stack-marked-dates'); }
    }
  }, []);

  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

  const handleNotesChange = (e) => {
    const updatedNotes = { ...monthlyNotes, [monthKey]: e.target.value };
    setMonthlyNotes(updatedNotes);
    localStorage.setItem('stack-calendar-notes', JSON.stringify(updatedNotes));
  };

  const toggleMarkDate = () => {
    if (!startDate) return;
    const timeKey = startDate.getTime();
    setMarkedDates(prev => {
      const newMarks = { ...prev };
      if (newMarks[timeKey]) delete newMarks[timeKey]; 
      else newMarks[timeKey] = true;
      localStorage.setItem('stack-marked-dates', JSON.stringify(newMarks));
      return newMarks;
    });
  };

  // --- 3. LOGIC ---
  const changeMonth = (offset) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(offset);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' }).toUpperCase();
  
  // Constant Size Math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7; 
  const endPadding = 42 - (daysInMonth + startOffset); 

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date); setEndDate(null);
    } else if (date < startDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const isDateInRange = (date) => {
    if (startDate && endDate) return date > startDate && date < endDate;
    if (startDate && hoverDate && !endDate) return date > Math.min(startDate, hoverDate) && date < Math.max(startDate, hoverDate);
    return false;
  };

  const images = [
    "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=1000",
    "https://images.unsplash.com/photo-1418985991508-e47386d96a71?q=80&w=1000",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
    "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?q=80&w=1000",
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000",
    "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=1000",
    "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=1000",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000",
    "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1000",
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1000",
  ];

  // --- 4. STACK PHYSICS ---
  const stackVariants = {
    enter: (dir) => ({ scale: 0.9, y: 30, opacity: 0, rotateZ: 0, zIndex: 0 }),
    center: { scale: 1, y: 0, opacity: 1, rotateZ: 0, zIndex: 10 },
    exit: (dir) => ({
      x: dir > 0 ? -400 : 400, 
      y: -30,
      rotateZ: dir > 0 ? -6 : 6, 
      opacity: 0,
      zIndex: 20
    })
  };

  return (
    <div className="min-h-screen bg-stone-200 p-3 sm:p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
      
      <style>{`
        @keyframes natural-breeze {
          0%, 100% { transform: rotateX(3deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(8deg) rotateY(1.5deg) rotateZ(0.5deg); } 
          75% { transform: rotateX(4deg) rotateY(-1deg) rotateZ(-0.5deg); } 
        }
        .wind-active {
          will-change: transform;
          animation: natural-breeze 6s ease-in-out infinite;
        }
      `}</style>

      {/* DASHBOARD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 sm:mb-4 px-1 sm:px-2 z-50">
        <div>
          <h2 className="text-stone-500 font-black tracking-[0.2em] text-[11px] sm:text-xs">SMART STACK CALENDAR</h2>
          <p className="text-stone-400 text-[9px] sm:text-[9px] tracking-widest uppercase mt-0.5">Compact Engine</p>
        </div>
        <button 
          onClick={() => setIsWindy(!isWindy)}
          className={`px-4 py-2 sm:px-4 sm:py-2 rounded-full font-black text-[10px] tracking-wider shadow-sm transition-all active:scale-95 ${
            isWindy ? 'bg-sky-500 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
          }`}
        >
          {isWindy ? '🛑 STOP BREEZE' : '💨 START BREEZE'}
        </button>
      </div>

      {/* 3D WRAPPER */}
      <div 
        className={`w-full max-w-4xl relative ${isWindy ? 'wind-active' : ''}`} 
        style={{ perspective: '2000px', transformStyle: 'preserve-3d', transformOrigin: 'top center' }}
      >
        <div className="grid w-full relative">
          
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={monthKey} 
              custom={direction}
              variants={stackVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onAnimationComplete={() => setIsAnimating(false)}
              className="col-start-1 row-start-1 w-full bg-[#fdfbf7] rounded-xl sm:rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col border border-stone-200"
            >
              
              {/* Wire Binding */}
              <div className="relative h-4 sm:h-5 bg-zinc-900 flex justify-around items-center px-6 sm:px-10 z-20 shrink-0">
                {[...Array(14)].map((_, i) => (
                  <div key={i} className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-zinc-300 to-zinc-600 rounded-full border border-black shadow-inner -mt-2" />
                ))}
              </div>

              {/* TOP: Image Banner (Optimized for Mobile Height) */}
              <div className="relative w-full h-32 sm:h-40 bg-zinc-100 shrink-0">
                <img src={images[month]} alt={monthName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                  <span className="text-[11px] sm:text-xs font-medium tracking-[0.4em] opacity-80 mb-0.5">{year}</span>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">{monthName}</h1>
                </div>
              </div>

              {/* MIDDLE: Content (Better Touch Padding for Mobile) */}
              <div className="flex flex-col md:flex-row p-4 sm:p-5 gap-5 sm:gap-6 bg-white border-b border-stone-100 flex-1">
                
                {/* LEFT: Calendar Grid */}
                <div className="w-full md:w-[55%] flex flex-col">
                  
                  {/* Grid Controls */}
                  <div className="flex justify-between items-center mb-4 sm:mb-4 h-5 shrink-0">
                    <span className="text-[10px] font-bold text-stone-400 tracking-widest">DATE RANGE</span>
                    <div className="flex gap-2">
                      {startDate && !endDate && (
                        <button 
                          onClick={toggleMarkDate} 
                          className="text-[9px] font-bold text-sky-500 hover:text-sky-700 uppercase tracking-widest bg-sky-50 px-2.5 py-1 rounded-full flex items-center gap-1"
                        >
                          {markedDates[startDate.getTime()] ? '★ UNMARK' : '☆ MARK'}
                        </button>
                      )}
                      {startDate && (
                        <button 
                          onClick={() => { setStartDate(null); setEndDate(null); setHoverDate(null); }} 
                          className="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full"
                        >
                          CLEAR
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Compact 42-Cell Grid */}
                  <div className="grid grid-cols-7 gap-y-1.5 sm:gap-y-1.5 gap-x-1 sm:gap-x-1 w-full text-center">
                    {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(day => (
                      <div key={day} className="text-[9px] sm:text-[9px] font-black tracking-widest text-stone-400 mb-1">{day}</div>
                    ))}
                    
                    {[...Array(startOffset)].map((_, i) => (
                      <div key={`prev-${i}`} className="flex items-center justify-center p-1 text-stone-300 text-[11px] sm:text-xs">
                        {prevMonthDays - startOffset + i + 1}
                      </div>
                    ))}

                    {[...Array(daysInMonth)].map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(year, month, day);
                      const timeKey = dateObj.getTime();
                      
                      const isStart = startDate && timeKey === startDate.getTime();
                      const isEnd = endDate && timeKey === endDate.getTime();
                      const inRange = isDateInRange(dateObj);
                      const isMarked = markedDates[timeKey];

                      return (
                        <div key={day} className="relative group flex items-center justify-center aspect-square min-h-[30px] sm:min-h-[36px]">
                          {inRange && <div className="absolute inset-0 bg-sky-100 z-0" />}
                          {isStart && endDate && <div className="absolute inset-y-0 right-0 w-1/2 bg-sky-100 z-0" />}
                          {isEnd && startDate && <div className="absolute inset-y-0 left-0 w-1/2 bg-sky-100 z-0" />}

                          <button
                            onClick={() => handleDateClick(dateObj)}
                            onMouseEnter={() => setHoverDate(dateObj)}
                            className={`
                              relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-colors
                              ${isStart || isEnd ? 'bg-sky-500 text-white shadow-sm' : ''}
                              ${!isStart && !isEnd && inRange ? 'text-sky-700' : ''}
                              ${!isStart && !isEnd && !inRange ? 'text-stone-700 hover:bg-stone-100' : ''}
                            `}
                          >
                            {day}
                            {isMarked && <span className={`absolute -bottom-1 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${isStart || isEnd ? 'bg-white' : 'bg-rose-500'}`} />}
                          </button>
                        </div>
                      );
                    })}

                    {[...Array(endPadding)].map((_, i) => (
                      <div key={`next-${i}`} className="flex items-center justify-center p-1 text-stone-300 text-[11px] sm:text-xs">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Compact Notes */}
                <div className="w-full md:w-[45%] flex flex-col border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-[10px] font-black text-stone-400 mb-2 uppercase tracking-widest flex items-center justify-between shrink-0">
                    <span>{monthName} MEMOS</span>
                    <span className="text-sky-500 text-sm leading-none">✎</span>
                  </h3>
                  
                  <textarea
                    value={monthlyNotes[monthKey] || ''}
                    onChange={handleNotesChange}
                    placeholder={`Notes for ${monthName}...`}
                    className="flex-1 w-full resize-none outline-none text-xs text-stone-700 bg-transparent min-h-[100px] sm:min-h-[140px] md:min-h-full"
                    style={{
                      lineHeight: '1.75rem',
                      backgroundImage: 'linear-gradient(transparent, transparent calc(1.75rem - 1px), #e5e5e5 0px)',
                      backgroundSize: '100% 1.75rem'
                    }}
                  />
                </div>
              </div>

              {/* BOTTOM FOOTER: Navigation */}
              <div className="flex justify-between items-center w-full p-3 sm:p-3 sm:px-6 bg-stone-50 shrink-0">
                <button 
                  onClick={() => changeMonth(-1)} disabled={isAnimating}
                  className="px-4 py-2 sm:px-4 sm:py-2 bg-white rounded-md shadow-sm text-[10px] font-black tracking-widest text-stone-500 hover:text-black hover:bg-stone-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  &larr; PREV
                </button>
                
                <div className="flex gap-1.5 opacity-40">
                  <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                  <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                  <div className="w-1 h-1 rounded-full bg-stone-400"></div>
                </div>

                <button 
                  onClick={() => changeMonth(1)} disabled={isAnimating}
                  className="px-4 py-2 sm:px-4 sm:py-2 bg-white rounded-md shadow-sm text-[10px] font-black tracking-widest text-stone-500 hover:text-black hover:bg-stone-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  NEXT &rarr;
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;