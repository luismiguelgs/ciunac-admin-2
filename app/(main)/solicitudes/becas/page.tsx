import MyTabs from "@/components/my-tabs";
import NavigationBread from "@/components/navigation-bread";
import React from "react";
import SolicitudbecasService from "@/modules/solicitudes/becas/solicitud-becas.service";
import { SolicitudBecasDataTable } from "@/modules/solicitudes/becas/solicitud-becas.table";

export default async function PageSolicitudesBecas() {
    const data = await SolicitudbecasService.getAll() || [];

    const nuevas = data.filter(item => !item.estado || item.estado.toLowerCase() === 'nuevas' || item.estado.toLowerCase() === 'pendiente');
    const aprobadas = data.filter(item => item.estado?.toLowerCase() === 'aprobado');
    const rechazadas = data.filter(item => item.estado?.toLowerCase() === 'rechazado');

    return (
        <React.Fragment>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Becas" />
            <div className="container mx-auto py-2 px-2">
                <h1 className="text-2xl font-bold mb-4">Becas CIUNAC</h1>
                <MyTabs defaultValue="nuevas" items={[
                    {
                        value: "nuevas",
                        label: `Nuevas (${nuevas.length})`,
                        content: <SolicitudBecasDataTable data={nuevas} />
                    },
                    {
                        value: "aprobados",
                        label: `Aprobadas (${aprobadas.length})`,
                        content: <SolicitudBecasDataTable data={aprobadas} />
                    },
                    {
                        value: "rechazados",
                        label: `Rechazadas (${rechazadas.length})`,
                        content: <SolicitudBecasDataTable data={rechazadas} />
                    },
                ]} />
            </div>
        </React.Fragment>
    )
}