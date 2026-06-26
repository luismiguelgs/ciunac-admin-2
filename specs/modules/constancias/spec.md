# Modulo Constancias - Spec

## Objetivo

Emitir constancias oficiales a partir de solicitudes, gestionar su estado administrativo y controlar el flujo de firma, impresion y entrega.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permiso `gestion_constancias`

## Reglas de negocio

- Una constancia pertenece a una solicitud (`id_solicitud`).
- Existen dos tipos principales:
  - `MATRICULA`
  - `NOTAS`
- Si el tipo es `MATRICULA`, `modalidad` y `horario` son obligatorios.
- El flujo operativo usa al menos estos campos de estado:
  - `aceptado`
  - `impreso`
  - `url`
  - `driveId`
- El proceso de firma requiere `constanciaId`, `fileId` y `solicitudId`.

## Criterios de aceptacion

- Se puede listar constancias por estado operativo.
- Se puede crear o editar una constancia.
- Se puede subir el archivo PDF asociado.
- Se puede procesar la firma.
- Se puede marcar una constancia como aceptada o impresa.
- Se puede consultar el detalle, incluyendo notas cuando aplique.

## Endpoints necesarios

- `GET /constancias`
- `GET /constancias/:id`
- `GET /constancias/:state`
- `POST /constancias`
- `PATCH /constancias/:id`
- `DELETE /constancias/:id`
- `PATCH /constancias/procesar-firma`
- `POST /upload/constancias`

## Modelo de datos relacionado

- `IConstancia`
- `IConstanciaDetalle`

## Validaciones

- `estudiante`, `dni`, `idioma`, `nivel`, `tipo`, `ciclo`, `id_solicitud` obligatorios
- `MATRICULA` exige `modalidad` y `horario`
- `impreso` y `aceptado` deben ser booleanos
- Los detalles de notas deben mantener `nota`, `mes`, `anio` y `aprobado`

## Errores posibles

- Solicitud asociada inexistente
- Error al subir PDF
- Error al procesar firma
- Error al marcar aceptado o impreso
- Archivo sin URL valida

## Tareas tecnicas

- Mantener `validation.schema.ts` como contrato canonico
- Definir reglas explicitas de transicion entre estados
- Unificar mensajes de error de upload y firma
- Cubrir formatos PDF y flujo administrativo

## Pruebas

- Alta y edicion de constancia
- Regla condicional por tipo `MATRICULA`
- Upload PDF
- Procesar firma
- Cambios de `aceptado` e `impreso`
