# Modulo Certificados - Plan

## Enfoque

- Confirmar contrato DELETE y estados reales antes de tocar UI.
- Unificar generacion/upload/reemplazo con resultado tipado.
- Mantener compensacion backend en firma y hacerla idempotente.
- Añadir item de impresos o retirar pagina segun producto.
- Normalizar timestamps de auditoria en el limite del servicio frontend.
- Mantener React PDF `4.6.1`, Textkit `6.4.1` y Fontkit `2.0.4` fijados mientras se aplica el parche upstream de preservacion de `codePoints`.

## Dependencias y migraciones

- Solicitudes PostgreSQL, certificado MongoDB, Drive y parche temporal `patch-package` para Textkit.
- No migracion prevista salvo maquina de estados/versionado de archivo.

## Rollout

- Pruebas con Drive simulado; smoke controlado.
- Backend compatible primero; luego UI de estados.
- Retirar el parche solo despues de actualizar a una version oficial que incluya el PR `#3405` y superar `TEST-CERT-010`.

## Definition of Done

- `CA-CERT-001..007`, guards, reintento, auditoria, transiciones, integridad tipografica y consistencia cubiertos.

