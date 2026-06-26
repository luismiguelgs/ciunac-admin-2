# Modulo Solicitudes - Plan

## Resumen

Solicitudes mezcla flujos administrativos transaccionales y una excepcion de dominio para becas. La documentacion debe mantener separados ambos contratos sin perder consistencia de estados.

## Fases

1. Confirmar contratos del recurso general `solicitudes`.
2. Confirmar recurso dedicado `solicitudbecas`.
3. Documentar reglas de estado y rechazo.
4. Documentar importacion de pagos y dependencias de archivo.
5. Probar flujos de actualizacion y rechazo.

## Dependencias

- `modules/solicitudes/shared/solicitudes.service.ts`
- `modules/solicitudes/becas/solicitud-becas.service.ts`
- Catalogos de estructura
- `services/upload.service.ts`

## Riesgos y aclaraciones

- El recurso general y el recurso de becas no siguen el mismo contrato de IDs.
- Los errores hoy se expresan como booleanos en varios servicios.
- La importacion de pagos depende de archivo y backend externo.

## Tareas tecnicas

- Unificar mensajes de error del dominio
- Revisar uso de `_id` vs `id` en becas
- Documentar ciclo de estados por tipo de solicitud
- Agregar casos negativos de CSV y rechazo
