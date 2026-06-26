# Modulo Examen de Ubicacion - Plan

## Resumen

El modulo mezcla configuracion, operacion diaria y formatos de salida. La documentacion debe separar claramente examen principal, detalles de participantes y tablas de configuracion.

## Fases

1. Confirmar contratos de examen y detalle.
2. Confirmar contratos de cronograma y calificaciones.
3. Documentar reglas de codigo, estado y finalizacion.
4. Probar rutas de lista, detalle, participantes y configuracion.

## Dependencias

- `modules/examen-ubicacion/services/*.ts`
- Catalogos de estructura
- Combo de docentes
- Solicitudes de ubicacion

## Riesgos y aclaraciones

- Las reglas de calculo de nivel dependen de configuracion de calificaciones.
- Los detalles pueden quedar inconsistentes si faltan solicitud o estudiante.
- El modulo comparte lenguaje con solicitudes de ubicacion y debe conservar contratos compatibles.

## Tareas tecnicas

- Agregar schemas faltantes para detalle, cronograma y calificaciones
- Revisar generacion automatica de codigo
- Alinear mensajes de error en CRUD y configuracion
- Preparar casos felices y negativos por subflujo
