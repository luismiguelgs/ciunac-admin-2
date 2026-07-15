# Modulo Usuarios - Plan

## Cambios objetivo

- Contratos tipados de usuario/rol.
- Schema explicito para alta y edicion.
- Reglas para cuenta propia y ultimo superadmin.
- Guard backend y mensajes de conflicto.

## Dependencias

- Auth, roles/permisos y tabla editable.
- Sin migracion salvo que se agreguen restricciones de DB.

## Compatibilidad y rollout

- Mantener payload actual de `/auth/register`.
- Desplegar validaciones backend antes de exponer acciones.

## Definition of Done

- `CA-USR-001..003`, errores y accesibilidad cubiertos.
