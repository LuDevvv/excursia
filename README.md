# Excursia - Plataforma de Reservas de Excursiones

Excursia es una aplicación web de página única (SPA) para la reserva de excursiones turísticas en República Dominicana, que integra un CMS para la gestión de contenido y una experiencia de usuario moderna y atractiva.

## Características

- **Diseño de Página Única**: Toda la interacción ocurre en una sola vista usando modales
- **Modales Interactivos**: Los detalles de las excursiones y el proceso de reserva se manejan a través de modales bien estructurados
- **Multilingüe**: Soporte completo para inglés y español
- **Gestión de Contenido**: Panel de administración integrado usando Payload CMS
- **Responsive**: Diseño adaptativo para dispositivos móviles y escritorio
- **Notificaciones por Email**: Confirmaciones automáticas para clientes y administradores

## Tecnologías

- **Frontend**: Next.js 14, TailwindCSS, Framer Motion
- **CMS**: Payload CMS
- **Base de Datos**: PostgreSQL
- **Internacionalización**: next-intl
- **Email**: Resend API
- **Despliegue**: Railway

## Estructura del Proyecto

```
excursia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (frontend)/         # Frontend (landing page)
│   │   ├── (payload)/          # Payload CMS
│   │   └── api/                # API endpoints
│   ├── collections/            # Colecciones de Payload
│   │   ├── Bookings.ts         # Reservas
│   │   ├── Excursions.ts       # Excursiones
│   │   ├── Media.ts            # Multimedia
│   │   └── Users.ts            # Usuarios
│   ├── components/             # Componentes React reutilizables
│   │   ├── modals/             # Componentes de modales
│   │   └── sections/           # Secciones de la página
│   ├── messages/               # Traducciones
│   │   ├── en.json             # Inglés
│   │   └── es.json             # Español
│   └── payload.config.ts       # Configuración de Payload CMS
├── public/                     # Recursos estáticos
└── docker-compose.yml          # Configuración Docker
```

## Instalación y Desarrollo

### Requisitos Previos

- Node.js 18+ (20+ recomendado)
- Docker y Docker Compose (opcional, para desarrollo containerizado)
- pnpm (recomendado) o npm/yarn

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-username/excursia.git
   cd excursia
   ```

2. Instala las dependencias:

   ```bash
   pnpm install
   ```

3. Configura las variables de entorno:

   ```bash
   cp .env.example .env
   ```

4. Inicia el servidor de desarrollo:

   **Opción 1: Desarrollo local**

   ```bash
   pnpm dev
   ```

   **Opción 2: Desarrollo con Docker**

   ```bash
   docker-compose up
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Configurar Cuenta de Administrador

1. Navega a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Sigue los pasos para crear el primer usuario administrador

## Flujo de Usuario

La aplicación funciona como una página de destino única (Single Page Application) con la siguiente estructura:

1. **Página Principal**: Muestra la barra de navegación, banner principal, sección de excursiones, sección "Por qué elegirnos", FAQ y contacto.

2. **Tarjetas de Excursiones**: Al hacer clic en una tarjeta, se abre un modal con los detalles completos de la excursión.

3. **Modal de Detalles**: Muestra información completa con desplazamiento vertical y un botón "Reservar Ahora" fijo en la parte inferior.

4. **Modal de Reserva**: Al hacer clic en "Reservar Ahora", se cierra el modal de detalles y se abre el formulario de reserva.

5. **Proceso de Reserva**: El formulario de reserva se divide en dos pasos (información personal y detalles de la reserva) para mejorar la experiencia del usuario.

6. **Confirmación**: Al enviar el formulario, se muestra un mensaje de éxito y se envía un email de confirmación.

## Colecciones de Payload CMS

### Excursiones

- **Título**: Nombre de la excursión (multilingüe)
- **Ubicación**: Lugar de la excursión (multilingüe)
- **Precio**: Costo de la excursión
- **Descripción**: Detalles completos (editor de texto enriquecido, multilingüe)
- **Duración**: Tiempo que dura la excursión
- **Idiomas**: Idiomas disponibles para la excursión
- **Recogida**: Información sobre el servicio de recogida
- **Imagen Principal**: Imagen destacada de la excursión
- **Galería**: Colección de imágenes adicionales
- **Activo**: Estado de publicación

### Reservas

- **Nombre Completo**: Nombre del cliente
- **Email**: Correo electrónico del cliente
- **Teléfono**: Número de contacto
- **Excursión**: Relación con la colección de excursiones
- **Adultos**: Cantidad de adultos
- **Niños**: Cantidad de niños
- **Fecha de Llegada**: Fecha de la excursión
- **Hora de Llegada**: Hora de la excursión
- **Mensaje**: Información adicional
- **Estado**: Estado de la reserva (pendiente, confirmada, cancelada)

## Internacionalización

La aplicación soporta inglés y español, con capacidad para agregar más idiomas:

- **Detección de Idioma**: Automática basada en el navegador o preferencias del usuario
- **Cambio de Idioma**: Mediante el selector en la barra de navegación
- **Contenido Multilingüe**: El CMS almacena campos como título, descripción, etc. en múltiples idiomas

## Despliegue

### Railway

El proyecto incluye una configuración `railway.json` para facilitar el despliegue en Railway:

1. Instala el CLI de Railway:

   ```bash
   npm install -g @railway/cli
   ```

2. Enlaza tu proyecto:

   ```bash
   railway link
   ```

3. Despliega:
   ```bash
   railway up
   ```

## Variables de Entorno

```
# Base de Datos
DATABASE_URI=postgres://usuario:contraseña@host:puerto/basededatos

# Payload CMS
PAYLOAD_SECRET=tu-clave-secreta-min-32-caracteres
PAYLOAD_PUBLIC_SERVER_URL=https://tu-dominio.com
PAYLOAD_PUBLIC_SITE_URL=https://tu-dominio.com

# Resend Email
RESEND_API_KEY=re_123456789
BUSINESS_EMAIL=info@tudominio.com

# Next.js
NODE_ENV=production
```

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Payload CMS](https://payloadcms.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [Railway](https://docs.railway.app/)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
