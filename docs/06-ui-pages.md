# 06 - UI Pages

## Objetivo

Definir las pantallas necesarias para soportar el flujo de publicacion de resultados de Examen de Ubicacion por periodo, dentro de la aplicacion administrativa existente.

## Pagina: Login

Ruta actual: `/`

Proposito:

- Permitir autenticacion de usuarios.
- Redirigir al dashboard o al modulo permitido segun sesion.

Estados:

- Formulario inicial.
- Credenciales invalidas.
- Cargando.
- Sesion iniciada.

## Pagina: Dashboard

Ruta actual: `/dashboard`

Proposito:

- Servir como entrada principal despues de iniciar sesion.
- Mostrar acceso a modulos segun permisos.
- Mostrar mensajes de acceso no autorizado cuando corresponda.

Estados:

- Usuario con permisos administrativos.
- Usuario docente.
- Usuario sin acceso a la ruta solicitada.

## Pagina: Lista de Examenes de Ubicacion

Ruta actual: `/examen-ubicacion`

Proposito:

- Mostrar examenes de ubicacion existentes.
- Permitir acciones sobre cada examen.
- Iniciar la generacion/publicacion de resultados por periodo.

Columnas actuales esperadas:

- Codigo.
- Estado.
- Fecha Examen.
- Idioma.
- Docente.
- Sala.
- Acciones.

Acciones actuales:

- Ver detalle.
- Eliminar examen.

Acciones nuevas sugeridas:

- Generar resultados por periodo.
- Ver documento publicado.
- Descargar documento publicado.
- Publicar documento generado.

Controles sugeridos:

- Filtro por codigo.
- Filtro por periodo.
- Filtro por idioma.
- Filtro por estado.
- Boton de generar documento por periodo.

Estados:

- Cargando examenes.
- Lista con datos.
- Lista vacia.
- Error al cargar.
- Documento no generado.
- Documento generado como borrador.
- Documento publicado.

## Pagina: Nuevo Examen de Ubicacion

Ruta actual: `/examen-ubicacion/nuevo`

Proposito:

- Crear un examen de ubicacion.

Campos relevantes para esta iniciativa:

- Codigo.
- Fecha.
- Periodo.
- Estado.
- Idioma.
- Docente.
- Aula.

Consideracion:

- El periodo debe registrarse de forma obligatoria si el examen sera usado para generar documentos por periodo.

## Pagina: Detalle de Examen de Ubicacion

Ruta actual: `/examen-ubicacion/[id]`

Proposito:

- Consultar informacion del examen.
- Gestionar o revisar participantes y resultados.

Informacion esperada:

- Codigo.
- Periodo.
- Fecha.
- Estado.
- Idioma.
- Docente.
- Aula.
- Participantes.
- Notas.
- Nivel de ubicacion.
- Estado de resultado por participante.

Acciones sugeridas:

- Actualizar estado del examen.
- Editar resultados segun permisos.
- Ir a generar documento del periodo del examen.

Estados:

- Examen cargado.
- Examen no encontrado.
- Error de carga.
- Participantes incompletos.
- Examen terminado.

## Pagina: Participantes de Examen de Ubicacion

Ruta actual: `/examen-ubicacion/participantes`

Proposito:

- Consultar o administrar participantes asociados a examenes de ubicacion.

Consideracion:

- Debe permitir identificar si un participante tiene nota, calificacion y nivel de ubicacion listos para publicacion.

## Pagina: Configuracion de Examen de Ubicacion

Ruta actual: `/examen-ubicacion/configuracion`

Proposito:

- Gestionar configuraciones del modulo.

Elementos relacionados:

- Cronograma de ubicacion.
- Calificaciones de ubicacion.
- Escalas o reglas de niveles, si aplican.

Consideracion:

- Las escalas de niveles usadas en el PDF deben provenir de configuracion o de una fuente controlada.

## Modal/Dialog: Generar Resultados por Periodo

Proposito:

- Confirmar periodo y parametros antes de generar el documento.

Contenido:

- Selector de periodo.
- Resumen de examenes encontrados.
- Idiomas incluidos.
- Cantidad de participantes con resultados.
- Advertencias de resultados incompletos.

Acciones:

- Cancelar.
- Generar vista previa.

Estados:

- Sin periodo seleccionado.
- Buscando datos.
- Datos listos.
- Sin resultados.
- Error al consultar.

## Modal/Dialog: Vista Previa del PDF

Proposito:

- Permitir revisar el documento antes de publicarlo.

Contenido:

- Vista previa embebida o enlace de apertura.
- Periodo.
- Idiomas incluidos.
- Fecha de generacion.
- Advertencias si existen.

Acciones:

- Descargar borrador.
- Regenerar.
- Publicar.
- Cerrar.

Estados:

- Generando PDF.
- PDF listo.
- Error de generacion.

## Modal/Dialog: Confirmar Publicacion

Proposito:

- Evitar publicaciones accidentales.

Contenido:

- Periodo.
- Idiomas incluidos.
- Cantidad de participantes.
- Mensaje de confirmacion indicando que el documento quedara disponible.

Acciones:

- Cancelar.
- Confirmar publicacion.

Estados:

- Confirmacion pendiente.
- Publicando.
- Publicado.
- Error de publicacion.

## Pagina o seccion: Documento Publicado

Ubicacion sugerida:

- Dentro de `/examen-ubicacion`.
- Dentro de `/examen-ubicacion/[id]`.
- O como seccion agrupada por periodo.

Proposito:

- Mostrar documento vigente para el periodo.

Datos visibles:

- Periodo.
- Estado.
- Fecha de generacion.
- Fecha de publicacion.
- Usuario responsable.
- Nombre del archivo.

Acciones:

- Ver.
- Descargar.
- Regenerar, si aplica.

## Reglas de UI

- El periodo debe estar visible en todo el flujo.
- Las acciones de publicar deben estar protegidas por confirmacion.
- Los botones de acciones criticas deben estar deshabilitados mientras se procesa.
- Los errores deben explicar que ocurrio y que puede hacer el usuario.
- La UI no debe mostrar acciones que el usuario no puede ejecutar.
- La experiencia debe funcionar correctamente en escritorio, que es el escenario principal administrativo.

## Navegacion sugerida

1. Dashboard.
2. Examen de Ubicacion.
3. Generar resultados por periodo.
4. Vista previa.
5. Confirmar publicacion.
6. Documento publicado disponible desde lista o detalle.
