# Challenge Toolbox Frontend

Una aplicación React para visualizar y buscar archivos con datos estructurados. El proyecto incluye pruebas unitarias completas con Jest y React Testing Library.

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org/)
- **npm** (v7 o superior) - Incluido con Node.js

Para verificar que tienes las versiones correctas, ejecuta:

```bash
node -v  # Debe ser v16+
npm -v   # Debe ser v7+
```

## 📦 Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/GALC55/Challenge-toolbox-frontend.git
cd Challenge-toolbox-frontend
```

2. **Instala las dependencias:**

```bash
npm install
```

Este comando instalará todas las dependencias necesarias incluyendo:

- React y React DOM
- React Query (@tanstack/react-query)
- Bootstrap para estilos
- Jest y React Testing Library para tests

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
REACT_APP_BACKEND_URL=http://localhost:3000
```

**Nota:** Las variables de entorno en React deben comenzar con `REACT_APP_` para ser accesibles en la aplicación.

### 2. Verificar la Configuración

Asegúrate de que:

- El archivo `.env` esté en el directorio raíz
- El backend esté corriendo en el puerto configurado (por defecto: 3000)

## 🚀 Scripts Disponibles

### Ejecutar el Proyecto en Desarrollo

```bash
npm start
```

- Inicia la aplicación en modo desarrollo
- Abre automáticamente [http://localhost:3000](http://localhost:3000) o [http://localhost:3001](http://localhost:3001) (en caso de que el puerto 3000 ya este ocupado por ejemplo con el backend) en el navegador
- La aplicación se recargará automáticamente cuando hagas cambios en los archivos
- Los errores se mostrarán en la consola

**Exit code:** 0 = éxito, 1 = error

### Construir para Producción

```bash
npm run build
```

- Crea una versión optimizada para producción
- Los archivos se generan en la carpeta `build/`
- La aplicación estará lista para ser desplegada

### Ejecutar Tests

```bash
npm test
```

- Inicia el test runner en modo watch
- Presiona `a` para ejecutar todos los tests
- Presiona `f` para ejecutar solo los tests que fallaron
- Presiona `q` para salir

### Ver Cobertura de Tests

```bash
npm test -- --coverage --watchAll=false
```

- Genera un reporte de cobertura de pruebas
- Muestra qué porcentaje del código está cubierto por tests

## 🧪 Ejecutar Tests

### Modo Watch (Desarrollo)

```bash
npm test
```

Perfecto para desarrollo. Los tests se ejecutarán automáticamente cuando cambies archivos.

**Opciones interactivas:**

- `a` - Ejecutar todos los tests
- `f` - Ejecutar tests fallidos
- `p` - Filtrar por nombre de archivo
- `t` - Filtrar por nombre de test
- `q` - Salir

### Modo No-Watch (CI/CD)

```bash
npm test -- --watchAll=false
```

Ejecuta los tests una sola vez y termina. Útil para pipelines de CI/CD.

### Tests Específicos

```bash
# Ejecutar solo tests del componente Tabla
npm test -- tabla.test.js

# Ejecutar solo tests del servicio de archivos
npm test -- files.test.js

# Ejecutar solo tests de utilidades
npm test -- apiQuery.test.js
```

### Cobertura de Tests

```bash
npm test -- --coverage --watchAll=false
```

Genera un reporte detallado de cobertura mostrando:

- Archivos y líneas cubiertas
- Porcentaje de cobertura
- Áreas no cubiertas

## 📁 Estructura del Proyecto

```
frontend/
├── public/                    # Archivos estáticos
│   ├── index.html            # HTML principal
│   ├── manifest.json         # Metadata de la app
│   └── robots.txt            # Instrucciones para bots
├── src/
│   ├── components/           # Componentes React
│   │   ├── tabla.js         # Componente principal
│   │   └── tabla.test.js    # Tests del componente
│   ├── services/            # Servicios y hooks personalizados
│   │   ├── files.js         # Hooks para obtener archivos
│   │   └── files.test.js    # Tests de los hooks
│   ├── utils/               # Funciones utilitarias
│   │   ├── apiQuery.js      # Configuración de React Query
│   │   └── apiQuery.test.js # Tests de utilidades
│   ├── styles/              # Estilos CSS
│   │   └── custom.css       # Estilos personalizados
│   ├── assets/              # Imágenes y recursos
│   ├── App.js               # Componente raíz
│   ├── App.test.js          # Tests de App
│   ├── App.css              # Estilos de App
│   ├── index.js             # Punto de entrada
│   ├── index.css            # Estilos globales
│   ├── setupTests.js        # Configuración de tests
│   └── reportWebVitals.js   # Métricas de rendimiento
├── .env                      # Variables de entorno
├── package.json              # Dependencias del proyecto
├── package-lock.json         # Lock file de npm
└── README.md                 # Este archivo
```

## 🏗️ Stack Tecnológico

### Frontend

- **React 19.2.3** - Librería UI
- **React DOM 19.2.3** - Renderización en el DOM
- **React Query 5.90.18** - Gestión de estado del servidor

### Testing

- **Jest** - Test runner
- **React Testing Library 16.3.1** - Utilidades de testing
- **@testing-library/jest-dom 6.9.1** - Matchers personalizados

### Estilos

- **Bootstrap 5.3.8** - Framework CSS

### Build

- **React Scripts 5.0.1** - Configuración de Create React App

## 🔌 Configuración de Variables de Entorno

### En Desarrollo

El archivo `.env` debe contener:

```env
# URL del backend
REACT_APP_BACKEND_URL=http://localhost:3000
```

**Nota importante:**

- Las variables se cargan cuando inicias la aplicación
- Si cambias `.env`, debes reiniciar `npm start`
- Las variables deben comenzar con `REACT_APP_` para ser accesibles

## 📝 Componentes y Servicios

### Componente Tabla

**Archivo:** `src/components/tabla.js`

Componente principal que:

- Muestra una tabla de archivos con sus datos
- Permite buscar archivos por nombre
- Maneja estados de carga y error
- Limpia la búsqueda

### Servicio de Archivos

**Archivo:** `src/services/files.js`

Hooks personalizados:

- `useFilesList()` - Obtiene la lista de archivos
- `useFilesData()` - Obtiene datos de todos los archivos
- `useFileByName(fileName)` - Busca un archivo específico

### Utilidades API

**Archivo:** `src/utils/apiQuery.js`

- `fetchJSON(url, options)` - Función fetch mejorada
- `useApiQuery(key, url, fetchOptions, queryOptions)` - Hook genérico de React Query

## 🐛 Troubleshooting

### El proyecto no inicia

```bash
# Elimina node_modules y package-lock.json
rm -r node_modules package-lock.json

# Reinstala dependencias
npm install

# Intenta iniciar nuevamente
npm start
```

### Tests no pasan

```bash
# Limpia la caché de Jest
npm test -- --clearCache

# Ejecuta los tests nuevamente
npm test
```

### Variables de entorno no se cargan

1. Asegúrate de que el archivo se llama `.env` (no `.env.local` en desarrollo)
2. Reinicia el servidor con `npm start`
3. Verifica que las variables comienzan con `REACT_APP_`

## 📄 Licencia

Este proyecto es propiedad de GALC55.
