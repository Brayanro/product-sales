## Descripción
Sistema de gestión de productos y ventas desarrollado con React, TypeScript y Vite. Implementa una arquitectura moderna y escalable, siguiendo principios SOLID y Clean Code.

## Características
- Gestión de productos (CRUD)
- Registro de ventas
- Autenticación de usuarios
- Interfaz responsiva
- Validaciones de formularios
- Gestión de estado optimizada

## Tecnologías Utilizadas
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Sonner
- React Router
- Docker

## Requisitos Previos
- Node.js >= 18
- npm 
- Docker (opcional)

## Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas/vistas de la aplicación
├── services/      # Servicios para comunicación con API
├── hooks/         # Custom hooks
├── context/       # Contextos de React
├── types/         # Definiciones de tipos TypeScript
└── utils/         # Utilidades y funciones auxiliares
```

## Instalación y Configuración

### Variables de Entorno
1. Crea un archivo `.env` en la raíz del proyecto

2. Configura las variables necesarias:
```
VITE_API_URL=http://localhost:3000/api
```

### Instalación de Dependencias
```bash
npm install

### Ejecución en Desarrollo
```bash
npm run dev

### Construcción para Producción
```bash
npm run build

## Docker
### Construir la Imagen
```bash
docker build -t product-sales .
```

### Ejecutar el Contenedor
```bash
docker run -d -p 8080:80 --name product-sales product-sales
```

## Buenas Prácticas Implementadas

### Clean Code
1. Nombres Descriptivos
   - Variables y funciones con nombres que explican su propósito
   - Evitar abreviaciones confusas

2. Funciones
   - Principio de Responsabilidad Única

### Principios SOLID
1. Single Responsibility Principle
   - Cada componente tiene una única responsabilidad
   - Separación de lógica de negocio y presentación

2. Open/Closed Principle
   - Componentes extensibles sin modificación
   - Uso de props para configuración

3. Interface Segregation
   - Interfaces pequeñas y específicas
   - Props mínimas necesarias

4. Dependency Inversion
   - Uso de contextos para inyección de dependencias
   - Servicios desacoplados

### Arquitectura y Organización
1. Separación de Responsabilidades
   - Components: UI y presentación
   - Services: Lógica de negocio y API
   - Hooks: Lógica reutilizable
   - Context: Estado global
   - Types: Definiciones de tipos

2. Gestión de Estado
   - Context API para estado global
   - useState para estado local
   - Custom hooks para lógica compleja

3. Manejo de Errores
   - Try-catch en operaciones asíncronas
   - Mensajes de error descriptivos
   - Fallbacks y estados de carga


## Convenciones de Código
1. TypeScript strict mode
2. Import ordering
3. Consistencia en nombrado de archivos
4. Organización de imports

## Seguridad
1. Validación de inputs
2. Protección de rutas
3. Manejo seguro de tokens

## Control de Versiones
1. Commits semánticos
2. Conventional commits