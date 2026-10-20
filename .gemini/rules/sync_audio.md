# Regla: Sincronización Automática de Biblioteca de Audios CEMIM

Cuando el usuario dé la instrucción:
`ACTUALIZAR BIBLIOTECA DE AUDIO` (o variaciones como `ACTUALIZAR BIBLIOTECA DE AUDIOM` o `actualizar audios desde drive`), debes ejecutar el procedimiento automatizado de sincronización:

1. **Carpeta de Google Drive Oficial de Audios:**
   `https://drive.google.com/drive/folders/1HLUEO2kHXZFz7hSITmAVtWYgynH-1BW2?usp=sharing`

2. **Script de Sincronización:**
   Ejecutar:
   ```powershell
   node scripts/sync_audio_drive.cjs
   ```
   Este script:
   - Analiza la carpeta de Google Drive.
   - Detecta archivos de audio (.mp3, .wav, .m4a, etc.).
   - Mantiene todos los libros (40) y todos los audios ya cargados previamente.
   - Identifica de forma diferencial si hay audios nuevos.
   - Si hay nuevos: genera enlaces de streaming de alto rendimiento con CORS abierto y guarda el catálogo en Supabase Storage (`cemim-multimedia/data/resources.json`).

3. **Verificación y Despliegue:**
   - Confirmar el estado del catálogo.
   - Hacer commit de `data/resources.json` y desplegar a Vercel con:
     ```powershell
     npx.cmd vercel --prod --yes
     ```
   - Informar al usuario cuáles archivos nuevos fueron añadidos y el total actualizado.
