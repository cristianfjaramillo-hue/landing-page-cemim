'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, BookOpen, Headphones, Video, ShieldCheck, Compass, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-cemim-green text-white shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 z-10" aria-label="CEMIM - Centro de Entrenamiento">
            <div className="h-12 w-12 rounded-xl bg-white border border-white/30 overflow-hidden flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <img 
                src="/logo.jpg" 
                alt="CEMIM Logo" 
                className="h-full w-full object-contain" 
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div 
                className="w-full flex justify-between items-center font-serif text-2xl font-black text-white leading-none select-none"
                aria-hidden="true"
              >
                <span>C</span>
                <span>E</span>
                <span>M</span>
                <span>I</span>
                <span>M</span>
              </div>
              <span className="sr-only">CEMIM</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/90 font-semibold mt-1 whitespace-nowrap">
                Centro de Entrenamiento
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Centrados con la misma separación) */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10 absolute left-1/2 -translate-x-1/2">
            <Link 
              href="/#acerca" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Sobre Mangayacu
            </Link>
            <Link 
              href="/#repositorio" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Recursos</span>
            </Link>
            <Link 
              href="/#contacto" 
              className="text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap"
            >
              Contactos
            </Link>
          </nav>

          {/* Right Section: Admin Link + CTA */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto z-10">
            <Link 
              href="/admin" 
              className={`p-2 rounded-xl transition-colors ${isAdmin ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            
            {/* Botón Superior Derecho: En admin salta a la landing page en 1 solo toque */}
            <Link 
              href={isAdmin ? "/" : "/#repositorio"}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white text-cemim-green shadow-md hover:bg-cemim-green-light hover:text-cemim-green-dark transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              title={isAdmin ? "Saltar a la Landing Page" : "Explorar Repositorio Multimedia"}
            >
              {isAdmin ? (
                <>
                  <ExternalLink className="w-4 h-4 text-cemim-green" />
                  <span>Ir a la Landing Page</span>
                </>
              ) : (
                <span>Explorar Repositorio</span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden z-10">
            <Link 
              href="/admin" 
              className={`p-2 rounded-lg ${isAdmin ? 'text-white bg-white/20' : 'text-white/80 hover:text-white'}`}
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
          <Link
            href="/#acerca"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Sobre Mangayacu
          </Link>
          <Link
            href="/#repositorio"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="/#contacto"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-base font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Contactos
          </Link>
          <div className="pt-2">
            <Link
              href={isAdmin ? "/" : "/#repositorio"}
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-cemim-green font-bold text-center shadow-md hover:bg-cemim-green-light transition-all cursor-pointer"
            >
              {isAdmin ? (
                <>
                  <ExternalLink className="w-4 h-4 text-cemim-green" />
                  <span>Ir a la Landing Page</span>
                </>
              ) : (
                <span>Explorar Repositorio</span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Línea gris inferior de la línea gráfica con haz de luz en loop infinito */}
      <div className="w-full h-[2.5px] bg-[#50555C] relative overflow-hidden" aria-hidden="true">
        <div className="header-light-beam pointer-events-none" />
      </div>
    </header>
  );
}
