# Modulo Estructura - Plan

## Resumen

Estructura es el modulo base de configuracion. Cualquier cambio aqui afecta formularios, filtros, combos y procesos batch del resto de la plataforma.

## Fases

1. Inventariar colecciones y sus relaciones.
2. Definir validaciones por entidad.
3. Homogeneizar servicios, hooks y stores de cache.
4. Probar impacto en modulos consumidores.

## Dependencias

- `modules/estructura/services/opciones.service.ts`
- `modules/estructura/services/textos.service.ts`
- `modules/estructura/hooks/use-opciones.ts`
- Formularios de grupos, solicitudes, constancias, examen de ubicacion y seguimiento docente

## Riesgos y aclaraciones

- Un cambio en estados o modulos puede romper workflows enteros.
- La falta de schemas por coleccion hoy deja huecos de validacion.
- El cache local debe invalidarse cuando cambie una opcion maestra.

## Tareas tecnicas

- Documentar reglas por coleccion
- Agregar schemas faltantes
- Definir estrategia de invalidacion de cache
- Revisar mensajes de error para catalogos vacios
