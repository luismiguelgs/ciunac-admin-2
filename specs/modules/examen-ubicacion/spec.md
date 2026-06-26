# Modulo Examen de Ubicacion - Spec

## Objetivo

Gestionar examenes de ubicacion, sus participantes, configuracion operativa y formatos asociados para soporte academico y administrativo.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permiso `examenes_ubicacion`

## Reglas de negocio

- Un examen requiere estado, fecha, aula, docente, idioma y codigo.
- El codigo puede construirse a partir de periodo, idioma y aula.
- El detalle del examen relaciona `solicitudId`, `estudianteId`, `nota`, `nivelId` y `calificacionId`.
- La configuracion del modulo incluye:
  - cronograma por modulo
  - calificaciones por ciclo
- La vista de participantes debe reflejar el estado `terminado` del detalle.

## Criterios de aceptacion

- Se puede listar examenes de ubicacion.
- Se puede crear y editar un examen.
- Se puede consultar un examen con sus detalles.
- Se pueden listar participantes globales o por examen.
- Se puede crear, editar o eliminar detalles de examen.
- Se puede mantener cronograma y tablas de calificacion.

## Endpoints necesarios

- `GET /examenesubicacion`
- `GET /examenesubicacion/:id`
- `POST /examenesubicacion`
- `PATCH /examenesubicacion/:id`
- `DELETE /examenesubicacion/:id`
- `GET /detallesubicacion`
- `GET /detallesubicacion/examen/:examenId`
- `POST /detallesubicacion`
- `PATCH /detallesubicacion/:id`
- `DELETE /detallesubicacion/:id`
- `GET /cronogramaubicacion`
- `POST /cronogramaubicacion`
- `PATCH /cronogramaubicacion/:id`
- `DELETE /cronogramaubicacion/:id`
- `GET /calificacionesubicacion`
- `POST /calificacionesubicacion`
- `PATCH /calificacionesubicacion/:id`
- `DELETE /calificacionesubicacion/:id`

## Modelo de datos relacionado

- `IExamenUbicacion`
- `IDetalleExamenUbicacion`
- `ICronogramaUbicacion`
- `ICalificacionUbicacion`

## Validaciones

- `estadoId`, `fecha`, `aulaId`, `docenteId`, `idiomaId`, `codigo` obligatorios
- `examenId`, `solicitudId`, `estudianteId` obligatorios en detalles
- `notaMin <= notaMax` en calificaciones
- `moduloId` y `fecha` obligatorios en cronograma

## Errores posibles

- Examen no encontrado
- Participantes vacios
- Error de configuracion de cronograma o calificaciones
- Permiso faltante
- Codigo generado inconsistente

## Tareas tecnicas

- Mantener `formSchema` del examen como contrato unico
- Tipar acciones de participantes y configuracion
- Definir validaciones faltantes para detalle, cronograma y calificaciones
- Cubrir flujo administrativo completo con pruebas

## Pruebas

- CRUD de examen
- CRUD de detalle
- Configuracion de cronograma
- Configuracion de calificaciones
- Proteccion por permiso
