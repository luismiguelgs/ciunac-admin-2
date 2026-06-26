# Modulo Solicitudes - Spec

## Objetivo

Gestionar solicitudes entrantes de becas, constancias y examen de ubicacion, ademas del flujo administrativo de rechazo, actualizacion de estado e importacion de pagos.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permisos de solicitudes o importacion

## Reglas de negocio

- Las solicitudes se listan por tipo y estado.
- El rechazo usa `PATCH /solicitudes/:id/rechazo`.
- La edicion de solicitudes actualiza estado, idioma, nivel, voucher, pago y observaciones.
- La importacion de pagos usa archivo CSV.
- Las solicitudes de beca usan un recurso dedicado y fuerzan mayusculas en nombres/direccion y el periodo actual.

## Criterios de aceptacion

- Se pueden listar solicitudes por tipo y estado.
- Se puede ver el detalle de una solicitud.
- Se puede editar una solicitud administrativa.
- Se puede rechazar una solicitud.
- Se puede importar un CSV de pagos.
- Se pueden crear, listar y consultar solicitudes de beca.

## Endpoints necesarios

- `GET /solicitudes/:tipo?estado=:id`
- `GET /solicitudes/:id`
- `PATCH /solicitudes/:id`
- `PATCH /solicitudes/:id/rechazo`
- `POST /pagos-banco/upload`
- `GET /solicitudbecas`
- `POST /solicitudbecas`
- `GET /solicitudbecas/:id`
- `PATCH /solicitudbecas/:id`
- `DELETE /solicitudbecas/:id`
- `GET /solicitudbecas/documento/:dni`

## Modelo de datos relacionado

- `ISolicitud`
- `ISolicitudBeca`
- Catalogos de `ITipoSolicitud`, `IEstado`, `IIdioma`, `INivel`

## Validaciones

- `tipoSolicitudId`, `estadoId`, `idiomaId`, `nivelId` obligatorios en detalle de constancias
- `numeroVoucher` obligatorio
- `pago >= 0`
- `fechaPago` valida
- CSV requerido para importacion de pagos
- En becas, numero de documento, facultad, escuela, codigo y archivos obligatorios segun flujo de negocio

## Errores posibles

- Solicitud inexistente
- Error al actualizar o rechazar
- CSV de pagos invalido
- Busqueda de beca sin resultados
- Permiso faltante para importar pagos

## Tareas tecnicas

- Homogeneizar contratos entre solicitudes genericas y becas
- Tipar mejor estados de error en servicios
- Documentar reglas de estado por tipo de solicitud
- Cubrir importacion de pagos con pruebas

## Pruebas

- Listado por estado
- Edicion de detalle
- Rechazo de solicitud
- Importacion de pagos
- CRUD de becas
