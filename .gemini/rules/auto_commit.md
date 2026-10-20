# Regla: Commits Automáticos en Cambios Importantes

Siempre que se realice una modificación significativa en el proyecto, se debe generar un commit en Git de forma automática y sincronizarlo con el repositorio remoto de GitHub:

1. **Cuándo realizar commit:**
   - Ingestión de nuevos lotes de libros o recursos multimedia en el catálogo.
   - Implementación o ajuste de nuevas características (paginación, reproductores, formularios).
   - Corrección de bugs o errores de funcionalidad.
   - Modificación de endpoints de API o integraciones de backend.
   - Ajustes en el diseño o componentes principales de la landing page.

2. **Procedimiento estándar:**
   - Probar que el proyecto compile limpiamente (`npm run build`).
   - Agregar los cambios: `git add .`
   - Realizar commit con mensaje descriptivo y claro siguiendo el estándar convencional (`feat: ...`, `fix: ...`, `refactor: ...`).
   - Hacer push a la rama `main` de GitHub.
   - Desplegar la versión a producción en Vercel (`npx vercel --prod --yes`).
