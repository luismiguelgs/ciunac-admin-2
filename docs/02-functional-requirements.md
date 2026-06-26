# 02 - Functional Requirements

## Convenciones

- `FR`: functional requirement.
- `MVP`: requerido para la primera entrega.
- `Futuro`: no requerido para la primera entrega, pero debe considerarse en diseno.

## Autenticacion y acceso

### FR-001 - Acceso autenticado

La aplicacion debe permitir el acceso al modulo de Examen de Ubicacion solo a usuarios autenticados.

Prioridad: MVP.

### FR-002 - Permiso de modulo

La aplicacion debe validar que el usuario tenga permiso para acceder a Examenes de Ubicacion.

Permiso actual esperado: `examenes_ubicacion`.

Prioridad: MVP.

### FR-003 - Bloqueo por rol sin permiso

La aplicacion debe impedir que roles sin permiso operativo publiquen documentos de resultados.

Prioridad: MVP.

## Lista de Examenes de Ubicacion

### FR-004 - Visualizar lista de examenes

El usuario autorizado debe poder visualizar la lista de Examenes de Ubicacion con codigo, estado, fecha, idioma, docente, aula y acciones disponibles.

Prioridad: MVP.

### FR-005 - Identificar periodo del examen

Cada examen de ubicacion usado para publicacion debe tener un periodo identificable.

Prioridad: MVP.

### FR-006 - Accion de generar/publicar resultados

La lista de Examenes de Ubicacion debe ofrecer una accion para generar o publicar el documento de resultados por periodo.

Prioridad: MVP.

## Generacion del documento

### FR-007 - Seleccionar periodo

El usuario debe poder seleccionar el periodo para el cual desea generar el documento, o iniciar la accion desde un examen y confirmar el periodo asociado.

Prioridad: MVP.

### FR-008 - Filtrar examenes por periodo

El sistema debe obtener solo los examenes de ubicacion asociados al periodo seleccionado.

Prioridad: MVP.

### FR-009 - Excluir otros tipos de examen

El sistema no debe incluir examenes que no correspondan a Examen de Ubicacion.

Prioridad: MVP.

### FR-010 - Agrupar por idioma

El sistema debe agrupar los resultados por idioma dentro del documento.

Prioridad: MVP.

### FR-011 - Incluir participantes terminados

El sistema debe incluir participantes con resultados validos para publicacion. La regla minima sugerida es incluir participantes con registro de nota y nivel de ubicacion.

Prioridad: MVP.

### FR-012 - Validar ausencia de resultados

Si no existen resultados para el periodo seleccionado, el sistema debe mostrar un mensaje claro y no debe generar un documento vacio.

Prioridad: MVP.

### FR-013 - Validar resultados incompletos

Si existen examenes o participantes incompletos, el sistema debe advertir al usuario antes de publicar.

Prioridad: MVP.

### FR-014 - Generar PDF institucional

El sistema debe generar un PDF con portada, periodo, idiomas incluidos, escala de niveles si aplica, resultados por idioma y pie institucional.

Prioridad: MVP.

### FR-015 - Nombre de archivo

El documento generado debe tener un nombre que incluya tipo de documento y periodo.

Ejemplo sugerido: `resultados-examen-ubicacion-2026-05.pdf`.

Prioridad: MVP.

## Vista previa y publicacion

### FR-016 - Vista previa

El usuario debe poder revisar el documento antes de publicarlo.

Prioridad: MVP.

### FR-017 - Publicar documento

El usuario autorizado debe poder publicar el documento generado para el periodo.

Prioridad: MVP.

### FR-018 - Confirmacion de publicacion

Antes de publicar, el sistema debe solicitar confirmacion al usuario.

Prioridad: MVP.

### FR-019 - Disponibilidad del documento

El documento publicado debe quedar disponible para visualizacion o descarga desde la lista o detalle del modulo Examen de Ubicacion.

Prioridad: MVP.

### FR-020 - Estado del documento

La interfaz debe indicar si un periodo no tiene documento, tiene borrador generado o tiene documento publicado.

Prioridad: MVP.

## Regeneracion y versionado

### FR-021 - Regenerar documento

El sistema puede permitir regenerar el documento si cambian resultados del periodo.

Prioridad: Futuro.

### FR-022 - Versionar publicaciones

El sistema puede conservar versiones anteriores cuando se publique un nuevo documento para el mismo periodo.

Prioridad: Futuro.

### FR-023 - Reemplazar publicacion vigente

Si no se implementa versionado, el sistema debe definir una regla de reemplazo explicita para la publicacion vigente.

Prioridad: MVP si se permite regeneracion.

## Auditoria

### FR-024 - Registrar usuario responsable

El backend debe registrar que usuario genero o publico el documento, si el modelo de auditoria lo permite.

Prioridad: MVP.

### FR-025 - Registrar fechas

El backend debe registrar fecha de generacion y fecha de publicacion.

Prioridad: MVP.

### FR-026 - Trazabilidad de errores

Si falla la generacion o publicacion, el sistema debe mostrar un mensaje al usuario y conservar informacion tecnica suficiente para diagnostico.

Prioridad: MVP.

## Backend/API

### FR-027 - Endpoint de consulta por periodo

El backend debe exponer o soportar una consulta que retorne examenes de ubicacion y participantes filtrados por periodo.

Prioridad: MVP.

### FR-028 - Endpoint de generacion de documento

El backend debe permitir generar o persistir el documento PDF de resultados por periodo, o entregar los datos necesarios para que la aplicacion lo genere.

Prioridad: MVP.

### FR-029 - Endpoint de publicacion

El backend debe permitir marcar un documento como publicado y devolver su metadata.

Prioridad: MVP.

### FR-030 - Endpoint de descarga

El backend debe permitir descargar o visualizar el documento publicado.

Prioridad: MVP.
