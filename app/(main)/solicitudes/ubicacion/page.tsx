import MyTabs from "@/components/my-tabs";
import NavigationBread from "@/components/navigation-bread";
import { Button } from "@/components/ui/button";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudUbicacionDataTable } from "@/modules/solicitudes/examen-ubicacion/solicitud-ubicacion.table";
import { Plus } from "lucide-react";
import React from "react";

const SOLICITUD_UBICACION_ENDPOINT = "examenes-ubicacion";

export const dynamic = "force-dynamic";

export default async function PageSolicitudesUbicacion() {
    const [nuevas, pagadas, asignadas, finalizadas, observadas, rechazadas] = await Promise.all([
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 1),
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 4),
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 12),
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 3),
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 2),
        SolicitudesService.fetchItemByState(SOLICITUD_UBICACION_ENDPOINT, 5),
    ]);

    return (
        <React.Fragment>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Examen de Ubicacion" />
            <div className="container mx-auto py-2 px-2">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Solicitudes de Examen de Ubicacion</h1>
                    <Button disabled title="Disponible proximamente" className="gap-2 self-start sm:self-auto">
                        <Plus className="h-4 w-4" />
                        Nueva Solicitud
                    </Button>
                </div>

                <MyTabs defaultValue="nuevas" items={[
                    {
                        value: "nuevas",
                        label: `Nuevas (${nuevas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={nuevas || []} />
                    },
                    {
                        value: "pagadas",
                        label: `Pagadas (${pagadas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={pagadas || []} />
                    },
                    {
                        value: "asignadas",
                        label: `Asignadas (${asignadas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={asignadas || []} />
                    },
                    {
                        value: "finalizadas",
                        label: `Finalizadas (${finalizadas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={finalizadas || []} />
                    },
                    {
                        value: "observadas",
                        label: `Observadas (${observadas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={observadas || []} />
                    },
                    {
                        value: "rechazadas",
                        label: `Rechazadas (${rechazadas?.length || 0})`,
                        content: <SolicitudUbicacionDataTable data={rechazadas || []} actionMode="restore" />
                    }
                ]} />
            </div>
        </React.Fragment>
    );
}
