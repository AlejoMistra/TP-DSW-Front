# Frontend — Sistema de Gestión de Gimnasio

Frontend del sistema de gestión de gimnasio desarrollado para la materia Desarrollo de Software.

## Stack

- [React 19](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (Radix UI, Base UI, Lucide Icons, Sonner)
- [React Router](https://reactrouter.com/) v7 (`react-router-dom`)

---

## Estructura del proyecto

El proyecto adopta una arquitectura modular orientada a funcionalidades (**Feature-Driven Architecture**), organizando el dominio del negocio en módulos autocontenidos (`features`) y desacoplando los componentes y utilidades transversales en `shared`:

```markdown
gym-frontend/
├── public/                 # Archivos y recursos estáticos públicos
├── src/
│   ├── app/                # Configuración global de la aplicación
│   │   ├── providers/      # Providers de contexto global (tema, etc.)
│   │   ├── router/         # Configuración centralizada de rutas (react-router-dom)
│   │   ├── App.tsx         # Componente raíz de la aplicación
│   │   ├── index.css       # Estilos globales y variables de diseño (Tailwind CSS)
│   │   └── main.tsx        # Punto de entrada de la aplicación
│   ├── assets/             # Recursos estáticos locales (imágenes, íconos)
│   ├── config/             # Configuraciones globales de la app (navegación, constantes)
│   ├── features/           # Módulos del negocio organizados por funcionalidad
│   │   ├── auth/           # Autenticación, control de sesión y login
│   │   ├── ClassSession/   # Sesiones y reservas de clases
│   │   ├── classSchedule/  # Horarios y cronogramas de clases
│   │   ├── exercises/      # Gestión y catálogo de ejercicios
│   │   ├── instructors/    # Gestión de profesores e instructores
│   │   ├── members/        # Administración y ficha de socios
│   │   ├── memberships/    # Membresías activas de socios
│   │   ├── membershipPlans/# Planes y tarifas de membresía
│   │   ├── payments/       # Registro y control de pagos
│   │   └── routines/       # Creación, gestión y asignación de rutinas
│   ├── layouts/            # Layouts estructurales por rol (RoleLayout, Sidebar, navegación)
│   ├── pages/              # Vistas y pantallas principales agrupadas por rol o módulo
│   │   ├── admin/          # Pantallas del panel administrativo
│   │   ├── instructor/     # Pantallas del panel de instructores
│   │   ├── member/         # Pantallas del portal de socios
│   │   ├── auth/           # Pantallas de autenticación (login, etc.)
│   │   └── public/         # Pantallas públicas o informativas (404, etc.)
│   └── shared/             # Recursos genéricos y transversales compartidos entre features
│       ├── api/            # Configuración base del cliente HTTP / API fetch
│       ├── components/     # Componentes comunes y catálogo UI (shadcn/ui en /ui)
│       ├── context/        # Contextos globales de React
│       ├── hooks/          # Custom hooks utilitarios transversales
│       ├── models/         # Tipos e interfaces globales de TypeScript
│       └── utils/          # Funciones auxiliares y utilitarias
├── .env                    # Variables de entorno locales (no versionado)
├── .env.example            # Plantilla de variables de entorno requeridas
├── components.json         # Configuración del CLI de shadcn/ui
├── index.html              # Template HTML principal
├── package.json            # Dependencias y scripts del proyecto
├── pnpm-lock.yaml          # Archivo de bloqueo de dependencias (pnpm)
├── tsconfig.app.json       # Configuración de TypeScript para el frontend
├── tsconfig.json           # Configuración base del compilador TypeScript
└── vite.config.ts          # Configuración del bundler Vite
```

> **Estructura interna de cada feature (`src/features/*`):**
> - `api/`: Servicios de comunicación con los endpoints del backend.
> - `components/`: Componentes de interfaz propios de la funcionalidad (formularios, tablas, diálogos).
> - `hooks/`: Custom hooks para el manejo de estado y lógica de negocio específica.
> - `models/`: Interfaces y contratos de tipos TypeScript del módulo.

---

## Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [pnpm](https://pnpm.io/) v9 o superior (recomendado) o npm v9 o superior

### Pasos

1. Clonar el repositorio

```bash
git clone <url-de-este-repo>
cd gym-frontend
```

2. Instalar dependencias

```bash
pnpm install
# o con npm:
# npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con la URL base del backend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

4. Iniciar en modo desarrollo

```bash
pnpm run dev
# o con npm:
# npm run dev
```

La app estará disponible en `http://localhost:5173`

### Scripts disponibles

| Comando | Descripción |
| --------- | ------------- |
| `pnpm run dev` / `npm run dev` | Inicia el servidor de desarrollo Vite |
| `pnpm run build` / `npm run build` | Compila TypeScript y genera el build de producción en `/dist` |
| `pnpm run preview` / `npm run preview` | Previsualiza localmente el build de producción |
| `pnpm run lint` / `npm run lint` | Ejecuta ESLint para analizar el código |
