# Modulo Estructura - Plan

## Enfoque

- Crear schemas por catalogo y reglas de dependencia.
- Tipar cache sin `any` y añadir invalidacion por mutacion.
- Proteger CRUD backend con JWT/permiso.
- Mantener endpoints existentes para compatibilidad.

## Dependencias y migraciones

- Auth, PostgreSQL, MongoDB Textos y consumidores de catalogo.
- Restricciones unicas o FK requieren migracion previa y auditoria de datos.

## Rollout

- Catalogos de solo lectura primero; mutaciones despues de verificar referencias.
- Smoke de grupos, solicitudes, examen y seguimiento tras cambios.

## Definition of Done

- `CA-ESTR-001..003`; schemas, guards y cache probados.
