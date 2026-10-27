# Gym Frontend (Vite + React + TypeScript)

Frontend para la aplicación de gestión de gimnasio. Implementado con Vite, React y TypeScript.

## Tecnologías

- Vite
- React + TypeScript
- Tailwind CSS
- shadcn (colección de componentes UI adaptada)
- react-router-dom (ruteo)

## Scripts

Usa `pnpm` (o `npm`/`yarn`) para ejecutar los scripts del proyecto:

```bash
pnpm install
pnpm dev    # inicia el servidor de desarrollo
pnpm build  # build de producción
pnpm preview
pnpm lint
```

## Despliegue en Vercel

1. **Root Directory**: `gym-frontend`
2. **Framework Preset**: `Vite`
3. **Environment Variables**:
   - `VITE_API_BASE_URL`: URL base del backend en producción.
4. Las rutas y recargas de `react-router-dom` están gestionadas por `vercel.json` mediante reescritura a `/index.html`.

