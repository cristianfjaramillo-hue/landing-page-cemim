'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, Upload, Trash2, Plus, LogOut, 
  BookOpen, Headphones, Video, CheckCircle2, AlertCircle, Eye, RefreshCw, FileText, Clock
} from 'lucide-react';
import { getStreamableMediaUrl } from '@/lib/mediaUtils';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Resources State
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [filterType, setFilterType] = useState('todos');

  // New Resource Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingResource, setSavingResource] = useState(false);
  const [notification, setNotification] = useState(null);
  const [fileSourceMode, setFileSourceMode] = useState('upload'); // 'upload' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    type: 'libro', // 'libro' | 'audio' | 'video'
    author: '',
    category: 'Misiones',
    description: '',
    fileUrl: '',
    coverUrl: '',
    pages: '',
    duration: '',
    fileSize: ''
  });

  // Check login on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('cemim_admin_logged');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchResources();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('cemim_admin_logged', 'true');
        fetchResources();
      } else {
        setAuthError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setAuthError('Error de red al intentar iniciar sesión');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cemim_admin_logged');
  };

  const fetchResources = async () => {
    setLoadingResources(true);
    try {
      const res = await fetch(`/api/admin/resources?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setResources(json.data);
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoadingResources(false);
    }
  };

  // Open clean modal
  const openNewResourceModal = () => {
    setUploadedFileName('');
    setFileSourceMode('upload');
    setFormData({
      title: '',
      type: 'libro',
      author: 'CEMIM Mangayacu',
      category: 'Misiones',
      description: '',
      fileUrl: '',
      coverUrl: '',
      pages: '',
      duration: '',
      fileSize: ''
    });
    setIsModalOpen(true);
  };

  // Upload file helper
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        if (fieldName === 'fileUrl') {
          setUploadedFileName(file.name);
          const cleanTitle = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/^[0-9]+[\._\s-]*/, "")
            .replace(/[_-]+/g, " ")
            .trim();

          setFormData((prev) => ({
            ...prev,
            fileUrl: json.url,
            fileSize: json.fileSize,
            title: prev.title.trim() ? prev.title : (cleanTitle || file.name)
          }));
        } else if (fieldName === 'coverUrl') {
          setFormData((prev) => ({
            ...prev,
            coverUrl: json.url
          }));
        }
        showNotification('✓ Archivo cargado exitosamente en la nube', 'success');
      } else {
        showNotification('❌ Error al subir: ' + json.message, 'error');
      }
    } catch (err) {
      showNotification('❌ Error de red al contactar el servidor de carga', 'error');
    } finally {
      setUploadingFile(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();

    if (uploadingFile) {
      showNotification('El archivo todavía se está subiendo a la nube, por favor espera un momento...', 'error');
      return;
    }

    if (!formData.fileUrl) {
      showNotification('Por favor selecciona un archivo desde tu computadora o ingresa un enlace antes de publicar.', 'error');
      return;
    }

    setSavingResource(true);

    try {
      const normalizedUrl = getStreamableMediaUrl(formData.fileUrl);
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fileUrl: normalizedUrl })
      });
      const json = await res.json();

      if (json.success) {
        showNotification('¡Recurso publicado exitosamente en el repositorio!', 'success');
        setIsModalOpen(false);
        setUploadedFileName('');
        
        // Optimistic update
        if (json.data) {
          setResources((prev) => [json.data, ...prev.filter(r => r.id !== json.data.id)]);
        }
        fetchResources();
      } else {
        showNotification(json.message || 'Error al guardar el recurso', 'error');
      }
    } catch (err) {
      showNotification('Error de conexión con el servidor', 'error');
    } finally {
      setSavingResource(false);
    }
  };

  const handleDeleteResource = async (id, title) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el recurso "${title}"?`);
    if (!confirmDelete) return;

    // Optimistically remove from list immediately
    setResources((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();

      if (json.success) {
        showNotification('Recurso eliminado correctamente', 'success');
        if (Array.isArray(json.data)) {
          setResources(json.data);
        } else {
          fetchResources();
        }
      } else {
        showNotification('Error al eliminar: ' + json.message, 'error');
        fetchResources();
      }
    } catch (err) {
      showNotification('Error de conexión al eliminar recurso', 'error');
      fetchResources();
    }
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Metrics
  const totalLibros = resources.filter((r) => r.type === 'libro').length;
  const totalAudios = resources.filter((r) => r.type === 'audio').length;
  const totalVideos = resources.filter((r) => r.type === 'video').length;

  // Filtered List
  const filteredList = resources.filter(
    (r) => filterType === 'todos' || r.type === filterType
  );

  // ==================== VISTA LOGIN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-cemim-bg">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-cemim-green/10 text-cemim-green flex items-center justify-center mx-auto mb-3 border border-cemim-green/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-cemim-dark">
              Panel Administrativo
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              CEMIM Mangayacu
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Correo Electrónico de Administrador
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="cristian.f.jaramillo@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                Contraseña Secreta
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {authLoading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-gray-500 hover:text-cemim-green">
              ← Volver a la Landing Page
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ==================== VISTA DASHBOARD AUTENTICADO ====================
  return (
    <div className="min-h-screen bg-cemim-bg py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {notification && (
          <div className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-sm animate-fadeIn ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Dashboard Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cemim-green uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Sesión de Administrador Activa
            </div>
            <h1 className="font-serif text-3xl font-black text-cemim-dark mt-1">
              Gestión del Repositorio CEMIM
            </h1>
            <p className="text-sm text-gray-500">
              Sube nuevos libros, historias en audio y videos, o administra y elimina los existentes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openNewResourceModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Subir Nuevo Recurso
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cemim-green/10 text-cemim-green flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Total Libros (PDF)</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalLibros}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Total Cuentos en Audio</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalAudios}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Total VIDEOS</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalVideos}</h3>
            </div>
          </div>
        </div>

        {/* Resources Table Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-gray-400">Filtrar por:</span>
              {['todos', 'libro', 'audio', 'video'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    filterType === type 
                      ? 'bg-cemim-dark text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'todos' ? 'Todos' : type === 'libro' ? 'Libros' : type === 'audio' ? 'Audios' : 'Videos'}
                </button>
              ))}
            </div>

            <button
              onClick={fetchResources}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-cemim-green"
              title="Refrescar lista"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar lista
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Recurso</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Autor / Dpto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingResources ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">
                      Cargando recursos...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">
                      No hay recursos en esta categoría.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            {item.coverUrl ? (
                              <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                <FileText className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-cemim-dark line-clamp-1">{item.title}</p>
                            <span className="text-xs text-gray-400">{item.fileSize || 'Archivo'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.type === 'libro'
                            ? 'bg-amber-100 text-amber-800'
                            : item.type === 'audio'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-700">
                        {item.author}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {item.createdAt || '2026'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-gray-500 hover:text-cemim-green hover:bg-gray-100 transition-colors"
                            title="Ver / Descargar archivo"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteResource(item.id, item.title)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal: Subir Nuevo Recurso */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
              
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-cemim-bg">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-cemim-dark">
                    Subir Nuevo Recurso al Repositorio
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Se publicará inmediatamente en la landing page y se almacenará en Supabase.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveResource} className="p-8 overflow-y-auto space-y-5">
                
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    Tipo de Recurso *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'libro', label: 'Libro (PDF)', icon: <BookOpen className="w-4 h-4" /> },
                      { type: 'audio', label: 'Audioteca (MP3)', icon: <Headphones className="w-4 h-4" /> },
                      { type: 'video', label: 'VIDEO', icon: <Video className="w-4 h-4" /> }
                    ].map((item) => (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: item.type })}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.type === item.type
                            ? 'border-cemim-green bg-cemim-green-light text-cemim-green-dark shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Título del Recurso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej. Cuento: El Viento sobre Mangayacu"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  />
                </div>

                {/* Author & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Autor o Departamento
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Ej. Equipo Misionero CEMIM"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ej. Cuentos Infantiles, Misiones, Teología"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                    />
                  </div>
                </div>

                {/* Specific Fields depending on Type (Duration for Audio/Video, Pages for Book) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(formData.type === 'audio' || formData.type === 'video') && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Duración del {formData.type === 'audio' ? 'Audio' : 'Video'} (opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="Ej. 1h 13m o 35:20"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                      />
                    </div>
                  )}

                  {formData.type === 'libro' && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                        Número de Páginas (opcional)
                      </label>
                      <input
                        type="number"
                        value={formData.pages}
                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                        placeholder="Ej. 120"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                      Tamaño aproximado (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.fileSize}
                      onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                      placeholder="Ej. 65 MB o 134 MB"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Descripción / Sinopsis
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Escribe una breve reseña de este recurso..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  />
                </div>

                {/* File Upload to Supabase */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase text-gray-700">
                      Archivo Multimedia *
                    </label>
                    <div className="inline-flex rounded-lg bg-gray-200 p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setFileSourceMode('upload')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          fileSourceMode === 'upload' ? 'bg-white text-cemim-dark shadow-sm' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Subir desde mi PC
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileSourceMode('url')}
                        className={`px-3 py-1 rounded-md transition-all ${
                          fileSourceMode === 'url' ? 'bg-white text-cemim-dark shadow-sm' : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        Pegar enlace / URL
                      </button>
                    </div>
                  </div>

                  {fileSourceMode === 'upload' ? (
                    <div>
                      {formData.fileUrl ? (
                        <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200 text-green-900">
                          <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold truncate">
                                {uploadedFileName || 'Archivo cargado en la nube'}
                              </p>
                              <p className="text-xs text-green-700">
                                {formData.fileSize ? `Tamaño: ${formData.fileSize}` : 'Listo para publicar'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                            <label className="cursor-pointer text-xs font-bold text-cemim-green hover:underline">
                              Cambiar archivo
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'fileUrl')}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedFileName('');
                                setFormData((prev) => ({ ...prev, fileUrl: '', fileSize: '' }));
                              }}
                              className="text-xs font-bold text-red-500 hover:underline"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${
                          uploadingFile 
                            ? 'border-cemim-green bg-cemim-green/5' 
                            : 'border-gray-300 hover:border-cemim-green bg-white hover:bg-gray-50'
                        }`}>
                          {uploadingFile ? (
                            <div className="flex flex-col items-center gap-2 text-cemim-green py-2">
                              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cemim-green border-r-transparent"></div>
                              <p className="text-xs font-bold mt-2">Subiendo archivo a la nube... por favor espera</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-center py-2">
                              <div className="w-12 h-12 rounded-xl bg-cemim-green/10 text-cemim-green flex items-center justify-center">
                                <Upload className="w-6 h-6" />
                              </div>
                              <p className="text-sm font-bold text-gray-800">
                                Haz clic aquí para seleccionar el archivo desde tu equipo
                              </p>
                              <p className="text-xs text-gray-400">
                                {formData.type === 'libro' ? 'Documentos PDF, EPUB' : formData.type === 'audio' ? 'Archivos MP3, WAV' : 'Archivos de video MP4'}
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            disabled={uploadingFile}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'fileUrl')}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={formData.fileUrl}
                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                        onBlur={(e) => {
                          const normalized = getStreamableMediaUrl(e.target.value);
                          if (normalized && normalized !== e.target.value) {
                            setFormData((prev) => ({ ...prev, fileUrl: normalized }));
                            showNotification('✓ Enlace de Google Drive optimizado para reproducción directa', 'success');
                          }
                        }}
                        placeholder="https://... Enlace directo o enlace de Google Drive"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-cemim-green/30"
                      />
                    </div>
                  )}
                </div>

                {/* Cover Image Upload / URL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                    Imagen de Portada / Miniatura (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... (opcional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-cemim-green/30 focus:border-cemim-green"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingResource}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cemim-green hover:bg-cemim-green-hover text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {savingResource ? 'Guardando...' : 'Publicar en Repositorio'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
