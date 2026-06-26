# 03 - Non-Functional Requirements

## Rendimiento

### NFR-001 - Tiempo de carga de lista

La lista de Examenes de Ubicacion debe cargar en un tiempo aceptable para uso administrativo recurrente. Como objetivo inicial, la primera carga no deberia exceder 3 segundos en condiciones normales de red interna.

### NFR-002 - Tiempo de generacion de PDF

La generacion del PDF por periodo deberia completarse en menos de 10 segundos para volumenes regulares. Si excede ese tiempo, la interfaz debe mostrar estado de progreso o procesamiento.

### NFR-003 - Volumen de resultados

El proceso debe soportar periodos con multiples idiomas y decenas o cientos de participantes sin degradar la experiencia.

## Seguridad

### NFR-004 - Autenticacion obligatoria

Todas las operaciones administrativas deben requerir sesion valida.

### NFR-005 - Autorizacion por permiso

La publicacion de resultados debe validar permisos tanto en frontend como en backend.

### NFR-006 - Proteccion de datos personales

El PDF y las vistas asociadas deben exponer solo los datos necesarios para publicar resultados. Se debe evitar mostrar datos sensibles innecesarios.

### NFR-007 - Integridad del documento

Una vez publicado, el documento debe conservar integridad. Cualquier reemplazo o nueva publicacion debe quedar registrado.

### NFR-008 - No confiar solo en UI

El backend debe validar periodo, tipo de examen, permiso y estado de resultados aunque la UI ya haya aplicado esos filtros.

## Disponibilidad y confiabilidad

### NFR-009 - Manejo de fallos de API

La aplicacion debe mostrar mensajes claros cuando el backend no responda, devuelva errores o no pueda generar el PDF.

### NFR-010 - Operacion idempotente o controlada

Reintentar una generacion o publicacion no debe crear documentos duplicados accidentalmente sin regla definida.

### NFR-011 - Recuperacion de documento publicado

Un documento ya publicado debe poder consultarse aun si una generacion posterior falla.

## Usabilidad

### NFR-012 - Claridad de periodo

El periodo seleccionado debe estar siempre visible durante generacion, vista previa y publicacion.

### NFR-013 - Confirmaciones explicitas

Las acciones irreversibles o publicas deben requerir confirmacion.

### NFR-014 - Mensajes comprensibles

Los mensajes deben estar orientados al usuario administrativo, evitando errores tecnicos sin explicacion.

### NFR-015 - Flujo corto

El flujo principal debe poder completarse desde la lista de Examenes de Ubicacion sin obligar al usuario a navegar por varias secciones.

## Accesibilidad

### NFR-016 - Navegacion por teclado

Las acciones principales deben poder ejecutarse mediante teclado.

### NFR-017 - Contraste y legibilidad

Estados, botones y mensajes deben tener contraste suficiente y texto legible.

### NFR-018 - Etiquetas de acciones

Botones con iconos deben tener etiquetas accesibles o tooltips descriptivos.

## Mantenibilidad

### NFR-019 - Separacion de responsabilidades

La logica de obtencion de datos, generacion de documento, publicacion y presentacion UI debe mantenerse separada.

### NFR-020 - Reutilizacion de servicios

La nueva funcionalidad debe integrarse con los servicios existentes del modulo Examen de Ubicacion cuando sea razonable.

### NFR-021 - Tipado consistente

Los contratos de datos deben estar tipados de forma consistente con las interfaces existentes.

### NFR-022 - Documentacion actualizable

Los cambios funcionales deben reflejarse en estos documentos antes de implementarse.

## Observabilidad

### NFR-023 - Registro de errores

Los errores de generacion, publicacion y descarga deben registrarse con contexto: periodo, usuario, fecha y operacion.

### NFR-024 - Auditoria funcional

Debe existir forma de conocer quien publico un documento, cuando lo hizo y a que periodo corresponde.

## Compatibilidad

### NFR-025 - Navegadores modernos

La aplicacion debe funcionar en navegadores modernos usados por el personal administrativo.

### NFR-026 - PDF estandar

El documento generado debe abrirse correctamente en visores PDF comunes.

## Calidad del PDF

### NFR-027 - Formato institucional

El documento debe mantener encabezado, portada, jerarquia visual, tablas legibles y pie institucional.

### NFR-028 - Paginacion correcta

Las tablas largas deben paginar sin cortar filas ni ocultar encabezados importantes.

### NFR-029 - Orden consistente

Los idiomas y participantes deben mostrarse en un orden definido y reproducible.
