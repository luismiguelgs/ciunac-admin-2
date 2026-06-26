# 00 - Overview

## Producto

CIUNAC Admin es una aplicacion web administrativa para el Centro de Idiomas de la Universidad Nacional del Callao. Su objetivo es centralizar operaciones academicas y administrativas relacionadas con solicitudes, examenes de ubicacion, constancias, grupos, usuarios, estructura academica y seguimiento docente.

## Proposito de esta documentacion

Esta documentacion inicia un proceso de spec-driven development para evolucionar la aplicacion con una nueva capacidad: publicar documentos oficiales de resultados de Examen de Ubicacion agrupados por periodo e idioma.

El objetivo es definir primero el comportamiento esperado, los requisitos, los roles, los flujos y las pantallas antes de escribir codigo.

## Alcance principal

La funcionalidad prioritaria es permitir que un usuario autorizado, desde la lista de Examenes de Ubicacion, genere y publique un documento PDF de resultados para un periodo especifico.

El documento debe:

- Incluir solo examenes de ubicacion.
- Agrupar examenes del mismo periodo.
- Consolidar todos los idiomas disponibles para ese periodo.
- Mostrar resultados por idioma.
- Seguir un formato institucional similar al documento de referencia.
- Quedar disponible para visualizacion o descarga.

## Contexto actual de la aplicacion

La aplicacion esta construida con Next.js y consume un backend mediante una API configurada por variables de entorno. La autenticacion usa sesion de usuario y token de acceso. El control de acceso se basa en roles y permisos por ruta.

Modulos visibles en el proyecto:

- Autenticacion y registro.
- Dashboard administrativo.
- Solicitudes de becas, constancias y examen de ubicacion.
- Importacion de pagos.
- Examenes de ubicacion.
- Constancias.
- Usuarios.
- Grupos.
- Estructura academica.
- Perfil docente y seguimiento docente.

## Usuarios principales

- Superadministrador.
- Personal administrativo autorizado.
- Docente.
- Usuario con contexto docente.

La nueva funcionalidad esta orientada principalmente a usuarios administrativos con permiso sobre Examenes de Ubicacion.

## Principios de producto

- Primero exactitud academica, luego comodidad operativa.
- No mezclar datos de periodos distintos.
- No publicar resultados incompletos sin advertencia.
- Mantener trazabilidad de documentos generados y publicados.
- Respetar permisos por rol y por modulo.
- Priorizar interfaces claras para operaciones repetitivas.

## Supuestos iniciales

- Cada examen de ubicacion tiene un periodo asociado.
- Cada examen pertenece a un idioma.
- Los resultados de participantes se almacenan como detalle del examen.
- El nivel de ubicacion puede calcularse o leerse desde la calificacion registrada.
- El backend sera la fuente de verdad para examenes, participantes, periodos, idiomas y documentos publicados.
- La aplicacion web puede generar, solicitar generacion o visualizar PDFs segun se defina en implementacion.

## Fuera de alcance inicial

- Redisenar todos los modulos existentes.
- Cambiar el modelo general de autenticacion.
- Cambiar la gestion general de solicitudes.
- Publicar resultados de examenes que no sean de ubicacion.
- Crear portal publico anonimo para consulta de resultados, salvo que se defina en una fase posterior.

## Documentos de especificacion

- `docs/01-product-spec.md`: especificacion de producto.
- `docs/02-functional-requirements.md`: requisitos funcionales.
- `docs/03-non-functional-requirements.md`: requisitos no funcionales.
- `docs/04-user-roles-permissions.md`: roles y permisos.
- `docs/05-user-flows.md`: flujos de usuario.
- `docs/06-ui-pages.md`: pantallas y comportamiento UI.
- `docs/10-frontend-architecture.md`: arquitectura frontend y mapa de modulos.
- `docs/11-auth-security.md`: autenticacion, autorizacion y controles de seguridad.
- `docs/12-validation-rules.md`: reglas de validacion y contratos de entrada.
- `docs/13-error-handling.md`: manejo de errores, logging y recuperacion.
- `docs/14-testing-plan.md`: estrategia de pruebas y matriz de cobertura.
- `docs/15-deployment.md`: despliegue, configuracion y checklist operativo.

## Estructura de specs por modulo

Los modulos funcionales se documentan en:

- `specs/modules/usuarios/`
- `specs/modules/estructura/`
- `specs/modules/grupos/`
- `specs/modules/seguimiento-docente/`
- `specs/modules/solicitudes/`
- `specs/modules/constancias/`
- `specs/modules/examen-ubicacion/`
