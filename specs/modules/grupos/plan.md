# Modulo Grupos - Plan

## Enfoque

- Mantener CRUD actual y reforzar schema/errores.
- Definir clave de idempotencia para importacion por periodo y codigo.
- Separar preview, confirmacion y resultado.
- Proteger Q10 y mutaciones con JWT/permiso.

## Dependencias

- Estructura, docentes, Q10 y auth.
- Posible indice unico requiere migracion y limpieza de duplicados.

## Rollout y DoD

- Activar primero preview y reporte; validar importacion en QA.
- `CA-GRP-001..003`, regresion CRUD y smoke Q10 aprobados.
