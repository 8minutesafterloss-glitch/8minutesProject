import React, { useState } from 'react';
import WorkHeader from '@/components/work/WorkHeader';
import WorkSegmented from '@/components/work/WorkSegmented';
import PromptForm from '@/components/work/PromptForm';
import EmployerGuideView from '@/components/work/EmployerGuideView';

const MANAGER_TOPICS = [
  'צריכה עוד זמן',
  'עובדת מהבית',
  'בבקשה לא לצלצל',
  'צריכה גמישות',
  'משהו אחר',
];

const HR_TOPICS = ['זכויות תעסוקה', 'חזרה לעבודה', 'הטבות', 'חופשה'];

export default function Work() {
  const [tab, setTab] = useState('manager');

  return (
    <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-3xl mx-auto">
      <WorkHeader />
      <WorkSegmented active={tab} onChange={setTab} />

      {tab === 'manager' && (
        <PromptForm
          topicLabel="מה את רוצה להגיד?"
          topicOptions={MANAGER_TOPICS}
          multiTopic
          buttonText="צרי לי פרומפט"
          contextPrompt="המנהל הישיר בעבודה"
        />
      )}

      {tab === 'hr' && (
        <PromptForm
          topicLabel="נושא"
          topicOptions={HR_TOPICS}
          multiTopic={false}
          buttonText="צרי לי פורמט"
          defaultTone="עדין"
          defaultChannel="ווטסאפ"
          contextPrompt="מחלקת משאבי אנוש"
        />
      )}

      {tab === 'guide' && <EmployerGuideView />}
    </div>
  );
}