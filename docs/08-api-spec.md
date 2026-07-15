# 08 - API Spec

## Convenciones generales

- Base URL: `NEXT_PUBLIC_API_URL`.
- JSON: `Content-Type: application/json`.
- Frontend envia `x-api-key` y, cuando existe sesion, `Authorization: Bearer <token>`.
- Uploads usan `FormData`.
- `apiFetch` devuelve JSON, texto o objeto vacio para respuesta sin body.
- `GAP-API-001`: no existe envelope uniforme de exito/error.

## Autenticacion

| ID | Metodo y ruta | Entrada | Respuesta usada | Guard `AS-IS` |
| --- | --- | --- | --- | --- |
| `API-AUTH-001` | `POST /auth/login` | email, password | `access_token`, usuario/rol | Publico |
| `API-AUTH-002` | `POST /auth/register` | usuario y password | usuario creado | Publico |
| `API-AUTH-003` | `POST /auth/logout` | sesion | confirmacion | JWT + API Key |
| `API-AUTH-004` | `GET /auth/profile` | bearer token | perfil autenticado | JWT + API Key |
| `API-AUTH-005` | `GET /rol-permisos/rol/:rol` | rol | permisos del rol | API Key + JWT + Permissions |
| `API-AUTH-006` | `GET /docentes/usuario/:usuarioId` | usuarioId | docente y perfil | API Key |

`GAP-API-002`: durante `authorize`, la carga de permisos usa un endpoint protegido por JWT; debe comprobarse que recibe el token correcto y que no rompe el login inicial.

## Usuarios, estructura y grupos

| ID | Rutas | Operaciones | Consumidor |
| --- | --- | --- | --- |
| `API-USR-001` | `/usuarios`, `/usuarios/:id` | GET, POST/registro, PATCH, DELETE | usuarios |
| `API-ESTR-001` | `/aulas`, `/ciclos`, `/idiomas`, `/niveles`, `/modulos` | CRUD | opciones generales |
| `API-ESTR-002` | `/modulos/visibles` | GET | selector de periodo/modulo |
| `API-ESTR-003` | `/estados`, `/tipossolicitud`, `/textos` | CRUD/consulta | solicitudes y configuracion |
| `API-GRP-001` | `/grupos`, `/grupos/:id` | CRUD | grupos |
| `API-GRP-002` | `/q10/horarios-cursos?periodo=:periodo` | GET | preview de importacion |
| `API-GRP-003` | `/q10/horarios-cursos` | POST | importar periodo |

Los controladores CRUD anteriores usan principalmente `ApiKeyGuard`. Usuarios y rol-permisos agregan JWT y `PermissionsGuard`.

## Solicitudes y pagos

| ID | Metodo y ruta | Uso |
| --- | --- | --- |
| `API-SOL-001` | `POST /solicitudes` | crear solicitud |
| `API-SOL-002` | `GET /solicitudes/:id` | detalle |
| `API-SOL-003` | `PATCH /solicitudes/:id` | editar o cambiar estado |
| `API-SOL-004` | `PATCH /solicitudes/:id/rechazo` | rechazo |
| `API-SOL-005` | `GET /solicitudes/certificados?estado=:id` | lista por estado |
| `API-SOL-006` | `GET /solicitudes/constancias?estado=:id` | lista por estado |
| `API-SOL-007` | `GET /solicitudes/examenes-ubicacion?estado=:id` | lista por estado |
| `API-SOL-008` | `GET/POST/PATCH/DELETE /solicitudbecas` | expedientes de beca |
| `API-SOL-009` | `GET/POST/PATCH /estudiantes` y `GET /estudiantes/buscar/:dni` | reutilizar estudiante |
| `API-SOL-010` | `POST /pagos-banco/upload` | importar CSV |
| `API-SOL-011` | `POST /pagos-banco/reverify` | reverificar pagos |

`AS-IS`: solicitudes, becas, estudiantes y pagos se protegen principalmente con API Key. `TO-BE`: mutaciones requieren JWT y permiso del dominio.

## Certificados y constancias

| ID | Rutas | Uso |
| --- | --- | --- |
| `API-CERT-001` | `GET/POST /certificados`, `GET/PATCH/DELETE /certificados/:id` | CRUD documental |
| `API-CERT-002` | `GET /certificados/pendientes|firmados|impresos|aceptados` | listas operativas |
| `API-CERT-003` | `POST /certificados/:id/archivo` | subir/reemplazar PDF |
| `API-CERT-004` | `PATCH /certificados/procesar-firma` | consolidar firma y solicitud |
| `API-CERT-005` | `GET /certificadosr` | reporte |
| `API-CONS-001` | `GET/POST /constancias`, `GET/PATCH/DELETE /constancias/:id` | CRUD documental |
| `API-CONS-002` | `GET /constancias/pendientes|impresos|aceptados` | listas operativas |
| `API-CONS-003` | `PATCH /constancias/procesar-firma` | firma, archivo y solicitud |
| `API-CONS-004` | `POST /upload/constancias` | upload de PDF |

`GAP-API-003`: crear constancia no cambia la solicitud; seleccionar la solicitud la cambia antes de crearla. `TO-BE`: endpoint transaccional o compensacion backend.

## Examen de ubicacion

| ID | Rutas | Uso |
| --- | --- | --- |
| `API-EXU-001` | `/examenesubicacion` | CRUD de examen |
| `API-EXU-002` | `/detallesubicacion`, `/detallesubicacion/examen/:id` | participantes y resultados |
| `API-EXU-003` | `/calificacionesubicacion` | CRUD de rangos/calificaciones |
| `API-EXU-004` | `/cronogramaubicacion` | CRUD de cronograma |
| `API-EXU-005` | `/actasexamenubicacion` | crear, consultar, actualizar y eliminar actas |

La mayoria usa API Key. Algunas mutaciones de actas agregan JWT y `PermissionsGuard`; la politica no es uniforme.

## Seguimiento docente

| ID | Rutas | Uso |
| --- | --- | --- |
| `API-SDOC-001` | `/docentes`, `/docentes/activos`, `/docentes/usuario/:id` | docentes y contexto |
| `API-SDOC-002` | `/perfil-docente` | CRUD de perfiles |
| `API-SDOC-003` | `/documentos-docente`, `/documentos-docente/perfil/:id` | documentos |
| `API-SDOC-004` | `/dashboard-docentes/*` | indicadores |
| `API-SDOC-005` | `/encuesta-preguntas`, `/encuesta-respuestas`, `/encuesta-metricas-docente` | encuestas |
| `API-SDOC-006` | `/perfil-docente-resultados/*` | ranking y detalle |
| `API-SDOC-007` | `/cumplimiento-docente` | cumplimiento por modulo/rubro |
| `API-SDOC-008` | `/tipos-documento-perfil`, `/academico-administrativo`, `/puntaje-academico-administrativo` | catalogos propios |

`GAP-API-004`: varios controladores de seguimiento no declaran guard de clase. Deben auditarse por accion antes de considerarse privados.

## Uploads

- `POST /upload/:folder` para `dnis`, `vouchers`, `becas`, `cvs`, `constancias` y carpetas documentales soportadas por backend.
- Respuesta esperada por frontend: identificador, enlace de descarga y metadata disponible.
- Errores: archivo ausente, carpeta invalida, credenciales Drive, conflicto o error externo.

## Catalogo backend no consumido directamente

El backend expone ademas escuelas, facultades, evaluaciones, notas, notas finales, actas de notas, mailer, reportes de tiempos y partes de Q10. Se consideran capacidades auxiliares o de otras aplicaciones hasta que exista consumidor en este frontend.

## Contrato `TO-BE`

- Respuesta de error: `{ statusCode, code, message, details?, correlationId? }`.
- Todo endpoint privado: API Key para identificacion de aplicacion mas JWT y permiso para identidad/autorizacion.
- IDs y query params validados con pipes/DTO.
- Mutaciones documentan idempotencia y resultado parcial.
- Swagger refleja DTO, respuestas y guards reales.

