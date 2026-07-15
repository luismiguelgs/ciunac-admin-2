# Modulo Constancias - Plan

## Arquitectura objetivo

- Mover asignacion de solicitud al backend junto con creacion.
- Rechazar solicitud ya vinculada.
- Tipar resultado parcial de generacion/upload.
- Formalizar estados pendiente, firmada y entregada.

## Dependencias y compatibilidad

- Solicitudes PostgreSQL, constancias MongoDB, Drive y React PDF.
- Endpoint nuevo/transaccional debe coexistir temporalmente con POST actual.
- No requiere migracion si se conserva modelo; indice por `id_solicitud` es recomendable tras limpiar duplicados.

## Rollout

- Crear pruebas de regresion del estado huerfano.
- Desplegar backend compatible, migrar frontend y retirar PATCH temprano.

## Definition of Done

- `CA-CONS-001..004`; no solicitud asignada sin constancia; upload/firma idempotentes.
