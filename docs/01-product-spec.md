# 01 - Product Spec

## Nombre de la iniciativa

Publicacion de resultados de Examen de Ubicacion por periodo.

## Problema

El Centro de Idiomas necesita publicar documentos oficiales de resultados para los Examenes de Ubicacion. Actualmente el documento de referencia agrupa resultados por idioma y periodo, pero se requiere que el flujo dentro de la aplicacion permita generar un documento enfocado solo en Examen de Ubicacion.

El proceso debe evitar errores frecuentes como mezclar examenes de distintos periodos, omitir idiomas del periodo o incluir registros de otros tipos de examen.

## Objetivo de producto

Permitir que el personal autorizado genere, revise y publique un PDF oficial de resultados de Examen de Ubicacion para un periodo, consolidando en un unico documento todos los idiomas evaluados en ese periodo.

## Resultado esperado

Un documento PDF institucional, asociado a un periodo, disponible desde el modulo de Examen de Ubicacion para visualizacion o descarga.

## Usuarios objetivo

### Usuario primario

Personal administrativo o superadministrador responsable de gestionar Examenes de Ubicacion y publicar resultados.

### Usuarios secundarios

- Coordinacion academica que revisa resultados antes de su publicacion.
- Personal de atencion que descarga o comparte documentos publicados.
- Docentes o responsables academicos que necesitan validar informacion de resultados.

## Historia principal

Como administrador del Centro de Idiomas, quiero publicar un documento PDF de resultados desde la lista de Examenes de Ubicacion, agrupado por periodo, para comunicar oficialmente los resultados de todos los idiomas evaluados en ese mismo periodo.

## Alcance MVP

- Accion para generar documento desde la lista de Examenes de Ubicacion.
- Seleccion o deteccion del periodo.
- Agrupacion de examenes por periodo.
- Consolidacion de resultados de todos los idiomas del periodo.
- Vista previa o descarga del PDF generado.
- Publicacion del documento para que quede disponible en el modulo.
- Validacion cuando no existan resultados publicables.

## Alcance futuro

- Versionado formal de documentos publicados.
- Flujo de aprobacion antes de publicar.
- Firma digital o sello institucional.
- Publicacion en portal externo.
- Notificacion automatica a estudiantes.
- Historial de descargas y visualizaciones.

## Reglas de producto

- Un documento corresponde a un solo periodo.
- Un periodo puede incluir varios idiomas.
- El documento debe mostrar secciones separadas por idioma.
- Solo se incluyen examenes de ubicacion.
- Los examenes de otros periodos no se incluyen.
- Los datos publicados deben corresponder a resultados terminados o aprobados segun regla academica.
- Si el documento ya existe para el periodo, el sistema debe definir si se reemplaza, versiona o bloquea una nueva publicacion.

## Datos clave del dominio

### Periodo

Unidad academica o administrativa usada para agrupar examenes. Ejemplo: `2026-05`.

### Examen de Ubicacion

Registro que representa una evaluacion de ubicacion. Tiene codigo, fecha, estado, idioma, docente, aula y participantes.

### Participante

Estudiante asociado a un examen. Tiene datos personales, nota, nivel ubicado, calificacion y estado de culminacion.

### Idioma

Categoria academica del examen. El informe debe agrupar resultados por idioma.

### Documento publicado

Archivo PDF generado para un periodo. Debe tener estado, fecha de generacion, fecha de publicacion y usuario responsable si el backend lo soporta.

## Ciclo de vida sugerido del documento

1. Sin generar.
2. Generado como borrador.
3. Revisado.
4. Publicado.
5. Reemplazado o archivado, si se permite regeneracion.

## Indicadores de exito

- El administrador puede generar el documento sin manipular datos manualmente.
- El documento incluye todos los idiomas del periodo seleccionado.
- No aparecen registros de otros periodos.
- El PDF tiene formato institucional consistente.
- El documento publicado se puede visualizar o descargar desde la aplicacion.

## Riesgos de producto

- Periodos no normalizados o ausentes en examenes existentes.
- Diferencias entre nota, calificacion y nivel de ubicacion.
- Publicacion accidental de resultados incompletos.
- Falta de definicion sobre reemplazo o versionado del PDF.
- Inconsistencia entre datos mostrados en pantalla y datos incluidos en PDF.

## Decisiones pendientes

- Si la publicacion ocurre automaticamente al generar el PDF o requiere confirmacion.
- Si se permite regenerar un documento ya publicado.
- Si se versionan documentos publicados por periodo.
- Si la escala de niveles se muestra siempre o solo para idiomas incluidos.
- Si el PDF debe incluir firma, sello, fecha de publicacion o usuario responsable.
- Si estudiantes o usuarios externos podran acceder al documento publicado.
