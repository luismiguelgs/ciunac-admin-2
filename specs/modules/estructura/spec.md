# Modulo Estructura - Spec

## Objetivo

Mantener los catalogos maestros usados por el resto de la aplicacion: tipos de solicitud, estados, facultades, idiomas, aulas, escuelas, modulos, ciclos, niveles y textos configurables.

## Actores

- `SUPERADMIN`
- `ADMINISTRATIVO` con permiso `gestionar_estructura`

## Reglas de negocio

- `modulos` funcionan como periodos visibles del sistema.
- `ciclos` dependen de `idiomaId` y `nivelId`.
- Las colecciones visibles deben poder consultarse mediante `/visibles` cuando el modulo lo requiera.
- `textos` se gestionan como contenido configurable por `codigo`.
- Los catalogos deben permanecer consistentes porque alimentan formularios de otros modulos.

## Criterios de aceptacion

- Se puede listar cada coleccion maestra.
- Se puede crear, editar y eliminar items de cada coleccion.
- Los ciclos muestran relacion con idioma y nivel.
- Los modulos pueden marcarse como `activo` y `visible`.
- Los textos configurables se pueden editar sin romper otros modulos.

## Endpoints necesarios

- `GET /tipossolicitud`
- `GET /estados`
- `GET /facultades`
- `GET /idiomas`
- `GET /aulas`
- `GET /escuelas`
- `GET /modulos`
- `GET /modulos/visibles`
- `GET /ciclos`
- `GET /niveles`
- `GET /textos`
- `POST/PATCH/DELETE` para cada coleccion anterior

## Modelo de datos relacionado

- `ITipoSolicitud`
- `IEstado`
- `IFacultad`
- `IIdioma`
- `ISalon`
- `IEscuela`
- `IModulo`
- `ICiclo`
- `INivel`
- `ITexto`

## Validaciones

- `nombre` obligatorio en catalogos basicos
- `codigo` obligatorio donde la entidad lo use como identificador funcional
- `facultadId` obligatorio en escuelas
- `idiomaId` y `nivelId` obligatorios en ciclos
- `fechaInicio <= fechaFin` en modulos

## Errores posibles

- Catalogo vacio
- Error de red al cargar opciones
- Eliminacion rechazada por referencias activas
- Datos inconsistentes entre colecciones relacionadas

## Tareas tecnicas

- Normalizar schemas de alta/edicion para cada coleccion
- Reducir duplicacion entre tablas editables
- Definir reglas de eliminacion segura para items en uso
- Cubrir cache de `useOpciones` con pruebas

## Pruebas

- CRUD por coleccion
- Relacion ciclo -> idioma/nivel
- Uso de `/visibles` en modulos dependientes
- Proteccion por `gestionar_estructura`
