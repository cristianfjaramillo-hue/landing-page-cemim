import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se envió ningún archivo' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize file name
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeName = `${Date.now()}_${cleanFileName}`;
    const fileSizeFormatted = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // 1. Upload to Supabase Storage if configured
    if (supabaseAdmin) {
      try {
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';

        let uploadRes = await supabaseAdmin.storage
          .from(bucketName)
          .upload(`uploads/${safeName}`, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: true
          });

        // If bucket does not exist, try creating it automatically
        if (uploadRes.error) {
          console.warn('Intento de crear bucket automáticamente:', uploadRes.error.message);
          try {
            await supabaseAdmin.storage.createBucket(bucketName, { public: true });
            uploadRes = await supabaseAdmin.storage
              .from(bucketName)
              .upload(`uploads/${safeName}`, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
              });
          } catch (createErr) {
            console.error('No se pudo crear bucket automáticamente:', createErr);
          }
        }

        if (!uploadRes.error && uploadRes.data) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(`uploads/${safeName}`);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storage: 'supabase',
            fileName: file.name,
            fileSize: fileSizeFormatted
          });
        } else {
          console.error('Error final en Supabase upload:', uploadRes.error);
          return NextResponse.json({
            success: false,
            message: `Error en Supabase: ${uploadRes.error?.message || 'Asegúrate de haber creado el bucket público "cemim-multimedia" en Supabase Storage.'}`
          }, { status: 400 });
        }
      } catch (sbError) {
        console.error('Error comunicándose con Supabase Storage:', sbError);
        return NextResponse.json({
          success: false,
          message: `Error al conectar con Supabase Storage: ${sbError.message}`
        }, { status: 500 });
      }
    }

    // 2. Local fallback ONLY if running in local environment (not in serverless Vercel)
    if (!process.env.VERCEL) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localFilePath = path.join(uploadDir, safeName);
      fs.writeFileSync(localFilePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${safeName}`,
        storage: 'local',
        fileName: file.name,
        fileSize: fileSizeFormatted
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No se encontró la configuración de almacenamiento en la nube (Supabase). Por favor verifica tus credenciales.'
    }, { status: 400 });

  } catch (error) {
    console.error('Error general en upload:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno al procesar el archivo: ' + error.message },
      { status: 500 }
    );
  }
}
