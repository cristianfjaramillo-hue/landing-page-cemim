# Instructivo Paso a Paso: Configuración de Credenciales en `.env`
**Proyecto:** Landing Page & Repositorio Multimedia CEMIM  
*(Centro de Entrenamiento Misionero Internacional Mangayacu)*

---

## 📌 Introducción y Reglas de Formato

El archivo [`.env`](file:///c:/Users/USER/Documents/ANTIGRAVITY/LADING%20PAGE%20CEMIM/.env) almacena los secretos y configuraciones privadas de la plataforma. Para evitar errores de lectura al iniciar la aplicación:

1. **Sin espacios en la asignación:** Usa `CLAVE=valor`, nunca `CLAVE = valor`.
2. **Uso de comillas:** Si el valor contiene espacios, comas o caracteres especiales, enciérralo entre comillas dobles: `CLAVE="mi valor con espacios"`.
3. **No borres las variables:** Si aún no tienes una clave específica, déjala vacía (`CLAVE=`) sin borrar la línea.
4. **Seguridad:** Nunca subas este archivo a repositorios públicos ni compartas capturas de pantalla de tus claves.

---

## 🧭 Paso 1: Configuración General de la Aplicación

Estas variables ya vienen preconfiguradas con los valores recomendados para el entorno local de desarrollo:

```bash
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_NAME="CEMIM - Centro de Entrenamiento Misionero Internacional Mangayacu"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Cuando el sitio web esté publicado en Vercel, `NEXT_PUBLIC_APP_URL` se actualizará con tu dominio definitivo (por ejemplo: `https://cemim.vercel.app` o tu dominio personalizado `https://cemim.org`).

---

## 🔐 Paso 2: Credenciales de Acceso Administrador

El panel administrativo de CEMIM permitirá subir libros (PDF), cuentos e historias en audio (MP3) y fotos, así como eliminarlos.

```bash
ADMIN_EMAIL=tu_correo@gmail.com
ADMIN_PASSWORD=TuContraseñaSuperSegura2026*
JWT_SECRET=clave_aleatoria_larga_para_tokens
SESSION_SECRET=otra_clave_aleatoria_para_sesiones
```

### ¿Cómo configurarlas?
1. **`ADMIN_EMAIL`**: Coloca el correo con el que iniciarás sesión en el panel de control.
2. **`ADMIN_PASSWORD`**: Define una contraseña robusta de al menos 12 caracteres (incluye mayúsculas, minúsculas, números y símbolos).
3. **`JWT_SECRET` y `SESSION_SECRET`**: Son firmas criptográficas que protegen las sesiones activas. 
   - Para generarlas de manera instantánea y segura, abre una terminal de **PowerShell** en tu equipo y ejecuta este comando dos veces:
     ```powershell
     [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
     ```
   - Pega una cadena generada en `JWT_SECRET` y otra en `SESSION_SECRET`.

---

## 🐙 Paso 3: Integración con la API de GitHub

Esta sección permite vincular el proyecto con GitHub para control de código, automatización y sincronización.

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=tu_usuario_de_github
GITHUB_REPO=landing-page-cemim
GITHUB_BRANCH=main
```

### ¿Cómo obtener el `GITHUB_TOKEN`?
1. Entra a [github.com](https://github.com) e inicia sesión.
2. Haz clic en tu foto de perfil (esquina superior derecha) y selecciona **Settings**.
3. En la barra lateral izquierda, baja al final y selecciona **Developer settings**.
4. Haz clic en **Personal access tokens** ➔ **Tokens (classic)**.
5. Presiona el botón desplegable **Generate new token** ➔ **Generate new token (classic)**.
6. En el campo **Note**, escribe: `CEMIM Landing Page`.
7. En **Expiration**, selecciona el tiempo deseado (por ejemplo, *90 days* o *No expiration*).
8. En los permisos (scopes), marca las siguientes casillas:
   - ✅ **`repo`** (Full control of private repositories)
   - ✅ **`workflow`** (Update GitHub Action workflows)
9. Ve al final de la página y haz clic en el botón verde **Generate token**.
10. **¡Copia el token inmediatamente!** GitHub solo lo mostrará una vez. Pégalo en `GITHUB_TOKEN`.

### Valores complementarios:
- **`GITHUB_OWNER`**: Tu nombre de usuario exacto en GitHub (o el nombre de la organización si creaste una).
- **`GITHUB_REPO`**: El nombre del repositorio donde alojarás este proyecto (por ejemplo: `landing-page-cemim`).
- **`GITHUB_BRANCH`**: Déjalo en `main`.

---

## 🚀 Paso 4: Conexión Automática y Despliegue en Vercel

Vercel alojará la landing page y el panel de administración con alta velocidad y certificado SSL gratuito.

```bash
VERCEL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxxxxxxxxxxxx
VERCEL_ORG_ID=team_xxxxxxxxxxxxxxxxxxxxxxxx
```

### ¿Cómo obtener el `VERCEL_TOKEN`?
1. Entra a [vercel.com](https://vercel.com) e inicia sesión (recomendado: inicia sesión con tu cuenta de GitHub).
2. Haz clic en tu avatar/perfil (arriba a la derecha) ➔ **Settings**.
3. En el menú lateral izquierdo, haz clic en **Tokens**.
4. En el apartado **Create Token**:
   - Asigna un nombre: `CEMIM Token`.
   - En **Scope**, selecciona tu cuenta personal o equipo.
5. Haz clic en **Create** y copia el token generado. Pégalo en `VERCEL_TOKEN`.

### ¿Cómo obtener `VERCEL_PROJECT_ID` y `VERCEL_ORG_ID`?
- **Si ya creaste el proyecto en Vercel:**
  1. Entra a tu proyecto en Vercel Dashboard.
  2. Ve a la pestaña **Settings** ➔ **General**.
  3. Desplaza hacia abajo hasta encontrar **Project ID** (cópialo en `VERCEL_PROJECT_ID`).
  4. En esa misma pantalla o en la configuración general de tu cuenta verás tu **User ID / Org ID** (cópialo en `VERCEL_ORG_ID`).
- **Si aún no has creado el proyecto en Vercel:**
  > Puedes dejar estos dos campos vacíos por el momento (`VERCEL_PROJECT_ID=` y `VERCEL_ORG_ID=`). Cuando vinculemos el repositorio por primera vez, Vercel los asignará automáticamente.

---

## 🗄️ Paso 5: Almacenamiento Multimedia en Supabase (Audios, Libros e Imágenes)

Dado que la landing page requiere reproducir historias en audio directamente, mostrar imágenes misioneras y descargar libros en PDF, los archivos deben residir en un almacenamiento en la nube persistente con soporte para streaming y descargas de alta velocidad. **Supabase** es la opción ideal y ofrece un plan gratuito muy completo.

```bash
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_STORAGE_BUCKET=cemim-multimedia
```

### Paso 5.1: Crear el proyecto en Supabase
1. Entra a [supabase.com](https://supabase.com) y presiona **Start your project** (inicia con tu cuenta de GitHub o correo).
2. Haz clic en **New Project**.
3. Completa los datos:
   - **Name:** `CEMIM`
   - **Database Password:** Crea una contraseña segura y anótala.
   - **Region:** Selecciona la más cercana (ejemplo: `South America (São Paulo)` o `US East (North Virginia)`).
4. Haz clic en **Create new project** y espera aproximadamente 1-2 minutos mientras se aprovisiona.

### Paso 5.2: Obtener las claves de la API
1. En el menú lateral izquierdo de tu proyecto en Supabase, haz clic en el icono de engranaje ⚙️ (**Project Settings**).
2. Selecciona la pestaña **API**.
3. En la sección **API Settings**:
   - Copia la **Project URL** y pégala en `SUPABASE_URL`.
4. En la sección **Project API keys**:
   - Copia la clave **anon (public)** y pégala en `SUPABASE_ANON_KEY`.
   - Haz clic en **Reveal** sobre la clave **service_role (secret)**, cópiala y pégala en `SUPABASE_SERVICE_ROLE_KEY`.

> La clave `service_role` tiene permisos totales sobre la base de datos y archivos. Debe permanecer estrictamente en el archivo `.env` del servidor y nunca compartirse en el código cliente.

### Paso 5.3: Crear el depósito (*Bucket*) para audios, libros y fotos
1. En el menú lateral izquierdo de Supabase, haz clic en el icono de cubo 🗄️ (**Storage**).
2. Haz clic en el botón verde **New Bucket**.
3. Configura:
   - **Bucket name:** `cemim-multimedia`
   - **Public bucket:** Activa el interruptor en **ON** (es imprescindible que sea público para que los visitantes de la web puedan escuchar los audios, ver las fotos y descargar los libros).
4. Haz clic en **Save bucket**.
5. Deja la variable configurada como: `SUPABASE_STORAGE_BUCKET=cemim-multimedia`.

---

## ✅ Resumen del Archivo `.env` Completo

Al finalizar, tu archivo [`.env`](file:///c:/Users/USER/Documents/ANTIGRAVITY/LADING%20PAGE%20CEMIM/.env) lucirá similar a esto:

```bash
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_NAME="CEMIM - Centro de Entrenamiento Misionero Internacional Mangayacu"
NEXT_PUBLIC_APP_URL=http://localhost:3000

ADMIN_EMAIL="mision@cemim.org"
ADMIN_PASSWORD="MiClaveMisionera2026*"
JWT_SECRET="x8H...claveGenerada...="
SESSION_SECRET="k9P...otraClave...="

GITHUB_TOKEN="ghp_5L8j2..."
GITHUB_OWNER="tu-usuario"
GITHUB_REPO="landing-page-cemim"
GITHUB_BRANCH="main"

VERCEL_TOKEN="vca_..."
VERCEL_PROJECT_ID=""
VERCEL_ORG_ID=""

SUPABASE_URL="https://abcdefghijklmn.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
SUPABASE_STORAGE_BUCKET="cemim-multimedia"
```
