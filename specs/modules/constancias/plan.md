# Modulo Constancias - Plan

## Resumen

Constancias combina formulario, generacion de documento, upload y cambios de estado. Requiere reglas claras de transicion para no mezclar fases administrativas.

## Fases

1. Confirmar contrato CRUD de constancias.
2. Confirmar contrato de upload y firma.
3. Documentar estados y transiciones.
4. Probar formularios, uploads y acciones administrativas.

## Dependencias

- `modules/constancias/constancias.service.ts`
- `modules/constancias/validation.schema.ts`
- `services/upload.service.ts`
- Catalogos de solicitudes y estructura

## Riesgos y aclaraciones

- Los estados `aceptado` e `impreso` hoy son booleanos; si el flujo crece puede requerir una maquina de estados mas explicita.
- El upload y la firma dependen de servicios externos.
- Un error de archivo puede dejar la constancia en estado parcial.

## Tareas tecnicas

- Revisar naming de estados operativos
- Revisar reemplazo de archivos y `fileId`
- Agregar pruebas negativas de upload y firma
- Documentar dependencias con solicitudes
