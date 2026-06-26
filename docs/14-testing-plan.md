# 14 - Testing Plan

## Objetivo

Definir la estrategia de pruebas para el frontend antes de ampliar funcionalidad, refactorizar auth o introducir cambios de negocio en los modulos principales.

## Estado actual

- El proyecto tiene `eslint` como chequeo configurado.
- No existe aun una suite automatizada de pruebas frontend versionada en este repositorio.
- La arquitectura ya es lo bastante compleja como para exigir pruebas por capas antes de seguir agregando modulos.

## Objetivos de calidad

- Proteger auth, permisos y contexto docente.
- Proteger formularios con validacion relevante.
- Proteger contratos de servicios HTTP.
- Cubrir flujos criticos de cada modulo visible en sidebar.

## Piramide propuesta

| Nivel | Objetivo | Ejemplos |
| --- | --- | --- |
| Unitarias | Validar reglas puras y helpers | `permissions.ts`, `access-control.ts`, builders, normalizadores |
| Integracion UI | Validar formularios, tablas y guards | login, `ProtectedRoute`, formularios con `zod` |
| Integracion de servicios | Validar contratos HTTP con mocks | `apiFetch`, services por modulo |
| E2E | Validar flujos de negocio | login, crear examen, aprobar constancia, editar solicitud |
| Smoke manual | Verificacion final por ambiente | deploy, secretos, rutas, uploads |

## Prioridad por modulo

| Modulo | Prioridad | Motivo |
| --- | --- | --- |
| Auth y permisos | Alta | Capa transversal con mayor riesgo |
| Seguimiento docente | Alta | Muchas rutas, permisos y contexto docente |
| Examen de ubicacion | Alta | Flujo transaccional y configuraciones dependientes |
| Constancias | Alta | Emision de documentos y uploads |
| Solicitudes | Media/Alta | Estados, pagos y rechazo |
| Usuarios | Media | CRUD y permisos de rol |
| Estructura | Media | Catalogos base del resto del sistema |
| Grupos | Media | CRUD e importacion externa |

## Cobertura minima recomendada

### Auth

- Login exitoso por rol
- Login fallido por credenciales
- Redireccion de `DOCENTE`
- Denegacion por permiso
- Denegacion por contexto docente faltante

### Formularios

- Grupos
- Docentes
- Perfil docente
- Documento de perfil
- Constancias
- Examen de ubicacion
- Solicitud de constancias

### Servicios

- Manejo de `response.ok = false`
- Parseo JSON y fallback a texto
- Incluson de `Authorization` y `x-api-key`
- Upload CSV y upload de archivos

### Navegacion protegida

- Sidebar filtra opciones por permiso
- `ProtectedRoute` bloquea o deja pasar
- `ensureServerPermission` protege paginas server

## Herramientas objetivo

- Lint: `eslint`
- Tipado: `tsc` o chequeo equivalente en build
- Unitarias / integracion ligera: `Vitest` + `Testing Library`
- Mock de red: `MSW`
- E2E: `Playwright`

La eleccion final de tooling debe quedar aprobada antes de implementar la suite.

## Datos de prueba

- Fixtures de usuarios por rol:
  - `SUPERADMIN`
  - `ADMINISTRATIVO` con y sin permisos
  - `DOCENTE` con y sin contexto
- Fixtures de catalogos:
  - idiomas, niveles, modulos, estados, aulas
- Fixtures de negocio:
  - solicitudes, constancias, examenes, perfiles docentes, encuestas

## Pipeline recomendado

1. `eslint`
2. type-check
3. unitarias
4. integracion UI
5. e2e smoke en rama de release

## Criterios de salida por cambio

- Cambio en auth o permisos:
  - unitarias + integracion + smoke
- Cambio en formulario:
  - validacion + submit + error states
- Cambio en servicio:
  - contrato HTTP y errores
- Cambio en modulo:
  - al menos un caso feliz y un caso negativo

## Checklist de aceptacion

- Toda regla transversal critica tiene prueba automatizada.
- Cada modulo tiene al menos un flujo E2E priorizado.
- No se fusionan cambios de auth sin cobertura de roles.
- La estrategia de fixtures y mocks queda definida antes de implementar pruebas.
