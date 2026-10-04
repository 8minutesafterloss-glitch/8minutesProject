import React, { useState } from 'react';

export function Pill({ active, onClick, children, emoji }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all whitespace-nowrap ${
        active
          ? 'bg-[#4B3F72] text-white border-[#4B3F72]'
          : 'bg-[#F4F3F7] text-[#2D2A35] border-transparent hover:bg-[#EAE8F0]'
      }`}
    >
      {emoji && <span>{emoji}</span>}
      <span>{children}</span>
    </button>
  );
}

export function PillGroup({ label, options, value, onChange, multi = false }) {
  const isActive = (opt) => (multi ? (value || []).includes(opt) : value === opt);
  const handleClick = (opt) => {
    if (multi) {
      const current = value || [];
      onChange(current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt]);
    } else {
      onChange(opt);
    }
  };

  return (
    <div className="mb-7">
      <label className="block text-[#2D2A35] font-medium mb-3">{label}</label>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const isObj = typeof opt === 'object';
          const label = isObj ? opt.label : opt;
          const emoji = isObj ? opt.emoji : null;
          return (
            <Pill
              key={label}
              active={isActive(label)}
              onClick={() => handleClick(label)}
              emoji={emoji}
            >
              {label}
            </Pill>
          );
        })}
      </div>
    </div>
  );
}

export function FreeTextArea({ value, onChange }) {
  const [internalText, setInternalText] = useState('');
  const text = value !== undefined ? value : internalText;
  const setText = onChange || setInternalText;
  return (
    <div className="mb-8">
      <label className="block text-[#2D2A35] font-medium mb-3">רוצה להוסיף משהו? (לא חובה)</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="למשל: 'אני צריכה עוד שבוע בבית' או 'אני לא רוצה לדבר על זה'"
        rows={4}
        className="w-full rounded-2xl border border-[#D5D2E0] bg-white px-4 py-3.5 text-sm text-[#2D2A35] placeholder:text-[#A8A4B5] focus:outline-none focus:border-[#4B3F72] focus:ring-2 focus:ring-[#4B3F72]/10 transition-all resize-none"
      />
    </div>
  );
}