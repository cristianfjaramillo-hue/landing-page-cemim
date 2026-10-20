'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Headphones, Video, Search, Download, Play, Pause, 
  ExternalLink, FileText, Clock, User, Filter, Sparkles, CheckCircle2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { getStreamableMediaUrl } from '@/lib/mediaUtils';

export default function RepositorySection({ 
  onPlayAudio, 
  currentAudioTrack, 
  onOpenVideo, 
  onOpenBook 
}) {
  const [activeTab, setActiveTab] = useState('libros'); // 'libros' | 'audios' | 'videos'
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Load resources from API
  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/resources?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setResources(json.data);
      }
    } catch (e) {
      console.error('Error cargando recursos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  // Filter by tab type (libro, audio, video)
  const currentTabType = activeTab === 'libros' ? 'libro' : activeTab === 'audios' ? 'audio' : 'video';
  const tabResources = resources.filter((r) => r.type === currentTabType);

  // Available categories for current tab
  const categories = ['todos', ...new Set(tabResources.map((r) => r.category).filter(Boolean))];

  // Pagination configuration (strictly 26 items per page)
  const ITEMS_PER_PAGE = 26;
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered by search & category
  const filtered = tabResources.filter((item) => {
    const matchesCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(q) ||
      item.author?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 whenever activeTab, selectedCategory, or searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filtered.length);
  const paginatedItems = filtered.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    const elem = document.getElementById('repositorio');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  return (
    <section id="repositorio" className="py-20 bg-cemim-bg scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cemim-green-light text-cemim-green-dark text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Repositorio Abierto Multimedia
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cemim-dark font-serif tracking-tight">
            Recursos y Formación Misionera
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Explora, lee, escucha y descarga libremente nuestro catálogo de literatura bíblica, cuentos e historias misioneras en audio, y documentales en video desde la Amazonía.
          </p>
        </div>

        {/* 3 Main Interactive Tabs Requested by User */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm w-full max-w-xl">
            
            {/* Tab 1: Libros */}
            <button
              onClick={() => {
                setActiveTab('libros');
                setSelectedCategory('todos');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'libros'
                  ? 'bg-cemim-green text-white shadow-md'
                  : 'text-gray-600 hover:text-cemim-dark hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Biblioteca de Libros</span>
            </button>

            {/* Tab 2: Audioteca */}
            <button
              onClick={() => {
                setActiveTab('audios');
                setSelectedCategory('todos');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'audios'
                  ? 'bg-cemim-green text-white shadow-md'
                  : 'text-gray-600 hover:text-cemim-dark hover:bg-gray-50'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Audioteca</span>
            </button>

            {/* Tab 3: VIDEOS */}
            <button
              onClick={() => {
                setActiveTab('videos');
                setSelectedCategory('todos');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'videos'
                  ? 'bg-cemim-green text-white shadow-md'
                  : 'text-gray-600 hover:text-cemim-dark hover:bg-gray-50'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>VIDEOS</span>
            </button>

          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar en ${activeTab === 'libros' ? 'libros' : activeTab === 'audios' ? 'audios y cuentos' : 'videos'}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-gray-400 uppercase font-semibold flex items-center gap-1 pl-1">
              <Filter className="w-3 h-3" /> Categoría:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-cemim-dark text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cemim-green border-r-transparent align-[-0.125em]"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Cargando recursos multimedia...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 border border-gray-100">
              {activeTab === 'audios' ? (
                <Headphones className="w-7 h-7 text-cemim-green" />
              ) : activeTab === 'videos' ? (
                <Video className="w-7 h-7 text-red-500" />
              ) : (
                <Search className="w-7 h-7 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {searchQuery
                ? 'No se encontraron resultados'
                : activeTab === 'audios'
                ? 'Audioteca en preparación'
                : activeTab === 'videos'
                ? 'Sección de Videos en preparación'
                : 'No se encontraron libros'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {searchQuery
                ? 'Prueba ajustando los términos de búsqueda o cambiando de categoría.'
                : activeTab === 'audios'
                ? 'Aún no se han publicado pistas ni cuentos en audio. Próximamente se integrarán nuevas historias sonoras.'
                : activeTab === 'videos'
                ? 'Aún no se han publicado videos ni documentales. Próximamente se integrarán producciones audiovisuales.'
                : 'Próximamente se integrarán nuevos títulos.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. RENDER LIBROS */}
            {activeTab === 'libros' &&
              paginatedItems.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Cover */}
                  <div 
                    onClick={() => onOpenBook(book)}
                    className="relative aspect-[16/10] bg-gray-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-cemim-dark text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {book.category}
                    </span>
                    {book.pages && (
                      <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                        <FileText className="w-3 h-3 text-cemim-green" />
                        {book.pages} págs
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => onOpenBook(book)}
                        className="font-serif text-xl font-bold text-cemim-dark group-hover:text-cemim-green transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {book.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3 text-cemim-gray" />
                        {book.author}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-5 mt-5 border-t border-gray-100 flex items-center gap-3">
                      <button
                        onClick={() => onOpenBook(book)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cemim-green" />
                        Leer Detalles
                      </button>
                      <a
                        href={book.fileUrl}
                        download={book.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-xs font-bold transition-all shadow-sm"
                        title="Descargar libro en PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}

            {/* 2. RENDER AUDIOTECA */}
            {activeTab === 'audios' &&
              paginatedItems.map((audio) => {
                const isPlaying = currentAudioTrack?.id === audio.id;
                return (
                  <div
                    key={audio.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl group ${
                      isPlaying ? 'border-cemim-green ring-2 ring-cemim-green/20' : 'border-gray-200'
                    }`}
                  >
                    <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                      <img
                        src={audio.coverUrl}
                        alt={audio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      <span className="absolute top-3 left-3 bg-cemim-dark/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {audio.category}
                      </span>

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => onPlayAudio({ ...audio, fileUrl: getStreamableMediaUrl(audio.fileUrl) })}
                        className={`absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                          isPlaying 
                            ? 'bg-cemim-green text-white scale-110 shadow-lg' 
                            : 'bg-white/90 text-cemim-dark hover:bg-cemim-green hover:text-white hover:scale-110 shadow-md'
                        }`}
                        title={isPlaying ? 'Pausar' : 'Reproducir Historia en Audio'}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>

                      {audio.duration && (
                        <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cemim-green" />
                          {audio.duration === '5:00' && audio.title?.toLowerCase().includes('job') ? '1h 13m' : audio.duration}
                        </span>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 
                          onClick={() => onPlayAudio({ ...audio, fileUrl: getStreamableMediaUrl(audio.fileUrl) })}
                          className="font-serif text-xl font-bold text-cemim-dark group-hover:text-cemim-green transition-colors cursor-pointer leading-snug line-clamp-2"
                        >
                          {audio.title}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                          <Headphones className="w-3 h-3 text-cemim-green" />
                          {audio.author}
                        </p>
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                          {audio.description}
                        </p>
                      </div>

                      <div className="pt-5 mt-5 border-t border-gray-100 flex items-center gap-3">
                        <button
                          onClick={() => onPlayAudio({ ...audio, fileUrl: getStreamableMediaUrl(audio.fileUrl) })}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cemim-green/10 hover:bg-cemim-green hover:text-white text-cemim-green-dark text-xs font-bold transition-all"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isPlaying ? 'Escuchando...' : 'Reproducir'}
                        </button>
                        <a
                          href={getStreamableMediaUrl(audio.fileUrl)}
                          download={audio.title}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                          title="Descargar audio MP3"
                        >
                          <Download className="w-3.5 h-3.5" />
                          MP3
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* 3. RENDER VIDEOS */}
            {activeTab === 'videos' &&
              paginatedItems.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => onOpenVideo(video)}
                    className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                  >
                    <img
                      src={video.coverUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                      {video.category || 'VIDEO'}
                    </span>

                    {/* Big Play Icon */}
                    <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-cemim-green text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>

                    {video.duration && (
                      <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cemim-green" />
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onOpenVideo(video)}
                        className="font-serif text-xl font-bold text-cemim-dark group-hover:text-cemim-green transition-colors cursor-pointer leading-snug line-clamp-2"
                      >
                        {video.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                        <Video className="w-3 h-3 text-cemim-green" />
                        {video.author}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-5 mt-5 border-t border-gray-100 flex items-center gap-3">
                      <button
                        onClick={() => onOpenVideo(video)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-xs font-bold transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Ver Video
                      </button>
                      <a
                        href={video.fileUrl}
                        download={video.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                        title="Descargar video"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar
                      </a>
                    </div>
                  </div>
                </div>
              ))}

          </div>
        )}

        {/* Numeración Inferior y Controles de Paginación */}
        {totalPages > 1 && (
          <div className="mt-14 pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            {/* Contador de recursos mostrados */}
            <div className="text-sm text-gray-500 font-medium text-center sm:text-left">
              Página <span className="font-black text-cemim-dark">{currentPage}</span> de <span className="font-black text-cemim-dark">{totalPages}</span>
              <span className="hidden sm:inline text-gray-300 mx-2">|</span>
              <span className="block sm:inline mt-1 sm:mt-0 text-xs sm:text-sm text-gray-600">
                Mostrando <span className="font-bold text-cemim-dark">{startIndex + 1}</span> a{' '}
                <span className="font-bold text-cemim-dark">{endIndex}</span> de{' '}
                <span className="font-bold text-cemim-dark">{filtered.length}</span>{' '}
                {activeTab === 'libros' ? 'libros' : activeTab === 'audios' ? 'audios' : 'videos'}
              </span>
            </div>

            {/* Botones de navegación de página */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* Botón Anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              {/* Botones numerados */}
              {getPageNumbers().map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 text-xs font-bold">
                      •••
                    </span>
                  );
                }
                const isActive = p === currentPage;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-sm ${
                      isActive
                        ? 'bg-cemim-green text-white shadow-cemim-green/30 scale-105 ring-2 ring-cemim-green/20'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              {/* Botón Siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                title="Página siguiente"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
