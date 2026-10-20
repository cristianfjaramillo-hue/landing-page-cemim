'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Phone, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-cemim-dark text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white p-1">
                <img src="/logo.jpg" alt="CEMIM" className="h-full w-full object-contain" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                CEMIM
              </span>
            </div>
            <p className="text-xs uppercase tracking-wider text-cemim-green font-semibold">
              Centro de Entrenamiento Misionero Internacional Mangayacu
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Formando, equipando y enviando obreros y líderes desde la Amazonía ecuatoriana hacia las comunidades transculturales y las naciones.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Repositorio Abierto
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#repositorio" className="hover:text-cemim-green transition-colors">
                  📚 Biblioteca de Libros y Manuales
                </a>
              </li>
              <li>
                <a href="#repositorio" className="hover:text-cemim-green transition-colors">
                  🎧 Audioteca: Cuentos e Historias
                </a>
              </li>
              <li>
                <a href="#repositorio" className="hover:text-cemim-green transition-colors">
                  🎥 VIDEOS y Documentales de Campo
                </a>
              </li>
              <li>
                <a href="#entrenamiento" className="hover:text-cemim-green transition-colors">
                  Campamentos y Cursos Misioneros
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Sede y Ubicación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cemim-green flex-shrink-0 mt-0.5" />
                <span>Sector Mangayacu, Vía Mera - Palora, Pastaza / Morona Santiago, Amazonía - Ecuador</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cemim-green flex-shrink-0" />
                <a href="mailto:cristian.f.jaramillo@gmail.com" className="hover:text-cemim-green transition-colors">
                  cristian.f.jaramillo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cemim-green flex-shrink-0" />
                <span>+593 99 000 0000</span>
              </li>
            </ul>
          </div>

          {/* Administration & Back to Top */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Acceso Administrativo
            </h4>
            <p className="text-xs text-gray-400">
              Panel privado para la carga, actualización y eliminación de libros, audios y videos multimedia.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-cemim-green hover:text-white text-gray-300 text-xs font-semibold transition-all border border-gray-700"
            >
              <ShieldCheck className="w-4 h-4" />
              Ingresar al Panel /admin
            </Link>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                Volver arriba
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CEMIM. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Dedicado a la gloria de Dios y al avance misionero en las naciones.
          </p>
        </div>

      </div>
    </footer>
  );
}
