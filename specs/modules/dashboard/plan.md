# Modulo Dashboard - Plan

## Enfoque

- Catalogar fuente y permiso de cada widget.
- Separar fallos parciales de error total.
- Mantener redireccion docente coherente con auth.

## Dependencias

- Sesion/permisos, reportes backend y sidebar.
- Sin migraciones previstas.

## Rollout y riesgos

- Implementar despues de auth.
- Usar fixtures por rol y respuestas parciales.
- No mostrar agregados sensibles si el endpoint no esta protegido.

## Definition of Done

- `CA-DASH-001..003` cubiertos.
- Cada widget tiene API, permiso, loading, empty y error.

