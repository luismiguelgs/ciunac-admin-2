# Modulo Grupos - Plan

## Resumen

El modulo combina CRUD tradicional con una integracion externa de importacion. La calidad del dato depende tanto de validacion local como del contrato de Q10.

## Fases

1. Confirmar contrato del CRUD local.
2. Confirmar contrato de `q10/horarios-cursos`.
3. Alinear formulario manual y flujo de importacion.
4. Probar escenarios de duplicados, vacios y errores de red.

## Dependencias

- `modules/grupos/grupo.service.ts`
- `modules/grupos/forms/grupo.schema.ts`
- `modules/grupos/forms/import.form.tsx`
- Catalogos de estructura
- Combo de docentes

## Riesgos y aclaraciones

- El endpoint Q10 puede tener latencia o devolver estructuras diferentes por periodo.
- El periodo visible en UI depende del modulo activo de estructura.
- La importacion debe ser idempotente o, al menos, reportar duplicados con claridad.

## Tareas tecnicas

- Revisar shape real de `ICursoQ10`
- Documentar regla de merge/import
- Unificar manejo de errores entre CRUD e importacion
- Agregar estados visuales para preview vacio y error
