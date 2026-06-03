import MyTabs from "@/components/my-tabs";
import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudConstanciasDataTable } from "@/modules/solicitudes/constancias/solicitud-constancias.table";
import React from "react";

export default async function PageSolicitudesConstancias() {
    const [nuevas, pagadas, procesadas, finalizadas, rechazadas, asignadas] = await Promise.all([
        SolicitudesService.fetchItemByState('constancias', 1), // Nuevas
        SolicitudesService.fetchItemByState('constancias', 4), // Pagadas
        SolicitudesService.fetchItemByState('constancias', 2), // Procesadas
        SolicitudesService.fetchItemByState('constancias', 3), // Finalizadas
        SolicitudesService.fetchItemByState('constancias', 5), // Rechazadas
        SolicitudesService.fetchItemByState('constancias', 12), // Asignadas
    ]);

    return (
        <React.Fragment>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Constancias" />
            <div className="container mx-auto py-2 px-2">
                <h1 className="text-2xl font-bold mb-4">Constancias CIUNAC</h1>
                <MyTabs defaultValue="nuevas" items={[
                    {
                        value: "nuevas",
                        label: `Nuevas (${nuevas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={nuevas || []} />
                    },
                    {
                        value: "pagadas",
                        label: `Pagadas (${pagadas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={pagadas || []} />
                    },
                    {
                        value: "asignadas",
                        label: `Asignadas (${asignadas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={asignadas || []} />
                    },
                    {
                        value: "finalizadas",
                        label: `Finalizadas (${finalizadas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={finalizadas || []} />
                    },
                    {
                        value: "procesadas",
                        label: `Observadas (${procesadas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={procesadas || []} />
                    },
                    {
                        value: "rechazadas",
                        label: `Rechazadas (${rechazadas?.length || 0})`,
                        content: <SolicitudConstanciasDataTable data={rechazadas || []} actionMode="restore" />
                    }
                ]} />
            </div>
        </React.Fragment>
    );
}
