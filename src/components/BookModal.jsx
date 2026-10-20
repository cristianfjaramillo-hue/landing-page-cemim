'use client';

import React from 'react';
import { X, Download, BookOpen, FileText, CheckCircle2 } from 'lucide-react';
import { getDownloadUrl } from '@/lib/mediaUtils';

export default function BookModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cemim-green" />
            <span className="text-xs uppercase font-semibold text-cemim-green tracking-wider">
              {book.category || 'Literatura CEMIM'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            
            {/* Book Cover */}
            <div className="w-full sm:w-1/3 flex-shrink-0">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 relative group">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Book Metadata */}
            <div className="w-full sm:w-2/3 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-cemim-dark font-serif leading-snug">
                  {book.title}
                </h3>
                <p className="text-sm font-medium text-cemim-gray mt-1">
                  Por {book.author || 'Equipo CEMIM'}
                </p>

                <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
                  {book.pages && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md">
                      <FileText className="w-3.5 h-3.5 text-cemim-green" />
                      {book.pages} páginas
                    </span>
                  )}
                  {book.fileSize && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md">
                      {book.fileSize}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 bg-cemim-green-light text-cemim-green-dark px-2.5 py-1 rounded-md font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acceso Libre
                  </span>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Sinopsis
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={getDownloadUrl(book.fileUrl, book.title, 'pdf')}
                  download={`${book.title}.pdf`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar Libro (PDF)
                </a>
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
                >
                  Ver en Navegador
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
