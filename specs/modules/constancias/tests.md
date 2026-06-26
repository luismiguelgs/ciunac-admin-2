# Modulo Constancias - Tests

## Unitarias

- Regla condicional de `validation.schema.ts`

## Integracion

- Crear constancia `MATRICULA` con modalidad y horario
- Rechazar submit de `MATRICULA` sin modalidad
- Marcar constancia como aceptada
- Marcar constancia como impresa
- Subir PDF

## E2E

- Usuario autorizado emite y procesa una constancia
- Usuario sin `gestion_constancias` es redirigido

## Casos negativos

- Upload rechaza archivo o backend falla
- Procesar firma sin `fileId`
- Constancia asociada a solicitud inexistente
