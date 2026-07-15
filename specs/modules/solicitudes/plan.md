# Modulo Solicitudes - Plan

## Arquitectura objetivo

- Centralizar estados y transiciones en backend.
- Mantener componentes compartidos por tipo, con adaptadores explicitos.
- Tipar resultados de update/rechazo en lugar de booleanos silenciosos.
- Definir pagina indice o corregir breadcrumbs `/solicitudes`.

## Dependencias y migraciones

- Estudiantes, catalogos, pagos, documentos y examen.
- Si se agrega historial de estados/auditoria, requiere entidad y migracion PostgreSQL.

## Compatibilidad y rollout

- Introducir endpoint/servicio de transicion manteniendo PATCH temporalmente.
- Migrar consumidores por subflujo y verificar documentos/examen.

## Definition of Done

- `CA-SOL-001..004`; transiciones, CSV, seguridad y navegacion cubiertos.
