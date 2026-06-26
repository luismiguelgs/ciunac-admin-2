# Historia de usuario: Publicacion de resultados de Examen de Ubicacion

## Objetivo

Publicar un documento PDF de resultados para Examen de Ubicacion desde la lista de examenes, agrupando todos los idiomas correspondientes a un mismo periodo.

## Historia de usuario

Como administrador del Centro de Idiomas,  
quiero publicar un documento PDF de resultados desde la lista de Examenes de Ubicacion, agrupado por periodo,  
para comunicar oficialmente los resultados de todos los idiomas evaluados en ese mismo periodo.

## Contexto

Actualmente se requiere generar un documento similar al informe de resultados de referencia, pero considerando solo los examenes de ubicacion.

Cada examen tiene un periodo asociado. El documento debe generarse por periodo y debe agrupar todos los idiomas que tengan examenes de ubicacion dentro de ese mismo periodo.

## Alcance del flujo

Desde la lista de Examenes de Ubicacion, el administrador podra generar y publicar un documento de resultados para un periodo especifico.

El sistema debe considerar unicamente examenes de tipo Ubicacion que pertenezcan al mismo periodo seleccionado. El informe resultante debe consolidar los resultados de todos los idiomas disponibles para ese periodo.

## Reglas de negocio

- Cada examen debe tener un periodo asociado.
- El informe se genera por periodo.
- Solo se deben incluir examenes de ubicacion.
- No se deben mezclar examenes de distintos periodos.
- El informe debe agrupar todos los idiomas del periodo seleccionado.
- Cada idioma debe mostrar sus postulantes y resultados en una seccion independiente.
- El periodo debe mostrarse de forma visible en la portada del documento.
- El documento publicado debe poder visualizarse o descargarse desde la lista de examenes.
- Si no existen resultados para el periodo seleccionado, el sistema debe informar que no hay resultados disponibles.

## Contenido esperado del PDF

- Portada con el titulo "Resultados del Examen de Ubicacion".
- Periodo del informe.
- Idiomas incluidos en el periodo.
- Escala de niveles por idioma, si aplica.
- Seccion de resultados por idioma.
- Tabla de estudiantes con apellidos y nombres, puntaje final y nivel de ubicacion.
- Pie institucional similar al documento de referencia.

## Criterios de aceptacion

### CA-01: Generar documento por periodo

Dado que el administrador se encuentra en la lista de Examenes de Ubicacion,  
cuando seleccione generar o publicar resultados para un periodo,  
entonces el sistema debe crear un documento PDF correspondiente a ese periodo.

### CA-02: Agrupar idiomas del mismo periodo

Dado que existen examenes de ubicacion de varios idiomas en el mismo periodo,  
cuando se genere el documento,  
entonces el informe debe incluir todos esos idiomas agrupados en el mismo PDF.

### CA-03: Excluir examenes de otros periodos

Dado que existen examenes de ubicacion de otros periodos,  
cuando se genere el informe de un periodo especifico,  
entonces esos examenes no deben aparecer en el documento.

### CA-04: Excluir otros tipos de examen

Dado que existen otros tipos de examen en el sistema,  
cuando se genere el informe,  
entonces solo deben incluirse registros de Examen de Ubicacion.

### CA-05: Publicar documento generado

Dado que el documento fue generado correctamente,  
cuando el administrador lo publique,  
entonces debe quedar disponible para consulta o descarga desde la lista de examenes.

### CA-06: Validar ausencia de resultados

Dado que no existen resultados para el periodo seleccionado,  
cuando el administrador intente generar el documento,  
entonces el sistema debe mostrar un mensaje indicando que no hay resultados disponibles.

## Consideraciones funcionales

- La accion de publicar debe estar disponible dentro del modulo o vista de Examen de Ubicacion.
- La generacion del documento debe tomar como filtro principal el periodo.
- El nombre del documento generado deberia incluir el periodo para facilitar su identificacion.
- El documento publicado debe reemplazar o actualizar la version anterior del mismo periodo, si el negocio decide permitir regeneraciones.

## Preguntas pendientes

- Definir si el documento se publica automaticamente al generarse o si requiere una accion adicional de confirmacion.
- Definir si un periodo puede tener mas de un documento publicado o si solo debe existir una version vigente.
- Definir si la escala de niveles debe mostrarse para todos los idiomas o solo para aquellos que tengan resultados en el periodo.
- Definir si el informe debe incluir firma, fecha de publicacion o usuario responsable de la publicacion.
