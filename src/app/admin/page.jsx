'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, Upload, Trash2, Plus, LogOut, 
  BookOpen, Headphones, Video, CheckCircle2, AlertCircle, Eye, RefreshCw, FileText, Clock,
  MessageSquare, Phone, ExternalLink, Inbox, Users, Download, Paperclip,
  BarChart3, Activity, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import { getStreamableMediaUrl } from '@/lib/mediaUtils';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('recursos'); // 'recursos' | 'contactos'

  // Resources State
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [filterType, setFilterType] = useState('todos');

  // Registrations / Inquiries State
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Analytics & Metrics State (Visitas y Descargas por Formato)
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    downloads: { libros: 0, audios: 0, videos: 0, total: 0 }
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [isCornerWidgetOpen, setIsCornerWidgetOpen] = useState(true);

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
      fetchRegistrations();
      fetchAnalytics();
    }
  }, []);

  const fetchAnalytics = async (fresh = false) => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`/api/analytics?fresh=${fresh ? 'true' : 'false'}&t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalytics(json.data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

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
        fetchRegistrations();
        fetchAnalytics();
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

  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const res = await fetch(`/api/contact?t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRegistrations(json.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleDeleteRegistration = async (id, nombre) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el registro de "${nombre}"?`);
    if (!confirmDelete) return;

    // Optimistic removal
    setRegistrations((prev) => prev.filter((r) => r.id !== id));

    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();

      if (json.success) {
        showNotification('Registro eliminado de la bandeja', 'success');
      } else {
        showNotification('Error al eliminar: ' + json.message, 'error');
        fetchRegistrations();
      }
    } catch (err) {
      showNotification('Error de conexión al eliminar registro', 'error');
      fetchRegistrations();
    }
  };

  const formatWhatsAppUrl = (phone, name) => {
    if (!phone) return null;
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('09') && cleaned.length === 10) {
      cleaned = '593' + cleaned.substring(1);
    }
    const text = encodeURIComponent(`¡Hola ${name || ''}! Te saludamos desde CEMIM Mangayacu con respecto a tu solicitud de información.`);
    return `https://wa.me/${cleaned}?text=${text}`;
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

  // Upload file helper (soporta hasta 50 MB mediante subida directa firmada a Supabase)
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      let finalUrl = '';
      let finalSize = file.size < 1024 * 1024 
        ? `${Math.round(file.size / 1024)} KB` 
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      // 1. Intentar subida directa firmada a Supabase Storage (permite hasta 100 MB)
      try {
        const signRes = await fetch('/api/upload/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, folder: 'uploads' })
        });
        const signData = await signRes.json();

        if (signData.success && supabase) {
          const { error: uploadError } = await supabase.storage
            .from(signData.bucketName || 'cemim-multimedia')
            .uploadToSignedUrl(signData.path, signData.token, file, {
              contentType: file.type || 'application/octet-stream'
            });

          if (!uploadError) {
            finalUrl = signData.publicUrl;
          }
        }
      } catch (signErr) {
        console.warn('Subida firmada no completada, intentando fallback tradicional:', signErr);
      }

      // 2. Fallback por si la subida firmada no se completó
      if (!finalUrl) {
        const data = new FormData();
        data.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        });
        const json = await res.json();
        if (json.success) {
          finalUrl = json.url;
          finalSize = json.fileSize || finalSize;
        } else {
          showNotification('❌ Error al subir: ' + json.message, 'error');
          return;
        }
      }

      if (fieldName === 'fileUrl') {
        setUploadedFileName(file.name);
        const cleanTitle = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/^[0-9]+[\._\s-]*/, "")
          .replace(/[_-]+/g, " ")
          .trim();

        setFormData((prev) => ({
          ...prev,
          fileUrl: finalUrl,
          fileSize: finalSize,
          title: prev.title.trim() ? prev.title : (cleanTitle || file.name)
        }));
      } else if (fieldName === 'coverUrl') {
        setFormData((prev) => ({
          ...prev,
          coverUrl: finalUrl
        }));
      }
      showNotification('✓ Archivo cargado exitosamente en la nube', 'success');
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-cemim-green text-gray-700 hover:text-cemim-green text-sm font-semibold transition-all shadow-sm"
                title="Saltar a la Landing Page Principal"
              >
                <ExternalLink className="w-4 h-4 text-cemim-green" />
                <span className="hidden sm:inline">Ver Landing Page</span>
              </Link>
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

          {/* Resumen Superior de Tráfico y Descargas */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shadow-sm">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>{analytics.pageViews.toLocaleString()}</span>
                <span className="text-[11px] font-normal text-emerald-700">Visitas Landing</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-sm">
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>{analytics.downloads.total.toLocaleString()}</span>
                <span className="text-[11px] font-normal text-blue-700">Descargas Totales</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-gray-600 text-xs">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-cemim-green" />
                Libros: <strong className="text-cemim-dark">{analytics.downloads.libros.toLocaleString()}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-blue-600" />
                Audios: <strong className="text-cemim-dark">{analytics.downloads.audios.toLocaleString()}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-red-600" />
                Videos: <strong className="text-cemim-dark">{analytics.downloads.videos.toLocaleString()}</strong>
              </span>
              <button
                onClick={() => fetchAnalytics(true)}
                disabled={loadingAnalytics}
                className="p-1 rounded-lg text-gray-400 hover:text-cemim-green hover:bg-gray-100 transition-colors ml-1"
                title="Actualizar métricas de visitas y descargas"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin text-cemim-green' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            onClick={() => { setActiveTab('recursos'); setFilterType('libro'); }}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-cemim-green transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cemim-green/10 text-cemim-green flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Libros (PDF)</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalLibros}</h3>
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('recursos'); setFilterType('audio'); }}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-500 transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Cuentos en Audio</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalAudios}</h3>
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('recursos'); setFilterType('video'); }}
            className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-red-500 transition-all"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Videos</p>
              <h3 className="text-2xl font-black text-cemim-dark">{totalVideos}</h3>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('contactos')}
            className={`p-5 sm:p-6 rounded-2xl border shadow-sm flex items-center gap-4 cursor-pointer transition-all ${
              activeTab === 'contactos' 
                ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20' 
                : 'bg-white border-gray-200 hover:border-amber-400'
            }`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Inbox className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400">Inscripciones Recibidas</p>
              <h3 className="text-2xl font-black text-cemim-dark flex items-center gap-2">
                {registrations.length}
                {registrations.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
                    Nuevos
                  </span>
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 gap-3 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('recursos')}
            className={`pb-3.5 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'recursos'
                ? 'border-cemim-green text-cemim-green'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca Multimedia ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contactos')}
            className={`pb-3.5 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'contactos'
                ? 'border-cemim-green text-cemim-green'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Bandeja de Contactos e Inscripciones</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              registrations.length > 0 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {registrations.length}
            </span>
          </button>
        </div>

        {/* ================= TAB 1: RECURSOS MULTIMEDIA ================= */}
        {activeTab === 'recursos' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Controls Bar */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
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

            {/* Resources Table */}
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
        )}

        {/* ================= TAB 2: BANDEJA DE CONTACTOS / INSCRIPCIONES ================= */}
        {activeTab === 'contactos' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Inquiries */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-cemim-dark flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-cemim-green" />
                  Bandeja de Contactos y Formularios Recibidos
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Todos los registros se almacenan inmediatamente en la nube de Supabase. Puedes contactar a cada persona por WhatsApp o Correo con un clic.
                </p>
              </div>

              <button
                onClick={fetchRegistrations}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 font-semibold transition-colors"
                title="Refrescar lista de registros"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualizar bandeja
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Aspirante / Nombre</th>
                    <th className="px-6 py-4">Correo Electrónico</th>
                    <th className="px-6 py-4">WhatsApp / Teléfono</th>
                    <th className="px-6 py-4">Programa de Interés</th>
                    <th className="px-6 py-4">Mensaje</th>
                    <th className="px-6 py-4">Archivo Adjunto</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loadingRegistrations ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-gray-400 font-medium">
                        Cargando solicitudes...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-16 text-gray-400">
                        <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="font-bold text-gray-600">No hay solicitudes registradas todavía.</p>
                        <p className="text-xs text-gray-400 mt-1">Cuando una persona complete el formulario en la web, aparecerá aquí al instante.</p>
                      </td>
                    </tr>
                  ) : (
                    registrations.map((item) => {
                      const waUrl = formatWhatsAppUrl(item.telefono, item.nombre);
                      const formattedDate = item.createdAt 
                        ? new Date(item.createdAt).toLocaleDateString('es-EC', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Reciente';

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Fecha */}
                          <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-300" />
                              <span>{formattedDate}</span>
                            </div>
                          </td>

                          {/* Nombre */}
                          <td className="px-6 py-4 font-bold text-cemim-dark">
                            {item.nombre}
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-xs">
                            <a
                              href={`mailto:${item.email}?subject=Contacto%20CEMIM%20Mangayacu`}
                              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{item.email}</span>
                            </a>
                          </td>

                          {/* WhatsApp / Teléfono */}
                          <td className="px-6 py-4 text-xs whitespace-nowrap">
                            {item.telefono ? (
                              waUrl ? (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-bold transition-colors"
                                  title="Abrir chat en WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                                  <span>{item.telefono}</span>
                                  <ExternalLink className="w-3 h-3 text-green-500" />
                                </a>
                              ) : (
                                <span className="text-gray-700">{item.telefono}</span>
                              )
                            ) : (
                              <span className="text-gray-300 italic">No indicado</span>
                            )}
                          </td>

                          {/* Interés */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cemim-green-light text-cemim-green-dark">
                              {item.interes || 'General'}
                            </span>
                          </td>

                          {/* Mensaje */}
                          <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                            <p className="line-clamp-3" title={item.mensaje}>
                              {item.mensaje || <span className="italic text-gray-300">Sin mensaje</span>}
                            </p>
                          </td>

                          {/* Archivo Adjunto */}
                          <td className="px-6 py-4 text-xs whitespace-nowrap">
                            {item.attachmentUrl ? (
                              <a
                                href={item.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition-all shadow-sm hover:shadow"
                                title={`Descargar ${item.attachmentName || 'archivo adjunto'}`}
                              >
                                <Download className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                <span className="max-w-[120px] truncate">{item.attachmentName || 'Descargar archivo'}</span>
                                {item.attachmentSize && (
                                  <span className="text-[10px] text-blue-500 font-normal">({item.attachmentSize})</span>
                                )}
                              </a>
                            ) : (
                              <span className="text-gray-300 italic text-xs">Sin adjunto</span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {item.attachmentUrl && (
                                <a
                                  href={item.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                  title={`Descargar archivo adjunto (${item.attachmentName || 'archivo'})`}
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                              {waUrl && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                  title="Chatear en WhatsApp"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              )}
                              <a
                                href={`mailto:${item.email}?subject=Contacto%20CEMIM%20Mangayacu`}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Enviar correo"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDeleteRegistration(item.id, item.nombre)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Eliminar de la bandeja"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {/* ==================== WIDGET EN LA ESQUINA: VISITAS Y DESCARGAS ==================== */}
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:w-80 transition-all duration-300">
          {isCornerWidgetOpen ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl p-4 sm:p-5 overflow-hidden animate-slideUp">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cemim-green" />
                    Métricas Landing Page
                  </h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchAnalytics(true)}
                    disabled={loadingAnalytics}
                    className="p-1 text-gray-400 hover:text-cemim-green hover:bg-gray-100 rounded-lg transition-colors"
                    title="Actualizar métricas"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin text-cemim-green' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsCornerWidgetOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Minimizar panel a la esquina"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visitas Landing Page */}
              <div className="py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cemim-green/10 text-cemim-green flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">Visitas Landing Page</p>
                    <span className="text-xs text-gray-500">Tráfico único de usuarios</span>
                  </div>
                </div>
                <span className="text-xl font-black text-cemim-dark">
                  {analytics.pageViews.toLocaleString()}
                </span>
              </div>

              {/* Descargas Separadas por Formato */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-1">
                    <Download className="w-3 h-3 text-cemim-green" />
                    Descargas Realizadas
                  </span>
                  <span className="text-xs font-bold text-cemim-green bg-cemim-green/10 px-2 py-0.5 rounded-full">
                    Total: {analytics.downloads.total.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {/* Libros */}
                  <div className="flex items-center justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-cemim-green" />
                      Libros (PDF)
                    </span>
                    <span className="font-bold text-cemim-dark">
                      {analytics.downloads.libros.toLocaleString()}
                    </span>
                  </div>

                  {/* Audios */}
                  <div className="flex items-center justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Headphones className="w-3.5 h-3.5 text-blue-600" />
                      Cuentos en Audio (MP3)
                    </span>
                    <span className="font-bold text-cemim-dark">
                      {analytics.downloads.audios.toLocaleString()}
                    </span>
                  </div>

                  {/* Videos */}
                  <div className="flex items-center justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Video className="w-3.5 h-3.5 text-red-600" />
                      Videos
                    </span>
                    <span className="font-bold text-cemim-dark">
                      {analytics.downloads.videos.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Minimized Pill in the corner */
            <button
              onClick={() => setIsCornerWidgetOpen(true)}
              className="ml-auto flex items-center gap-2.5 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl text-xs font-bold text-cemim-dark hover:text-cemim-green transition-all group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cemim-green" />
                {analytics.pageViews.toLocaleString()} Visitas
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-cemim-green" />
                {analytics.downloads.total.toLocaleString()} Descargas
              </span>
              <ChevronUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-cemim-green transition-transform" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
