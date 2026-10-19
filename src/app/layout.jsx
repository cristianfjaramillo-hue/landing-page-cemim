import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CEMIM - Centro de Entrenamiento Misionero Internacional Mangayacu',
  description: 'Repositorio abierto de literatura bíblica, cuentos e historias misioneras en audio, y videos documentales desde la Amazonía ecuatoriana hacia las naciones.',
  keywords: [
    'CEMIM',
    'Mangayacu',
    'Centro de entrenamiento misionero',
    'Misiones transculturales',
    'Amazonía Ecuador',
    'Cuentos misioneros en audio',
    'Libros cristianos PDF',
    'Documentales misioneros'
  ],
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-cemim-bg text-cemim-dark min-h-screen flex flex-col antialiased selection:bg-cemim-green selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
