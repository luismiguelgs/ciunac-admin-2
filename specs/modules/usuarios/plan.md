# Modulo Usuarios - Plan

## Resumen

El modulo necesita mantener dos capacidades coordinadas: CRUD de usuarios y administracion de permisos por rol. Cualquier cambio impacta login, session, sidebar y guards.

## Fases

1. Confirmar contratos de `usuarios` y `rol-permisos`.
2. Alinear formularios y tablas con tipos estrictos.
3. Validar sincronizacion entre alta de usuario, login y permisos efectivos.
4. Cubrir flujos criticos con pruebas por rol.

## Dependencias

- `auth.ts`
- `auth.config.ts`
- `lib/access-control.ts`
- `modules/usuarios/services/*`

## Riesgos y aclaraciones

- Si cambia el nombre de un permiso, el acceso por ruta puede romperse.
- Si el backend devuelve permisos con shapes distintos, el parseo debe seguir siendo tolerante.
- El alta usa `/auth/register`, asi que cualquier cambio en auth impacta este modulo.

## Tareas tecnicas

- Revisar shape real de respuesta de `/usuarios`
- Revisar shape real de respuesta de `/rol-permisos`
- Eliminar `any` residuales en servicios y tablas
- Validar refresh de sesion tras cambios de rol
- Alinear mensajes de error del CRUD
