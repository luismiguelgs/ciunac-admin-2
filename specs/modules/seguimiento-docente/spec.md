# Modulo Seguimiento Docente - Spec

## Objetivo

Gestionar el ecosistema de seguimiento docente: dashboard, perfiles, documentos, docentes, encuestas, ranking, cumplimiento academico-administrativo y catalogos propios del dominio.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permisos del dominio docente
- `DOCENTE` con experiencia personal sobre `mi-perfil`, `mis-resultados` y `mi-encuesta`

## Reglas de negocio

- Un usuario `DOCENTE` requiere `docenteId` y `perfilId` para acceder a vistas personales.
- Cada ruta del dominio docente exige el permiso definido en `lib/access-control.ts`.
- `perfil-docente` relaciona un docente con idioma, experiencia y puntaje final.
- Los documentos de perfil se agrupan por `perfilId`.
- Las encuestas se consumen por `moduloId` y, cuando aplica, por `docenteId`.
- El cumplimiento academico-administrativo se consulta por `moduloId` y `academicoAdministrativoId`.
- Los catalogos del dominio usan colecciones independientes:
  - `tipos-documento-perfil`
  - `academico-administrativo`
  - `puntaje-academico-administrativo`

## Criterios de aceptacion

- El dashboard docente carga indicadores globales.
- Se puede listar y editar docentes.
- Se puede crear y editar perfil docente.
- Se pueden cargar y consultar documentos de perfil.
- Se pueden consultar metricas, respuestas y preguntas de encuestas.
- Un docente puede ver `mi-perfil`, `mis-resultados` y `mi-encuesta` con su contexto.
- Se pueden consultar ranking y detalle de resultados por modulo/docente.
- Se puede gestionar cumplimiento por rubro academico-administrativo.

## Endpoints necesarios

- `GET/POST/PATCH/DELETE /docentes`
- `GET /docentes/:id`
- `GET /docentes/usuario/:userId`
- `GET/POST/PATCH/DELETE /perfil-docente`
- `GET /perfil-docente/:id`
- `GET/POST/PATCH/DELETE /documentos-docente`
- `GET /documentos-docente/perfil/:perfilId`
- `GET /dashboard-docentes/*`
- `GET /encuesta-metricas-docente?moduloId=:id`
- `GET /encuesta-respuestas/buscar?docenteId=:id&moduloId=:id`
- `POST /encuesta-respuestas/upload`
- `GET/POST/PATCH/DELETE /encuesta-preguntas`
- `GET /perfil-docente-resultados/modulo/:moduloId`
- `GET /perfil-docente-resultados/docente/:docenteId`
- `GET /perfil-docente-resultados/detalle/:moduloId/:docenteId`
- `GET/POST/PATCH/DELETE /cumplimiento-docente`
- `GET /cumplimiento-docente?academicoAdministrativoId=:id&moduloId=:id`
- `GET/POST/PATCH/DELETE /tipos-documento-perfil`
- `GET/POST/PATCH/DELETE /academico-administrativo`
- `GET/POST/PATCH/DELETE /puntaje-academico-administrativo`

## Modelo de datos relacionado

- `IDocente`
- `PerfilDocente`
- `DocumentosPerfil`
- `IEncuestaMetricas`
- `IEncuestaRespuesta`
- `IPregunta`
- `IPerfilResultado`
- `DetalleResultado`
- `ICumplimientoDocente`
- `ITipoDocumentosPerfil`
- `IAreasSeguimiento`
- `IPuntajesAcademicoAdmin`

## Validaciones

- `DocenteSchema`
- `perfilDocenteSchema`
- `documentoSchema`
- Contexto docente obligatorio para vistas personales
- Validacion de CSV en upload de encuestas
- Validacion de queries `moduloId`, `docenteId`, `perfilId` antes de consumir servicios

## Errores posibles

- Falta de contexto docente
- Permiso faltante por subruta
- Perfil o documento inexistente
- CSV invalido o procesamiento fallido
- Modulo sin metricas, ranking o cumplimiento
- Catalogos de opciones vacios o inconsistentes

## Tareas tecnicas

- Mantener un mapa claro de permisos por submodulo
- Tipar mejor respuestas de servicios y tablas editables
- Normalizar manejo de contexto docente entre sesion y stores
- Definir validaciones faltantes para edicion inline
- Cubrir rutas personales y administrativas con pruebas

## Pruebas

- Auth y contexto docente
- CRUD de docentes y perfiles
- Upload y consulta de encuestas
- Consulta de ranking y detalle
- Consulta y edicion de cumplimiento
- Catalogos del dominio
