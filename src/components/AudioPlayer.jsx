'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, X, Headphones, Disc } from 'lucide-react';

export default function AudioPlayer({ track, onClose }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track.fileUrl;
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
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
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
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cemim-dark text-white border-t border-gray-800 shadow-2xl px-4 py-3 sm:px-6 transition-all animate-slideUp">
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
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
            href={track.fileUrl}
            download={track.title}
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
