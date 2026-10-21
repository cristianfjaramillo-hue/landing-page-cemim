'use client';

import React, { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import RepositorySection from '@/components/RepositorySection';
import ContactSection from '@/components/ContactSection';
import AudioPlayer from '@/components/AudioPlayer';
import VideoModal from '@/components/VideoModal';
import BookModal from '@/components/BookModal';
import { trackMetric } from '@/lib/mediaUtils';

export default function HomePage() {
  const [currentAudioTrack, setCurrentAudioTrack] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);

  // Registrar visita a la Landing Page (una por sesión de usuario)
  useEffect(() => {
    try {
      const hasVisited = sessionStorage.getItem('cemim_visited');
      if (!hasVisited) {
        sessionStorage.setItem('cemim_visited', 'true');
        trackMetric('page_view');
      }
    } catch (e) {
      trackMetric('page_view');
    }
  }, []);

  const handlePlayAudio = (track) => {
    if (currentAudioTrack && currentAudioTrack.id === track.id) {
      // Si ya es la pista activa, alternar entre reproducir y pausar
      setIsAudioPlaying((prev) => !prev);
    } else {
      // Si es una nueva pista, asignarla y reproducir de inmediato
      setCurrentAudioTrack(track);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="relative">
      {/* 1. Hero Section (Banner de Bienvenida) */}
      <Hero />

      {/* 2. Contact & Admissions (Contactos) */}
      <ContactSection />

      {/* 3. Repository Section (Repositorio Multimedia: Libros, Audioteca, VIDEOS) */}
      <RepositorySection
        onPlayAudio={handlePlayAudio}
        currentAudioTrack={currentAudioTrack}
        isAudioPlaying={isAudioPlaying}
        onOpenVideo={(video) => setCurrentVideo(video)}
        onOpenBook={(book) => setCurrentBook(book)}
      />

      {/* 4. About Section (Sobre Mangayacu) */}
      <AboutSection />

      {/* Modals & Media Players */}
      {currentAudioTrack && (
        <AudioPlayer
          track={currentAudioTrack}
          isPlaying={isAudioPlaying}
          onTogglePlay={(playing) => setIsAudioPlaying(playing)}
          onClose={() => {
            setCurrentAudioTrack(null);
            setIsAudioPlaying(false);
          }}
        />
      )}

      {currentVideo && (
        <VideoModal
          video={currentVideo}
          onClose={() => setCurrentVideo(null)}
        />
      )}

      {currentBook && (
        <BookModal
          book={currentBook}
          onClose={() => setCurrentBook(null)}
        />
      )}
    </div>
  );
}
