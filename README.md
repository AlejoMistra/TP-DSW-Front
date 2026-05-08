# Frontend — Sistema de Gestión de Gimnasio

Frontend del sistema de gestión de gimnasio desarrollado para la materia Desarrollo de Software.

## Stack

- [React](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) + SWC
- Estilos: por definir (candidato: shadcn/ui + Tailwind)

---

## Estructura del proyecto

```markdown
gym-frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/             # Imágenes, íconos y recursos estáticos
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # Custom hooks de React
│   ├── layouts/            # Layouts por rol / secciones de la app
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── pages/              # Páginas / vistas de la app
│   ├── routes/             # Definición de rutas con react-router-dom
│   ├── services/           # Lógica de acceso a datos / servicios
│   ├── App.tsx             # Componente raíz de la aplicación
│   └── main.tsx            # Punto de entrada y configuración del router
├── .env                    # Variables de entorno (no se commitea)
├── index.html
├── package.json
├── tsconfig.app.json
└── vite.config.ts
```

---

## Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

### Pasos

1. Clonar el repositorio

```bash
git clone <url-de-este-repo>
cd gym-frontend
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno (TODAVIA NO HACE FALTA)

```bash
cp .env.example .env
```

Editar `.env` con la URL del backend:

```markdown
VITE_API_URL=http://localhost:3000
```

4. Iniciar en modo desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

### Scripts disponibles

| Comando | Descripción |
| --------- | ------------- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta el linter |
