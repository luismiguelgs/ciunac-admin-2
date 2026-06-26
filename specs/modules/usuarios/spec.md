# Modulo Usuarios - Spec

## Objetivo

Gestionar usuarios del panel administrativo, alta por rol y mapeo de permisos por rol para controlar acceso a rutas y modulos.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permiso `gestionar_usuarios`
- `DOCENTE` solo como sujeto administrado, no como operador del modulo

## Reglas de negocio

- Todo usuario debe tener `email` y `rol`.
- El alta local usa `POST /auth/register`, no `POST /usuarios`.
- Los permisos se asignan por rol mediante `rol-permisos`.
- `SUPERADMIN` tiene bypass de permisos en frontend.
- Los cambios de rol o permisos deben reflejarse en auth y sidebar despues de refrescar sesion.

## Criterios de aceptacion

- Se puede listar usuarios existentes.
- Se puede crear un usuario con rol valido.
- Se puede editar email o rol de un usuario.
- Se puede eliminar un usuario.
- Se pueden consultar y mantener permisos por rol.
- El frontend puede resolver permisos por rol durante login.

## Endpoints necesarios

- `POST /auth/register`
- `POST /auth/login`
- `GET /usuarios`
- `GET /usuarios/:id`
- `PATCH /usuarios/:id`
- `DELETE /usuarios/:id`
- `GET /rol-permisos`
- `GET /rol-permisos/:id`
- `GET /rol-permisos/rol/:rol`
- `POST /rol-permisos`
- `PATCH /rol-permisos/:id`
- `DELETE /rol-permisos/:id`

## Modelo de datos relacionado

- `Usuario`
- `RolPermiso`
- `AuthUser`
- `Session.user`

## Validaciones

- `email` con formato valido
- `password` minima de 6 caracteres para alta local
- `rol` obligatorio y perteneciente al catalogo de roles soportados
- `permisoId` numerico y `rol` obligatorio en asignaciones de permisos

## Errores posibles

- Email duplicado
- Credenciales invalidas
- Rol no soportado
- Permisos de rol vacios o no cargados
- Usuario no autorizado para administrar usuarios

## Tareas tecnicas

- Tipar por completo `Usuario` y `RolPermiso` en tablas y formularios
- Unificar contratos de error entre `usuarios.service.ts` y `rol-permiso.service.ts`
- Mantener coherencia entre cambio de rol, sesion y sidebar
- Documentar y probar el impacto de permisos en auth

## Pruebas

- Alta de usuario por rol
- Edicion de rol
- Baja de usuario
- Carga de permisos por rol
- Denegacion por falta de `gestionar_usuarios`
