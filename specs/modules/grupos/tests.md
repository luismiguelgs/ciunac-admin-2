# Modulo Grupos - Tests

## Unitarias

- Validacion de `GrupoSchema`
- Validacion de schema de importacion por periodo

## Integracion

- Crear grupo con datos validos
- Rechazar guardado sin docente
- Preview de cursos por periodo
- Importar cursos y redirigir a `/grupos`

## E2E

- Usuario autorizado crea grupo manual
- Usuario autorizado importa cursos de Q10
- Usuario sin permiso no accede al modulo

## Casos negativos

- Q10 devuelve lista vacia
- Q10 devuelve error HTTP
- El backend rechaza el guardado del grupo
