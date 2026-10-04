import React from "react";
import Navbar from "@/components/landing/Navbar";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen bg-soft-lavender">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-28 pb-12 min-h-[calc(100vh-5rem)]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-purple mb-4 shadow-lg shadow-primary/20">
              <Icon className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-primary font-heading">{title}</h1>
            {subtitle && <p className="text-foreground/60 mt-2">{subtitle}</p>}
          </div>
          <div className="bg-white rounded-2xl shadow-xl shadow-primary/5 border border-border/50 p-8">
            {children}
          </div>
          {footer && (
            <p className="text-center text-sm text-foreground/60 mt-6">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}