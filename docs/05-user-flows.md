# 05 - User Flows

## Flow 01 - Acceder al modulo de Examen de Ubicacion

Actor: usuario administrativo autorizado.

1. El usuario inicia sesion.
2. El sistema valida sesion y permisos.
3. El usuario ingresa al menu Examen de Ubicacion.
4. El sistema muestra la lista de examenes.
5. La lista muestra codigo, estado, fecha, idioma, docente, sala y acciones.

Resultado esperado: el usuario puede operar sobre examenes de ubicacion segun permisos.

## Flow 02 - Generar documento de resultados por periodo

Actor: usuario administrativo autorizado.

1. El usuario ingresa a la lista de Examenes de Ubicacion.
2. El usuario elige la accion de generar resultados.
3. El sistema solicita seleccionar o confirmar el periodo.
4. El usuario confirma el periodo.
5. El sistema busca examenes de ubicacion del periodo.
6. El sistema agrupa resultados por idioma.
7. El sistema valida que existan resultados publicables.
8. El sistema genera el PDF.
9. El sistema muestra una vista previa o enlace de descarga.

Resultado esperado: el usuario obtiene un PDF listo para revisar.

## Flow 03 - Publicar documento generado

Actor: usuario administrativo autorizado.

1. El usuario revisa la vista previa del PDF.
2. El usuario selecciona publicar.
3. El sistema muestra confirmacion con periodo e idiomas incluidos.
4. El usuario confirma.
5. El backend registra la publicacion.
6. El sistema marca el documento como publicado.
7. El sistema muestra opcion de visualizar o descargar el documento publicado.

Resultado esperado: el documento queda oficialmente disponible.

## Flow 04 - Descargar documento publicado

Actor: usuario autorizado.

1. El usuario ingresa a la lista de Examenes de Ubicacion.
2. El sistema muestra que existe un documento publicado para el periodo.
3. El usuario selecciona descargar o visualizar.
4. El sistema obtiene el archivo desde backend o almacenamiento.
5. El navegador abre o descarga el PDF.

Resultado esperado: el usuario accede al documento publicado.

## Flow 05 - No existen resultados para el periodo

Actor: usuario administrativo autorizado.

1. El usuario intenta generar documento para un periodo.
2. El sistema consulta examenes y participantes.
3. El sistema no encuentra resultados validos.
4. El sistema muestra mensaje de ausencia de resultados.
5. El sistema no genera PDF.

Resultado esperado: se evita publicar un documento vacio o incorrecto.

## Flow 06 - Existen resultados incompletos

Actor: usuario administrativo autorizado.

1. El usuario intenta generar documento para un periodo.
2. El sistema encuentra examenes o participantes incompletos.
3. El sistema muestra advertencia con resumen del problema.
4. El usuario puede cancelar o continuar solo si la politica lo permite.

Resultado esperado: el usuario comprende el riesgo antes de generar o publicar.

## Flow 07 - Documento ya publicado para el periodo

Actor: usuario administrativo autorizado.

1. El usuario selecciona un periodo con documento publicado.
2. El sistema muestra el estado publicado y la fecha de publicacion.
3. El usuario puede descargar el documento.
4. Si se permite regeneracion, el usuario selecciona regenerar.
5. El sistema solicita confirmacion especial.
6. El sistema crea una nueva version o reemplaza la vigente segun regla definida.

Resultado esperado: no se crean publicaciones duplicadas sin control.

## Flow 08 - Usuario sin permiso intenta acceder

Actor: usuario sin permiso.

1. El usuario intenta abrir Examenes de Ubicacion.
2. El sistema valida permisos.
3. El sistema bloquea acceso.
4. El sistema redirige o muestra mensaje de no autorizado.

Resultado esperado: el usuario no puede ver ni publicar resultados.

## Estados principales del flujo de publicacion

| Estado | Descripcion | Acciones posibles |
| --- | --- | --- |
| Sin documento | No existe PDF generado para el periodo | Generar |
| Borrador generado | Existe PDF generado pero no publicado | Vista previa, publicar, regenerar |
| Publicado | Documento oficial disponible | Ver, descargar, regenerar si aplica |
| Error | Fallo generacion o publicacion | Reintentar, revisar detalle |

## Validaciones clave

- Periodo seleccionado obligatorio.
- Existen examenes de ubicacion para el periodo.
- Existen participantes con resultados validos.
- Todos los registros incluidos pertenecen al mismo periodo.
- El usuario tiene permiso vigente.
- El documento no duplica una publicacion existente sin regla definida.
