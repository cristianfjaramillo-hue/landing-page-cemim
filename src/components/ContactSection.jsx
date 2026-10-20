'use client';

import React, { useState, useRef } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, MapPin, Sparkles, Paperclip, X, FileText, Upload, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attachment, setAttachment] = useState(null); // { url, name, size }
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    interes: 'Entrenamiento Misionero Integral',
    mensaje: ''
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentError('');

    // Validar extensión
    const allowedExts = ['.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png', '.mp3', '.mp4'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      setAttachmentError('Formato no permitido. Solo se aceptan: .doc, .pdf, .jpg, .png, .mp3, .mp4');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validar tamaño máximo: 50 MB
    const MAX_SIZE_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setAttachmentError('El archivo excede el tamaño máximo permitido de 50 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const formatFileSize = (bytes) => {
      if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
      }
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    setUploadingAttachment(true);

    try {
      // 1. Solicitar URL firmada para subida directa a Supabase Storage (soporta hasta 50 MB directo al storage)
      const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, folder: 'attachments' })
      });
      const signJson = await signRes.json();

      if (signJson.success && supabase) {
        // Subida directa desde el navegador a Supabase Storage sin límite de Vercel
        const { error: uploadError } = await supabase.storage
          .from(signJson.bucketName || 'cemim-multimedia')
          .uploadToSignedUrl(signJson.path, signJson.token, file, {
            contentType: file.type || 'application/octet-stream'
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        setAttachment({
          url: signJson.publicUrl,
          name: file.name,
          size: formatFileSize(file.size)
        });
        setAttachmentError('');
      } else {
        // Fallback por API de servidor para archivos pequeños
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('folder', 'attachments');

        const fallbackRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const fallbackJson = await fallbackRes.json();

        if (fallbackJson.success) {
          setAttachment({
            url: fallbackJson.url,
            name: file.name,
            size: fallbackJson.fileSize || formatFileSize(file.size)
          });
          setAttachmentError('');
        } else {
          setAttachmentError(fallbackJson.message || 'No se pudo subir el archivo adjunto.');
        }
      }
    } catch (err) {
      console.error('Error al subir adjunto:', err);
      setAttachmentError('Error al subir el archivo: ' + (err.message || 'Verifica tu conexión.'));
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadingAttachment) {
      setErrorMsg('Por favor espera a que termine de cargarse el archivo adjunto.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = {
      ...formData,
      attachmentUrl: attachment?.url || null,
      attachmentName: attachment?.name || null,
      attachmentSize: attachment?.size || null
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
              'Mensaje': formData.mensaje || 'Sin mensaje',
              'Archivo Adjunto': attachment?.url ? `${attachment.name} (${attachment.url})` : 'Ninguno'
            })
          }).catch(() => {});
        } catch (_) {}

        setSubmitted(true);
        setAttachment(null);
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

                {/* File Attachment Field (Optional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-gray-600 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-cemim-green" />
                      Adjuntar Archivo
                    </label>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      Opcional
                    </span>
                  </div>

                  {attachment ? (
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-900 animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-green-900">
                            {attachment.name}
                          </p>
                          <p className="text-[11px] text-green-700">
                            {attachment.size} • Adjuntado correctamente
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-2 flex-shrink-0"
                        title="Quitar archivo adjunto"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : uploadingAttachment ? (
                    <div className="flex items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-cemim-green bg-cemim-green/5 text-cemim-green text-xs font-semibold animate-pulse">
                      <div className="w-4 h-4 border-2 border-cemim-green border-t-transparent rounded-full animate-spin" />
                      <span>Cargando archivo en la nube... por favor espera</span>
                    </div>
                  ) : (
                    <label className="group cursor-pointer flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 hover:border-cemim-green rounded-xl bg-white hover:bg-gray-50/80 transition-all text-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 group-hover:text-cemim-green">
                        <Upload className="w-4 h-4 text-gray-400 group-hover:text-cemim-green" />
                        <span>Haz clic para seleccionar un archivo</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Formatos: .doc, .pdf, .jpg, .png, .mp3, .mp4 (hasta 50 MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".doc,.docx,.pdf,.jpg,.jpeg,.png,.mp3,.mp4,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png,audio/mpeg,video/mp4"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  {attachmentError && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{attachmentError}</span>
                    </div>
                  )}
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
