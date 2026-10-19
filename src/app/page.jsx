'use client';

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import RepositorySection from '@/components/RepositorySection';
import ContactSection from '@/components/ContactSection';
import AudioPlayer from '@/components/AudioPlayer';
import VideoModal from '@/components/VideoModal';
import BookModal from '@/components/BookModal';

export default function HomePage() {
  const [currentAudioTrack, setCurrentAudioTrack] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);

  const handlePlayAudio = (track) => {
    if (currentAudioTrack && currentAudioTrack.id === track.id) {
      // already active, leave as is or toggle
      return;
    }
    setCurrentAudioTrack(track);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <AboutSection />

      {/* Repository Section (3 Tabs: Libros, Audioteca, VIDEOS) */}
      <RepositorySection
        onPlayAudio={handlePlayAudio}
        currentAudioTrack={currentAudioTrack}
        onOpenVideo={(video) => setCurrentVideo(video)}
        onOpenBook={(book) => setCurrentBook(book)}
      />

      {/* Contact & Admissions */}
      <ContactSection />

      {/* Modals & Media Players */}
      {currentAudioTrack && (
        <AudioPlayer
          track={currentAudioTrack}
          onClose={() => setCurrentAudioTrack(null)}
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
