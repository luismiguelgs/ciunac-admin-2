# Modulo Usuarios - Tests

## Unitarias

- `extractPermissionCodes()` resuelve strings y objetos
- `normalizeRole()` normaliza variantes de rol

## Integracion

- Crear usuario desde UI con datos validos
- Rechazar alta con email invalido
- Editar rol y reflejarlo en tabla
- Cargar permisos de un rol sin romper sidebar

## E2E

- `SUPERADMIN` entra a `/usuarios` y gestiona usuarios
- `ADMINISTRATIVO` sin `gestionar_usuarios` es redirigido

## Casos negativos

- Backend devuelve error 409 por email duplicado
- Backend devuelve lista vacia de permisos
- Backend devuelve payload inesperado de `rol-permisos`
