# Modulo Seguimiento Docente - Plan

## Arquitectura objetivo

- Sesion como fuente del contexto; store recuperable.
- Ownership backend para endpoints personales.
- Permisos y guards por subdominio.
- Servicios tipados y selector de modulo compartido.
- Schemas para edicion inline e importacion.

## Dependencias y migraciones

- Auth, usuarios, estructura/modulos, docentes y entidades de seguimiento.
- Restricciones ownership/FK o auditoria requieren migraciones tras validar datos existentes.

## Orden de implementacion

1. Contexto/ownership y guards.
2. Docentes y perfiles/documentos.
3. Opciones y cumplimiento.
4. Encuestas/importacion.
5. Ranking/dashboard y vistas personales.

## Rollout

- Fixtures por rol y modulo.
- Backend compatible primero; activar subflujos progresivamente.

## Definition of Done

- `CA-SDOC-001..006`, permisos por subruta, contexto y CSV cubiertos.
