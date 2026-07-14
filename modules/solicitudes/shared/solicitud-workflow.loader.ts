import "server-only"

import type { IEstado } from "@/modules/estructura/interfaces/types.interface"
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service"
import SolicitudesService from "./solicitudes.service"
import { resolveSolicitudWorkflowEstados, type SolicitudWorkflowData } from "./solicitud-workflow"

export async function fetchSolicitudWorkflow(endpoint: string): Promise<SolicitudWorkflowData> {
    const estados = await OpcionesService.fetchItems<IEstado>(Collection.Estados)
    const stateIds = resolveSolicitudWorkflowEstados(Array.isArray(estados) ? estados : [])

    const [nuevas, pagadas, asignadas, finalizadas, observadas, rechazadas] = await Promise.all([
        SolicitudesService.fetchItemByState(endpoint, stateIds.nueva),
        SolicitudesService.fetchItemByState(endpoint, stateIds.pagada),
        SolicitudesService.fetchItemByState(endpoint, stateIds.asignada),
        SolicitudesService.fetchItemByState(endpoint, stateIds.finalizada),
        typeof stateIds.observada === "number"
            ? SolicitudesService.fetchItemByState(endpoint, stateIds.observada)
            : Promise.resolve([]),
        SolicitudesService.fetchItemByState(endpoint, stateIds.rechazada),
    ])

    return { nuevas, pagadas, asignadas, finalizadas, observadas, rechazadas }
}
