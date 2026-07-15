# 01 - Product Spec

## Vision

Ofrecer una plataforma administrativa unica, trazable y segura para operar procesos academicos y documentarios de CIUNAC, reduciendo tareas manuales y manteniendo una experiencia diferenciada para personal administrativo y docentes.

## Problemas que resuelve

- Informacion distribuida entre sistemas, archivos y operaciones manuales.
- Seguimiento debil del estado de solicitudes y documentos.
- Configuraciones academicas reutilizadas por varios procesos sin una vista central.
- Falta de trazabilidad uniforme entre solicitud, documento, firma y entrega.
- Experiencias administrativas y docentes que comparten plataforma, pero requieren permisos y contexto distintos.

## Actores

| Actor | Necesidad principal |
| --- | --- |
| `SUPERADMIN` | Configurar y supervisar todo el sistema |
| `ADMINISTRATIVO` | Ejecutar operaciones autorizadas sobre solicitudes, estructura, grupos y seguimiento |
| `DOCENTE` | Consultar su perfil, resultados y encuestas con contexto docente valido |
| Estudiante | Actor indirecto cuyos datos originan solicitudes, certificados, constancias y examenes |
| Sistemas externos | Q10, Google Drive, correo, PostgreSQL y MongoDB |

## Objetivos

- Centralizar catalogos y operaciones academicas.
- Controlar acceso por rol, permiso y contexto.
- Mantener continuidad entre solicitudes y documentos emitidos.
- Producir documentos PDF y archivos verificables.
- Dar trazabilidad desde requisito hasta prueba y despliegue.

## Epics

| Epic | Resultado esperado |
| --- | --- |
| `EP-AUTH` | Acceso seguro y experiencia correcta por rol |
| `EP-PLAT` | Usuarios y estructura academica administrables |
| `EP-GRP` | Grupos creados, editados o importados desde fuentes autorizadas |
| `EP-SOL` | Solicitudes registradas y gestionadas mediante estados controlados |
| `EP-DOC` | Certificados y constancias emitidos, firmados y entregados |
| `EP-EXU` | Examenes de ubicacion configurados, ejecutados y reportados |
| `EP-SDOC` | Perfiles, documentos, encuestas y resultados docentes consultables |

## Capacidades del producto

- Login y registro de usuarios.
- Dashboard administrativo y dashboard de seguimiento docente.
- CRUD de usuarios y catalogos academicos.
- CRUD e importacion de grupos.
- Registro manual y consulta de solicitudes.
- Importacion y verificacion de pagos.
- Emision de certificados y constancias con PDF y firma.
- Gestion de examenes, participantes, actas y resultados de ubicacion.
- Gestion de docentes, perfiles, documentos, encuestas, cumplimiento y ranking.

## Indicadores

- Porcentaje de rutas sensibles con permiso frontend y guard backend documentado.
- Porcentaje de flujos criticos cubiertos por pruebas automatizadas.
- Solicitudes sin transicion de estado inconsistente.
- Documentos emitidos con solicitud y archivo asociado validos.
- Errores de login diferenciados entre credenciales, permisos y contexto.
- Tiempo de recuperacion ante fallos de API o upload.

## Principios

- El backend es autoridad final de datos y autorizacion.
- Ocultar una accion en UI no equivale a protegerla.
- Las transiciones de negocio deben ser atomicas o compensables.
- Los catalogos tienen identificadores; el texto visible no debe ser la unica regla.
- Los cambios de contrato se documentan antes de implementarse.

## Fuera de alcance documental

- Portal publico anonimo para estudiantes.
- Rediseño visual integral.
- Sustitucion de Q10, Google Drive o proveedores de correo.
- Migracion inmediata de PostgreSQL o MongoDB.

## Decisiones registradas

- `DECISION-001`: confirmar si `ADMINISTRATIVO` debe poder operar certificados, constancias, solicitudes y examen de ubicacion. El codigo actual lo bloquea por rol aunque posea permiso.
- `DECISION-002`: confirmar si el registro publico `/registro` debe permanecer habilitado en produccion.
- `DECISION-003`: definir propietario operativo de despliegue backend y procedimiento formal de migraciones.
