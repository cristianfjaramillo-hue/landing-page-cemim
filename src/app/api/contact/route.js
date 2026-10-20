import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
const TARGET_EMAIL = process.env.ADMIN_EMAIL || 'cristian.f.jaramillo@gmail.com';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, interes, mensaje } = body;

    if (!nombre || !email) {
      return NextResponse.json({ 
        success: false, 
        message: 'El nombre y correo electrónico son obligatorios.' 
      }, { status: 400 });
    }

    const registration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono ? telefono.trim() : '',
      interes: interes || 'General',
      mensaje: mensaje ? mensaje.trim() : '',
      createdAt: new Date().toISOString()
    };

    // 1. Guardar permanentemente en Supabase Storage
    if (url && serviceKey) {
      try {
        const supabase = createClient(url, serviceKey);
        let list = [];
        const { data: fileData } = await supabase.storage.from(bucket).download('data/registrations.json');
        if (fileData) {
          try {
            list = JSON.parse(await fileData.text());
          } catch (e) {}
        }
        list.unshift(registration);
        await supabase.storage.from(bucket).upload('data/registrations.json', Buffer.from(JSON.stringify(list, null, 2)), {
          contentType: 'application/json',
          cacheControl: '0',
          upsert: true
        });
      } catch (err) {
        console.error('Error guardando registro en Supabase:', err);
      }
    }

    // 2. Intento de notificación FormSubmit con timeout estricto de 3 segundos para no bloquear la respuesta
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://landing-page-cemim.vercel.app',
          'Referer': 'https://landing-page-cemim.vercel.app/'
        },
        body: JSON.stringify({
          _subject: `Nuevo Registro CEMIM: ${nombre} (${interes})`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
          'Nombre Completo': nombre,
          'Correo Electrónico': email,
          'Teléfono / WhatsApp': telefono || 'No provisto',
          'Área de Interés': interes,
          'Mensaje o Consulta': mensaje || 'Sin mensaje adicional',
          'Fecha de Registro': new Date().toLocaleString('es-EC')
        }),
        signal: controller.signal
      })
      .then(() => clearTimeout(timer))
      .catch(() => clearTimeout(timer));
    } catch (mailErr) {
      console.error('Notificación mail saltada:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: '¡Tu registro ha sido enviado exitosamente!',
      data: registration
    });
  } catch (error) {
    console.error('Error en /api/contact:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Ocurrió un error al procesar el formulario' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!url || !serviceKey) {
      return NextResponse.json({ success: true, data: [] });
    }
    const supabase = createClient(url, serviceKey);
    const { data: fileData, error } = await supabase.storage.from(bucket).download('data/registrations.json');
    if (error || !fileData) {
      return NextResponse.json({ success: true, data: [] });
    }
    const list = JSON.parse(await fileData.text());
    return NextResponse.json({ success: true, data: list });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !url || !serviceKey) {
      return NextResponse.json({ success: false, message: 'ID de registro requerido' }, { status: 400 });
    }
    const supabase = createClient(url, serviceKey);
    const { data: fileData } = await supabase.storage.from(bucket).download('data/registrations.json');
    if (fileData) {
      let list = JSON.parse(await fileData.text());
      list = list.filter(r => r.id !== id);
      await supabase.storage.from(bucket).upload('data/registrations.json', Buffer.from(JSON.stringify(list, null, 2)), {
        contentType: 'application/json',
        cacheControl: '0',
        upsert: true
      });
    }
    return NextResponse.json({ success: true, message: 'Registro eliminado correctamente' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
