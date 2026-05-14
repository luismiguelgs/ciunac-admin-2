# Requisitos: Interfaz de Importación de Pagos (CSV)

**1. Objetivo del Agente:**
Construir la vista y la lógica en el cliente para subir un archivo CSV de pagos bancarios y enviarlo al backend existente para su conciliación.

**2. Interfaz de Usuario (UI):**
*   **Ruta:** Crear la página en la ruta correspondiente (ej. `/solicitudes/pagos/importar`).
*   **Componentes Clave:**
    *   **Área Dropzone:** Un espacio para arrastrar y soltar el archivo `.csv`, o hacer clic para seleccionarlo desde el explorador.
    *   **Validación Local:** Validar estrictamente que el archivo sea `.csv` antes de habilitar el envío.
    *   **Botón de Acción:** Un botón de "Procesar Pagos" para enviar la petición.
    *   **Estado de Carga (Loading):** Deshabilitar el botón y mostrar un indicador de carga (*spinner*) mientras se espera la respuesta del servidor, ya que el procesamiento puede tomar unos segundos.
*   **Estilo y Diseño:** Utilizar el sistema actual de **Shadcn UI** y **TailwindCSS**. Mantener un diseño limpio, moderno y consistente con el resto del panel de administración.

**3. Integración con el Backend (Contrato API):**
*(Nota para el agente: El backend ya está construido, tu objetivo es consumirlo usando la configuración de fetch/axios existente en el proyecto)*

*   **Endpoint:** `POST /pagos-banco/upload`
*   **Payload (Body):** Se debe enviar el archivo en formato `multipart/form-data`. El nombre del campo (key) debe ser exactamente `file`.
*   **Respuesta Exitosa (200 OK):**
    El backend responde con un objeto JSON estructurado de la siguiente manera:
    ```json
    {
      "mensaje": "Aquí se dice cuántos registros se procesaron, se reverificaron o se rechazaron"
    }
    ```
*   **Manejo de la Respuesta:**
    *   **Éxito:** Extraer el `mensaje` de la respuesta y mostrarlo en la interfaz de usuario usando un componente de notificación (como el *Toast* de Shadcn UI) para informar al usuario sobre el resultado del proceso.
    *   **Error:** Capturar cualquier error HTTP (ej. 400 o 500) y mostrar un *Toast* destructivo indicando que ocurrió un problema al procesar el archivo.
