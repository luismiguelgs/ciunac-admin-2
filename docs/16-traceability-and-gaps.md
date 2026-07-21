# 16 - Traceability And Gaps

## Matriz principal

| Historia | Requisitos | Ruta/API | Criterios | Spec | Pruebas |
| --- | --- | --- | --- | --- | --- |
| `HU-AUTH-001` | `FR-AUTH-001..004` | `/`, `API-AUTH-001..006` | `CA-AUTH-001..003` | autenticacion | `TEST-AUTH-*` |
| `HU-DASH-001` | `FR-DASH-001..002` | `/dashboard` | `CA-DASH-001` | dashboard | `TEST-DASH-*` |
| `HU-USR-001` | `FR-USR-001..002` | `/usuarios`, `API-USR-001` | `CA-USR-001` | usuarios | `TEST-USR-*` |
| `HU-ESTR-001` | `FR-ESTR-001..002` | `/estructura`, `API-ESTR-*` | `CA-ESTR-001` | estructura | `TEST-ESTR-*` |
| `HU-GRP-001` | `FR-GRP-001..003` | `/grupos/*`, `API-GRP-*` | `CA-GRP-001..002` | grupos | `TEST-GRP-*` |
| `HU-SOL-001` | `FR-SOL-001..006` | `/solicitudes/*`, `API-SOL-*` | `CA-SOL-001..003` | solicitudes | `TEST-SOL-*` |
| `HU-CERT-001` | `FR-CERT-001..004` | `/certificados/*`, `API-CERT-*` | `CA-CERT-001..002` | certificados | `TEST-CERT-*` |
| `HU-CONS-001` | `FR-CONS-001..005` | `/constancias/*`, `API-CONS-*` | `CA-CONS-001..003` | constancias | `TEST-CONS-*` |
| `HU-EXU-001/002` | `FR-EXU-001..007` | `/examen-ubicacion/*`, `API-EXU-*` | `CA-EXU-001..004` | examen-ubicacion | `TEST-EXU-*` |
| `HU-SDOC-001/002` | `FR-SDOC-001..007` | `/perfil-docente/*`, `API-SDOC-*` | `CA-SDOC-001..006` | seguimiento-docente | `TEST-SDOC-*` |

## Registro de brechas prioritarias

| ID | Prioridad | Brecha | Impacto | Bloquea implementacion |
| --- | --- | --- | --- | --- |
| `GAP-PERM-001` | Alta | Administrativo sigue bloqueado para tres permisos sensibles; `gestion_solicitudes` e `importar_pagos` ya fueron resueltos | Acceso y modelo de roles | Si, otros cambios de permisos |
| `GAP-BE-002` | Critica | Muchos endpoints dependen solo de API Key publica | Autorizacion real | Si, seguridad |
| `GAP-API-003` | Alta | Solicitud pasa a asignada antes de crear constancia | Estado huerfano | Si, flujo constancia |
| `GAP-AUTH-001` | Alta | NextAuth y Zustand duplican sesion | Desincronizacion | Si, refactor auth |
| `GAP-AUTH-002` | Alta | `data.sql` no incluye `MESADEPARTES` en `UsuarioRol`, aunque el backend vigente si lo reconoce | Inicializacion de datos inconsistente | Si se usa ese script |
| `GAP-UI-005` | Media | Breadcrumb `/solicitudes` sin pagina | Navegacion/404 | No |
| `GAP-UI-006` | Media | Certificados impresos sin item sidebar | Descubribilidad | No |
| `GAP-DATA-001` | Alta | Constantes de estado incompletas | Transiciones inconsistentes | Si, estados |
| `GAP-ERR-001` | Media | Errores mezclan throw/false/undefined | UX y diagnostico | Si, cliente HTTP |
| `GAP-VAL-001` | Media | Uploads sin validacion uniforme | Seguridad/UX | Si, uploads |
| `GAP-DEP-003` | Media | Hosting/owner backend no formalizado | Operacion | Si, produccion |

## Decisiones

| ID | Pregunta | Evidencia | Owner sugerido |
| --- | --- | --- | --- |
| `DECISION-001` | ¿Administrativo puede operar certificados, constancias y examen con permiso? Solicitudes e importacion ya fueron aprobados | `lib/permissions.ts` conserva tres bloqueos | Producto + seguridad |
| `DECISION-002` | ¿Registro publico sigue habilitado? | ruta `/registro` publica | Producto + seguridad |
| `DECISION-003` | ¿Quien opera backend y migraciones? | no hay pipeline/owner documentado | Operaciones |

## Definition of Ready

Una task puede implementarse cuando:

- Tiene historia, requisito, regla y criterio.
- Contratos API y datos estan definidos.
- Permiso/actor estan aprobados.
- Errores y estados alternativos estan descritos.
- Tiene pruebas vinculadas.
- No depende de una `DECISION` abierta.

## Definition of Done

- Codigo y contrato coinciden.
- Pruebas asociadas pasan.
- No aparecen rutas, endpoints o estados no documentados.
- Logs no exponen secretos.
- Despliegue y rollback estan definidos para cambios operativos.

