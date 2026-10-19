'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, Headphones, Video, ShieldCheck, Compass } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-xl bg-cemim-bg border border-gray-200 overflow-hidden flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src="/logo.jpg" 
                alt="CEMIM Logo" 
                className="h-full w-full object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tight text-cemim-dark leading-none group-hover:text-cemim-green transition-colors">
                CEMIM
              </span>
              <span className="text-[10px] uppercase tracking-wider text-cemim-gray font-semibold mt-1">
                Mangayacu • Misiones
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#acerca" 
              className="text-sm font-medium text-gray-700 hover:text-cemim-green transition-colors"
            >
              Sobre Mangayacu
            </a>
            <a 
              href="#repositorio" 
              className="text-sm font-medium text-gray-700 hover:text-cemim-green flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-4 h-4 text-cemim-green" />
              Recursos
            </a>
            <a 
              href="#entrenamiento" 
              className="text-sm font-medium text-gray-700 hover:text-cemim-green transition-colors"
            >
              Programas
            </a>
            <a 
              href="#contacto" 
              className="text-sm font-medium text-gray-700 hover:text-cemim-green transition-colors"
            >
              Contacto
            </a>
          </nav>

          {/* CTA & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/admin" 
              className="p-2 text-gray-400 hover:text-cemim-green transition-colors"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <a 
              href="#repositorio"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-cemim-green text-white shadow-sm hover:bg-cemim-green-hover transition-all hover:shadow"
            >
              Explorar Repositorio
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link 
              href="/admin" 
              className="p-2 text-gray-500 hover:text-cemim-green"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-cemim-dark hover:bg-gray-100 transition-colors"
              aria-label="Abrir Menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <a
            href="#acerca"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-cemim-green"
          >
            Sobre Mangayacu
          </a>
          <a
            href="#repositorio"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-cemim-green"
          >
            Repositorio Multimedia (Libros, Audios, Videos)
          </a>
          <a
            href="#entrenamiento"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-cemim-green"
          >
            Programas de Formación
          </a>
          <a
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-cemim-green"
          >
            Contacto e Inscripciones
          </a>
          <div className="pt-2">
            <a
              href="#repositorio"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-cemim-green text-white font-semibold text-center"
            >
              Explorar Repositorio
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
