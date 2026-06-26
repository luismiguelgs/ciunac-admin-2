# Modulo Grupos - Spec

## Objetivo

Gestionar grupos academicos del periodo y permitir la importacion de cursos desde Q10 para acelerar la carga operativa.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permiso `gestionar_estructura`

## Reglas de negocio

- Un grupo requiere modulo, ciclo, codigo, docente, frecuencia y modalidad.
- `aulaId` es opcional en el schema actual.
- La importacion desde Q10 depende de un `periodo` seleccionado.
- La vista de importacion debe permitir preview de cursos antes de ejecutar el import final.

## Criterios de aceptacion

- Se puede listar grupos existentes.
- Se puede crear un grupo manualmente.
- Se puede editar un grupo existente.
- Se puede eliminar un grupo.
- Se puede consultar cursos importables por periodo.
- Se puede importar cursos desde Q10 al modulo local.

## Endpoints necesarios

- `GET /grupos`
- `GET /grupos/:id`
- `POST /grupos`
- `PATCH /grupos/:id`
- `DELETE /grupos/:id`
- `GET /q10/horarios-cursos?periodo=:nombrePeriodo`
- `POST /q10/horarios-cursos`

## Modelo de datos relacionado

- `IGrupo`
- `ICursoQ10`
- Catalogos de `IModulo`, `ICiclo`, `ISalon`
- `IDocente` para asignacion

## Validaciones

- `moduloId` obligatorio
- `cicloId` obligatorio
- `codigo` obligatorio
- `docenteId` obligatorio
- `frecuencia` obligatoria
- `modalidad` obligatoria
- `periodo` obligatorio para preview e importacion

## Errores posibles

- Grupo no encontrado
- Periodo no seleccionado
- Importacion Q10 sin cursos disponibles
- Error de red al importar
- Docente inexistente o no visible

## Tareas tecnicas

- Mantener schema de grupo como contrato unico de formulario
- Tipar correctamente importacion Q10
- Definir reglas de reconciliacion si Q10 devuelve cursos repetidos
- Cubrir creacion, edicion e importacion con pruebas

## Pruebas

- CRUD de grupos
- Preview de cursos por periodo
- Importacion exitosa y fallida
- Proteccion por permiso
