'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, MapPin, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    interes: 'Entrenamiento Misionero Integral',
    mensaje: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        // Enviar también desde el navegador para entrega directa de FormSubmit evitando bloqueos de servidor
        try {
          fetch('https://formsubmit.co/ajax/cristian.f.jaramillo@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: `Nuevo Registro CEMIM: ${formData.nombre} (${formData.interes})`,
              _replyto: formData.email,
              _template: 'table',
              _captcha: 'false',
              'Nombre Completo': formData.nombre,
              'Correo Electrónico': formData.email,
              'Teléfono / WhatsApp': formData.telefono || 'No provisto',
              'Área de Interés': formData.interes,
              'Mensaje': formData.mensaje || 'Sin mensaje'
            })
          }).catch(() => {});
        } catch (_) {}

        setSubmitted(true);
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          interes: 'Entrenamiento Misionero Integral',
          mensaje: ''
        });
      } else {
        setErrorMsg(data.message || 'Error al enviar la solicitud. Intenta nuevamente.');
      }
    } catch (err) {
      setErrorMsg('Error de red al procesar el envío. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Info Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cemim-green-light text-cemim-green-dark text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Conéctate con Nosotros
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cemim-dark font-serif tracking-tight">
              ¿Listo para dar el paso hacia la <span className="text-cemim-green">misión</span>?
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Ya sea que desees inscribirte en la próxima temporada de formación misionera, coordinar un campamento para tu iglesia, o colaborar con la producción de nuevos libros y cuentos, queremos escucharte.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-cemim-bg border border-gray-100">
                <MapPin className="w-5 h-5 text-cemim-green flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-cemim-dark">Centro de Operaciones Mangayacu</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Sector Mangayacu, Vía Mera - Palora (Pastaza / Morona Santiago), Amazonía ecuatoriana.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-cemim-bg border border-gray-100">
                <Mail className="w-5 h-5 text-cemim-green flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-cemim-dark">Correo Electrónico</h4>
                  <a href="mailto:cristian.f.jaramillo@gmail.com" className="text-xs text-cemim-green hover:underline font-semibold mt-0.5 block">
                    cristian.f.jaramillo@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-cemim-bg border border-gray-100">
                <MessageSquare className="w-5 h-5 text-cemim-green flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-cemim-dark">WhatsApp Directo</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Atención a aspirantes y coordinación pastoral: +593 99 000 0000
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Form Card */}
          <div className="bg-cemim-bg rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cemim-green/20 text-cemim-green flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cemim-dark">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Gracias por tu interés en CEMIM Mangayacu. Nuestro equipo de coordinación se pondrá en contacto contigo a la brevedad.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex px-6 py-2.5 rounded-xl bg-cemim-green text-white text-xs font-bold hover:bg-cemim-green-hover transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-cemim-dark mb-4">
                  Formulario de Contacto e Inscripción
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. David Santillán"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nombre@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      WhatsApp / Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+593 9..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Área de Interés
                  </label>
                  <select
                    value={formData.interes}
                    onChange={(e) => setFormData({ ...formData, interes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  >
                    <option>Entrenamiento Misionero Integral</option>
                    <option>Campamentos y Retiros Juveniles</option>
                    <option>Cursos Cortos de Misiones Transculturales</option>
                    <option>Acceso y Donación de Recursos Multimedia</option>
                    <option>Otro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Mensaje o Consulta
                  </label>
                  <textarea
                    rows="3"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Cuéntanos un poco sobre tu llamado o inquietud..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando Solicitud...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitud</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
