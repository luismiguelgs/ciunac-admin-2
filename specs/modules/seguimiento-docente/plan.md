# Modulo Seguimiento Docente - Plan

## Resumen

Es el modulo con mayor densidad funcional del sistema. La estrategia debe separar claramente rutas administrativas, rutas personales de docente y catalogos internos.

## Fases

1. Confirmar contratos de auth y contexto docente.
2. Mapear permisos por subruta y submodulo.
3. Consolidar contratos de servicios del dominio.
4. Cubrir formularios y uploads con validacion explicita.
5. Probar escenarios personales y administrativos.

## Dependencias

- `auth.ts`
- `auth.config.ts`
- `lib/access-control.ts`
- `modules/seguimiento-docente/**/*`
- Catalogos de `estructura`

## Riesgos y aclaraciones

- Cualquier error en `docenteId` o `perfilId` rompe varias vistas personales.
- Las tablas con edicion inline requieren validacion adicional.
- El modulo mezcla paginas server y client; los permisos deben mantenerse equivalentes.

## Tareas tecnicas

- Revisar sincronizacion `Session -> useAuthStore -> useDocenteStore`
- Revisar todas las rutas del sidebar docente
- Definir schemas faltantes en encuestas, ranking y cumplimiento
- Asegurar manejo uniforme de vacios y errores por submodulo
