import React, { useState } from 'react';
import { Sparkles, Loader2, Send, Copy, Check, RefreshCw } from 'lucide-react';
import { PillGroup, FreeTextArea } from '@/components/work/PillGroup';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

const DEFAULT_TONE_OPTIONS = [
  { label: 'רשמי', emoji: '📄' },
  { label: 'מעודד', emoji: '🌱' },
  { label: 'מפורט', emoji: '✏️' },
  { label: 'קצר', emoji: '✨' },
  { label: 'ישר', emoji: '📌' },
  { label: 'עדין', emoji: '🌸' },
];

const DEFAULT_CHANNEL_OPTIONS = [
  { label: 'אימייל', emoji: '✉️' },
  { label: 'ווטסאפ', emoji: '💬' },
  { label: 'SMS', emoji: '📱' },
];

function buildChannelLink(channel, text) {
  const encoded = encodeURIComponent(text);
  switch (channel) {
    case 'וואטסאפ':
      return `https://wa.me/?text=${encoded}`;
    case 'SMS':
      return `sms:?&body=${encoded}`;
    case 'אימייל':
      return `mailto:?subject=${encodeURIComponent('הודעה ממרכז אישי')}&body=${encoded}`;
    default:
      return null;
  }
}

export default function PromptForm({
  topicLabel,
  topicOptions,
  multiTopic,
  buttonText,
  defaultTone,
  defaultChannel,
  toneOptions,
  channelOptions,
  hideTopics,
  contextPrompt,
}) {
  const { toast } = useToast();
  const [topics, setTopics] = useState(multiTopic ? [] : null);
  const [tone, setTone] = useState(defaultTone || 'עדין');
  const [channel, setChannel] = useState(defaultChannel || 'וואטסאפ');
  const [freeText, setFreeText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const tones = toneOptions || DEFAULT_TONE_OPTIONS;
  const channels = channelOptions || DEFAULT_CHANNEL_OPTIONS;

  const handleGenerate = async () => {
    setGenerating(true);
    setResult('');
    try {
      const response = await base44.functions.invoke('generateMessage', {
        topics,
        tone,
        channel,
        freeText,
        contextPrompt,
      });
      setResult(response.data?.text || '');
    } catch (e) {
      console.error(e);
      toast({ title: 'שגיאה ביצירת ההודעה', variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!result) return;
    const link = buildChannelLink(channel, result);
    if (link) {
      window.open(link, '_blank');
    } else {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        toast({ title: 'הטקסט הועתק — הדביקי אותו בערוץ שבחרת' });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast({ title: 'לא הצלחנו להעתיק', variant: 'destructive' });
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-[#D5D2E0]/40">
      {!hideTopics && topicOptions && (
        <PillGroup
          label={topicLabel}
          options={topicOptions}
          value={topics}
          onChange={setTopics}
          multi={multiTopic}
        />
      )}
      <PillGroup label="טון ההודעה" options={tones} value={tone} onChange={setTone} />
      <PillGroup label="ערוץ שליחה" options={channels} value={channel} onChange={setChannel} />
      <FreeTextArea value={freeText} onChange={setFreeText} />

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#4B3F72] text-white font-semibold text-base hover:bg-[#3E3260] transition-colors shadow-md shadow-[#4B3F72]/20 disabled:opacity-60"
      >
        {generating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>יוצר...</span>
          </>
        ) : (
          <>
            <span>{buttonText}</span>
            <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>

      {result && (
        <div className="mt-6 rounded-2xl border border-[#D5D2E0] bg-[#F8F7FB] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#7A7585]">ההודעה שלך</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7A7585] hover:bg-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'הועתק' : 'העתק'}
              </button>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7A7585] hover:bg-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                נסה שוב
              </button>
            </div>
          </div>
          <p className="text-sm text-[#2D2A35] leading-relaxed whitespace-pre-line mb-4">{result}</p>
          <button
            onClick={handleSend}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>שלחי ב{channel}</span>
          </button>
        </div>
      )}
    </div>
  );
}