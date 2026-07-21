# Modulo Certificados - Plan

## Enfoque

- Confirmar contrato DELETE y estados reales antes de tocar UI.
- Unificar generacion/upload/reemplazo con resultado tipado.
- Mantener compensacion backend en firma y hacerla idempotente.
- Añadir item de impresos o retirar pagina segun producto.
- Normalizar timestamps de auditoria en el limite del servicio frontend.

## Dependencias y migraciones

- Solicitudes PostgreSQL, certificado MongoDB y Drive.
- No migracion prevista salvo maquina de estados/versionado de archivo.

## Rollout

- Pruebas con Drive simulado; smoke controlado.
- Backend compatible primero; luego UI de estados.

## Definition of Done

- `CA-CERT-001..005`, guards, reintento, auditoria y consistencia cubiertos.

