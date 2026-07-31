# Modulo Reportes - Plan

## Enfoque

- Mantener la pagina como composicion protegida y el estado de consulta dentro de cada panel.
- Centralizar configuracion de tipo, IDs permitidos, etiqueta y nombre de exportacion.
- Consumir el endpoint existente mediante `apiFetch`; no modificar el backend.
- Reutilizar `DataTable` para filtro, ordenamiento, visibilidad y paginacion.
- Importar ExcelJS solo al exportar para no incorporarlo al bundle inicial de la pagina.

## Dependencias y compatibilidad

- Nueva dependencia runtime: `exceljs`.
- Sin migraciones, endpoints nuevos ni cambios de datos.
- `tipo=n` y `tipo=7` se conservan por compatibilidad con el backend actual.
- `importar_pagos` se reutiliza temporalmente para ruta y sidebar.

## Riesgos y rollout

- El filtro frontend no sustituye una consulta ni autorizacion backend; registrar `GAP-REP-001..002`.
- Mantener `GAP-REP-003` visible y evaluar una libreria XLSX mantenida o una exportacion servidor antes de produccion critica.
- Probar primero con periodos cortos y luego con un mes de volumen real.
- Si el volumen afecta red o memoria, mover filtros y generacion al servidor en una fase posterior.
- Rollback: deshabilitar el item del sidebar y retirar la regla `/reportes`; no hay persistencia que revertir.

## Definition of Done

- `CA-REP-001..007` verificados.
- Excel abre sin reparacion y contiene todos los registros consultados.
- Lint y build frontend exitosos.
- Specs, tareas, pruebas y brechas actualizadas, incluido el riesgo transitivo de ExcelJS.
