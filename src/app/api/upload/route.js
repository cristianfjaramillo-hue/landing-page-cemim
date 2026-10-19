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

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // Try uploading to Supabase Storage first if configured
    if (supabaseAdmin) {
      try {
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'cemim-multimedia';
        const { data, error } = await supabaseAdmin.storage
          .from(bucketName)
          .upload(`uploads/${safeName}`, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (!error && data) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(`uploads/${safeName}`);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            storage: 'supabase',
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          });
        }
      } catch (sbError) {
        console.warn('Fallo upload en Supabase, recurriendo a almacenamiento local:', sbError);
      }
    }

    // Local fallback: save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const localFilePath = path.join(uploadDir, safeName);
    fs.writeFileSync(localFilePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      storage: 'local',
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    });
  } catch (error) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { success: false, message: 'Error al procesar el archivo subido' },
      { status: 500 }
    );
  }
}
