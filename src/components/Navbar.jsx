'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Headphones, Video, ShieldCheck, Compass } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cemim-green text-white shadow-md border-b border-cemim-green-dark/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 z-10">
            <div className="h-12 w-12 rounded-xl bg-white border border-white/30 overflow-hidden flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform">
              <img 
                src="/logo.jpg" 
                alt="CEMIM Logo" 
                className="h-full w-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tight text-white leading-none">
                CEMIM
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/80 font-semibold mt-1">
                Mangayacu • Misiones
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Centrados con la misma separación) */}
          <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            <a 
              href="#acerca" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Sobre Mangayacu
            </a>
            <a 
              href="#repositorio" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Recursos</span>
            </a>
            <a 
              href="#contacto" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Contactos
            </a>
          </nav>

          {/* Right Section: Admin Link + CTA */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto z-10">
            <Link 
              href="/admin" 
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <a 
              href="#repositorio"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold bg-white text-cemim-green shadow-md hover:bg-cemim-green-light hover:text-cemim-green-dark transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Explorar Repositorio
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden z-10">
            <Link 
              href="/admin" 
              className="p-2 text-white/80 hover:text-white"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Abrir Menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-cemim-green border-t border-white/20 px-4 pt-3 pb-6 space-y-2 animate-fadeIn text-white">
          <a
            href="#acerca"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Sobre Mangayacu
          </a>
          <a
            href="#repositorio"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Recursos
          </a>
          <a
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Contactos
          </a>
          <div className="pt-2">
            <a
              href="#repositorio"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-white text-cemim-green font-bold text-center shadow-md hover:bg-cemim-green-light transition-all"
            >
              Explorar Repositorio
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
