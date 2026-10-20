'use client';

import React from 'react';
import { Compass, TreePine, Flame, Users, BookCheck, Mountain } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    {
      icon: <Compass className="w-6 h-6 text-cemim-green" />,
      title: "Visión Transcultural",
      desc: "Entrenamos líderes capaces de cruzar barreras idiomáticas, culturales y geográficas para comunicar el Evangelio con pertinencia."
    },
    {
      icon: <TreePine className="w-6 h-6 text-cemim-green" />,
      title: "Inmersión en la Amazonía",
      desc: "Nuestras instalaciones en Mangayacu brindan un entorno vivo de selva tropical, ideal para forjar resiliencia, trabajo de campo y vida en comunidad."
    },
    {
      icon: <BookCheck className="w-6 h-6 text-cemim-green" />,
      title: "Rigor Bíblico y Teológico",
      desc: "Cursos sistemáticos de hermenéutica, homilética, misionología y discipulado fundamentados firmemente en las Escrituras."
    },
    {
      icon: <Users className="w-6 h-6 text-cemim-green" />,
      title: "Campamentos y Retiros",
      desc: "Espacios de renovación espiritual, campamentos juveniles y talleres intensivos para iglesias locales y ministerios de toda la región."
    }
  ];

  return (
    <section id="acerca" className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cemim-green/10 text-cemim-green text-xs font-bold uppercase tracking-wider">
              <Mountain className="w-3.5 h-3.5" />
              Nuestro Lugar de Formación
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cemim-dark font-serif tracking-tight leading-tight">
              ¿Por qué entrenarse en <span className="text-cemim-green">Mangayacu</span>?
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              El <strong>Centro de Entrenamiento Misionero Internacional Mangayacu (CEMIM)</strong> nació con el anhelo de ser un faro de preparación ministerial y transcultural en la región amazónica de Ecuador (Mera / Palora / Pastaza).
            </p>

            <p className="text-base text-gray-600 leading-relaxed">
              Creemos que la formación misionera no solo ocurre en un aula con libros, sino al lado del río, aprendiendo a convivir en comunidad, compartiendo con pueblos indígenas y experimentando la provisión de Dios en cada paso del camino.
            </p>

            <div className="pt-2">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cemim-dark text-white text-sm font-semibold hover:bg-cemim-green transition-colors"
              >
                Contáctanos
              </a>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative group">
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
                alt="Entorno natural Mangayacu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-cemim-green">
                  Amazonía Ecuatoriana
                </span>
                <p className="text-lg font-serif font-bold mt-1">
                  "El campo es el mundo; y la buena semilla son los hijos del reino."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-cemim-bg border border-gray-100 hover:border-cemim-green/30 transition-all hover:shadow-lg space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white text-cemim-green border border-gray-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-cemim-dark">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
