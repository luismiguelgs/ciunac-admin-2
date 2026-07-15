# 03 - Non-Functional Requirements

## Seguridad

- `NFR-SEC-001`: ninguna autorizacion sensible dependera solo del sidebar o de un store cliente.
- `NFR-SEC-002`: los endpoints privados validaran identidad y permiso en backend.
- `NFR-SEC-003`: `NEXT_PUBLIC_API_KEY` se tratara como identificador publico, no como secreto.
- `NFR-SEC-004`: tokens, passwords y payloads sensibles no se registraran en logs.
- `NFR-SEC-005`: datos persistidos en navegador se limitaran al contexto minimo de UI.

## Rendimiento

- `NFR-PERF-001`: las paginas de lista deben mostrar feedback de carga inmediatamente.
- `NFR-PERF-002`: filtros locales no deben provocar solicitudes por cada pulsacion salvo contrato explicito.
- `NFR-PERF-003`: catalogos cacheados deben poder invalidarse despues de una mutacion.
- `NFR-PERF-004`: generacion de PDF y upload deben mostrar progreso o estado de procesamiento.

## Confiabilidad

- `NFR-REL-001`: operaciones de negocio con dos persistencias deben ser atomicas o compensables.
- `NFR-REL-002`: reintentos de firma o upload no deben duplicar documentos.
- `NFR-REL-003`: errores parciales deben indicar que parte fue persistida.
- `NFR-REL-004`: estados se resolveran por constantes o catalogos validados, no por numeros sin nombre.

## Usabilidad y accesibilidad

- `NFR-UX-001`: formularios deben identificar el campo invalido y conservar valores.
- `NFR-UX-002`: tablas deben ofrecer filtro comprensible, paginacion y estado vacio.
- `NFR-A11Y-001`: controles interactivos deben ser operables con teclado y tener nombre accesible.
- `NFR-A11Y-002`: estados no se comunicaran unicamente por color.
- `NFR-A11Y-003`: dialogs deben gestionar foco y cierre de forma predecible.

## Mantenibilidad

- `NFR-MNT-001`: contratos compartidos no usaran `any` cuando exista un modelo conocido.
- `NFR-MNT-002`: permisos por ruta tendran una sola fuente canonica y consumidores consistentes.
- `NFR-MNT-003`: servicios de un mismo dominio usaran una estrategia de error uniforme.
- `NFR-MNT-004`: cada cambio funcional actualizara spec, task y prueba vinculada.

## Observabilidad

- `NFR-OBS-001`: errores backend registraran operacion, recurso, status e identificador de correlacion cuando exista.
- `NFR-OBS-002`: auth distinguira fallo de credenciales, permisos y contexto sin exponer secretos.
- `NFR-OBS-003`: despliegues conservaran version frontend y backend para diagnostico.

## Compatibilidad

- `NFR-COMP-001`: soportar versiones vigentes de Chrome, Edge y Firefox de escritorio.
- `NFR-COMP-002`: las paginas deben ser utilizables en escritorio y viewport movil.
- `NFR-COMP-003`: PDFs deben abrirse en lectores estandar y conservar formato institucional.

## Calidad minima

| Cambio | Verificacion obligatoria |
| --- | --- |
| Auth o permisos | Unitarias, integracion y E2E por rol |
| Formulario | Schema, submit, error y accesibilidad basica |
| Servicio/API | Contrato feliz, 4xx, 5xx y red |
| Estado de negocio | Transiciones validas, invalidas y reintento |
| Upload/PDF | Archivo valido, rechazo, reintento y consistencia |
