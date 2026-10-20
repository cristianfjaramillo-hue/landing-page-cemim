'use client';

import React from 'react';
import { X, Download, Share2, Film } from 'lucide-react';
import { getStreamableMediaUrl, getDriveEmbedUrl } from '@/lib/mediaUtils';

export default function VideoModal({ video, onClose }) {
  if (!video) return null;

  const streamUrl = getStreamableMediaUrl(video.fileUrl);
  const driveEmbed = getDriveEmbedUrl(video.fileUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-cemim-dark rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-cemim-surface">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-cemim-green" />
            <span className="text-xs uppercase font-semibold text-cemim-green tracking-wider">
              {video.category || 'Video CEMIM'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center">
          {driveEmbed ? (
            <iframe
              src={driveEmbed}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              src={streamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
              poster={video.coverUrl}
            >
              Tu navegador no soporta la reproducción de video HTML5.
            </video>
          )}
        </div>

        {/* Details & Actions */}
        <div className="p-6 bg-cemim-surface overflow-y-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-serif">{video.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{video.author} • {video.duration || 'Video'}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={video.fileUrl}
                download={video.title}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-sm font-semibold transition-all shadow-md"
              >
                <Download className="w-4 h-4" />
                Descargar Video
              </a>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-800 pt-3">
            {video.description}
          </p>
        </div>

      </div>
    </div>
  );
}
