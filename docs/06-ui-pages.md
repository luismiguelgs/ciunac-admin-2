# 06 - UI Pages

## Inventario de paginas

| Modulo | Ruta | Tipo | UI principal | Permiso `AS-IS` |
| --- | --- | --- | --- | --- |
| Autenticacion | `/` | Login | `LoginForm` | Publica |
| Autenticacion | `/registro` | Formulario | `RegistroForm` | Publica (`GAP-UI-001`) |
| Dashboard | `/dashboard` | Resumen | cards y reportes | Sesion |
| Estructura | `/estructura` | Tabs CRUD | opciones academicas | `gestionar_estructura` |
| Grupos | `/grupos` | Tabla | `GruposDataTable` | `gestionar_estructura` |
| Grupos | `/grupos/{id}` | Detalle/form | `GrupoForm` | `gestionar_estructura` |
| Grupos | `/grupos/nuevo` | Formulario | `GrupoForm` | `gestionar_estructura` |
| Grupos | `/grupos/importar` | Importacion | `ImportarGrupos` | `gestionar_estructura` |
| Usuarios | `/usuarios` | Tabla CRUD | `UsuariosDataTable` | `gestionar_usuarios` |
| Certificados | `/certificados` | Tabla pendientes | `CertificadosTable` | `gestion_certificados` |
| Certificados | `/certificados/{id}` | Detalle/form | `CertificadoForm` | `gestion_certificados` |
| Certificados | `/certificados/nuevo` | Formulario | `CertificadoForm` | `gestion_certificados` |
| Certificados | `/certificados/firmados` | Tabla | `CertificadosTable` | `gestion_certificados` |
| Certificados | `/certificados/impresos` | Tabla | `CertificadosTable` | `gestion_certificados` |
| Constancias | `/constancias` | Tabla pendientes | `ConstanciasTable` | `gestion_constancias` |
| Constancias | `/constancias/{id}` | Detalle/form | `ConstanciaForm` | `gestion_constancias` |
| Constancias | `/constancias/nueva` | Formulario | `ConstanciaForm` | `gestion_constancias` |
| Constancias | `/constancias/firmadas` | Tabla | `ConstanciasTable` | `gestion_constancias` |
| Constancias | `/constancias/entregadas` | Tabla | `ConstanciasTable` | `gestion_constancias` |
| Examen ubicacion | `/examen-ubicacion` | Tabla | `ExamenesUbicacionTable` | `examenes_ubicacion` |
| Examen ubicacion | `/examen-ubicacion/{id}` | Detalle | `ExamenDetail` | `examenes_ubicacion` |
| Examen ubicacion | `/examen-ubicacion/nuevo` | Formulario | `ExamenForm` | `examenes_ubicacion` |
| Examen ubicacion | `/examen-ubicacion/participantes` | Tabla | `ParticipantsGlobalTable` | `examenes_ubicacion` |
| Examen ubicacion | `/examen-ubicacion/configuracion` | Tabs CRUD | cronograma y calificaciones | `examenes_ubicacion` |
| Seguimiento | `/perfil-docente` | Dashboard | indicadores | `dashboard_docente` |
| Seguimiento | `/perfil-docente/{id}` | Detalle perfil | perfil/documentos | regla por prefijo |
| Seguimiento | `/perfil-docente/nuevo` | Formulario | `PerfilDocenteForm` | `dashboard_docente` por prefijo (`GAP-UI-002`) |
| Seguimiento | `/perfil-docente/documentos` | Tabla | `PerfilesDataTable` | `perfil_docente` |
| Seguimiento | `/perfil-docente/docentes` | Tabla | `DocentesDataTable` | `gestion_docentes` |
| Seguimiento | `/perfil-docente/docentes/{id}` | Formulario | `DocenteForm` | `gestion_docentes` |
| Seguimiento | `/perfil-docente/docentes/nuevo` | Formulario | `DocenteForm` | `gestion_docentes` |
| Seguimiento | `/perfil-docente/academico-administrativo` | Tabs/tabla | cumplimiento | `cumplimiento_docente` |
| Seguimiento | `/perfil-docente/encuestas` | Tabla | respuestas | `encuesta_respuestas` |
| Seguimiento | `/perfil-docente/encuestas/{id}` | Detalle | respuestas detalle | `encuesta_respuestas` |
| Seguimiento | `/perfil-docente/encuestas/importar` | Importacion | `ImportarEncuesta` | `encuesta_preguntas` |
| Seguimiento | `/perfil-docente/encuestas/preguntas` | Tabla editable | `PreguntasDataTable` | `encuesta_preguntas` |
| Seguimiento | `/perfil-docente/encuestas/mi-encuesta` | Tabla personal | respuestas propias | `mi_encuesta_respuestas` + contexto |
| Seguimiento | `/perfil-docente/mi-perfil` | Perfil personal | perfil/documentos | `mi_perfil_docente` + contexto |
| Seguimiento | `/perfil-docente/mis-resultados` | Resultados personales | graficos/detalle | `mi_perfil_docente_resultados` + contexto |
| Seguimiento | `/perfil-docente/opciones` | Tabs CRUD | catalogos propios | `puntaje_academico_administrativo` |
| Seguimiento | `/perfil-docente/ranking-docentes` | Tabla | `RankingDataTable` | `perfil_docente_resultados` |
| Seguimiento | `/perfil-docente/ranking-docentes/{id}` | Detalle | graficos y pilares | `perfil_docente_resultados` |
| Solicitudes | `/solicitudes/nueva` | Formulario | `NuevaSolicitudForm` | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/becas` | Tabla | `SolicitudBecasTable` | `gestion_becas` |
| Solicitudes | `/solicitudes/becas/{id}` | Detalle | beca | `gestion_becas` por prefijo |
| Solicitudes | `/solicitudes/certificados` | Tabla/estados | tabla compartida | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/certificados/{id}` | Detalle/form | `SolicitudDetails` | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/constancias` | Tabla/estados | tabla compartida | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/constancias/{id}` | Detalle/form | `SolicitudDetails` | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/ubicacion` | Tabla/estados | tabla compartida | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/ubicacion/{id}` | Detalle/form | `SolicitudDetails` | `gestion_solicitudes` |
| Solicitudes | `/solicitudes/importar-pagos` | Importacion | `ImportarPagos` | `importar_pagos` |

## Componentes compartidos

- Formularios: `InputField`, `SelectField`, `ComboField`, `DatePickerField`, `RadioGroupField`, `SwitchField`, `TextareaField`, `UploadField`.
- Tablas: `DataTable`, `DataTableEditable`, paginacion, selector de columnas y skeleton.
- Navegacion: sidebar, breadcrumbs, tabs y botones de retorno.
- Feedback: Sonner, dialogs de confirmacion, estados empty/loading y preview PDF.

## Formularios y validacion visual

Los 18 archivos de formulario/schema son:

- Compartidos: `components/login-form.tsx`, `components/registro-form.tsx`.
- Grupos: `grupo.form.tsx`, `grupo.schema.ts`, `import.form.tsx`.
- Solicitudes: `nueva-solicitud.form.tsx`, `nueva-solicitud.schema.ts`.
- Certificados: `certificado.form.tsx`, `certificado.schema.ts`.
- Constancias: `constancia.form.tsx`, `validation.schema.ts`.
- Examen: `examen-form.tsx`.
- Docentes: `docente.form.tsx`, `docente.schema.tsx`.
- Perfil docente: `perfil-docente.form.tsx`, `perfil-docente.schema.ts`, `documento.form.tsx`, `documento.schema.ts`.

- Error de campo debe aparecer junto al control.
- Error de API debe usar toast y conservar valores.
- Submit debe deshabilitarse durante la operacion.
- Upload debe indicar archivo, progreso y error parcial.
- `GAP-UI-003`: varias tablas editables validan implicitamente y no poseen schema dedicado.

## Tablas y filtros

Los 22 archivos de tabla/datatable son:

- Compartidos: `data-table.tsx`, `data-table-editable.tsx`, `components/ui/table.tsx`.
- Usuarios: `usuarios-datatable.tsx`.
- Grupos: `grupos-data-table.tsx`.
- Solicitudes: tabla compartida, becas, certificados, constancias y ubicacion.
- Certificados: certificados y notas.
- Constancias: constancias y detalle de notas.
- Examen: examenes y participantes globales.
- Seguimiento: docentes, perfiles, preguntas, respuestas, metricas y ranking.

- El patron compartido ofrece filtro por una columna, paginacion y visibilidad de columnas.
- Cada spec declara columna filtrada, acciones, estados y permisos visibles.
- `GAP-UI-004`: no existe una politica uniforme de filtros multiples, persistencia o busqueda remota.

## Estado y consumo de API

- Paginas server cargan datos directamente mediante servicios.
- Componentes client usan servicios, hooks y estado local.
- NextAuth es fuente de sesion; Zustand replica auth y contexto docente.
- Stores de opciones cachean catalogos en `sessionStorage`.

## Brechas de navegacion

- `GAP-UI-001`: `/registro` es publica y debe confirmarse si corresponde en produccion.
- `GAP-UI-002`: algunas subrutas de perfil dependen de permisos heredados por prefijo, no de regla exacta.
- `GAP-UI-005`: breadcrumbs enlazan a `/solicitudes`, pero no existe `app/(main)/solicitudes/page.tsx`.
- `GAP-UI-006`: existe `/certificados/impresos`, pero no aparece en el sidebar actual.
