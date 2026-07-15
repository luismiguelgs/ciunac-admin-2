# 04 - User Roles And Permissions

## Fuentes de verdad `AS-IS`

- Roles: `lib/roles.ts`.
- Ruta a permiso: `lib/access-control.ts`.
- Evaluacion rol/permiso: `lib/permissions.ts`.
- Sidebar: `components/sidebar/app-sidebar.tsx`.
- Guard servidor: `lib/server-permissions.ts`.
- Guard cliente: `components/protected-route.tsx`.
- Permisos backend: `GET /rol-permisos/rol/:rol`.

## Roles

| Rol | Comportamiento actual |
| --- | --- |
| `SUPERADMIN` | Bypass de permisos en frontend; entra a todas las rutas protegidas |
| `ADMINISTRATIVO` | Necesita permiso, pero ademas esta bloqueado para cinco permisos sensibles |
| `DOCENTE` | Necesita permiso y, en rutas personales, `docenteId` y `perfilId` |

## Permisos sensibles restringidos por rol

`lib/permissions.ts` bloquea tanto a `ADMINISTRATIVO` como a `DOCENTE`, aunque el backend entregue el permiso:

- `gestion_constancias`
- `gestion_certificados`
- `gestion_solicitudes`
- `examenes_ubicacion`
- `importar_pagos`

`GAP-PERM-001`: esta regla contradice el modelo habitual de administrativo con permisos explicitos y debe resolverse mediante `DECISION-001` antes de modificarla.

## Matriz de rutas

| Familia de rutas | Permiso frontend | Superadmin | Administrativo `AS-IS` | Docente `AS-IS` |
| --- | --- | --- | --- | --- |
| `/dashboard` | Solo sesion | Si | Si | Si, aunque su destino principal es experiencia docente |
| `/usuarios` | `gestionar_usuarios` | Si | Si, con permiso | Si, con permiso; requiere decision de producto |
| `/estructura` | `gestionar_estructura` | Si | Si, con permiso | Si, con permiso; requiere decision de producto |
| `/grupos/*` | `gestionar_estructura` | Si | Si, con permiso | Si, con permiso; requiere decision de producto |
| `/solicitudes/*` | `gestion_solicitudes` o `gestion_becas`/`importar_pagos` | Si | Bloqueado en solicitudes e importacion; becas depende de permiso | Bloqueado en solicitudes e importacion; becas depende de permiso |
| `/certificados/*` | `gestion_certificados` | Si | Bloqueado | Bloqueado |
| `/constancias/*` | `gestion_constancias` | Si | Bloqueado | Bloqueado |
| `/examen-ubicacion/*` | `examenes_ubicacion` | Si | Bloqueado | Bloqueado |
| `/perfil-docente/docentes/*` | `gestion_docentes` | Si | Si, con permiso | Si, con permiso; no recomendado para experiencia personal |
| `/perfil-docente/ranking-docentes/*` | `perfil_docente_resultados` | Si | Si, con permiso | Si, con permiso |
| `/perfil-docente/mi-perfil` | `mi_perfil_docente` | Si | Si, con permiso | Si, con permiso y contexto |
| `/perfil-docente/mis-resultados` | `mi_perfil_docente_resultados` | Si | Si, con permiso | Si, con permiso y contexto |
| `/perfil-docente/encuestas/mi-encuesta` | `mi_encuesta_respuestas` | Si | Si, con permiso | Si, con permiso y contexto |

## Acciones visibles

- El sidebar elimina items cuyo permiso falla en `canAccessRoute`.
- Los botones dentro de una pagina no tienen una politica transversal por accion; normalmente heredan el permiso del modulo.
- `GAP-PERM-002`: lectura, creacion, edicion, eliminacion, firma y publicacion no tienen permisos separados.
- `GAP-PERM-003`: ocultar rutas en UI no demuestra que el controlador backend aplique el mismo rol o permiso.

## Flujo de autorizacion

```mermaid
flowchart TD
    A["Solicitud de ruta"] --> B{"Existe sesion?"}
    B -->|No| C["Redirigir a login"]
    B -->|Si| D{"SUPERADMIN?"}
    D -->|Si| E["Permitir en frontend"]
    D -->|No| F{"Rol restringido para el permiso?"}
    F -->|Si| G["Unauthorized"]
    F -->|No| H{"Permiso presente?"}
    H -->|No| G
    H -->|Si| I{"Ruta docente personal?"}
    I -->|No| E
    I -->|Si| J{"Contexto completo?"}
    J -->|No| K["Missing docente context"]
    J -->|Si| E
```

## Reglas `TO-BE`

- El backend debe validar identidad y autorizacion para cada accion sensible.
- Una matriz aprobada debe definir si `ADMINISTRATIVO` usa permisos o bloqueo por rol.
- Acciones destructivas o de publicacion deben poder tener permisos mas granulares.
- Cambios de permisos deben invalidar o refrescar la sesion.
