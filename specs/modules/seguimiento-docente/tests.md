# Modulo Seguimiento Docente - Tests

## Unitarias

- `requireDocenteContext()`
- `canAccessRoute()` en permisos del dominio

## Integracion

- Login `DOCENTE` y carga de contexto
- Crear/editar docente
- Crear/editar perfil docente
- Crear/editar documento de perfil
- Consultar metricas por modulo
- Subir CSV de encuestas

## E2E

- `DOCENTE` entra a `mis-resultados`
- `DOCENTE` entra a `mi-perfil`
- `ADMINISTRATIVO` accede a ranking y cumplimiento
- Usuario sin permiso es redirigido

## Casos negativos

- Sesion sin `docenteId` o `perfilId`
- CSV invalido
- Modulo sin datos de ranking
- Catalogo del dominio vacio
