# Modulo Examen De Ubicacion - Plan

## Arquitectura objetivo

- Centralizar estados y transiciones participante/solicitud en backend.
- Validar rangos de calificacion sin solapamiento.
- Mantener acta como snapshot idempotente.
- Añadir agregado y persistencia de publicacion por periodo/version.

## Dependencias y migraciones

- Solicitudes, estructura, docentes, PostgreSQL, MongoDB y PDF.
- Publicacion requiere modelo de metadata/version y posiblemente storage; definir migracion antes de implementar.

## Compatibilidad y rollout

- Mantener CRUD actual.
- Implementar consulta consolidada antes de publicacion.
- Habilitar publicacion despues de pruebas con periodos historicos sanitizados.

## Definition of Done

- `CA-EXU-001..006`, permisos, estados, PDFs y versionado cubiertos.
