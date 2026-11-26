This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Plataforma > Estudiantes

El código de permiso para registrar y asignar en la base de datos es `gestion_estudiantes`. Los usuarios deben volver a iniciar sesión para recibir cambios de permisos.

- `API_URL` y `API_KEY` configuran la integración servidor a servidor con CIUNAC.
- `API_KEY_Q10` se usa para consultar programas. El valor opcional de `Q10_API_URL` sustituye la base `https://api.q10.com/v1`.
- `APP_BASE_URL` permite fijar el origen permitido para las escrituras cuando el portal está detrás de un proxy.

El adjunto admite hasta 10 MiB. En Vercel, habilita `VERCEL_SUPPORT_LARGE_REQUEST_BODY=1` con Fluid Compute y memoria Performance (4 GB) para recibir ese tamaño. [Configuración de cargas grandes en Vercel](https://vercel.com/changelog/vercel-functions-now-support-request-bodies-up-to-20mib).

Para ejecutar la prueba de navegador, usa `node scripts/verify-estudiantes.mjs` con Playwright y Chromium disponibles. Puedes indicar la ruta de una instalación existente con `PLAYWRIGHT_MODULE` y la del navegador con `PLAYWRIGHT_CHROMIUM`. La prueba usa servicios locales simulados.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
