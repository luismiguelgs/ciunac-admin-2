# Modulo Reportes - Tests

En esta fase los casos frontend son manuales porque el repositorio aun no posee runner de pruebas versionado.

| ID | Nivel | Escenario |
| --- | --- | --- |
| `TEST-REP-001` | Component/manual | inicia con mes actual, no consulta al montar y rechaza rango vacio/invertido |
| `TEST-REP-002` | Contract/manual | construye query `inicio`, `fin` y `tipo=n|7` sin incrementar fecha final |
| `TEST-REP-003` | Regression/manual | documentos excluye tipo `7`, becas y cualquier ID fuera de `1..6`; examen conserva solo `7` |
| `TEST-REP-004` | Component/manual | muestra carga, vacio, error `400/401/403/5xx` y permite reintentar |
| `TEST-REP-005` | Component/manual | busca por datos compuestos y combina ordenamiento, paginacion y visibilidad |
| `TEST-REP-006` | Integration/manual | Excel abre correctamente, conserva tildes, formatos, filas completas y filename esperado |
| `TEST-REP-007` | E2E/manual | cambia tabs mediante `reporte` en URL y mantiene flujos independientes |
| `TEST-REP-008` | Security/manual | superadmin accede; rol con permiso accede; rol sin `importar_pagos` no ve item y es redirigido |
| `TEST-REP-009` | Static | ESLint y build frontend finalizan sin errores |
| `TEST-REP-010` | Integration/manual | observaciones se muestran, buscan y ordenan en ambas tablas; Excel conserva texto completo, saltos de linea, tildes y vacios en la columna `L` |
| `TEST-REP-011` | Regression/manual | documentos y examen abren en Microsoft Excel sin recuperacion; pagos siguen numericos y `xl/styles.xml` contiene `&quot;S/&quot; #,##0.00` |

## Automatizacion pendiente

Cuando se implemente la infraestructura transversal, migrar `TEST-REP-001..008` y `TEST-REP-010..011` a Vitest/Testing Library y Playwright sin instalar herramientas exclusivas para este modulo.
