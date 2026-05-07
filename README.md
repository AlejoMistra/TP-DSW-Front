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
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Vistas/páginas de la app
│   ├── services/           # Llamadas a la API del backend
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── hooks/              # Custom hooks (React)
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada
├── .env                    # Variables de entorno (no se commitea)
├── .env.example            # Ejemplo de variables de entorno
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── package.json
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

1. Instalar dependencias

```bash
npm install
```

1. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con la URL del backend:

```markdown
VITE_API_URL=http://localhost:3000
```

1. Iniciar en modo desarrollo

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
