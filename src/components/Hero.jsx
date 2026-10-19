'use client';

import React from 'react';
import { ArrowRight, BookOpen, Headphones, Video, Shield, Award, Compass, Play } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-cemim-bg to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Decorative Rings/Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-cemim-green-light/40 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text / Messaging */}
          <div className="w-full lg:w-3/5 text-center lg:text-left space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cemim-green-light text-cemim-green-dark border border-cemim-green/20 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Compass className="w-4 h-4 text-cemim-green" />
              Centro de Entrenamiento Misionero Internacional Mangayacu
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-cemim-dark tracking-tight leading-[1.12]">
              Capacitando y enviando obreros a las <span className="text-cemim-green underline decoration-cemim-green/30 decoration-wavy">naciones</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
              Desde la Amazonía ecuatoriana hacia el mundo. Un espacio integral de formación bíblica, práctica de campo y un <strong>repositorio multimedia abierto</strong> de libros, cuentos en audio y videos documentales.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#repositorio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-cemim-green hover:bg-cemim-green-hover text-white text-base font-bold shadow-lg shadow-cemim-green/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <span>Explorar Recursos Abiertos</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#acerca"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-cemim-dark text-base font-semibold border border-gray-200 shadow-sm transition-all"
              >
                Conocer Mangayacu
              </a>
            </div>

            {/* Fast Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cemim-dark font-serif">+15</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Años de Misión</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cemim-green font-serif">+40</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Comunidades</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-cemim-dark font-serif">100%</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Acceso Libre</p>
              </div>
            </div>

          </div>

          {/* Right Visual Card with Logo & Multimedia Highlights */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Background Glow Card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cemim-green to-cemim-gray rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
                
                {/* Logo Banner */}
                <div className="flex items-center justify-center p-4 bg-cemim-bg rounded-2xl border border-gray-100">
                  <img
                    src="/logo.jpg"
                    alt="Logo CEMIM"
                    className="max-h-40 w-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cemim-green">
                    Tres Formas de Acceder al Contenido
                  </span>
                  
                  {/* Item 1 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-cemim-green/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-cemim-green/10 text-cemim-green flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-cemim-dark">Biblioteca de Libros (PDF)</h4>
                      <p className="text-xs text-gray-500">Manuales misioneros y teología práctica</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-cemim-green/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-cemim-green/10 text-cemim-green flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-cemim-dark">Audioteca de Cuentos (MP3)</h4>
                      <p className="text-xs text-gray-500">Historias misioneras y relatos formativos</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-cemim-green/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-cemim-green/10 text-cemim-green flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-cemim-dark">VIDEOS y Documentales</h4>
                      <p className="text-xs text-gray-500">Expediciones y vivencias en Mangayacu</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
