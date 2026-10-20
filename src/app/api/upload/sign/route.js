import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    const { fileName, folder = 'attachments' } = body;

    if (!fileName) {
      return NextResponse.json(
        { success: false, message: 'Nombre de archivo requerido' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Supabase no configurado en servidor' },
        { status: 500 }
      );
    }

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeName = `${Date.now()}_${cleanFileName}`;
    const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'attachments';
    const storagePath = `${cleanFolder}/${safeName}`;

    // Generar URL firmada para subida directa desde el navegador (soporta hasta 50 MB)
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUploadUrl(storagePath, { upsert: true });

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: error?.message || 'Error al generar URL de carga' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      storagePath,
      bucketName
    });
  } catch (err) {
    console.error('Error en /api/upload/sign:', err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
