import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'cristian.f.jaramillo@gmail.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Cemim2026*Mision';

    if (
      email &&
      password &&
      email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
      password.trim() === expectedPassword.trim()
    ) {
      // In production, sign with JWT_SECRET
      const response = NextResponse.json({
        success: true,
        message: 'Autenticación exitosa',
        user: {
          email: expectedEmail,
          role: 'admin'
        }
      });

      // Set cookie for session persistence
      response.cookies.set('cemim_admin_session', 'authenticated_admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Credenciales inválidas. Verifica tu correo o contraseña.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
