# 12 - Validation Rules

## Objetivo

Definir las reglas de validacion del frontend y establecer una politica clara para entradas de usuario, parametros de ruta, cargas de archivos y datos enviados al backend.

## Principios

- Validar temprano en UI para mejorar UX.
- Validar de nuevo en backend como autoridad final.
- Usar `zod` como contrato canonico del formulario cuando exista schema.
- Convertir tipos antes de enviar (`number`, `date`, `boolean`) para no delegar ambiguedades al backend.
- Mantener mensajes breves, accionables y orientados al campo.

## Inventario actual de schemas

| Ubicacion | Alcance | Reglas principales |
| --- | --- | --- |
| `components/login-form.tsx` | Login | Email valido, password minimo 6 |
| `modules/grupos/forms/grupo.schema.ts` | Crear/editar grupo | `moduloId`, `cicloId`, `codigo`, `docenteId`, `frecuencia`, `modalidad` obligatorios |
| `modules/grupos/forms/import.form.tsx` | Importar grupos | `periodo` obligatorio |
| `modules/constancias/validation.schema.ts` | Crear/editar constancia | Campos base obligatorios; `MATRICULA` exige `modalidad` y `horario` |
| `modules/examen-ubicacion/components/examen-form.tsx` | Crear/editar examen | `estadoId`, `fecha`, `aulaId`, `docenteId`, `idiomaId`, `codigo` obligatorios |
| `modules/seguimiento-docente/docentes/forms/docente.schema.tsx` | Crear/editar docente | Nombres/apellidos max 50, genero y tipoDocumento por enum, celular requerido |
| `modules/seguimiento-docente/perfil-docente/forms/perfil-docente.schema.ts` | Crear/editar perfil docente | `docenteId`, `experienciaTotal`, `idiomaId`, `puntajeFinal` obligatorios |
| `modules/seguimiento-docente/perfil-docente/forms/documento.schema.ts` | Documentos de perfil | Tipo, estado, descripcion y fecha requeridos |
| `modules/solicitudes/constancias/solicitud-constancias.details.tsx` | Edicion de solicitud | Tipo, estado, idioma, nivel, voucher, pago y fecha requeridos |

## Reglas compartidas por tipo de dato

### Strings

- Trim antes de persistir cuando el campo representa codigo, nombre o descripcion.
- No aceptar strings vacios para campos marcados como requeridos.
- Usar enums para dominios cerrados: rol, genero, tipoDocumento, tipo de constancia.

### Numeros

- Convertir con `z.coerce.number()` o casteo controlado antes de enviar.
- No enviar strings numericos al backend si el contrato del recurso es numerico.
- Validar minimos explicitos cuando el negocio lo requiere.

### Fechas

- Convertir a `Date` en UI.
- Serializar al backend en formato `YYYY-MM-DD` cuando el recurso lo espera como fecha plana.
- Rechazar fechas invalidas despues del parseo.

### Booleanos

- Mantener valores por defecto explicitos en formularios.
- Evitar `undefined` para toggles que alteran estados del negocio.

## Reglas por dominio

### Auth

- Login:
  - `email` valido
  - `password` minimo 6
- Registro de usuario:
  - `email` obligatorio
  - `rol` obligatorio
  - password obligatoria en flujos de alta local

### Catalogos de estructura

- `nombre` requerido en colecciones basicas.
- `codigo` requerido cuando la entidad lo usa como identificador funcional.
- `ciclos` deben referenciar `idiomaId` y `nivelId`.
- `modulos` deben mantener fechas coherentes y visibilidad controlada.

### Grupos

- Un grupo no debe guardarse sin modulo, ciclo, docente y modalidad.
- `aulaId` puede ser opcional segun el schema actual.
- La importacion exige `periodo` seleccionado antes de preview o import.

### Seguimiento docente

- `DOCENTE` debe operar con `docenteId` y `perfilId` validos cuando la vista es personal.
- Perfil docente exige docente, idioma, experiencia y puntaje final.
- Documento de perfil exige tipo de documento, estado, descripcion y fecha de emision.
- Cargas CSV de encuestas deben ser archivo valido y endpoint soportado.

### Solicitudes y constancias

- Solicitudes de constancias exigen voucher, monto y fecha de pago.
- Constancias tipo `MATRICULA` exigen `modalidad` y `horario`.
- Los uploads deben identificar carpeta y metadata minima antes de enviar.

### Examen de ubicacion

- Examen exige estado, fecha, docente, idioma, aula y codigo.
- Detalle de examen debe respetar `examenId`, `solicitudId`, `estudianteId`, `nota`, `nivelId`, `calificacionId`.
- Cronograma y calificaciones deben mantener relacion con modulo/ciclo.

## Validacion de archivos

| Flujo | Regla |
| --- | --- |
| `uploadCSVFile` | Archivo requerido, respuesta HTTP valida |
| Encuestas CSV | Solo CSV y estructura esperada por backend |
| Pagos CSV | Archivo CSV del banco |
| Upload general | Carpeta permitida: `dnis`, `vouchers`, `becas`, `cvs`, `constancias` |
| Constancias PDF | Debe subirse a carpeta `constancias` con metadata de nombre |

## Politica de mensajes de error

- Error por campo:
  - mensaje corto y directo
  - ejemplo: `Idioma requerido`
- Error de submit:
  - toast con accion o siguiente paso
  - ejemplo: `No se pudo guardar el examen`
- Error de permisos/contexto:
  - redireccion controlada o pantalla con estado claro

## Gaps actuales a resolver

- No todos los modulos tienen schemas dedicados.
- Algunas tablas con edicion inline dependen de validacion implicita.
- Hay servicios que aceptan `any` y necesitan contratos tipados mas estrictos.
- Las validaciones de backend no estan representadas siempre en el frontend.

## Checklist de aceptacion

- Todo formulario critico tiene schema o reglas equivalentes documentadas.
- Todos los IDs enviados al backend tienen tipo consistente.
- Los uploads validan extension y metadata minima antes del submit.
- Las reglas condicionales quedan escritas junto al modulo que las consume.
