# 02 - Functional Requirements

## Convenciones

Cada requisito se enlaza con historias, criterios, tareas y pruebas en `docs/16-traceability-and-gaps.md`. `AS-IS` describe codigo actual y `TO-BE` el contrato requerido antes de nuevas implementaciones.

## Autenticacion y dashboard

- `FR-AUTH-001` (`AS-IS`): permitir login por credenciales contra `POST /auth/login`.
- `FR-AUTH-002` (`AS-IS`): construir sesion con token, rol, permisos y contexto docente cuando aplique.
- `FR-AUTH-003` (`TO-BE`): diferenciar errores de credenciales, permisos y contexto docente.
- `FR-AUTH-004` (`AS-IS`): cerrar sesion y limpiar NextAuth y stores persistidos.
- `FR-DASH-001` (`AS-IS`): redirigir usuarios autenticados al dashboard permitido por su rol.
- `FR-DASH-002` (`TO-BE`): mostrar estados `unauthorized` y `missing-docente-context` con mensajes accionables.

## Usuarios, estructura y grupos

- `FR-USR-001`: listar, filtrar, crear, editar y eliminar usuarios autorizados.
- `FR-USR-002`: asignar rol y obtener permisos efectivos del rol.
- `FR-ESTR-001`: administrar aulas, ciclos, idiomas, niveles, modulos, periodos y textos.
- `FR-ESTR-002`: cachear catalogos y refrescarlos despues de cambios.
- `FR-GRP-001`: listar y filtrar grupos.
- `FR-GRP-002`: crear y editar grupos con referencias academicas validas.
- `FR-GRP-003`: importar grupos para un periodo seleccionado y reportar filas rechazadas.

## Solicitudes

- `FR-SOL-001`: registrar estudiante y solicitud manual sin duplicar estudiantes existentes.
- `FR-SOL-002`: consultar solicitudes por tipo y estado.
- `FR-SOL-003`: editar datos y estado de una solicitud con catalogos validos.
- `FR-SOL-004`: observar o rechazar solicitudes conservando motivo y trazabilidad.
- `FR-SOL-005`: importar pagos bancarios y actualizar solo solicitudes compatibles.
- `FR-SOL-006` (`TO-BE`): ejecutar transiciones mediante reglas de estado explicitas y no por IDs dispersos.

## Certificados y constancias

- `FR-CERT-001`: crear certificado asociado a una solicitud y sus notas.
- `FR-CERT-002`: generar, subir y reemplazar el PDF del certificado.
- `FR-CERT-003`: procesar firma y mover el documento entre estados operativos.
- `FR-CERT-004`: listar certificados pendientes, firmados e impresos.
- `FR-CONS-001`: crear constancia de matricula o notas asociada a una solicitud.
- `FR-CONS-002`: validar modalidad y horario para constancia de matricula.
- `FR-CONS-003`: generar y subir PDF de constancia.
- `FR-CONS-004`: procesar firma, impresion y entrega.
- `FR-CONS-005` (`TO-BE`): crear constancia y cambiar solicitud a asignada en una operacion atomica o compensable.

## Examen de ubicacion

- `FR-EXU-001`: administrar examenes con fecha, aula, docente, idioma, estado y codigo.
- `FR-EXU-002`: asignar solicitudes pagadas como participantes.
- `FR-EXU-003`: registrar nota, calificacion y nivel resultante.
- `FR-EXU-004`: administrar cronogramas y catalogos de calificacion.
- `FR-EXU-005`: generar acta y constancia de resultados.
- `FR-EXU-006`: generar resultados agrupados por periodo e idioma.
- `FR-EXU-007` (`TO-BE`): publicar resultados con version, responsable y fecha de publicacion.

## Seguimiento docente

- `FR-SDOC-001`: listar y administrar docentes.
- `FR-SDOC-002`: crear perfiles docentes y documentos asociados.
- `FR-SDOC-003`: mostrar indicadores y cumplimiento por modulo.
- `FR-SDOC-004`: importar y consultar encuestas, preguntas, respuestas y metricas.
- `FR-SDOC-005`: consultar ranking y detalle de resultados.
- `FR-SDOC-006`: permitir a `DOCENTE` consultar solo su perfil, resultados y encuestas con contexto valido.
- `FR-SDOC-007`: administrar catalogos de seguimiento docente.

## Requisitos transversales

- `FR-CORE-001`: cada pagina privada debe declarar permiso o excepcion documentada.
- `FR-CORE-002`: toda tabla debe mostrar carga, vacio y error cuando corresponda.
- `FR-CORE-003`: todo formulario debe preservar datos ante error de backend.
- `FR-CORE-004`: todo upload debe validar archivo y mostrar resultado parcial si los datos se guardaron pero el archivo fallo.
- `FR-CORE-005`: cada llamada API debe usar el contrato central de autenticacion y errores.
