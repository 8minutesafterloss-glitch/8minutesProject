import React, { useMemo } from 'react';

const ARTIST_LIST =
  'נעמה מרקס אביקסיס, אורטל אגמון הירש, ליענה אלון, רותם אלפסי, יסמין בלנק, עדן ברנע לנדאו, ענת גוזלי, שרה מלק, יעל גולדמן, ליאור חיים, טל כהן, רונית לובצקי, תניה לוי, ברק מאיר, ירון מאייר, מור לוי גבירץ, זהר נוי ולך, מאיה נוי סמירה, יוליה ספקטור, רוני עמבור, טלי צפדיה, אריאלה צ\u2018רני, רונן קנדל, נאורה קנובלר.';

const INTRO_WORD = 'בקרוב';
const TITLE_LINES = ['התערוכה של מיזם', '8 דקות', '"הרגעים הריקים"'];

const STAGES = [
  { type: 'intro-grow', main: INTRO_WORD },
  { type: 'typewriter' },
  { type: 'grow', main: 'מעל ל־20 אומנים' },
  { type: 'list', main: ARTIST_LIST },
  { type: 'bounce', main: 'כ־50 יצירות' },
  { type: 'title', top: 'פתיחה', main: '15/10 · בית ציוני אמריקה' },
  { type: 'glow', main: 'אנחנו נהיה שם!' },
  { type: 'climax', main: 'מה אתכם?', prev: 'אנחנו נהיה שם!' },
];

const SCATTER_DURATION = 0.4;

function TypewriterTitle({ stageElapsed, stageDuration }) {
  const flat = useMemo(() => {
    const arr = [];
    TITLE_LINES.forEach((line, li) => {
      [...line].forEach((ch) => arr.push({ li, ch }));
    });
    return arr;
  }, []);

  const totalChars = flat.length;
  const typingDuration = stageDuration * 0.82;
  const charInterval = typingDuration / totalChars;
  const revealed = Math.min(totalChars, Math.floor(stageElapsed / charInterval));

  const lineStrings = useMemo(() => {
    const result = TITLE_LINES.map(() => '');
    for (let i = 0; i < revealed; i++) {
      const item = flat[i];
      result[item.li] += item.ch;
    }
    return result;
  }, [revealed, flat]);

  const cursorLi = revealed < totalChars ? flat[revealed]?.li ?? 0 : -1;

  return (
    <div className="flex flex-col items-center gap-2">
      {TITLE_LINES.map((_, li) => (
        <h1
          key={li}
          className="font-heading text-3xl font-bold text-white drop-shadow-lg flex items-center justify-center min-h-[1.4em]"
        >
          <span>{lineStrings[li]}</span>
          {li === cursorLi && (
            <span className="inline-block w-[3px] h-[0.9em] bg-white ml-1 animate-pulse" />
          )}
        </h1>
      ))}
    </div>
  );
}

export default function TeaserCaptions({ elapsed, totalDuration }) {
  const stageCount = STAGES.length;
  const stageDuration = totalDuration / stageCount;
  const stageIndex = Math.min(stageCount - 1, Math.floor(elapsed / stageDuration));
  const stage = STAGES[stageIndex];
  const stageStart = stageIndex * stageDuration;
  const stageProgress = (elapsed - stageStart) / stageDuration;

  const scatterChars = useMemo(() => {
    if (stage.type !== 'list') return [];
    return stage.main.split('').map((ch) => ({
      ch,
      tx: (Math.random() - 0.5) * 600,
      ty: (Math.random() - 0.5) * 900,
      rot: (Math.random() - 0.5) * 140,
    }));
  }, [stageIndex, stage.type, stage.main]);

  const scatterActive =
    stage.type === 'list' && stageProgress > 1 - SCATTER_DURATION / stageDuration;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center bg-black/35">
      {stage.type === 'intro-grow' && (
        <h1
          key={stageIndex}
          className="font-heading font-bold text-white drop-shadow-lg intro-grow-fade"
          style={{ fontSize: 'min(160px, 90vw)', animationDuration: `${stageDuration}s` }}
        >
          {stage.main}
        </h1>
      )}

      {stage.type === 'typewriter' && (
        <TypewriterTitle stageElapsed={elapsed - stageStart} stageDuration={stageDuration} />
      )}

      {stage.type === 'title' && (
        <div key={stageIndex} className="flex flex-col items-center">
          {stage.top && (
            <p
              className="text-white/85 text-lg md:text-xl tracking-widest mb-3 font-medium opacity-0 animate-fade-up"
              style={{ animationDelay: '0.3s' }}
            >
              {stage.top}
            </p>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white drop-shadow-lg opacity-0 animate-fade-up">
            {stage.main}
          </h1>
        </div>
      )}

      {stage.type === 'grow' && (
        <h1
          key={stageIndex}
          className="font-heading text-[42px] font-bold text-white drop-shadow-lg grow-wide whitespace-nowrap"
        >
          {stage.main}
        </h1>
      )}

      {stage.type === 'list' && (
        <p
          key={stageIndex}
          className="text-white/90 text-sm md:text-base leading-relaxed max-w-[92%] font-medium"
        >
          {scatterChars.map((c, i) => (
            <span
              key={i}
              className={`inline-block ${scatterActive ? 'scatter-out' : 'char-in'}`}
              style={
                scatterActive
                  ? {
                      '--tx': `${c.tx}px`,
                      '--ty': `${c.ty}px`,
                      '--rot': `${c.rot}deg`,
                    }
                  : { animationDelay: `${i * 0.004}s` }
              }
            >
              {c.ch === ' ' ? '\u00A0' : c.ch}
            </span>
          ))}
        </p>
      )}

      {stage.type === 'bounce' && (
        <h1
          key={stageIndex}
          className="font-heading text-5xl md:text-7xl font-bold text-white drop-shadow-lg bounce-in"
        >
          {stage.main}
        </h1>
      )}

      {stage.type === 'glow' && (
        <h1
          key={stageIndex}
          className="font-heading text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
          style={{
            animation:
              'fade-up 0.8s ease-out forwards, glow-pulse 2s ease-in-out 0.8s infinite',
          }}
        >
          {stage.main}
        </h1>
      )}

      {stage.type === 'climax' && (
        <div key={stageIndex} className="flex flex-col items-center">
          <h1
            className="font-heading text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-3 caption-shrink"
            style={{ animationDuration: `${stageDuration}s` }}
          >
            {stage.prev}
          </h1>
          <h1
            className="font-heading text-3xl md:text-4xl font-bold text-white drop-shadow-lg caption-grow"
            style={{ animationDuration: `${stageDuration}s` }}
          >
            {stage.main}
          </h1>
        </div>
      )}
    </div>
  );
}