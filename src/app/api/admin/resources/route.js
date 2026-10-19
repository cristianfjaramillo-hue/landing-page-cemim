import { NextResponse } from 'next/server';
import { getAllResources, addResource, deleteResourceById } from '@/lib/resourceStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let list = getAllResources();

    if (type && type !== 'todos') {
      list = list.filter((item) => item.type === type);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.author?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al obtener recursos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.type || !body.fileUrl) {
      return NextResponse.json(
        { success: false, message: 'El título, tipo y URL del archivo son obligatorios' },
        { status: 400 }
      );
    }

    const created = addResource({
      title: body.title,
      type: body.type, // 'libro' | 'audio' | 'video'
      author: body.author || 'CEMIM Mangayacu',
      category: body.category || 'General',
      description: body.description || '',
      fileUrl: body.fileUrl,
      coverUrl: body.coverUrl || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      duration: body.duration || (body.type === 'audio' ? '5:00' : body.type === 'video' ? '10:00' : null),
      pages: body.pages ? parseInt(body.pages, 10) : null,
      fileSize: body.fileSize || '5.0 MB'
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al guardar el recurso' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID de recurso no especificado' },
        { status: 400 }
      );
    }

    const updated = deleteResourceById(id);
    return NextResponse.json({
      success: true,
      message: 'Recurso eliminado correctamente',
      data: updated
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error al eliminar el recurso' },
      { status: 500 }
    );
  }
}
