# 04 - User Roles And Permissions

## Modelo actual

La aplicacion usa roles y permisos para controlar el acceso a rutas y funcionalidades.

Roles identificados:

- `SUPERADMIN`
- `ADMINISTRATIVO`
- `DOCENTE`

Permiso relevante para esta iniciativa:

- `examenes_ubicacion`

## Principios de autorizacion

- Todo usuario debe estar autenticado.
- `SUPERADMIN` puede acceder a todas las funcionalidades protegidas.
- Los demas roles requieren permisos explicitos.
- La UI debe ocultar o deshabilitar acciones no permitidas.
- El backend debe validar permisos en cada operacion critica.

## Roles

### SUPERADMIN

Responsable de administracion total del sistema.

Permisos esperados:

- Acceder a todos los modulos.
- Gestionar usuarios y permisos.
- Crear, editar y eliminar examenes de ubicacion.
- Generar, revisar, publicar, descargar y reemplazar documentos de resultados.

### ADMINISTRATIVO

Personal administrativo con acceso segun permisos asignados.

Permisos posibles:

- Acceder a Examenes de Ubicacion si tiene `examenes_ubicacion`.
- Generar documento de resultados si tiene permiso operativo.
- Publicar documento si el permiso o politica del sistema lo permite.
- Descargar documentos publicados.

Restricciones:

- No debe acceder a funcionalidades sin permiso.
- No debe publicar resultados si solo tiene permisos de lectura, si se define esa separacion.

### DOCENTE

Usuario orientado a perfil docente y seguimiento academico.

Permisos posibles:

- Acceder a vistas docentes segun contexto.

Restricciones:

- No debe publicar documentos oficiales de resultados de Examen de Ubicacion.
- No debe acceder al modulo de Examenes de Ubicacion salvo definicion futura explicita.

## Permisos sugeridos para granularidad futura

El permiso actual `examenes_ubicacion` puede ser suficiente para MVP. Para un control mas fino se sugieren estos permisos:

- `examenes_ubicacion_ver`
- `examenes_ubicacion_crear`
- `examenes_ubicacion_editar`
- `examenes_ubicacion_eliminar`
- `examenes_ubicacion_resultados_generar`
- `examenes_ubicacion_resultados_publicar`
- `examenes_ubicacion_resultados_descargar`
- `examenes_ubicacion_resultados_reemplazar`

## Matriz de permisos MVP

| Accion | SUPERADMIN | ADMINISTRATIVO con `examenes_ubicacion` | ADMINISTRATIVO sin permiso | DOCENTE |
| --- | --- | --- | --- | --- |
| Ver lista de examenes | Si | Si | No | No |
| Ver detalle de examen | Si | Si | No | No |
| Crear examen | Si | Si | No | No |
| Editar examen | Si | Si | No | No |
| Eliminar examen | Si | Si | No | No |
| Generar PDF de resultados | Si | Si | No | No |
| Vista previa de PDF | Si | Si | No | No |
| Publicar PDF | Si | Si | No | No |
| Descargar PDF publicado | Si | Si | No | No |

## Matriz de permisos futura recomendada

| Accion | Permiso sugerido |
| --- | --- |
| Ver lista y detalle | `examenes_ubicacion_ver` |
| Crear examen | `examenes_ubicacion_crear` |
| Editar examen | `examenes_ubicacion_editar` |
| Eliminar examen | `examenes_ubicacion_eliminar` |
| Generar documento | `examenes_ubicacion_resultados_generar` |
| Publicar documento | `examenes_ubicacion_resultados_publicar` |
| Descargar documento | `examenes_ubicacion_resultados_descargar` |
| Reemplazar documento publicado | `examenes_ubicacion_resultados_reemplazar` |

## Reglas de seguridad para publicacion

- Solo usuarios autorizados pueden generar documentos.
- Solo usuarios autorizados pueden publicar documentos.
- El usuario debe confirmar antes de publicar.
- El backend debe validar el permiso del usuario antes de crear o cambiar el estado de un documento.
- La publicacion debe registrar usuario y fecha.

## Estados de acceso en UI

### Sin sesion

Redirigir a login.

### Sin permiso

Redirigir a dashboard o mostrar mensaje de acceso no autorizado.

### Con permiso de lectura, sin publicacion

Mostrar documentos existentes, pero ocultar o deshabilitar acciones de generacion y publicacion.

### Con permiso completo

Mostrar acciones de generar, vista previa, publicar y descargar.

## Preguntas pendientes

- Si `ADMINISTRATIVO` con `examenes_ubicacion` puede publicar directamente o requiere permiso adicional.
- Si debe existir un rol de aprobador academico.
- Si docentes deben poder ver documentos publicados sin capacidad de publicacion.
- Si los documentos publicados seran visibles fuera del panel administrativo.
