# Modulo Autenticacion - Plan

## Arquitectura objetivo

- Mantener NextAuth como fuente canonica de identidad.
- Derivar stores desde sesion y limpiarlos juntos.
- Unificar matriz de rutas para proxy, servidor, cliente y sidebar.
- Exigir JWT/permiso backend en operaciones privadas.

## Cambios previstos

1. Tipar payload de login, JWT y sesion sin `any`.
2. Diferenciar errores de authorize.
3. Resolver contexto docente con contrato unico `/docentes/usuario/:usuarioId`.
4. Auditar bloqueo de permisos sensibles mediante `DECISION-001`.
5. Añadir pruebas antes de simplificar capas duplicadas.

## Dependencias y compatibilidad

- NextAuth v5 beta, backend auth, rol-permisos y docentes.
- Mantener nombres actuales de campos durante una migracion compatible.
- No migracion de datos; puede requerir invalidacion de sesiones.

## Riesgos y rollout

- Activar primero pruebas y logging sanitizado.
- Desplegar backend compatible antes del frontend.
- Verificar los tres roles y rollback por version frontend.

## Definition of Done

- `CA-AUTH-001..004` aprobados.
- Sin secretos en storage/logs.
- Cada ruta privada tiene prueba de permiso y backend protegido.

