'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, X, Headphones, Disc, AlertCircle } from 'lucide-react';
import { getStreamableMediaUrl } from '@/lib/mediaUtils';

export default function AudioPlayer({ track, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (track && audioRef.current) {
      setHasError(false);
      const streamUrl = getStreamableMediaUrl(track.fileUrl);
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Autoplay prevent default, click play to listen:', e);
        setIsPlaying(false);
      });
    }
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setHasError(false);
      }).catch((e) => {
        console.error('Error al reproducir audio:', e);
        setIsPlaying(false);
      });
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const onError = () => {
    console.error('Error al cargar stream de audio.');
    setHasError(true);
    setIsPlaying(false);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || !isFinite(secs) || secs < 0) return '0:00';
    const totalSecs = Math.floor(secs);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const rem = totalSecs % 60;
    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
    }
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!track) return null;

  const downloadUrl = getStreamableMediaUrl(track.fileUrl);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cemim-dark text-white border-t border-gray-800 shadow-2xl px-4 py-3 sm:px-6 transition-all animate-slideUp">
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onError={onError}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        
        {/* Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-1/4 min-w-0">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
            {track.coverUrl ? (
              <img src={track.coverUrl} alt={track.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-cemim-green/20">
                <Disc className="w-6 h-6 text-cemim-green animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-white truncate">{track.title}</h4>
            <p className="text-xs text-gray-400 truncate">{track.author || 'CEMIM Mangayacu'}</p>
          </div>
        </div>

        {/* Center Controls & Seek Bar */}
        <div className="flex flex-col items-center w-full sm:w-2/4">
          <div className="flex items-center gap-4 mb-1">
            <button
              onClick={togglePlay}
              className="h-10 w-10 rounded-full bg-cemim-green text-white flex items-center justify-center hover:bg-cemim-green-hover transition-transform hover:scale-105 shadow-md"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            {hasError && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Reintentando conexión...
              </span>
            )}
          </div>

          <div className="w-full flex items-center gap-3 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cemim-green"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Tools: Volume, Download, Close */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-1/4">
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cemim-green"
            />
          </div>

          {/* Download Button */}
          <a
            href={downloadUrl}
            download={`${track.title}.mp3`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-cemim-green hover:text-white text-gray-200 text-xs font-medium transition-all"
            title="Descargar audio MP3"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar MP3</span>
          </a>

          {/* Close Player */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
