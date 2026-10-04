import React from 'react';
import GuestbookForm from './GuestbookForm';
import GuestbookList from './GuestbookList';

export default function GuestbookSection({ exhibitionItems = [] }) {
  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-primary mb-3 text-center">ספר אורחים</h2>
        <p className="text-foreground/55 text-center mb-10">
          שתפו את הרשמים שלכם מהתערוכה. הרשומות יופיעו לאחר אישור מנהל.
        </p>
        <div className="rounded-3xl bg-soft-lavender border border-border/40 p-6 sm:p-8 mb-10">
          <GuestbookForm exhibitionItems={exhibitionItems} />
        </div>
        <GuestbookList exhibitionItems={exhibitionItems} />
      </div>
    </section>
  );
}