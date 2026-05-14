import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service";
import { SolicitudConstanciasDetails } from "@/modules/solicitudes/constancias/solicitud-constancias.details";
import { IIdioma, INivel, ITipoSolicitud } from "@/modules/estructura/interfaces/types.interface";
import React from "react";
import { notFound } from "next/navigation";

export default async function PageSolicitudConstanciaDetalle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Estados estáticos según requerimiento del usuario si no hay servicio dinámico
    const staticEstados = [
        { id: 1, nombre: "Nuevas" },
        { id: 2, nombre: "Procesadas" },
        { id: 4, nombre: "Pagadas" },
        { id: 3, nombre: "Finalizadas" },
    ];

    const [solicitud, tiposSolicitud, idiomas, niveles] = await Promise.all([
        SolicitudesService.fetchItemById(id),
        OpcionesService.fetchItems<ITipoSolicitud>(Collection.Tiposolicitud),
        OpcionesService.fetchItems<IIdioma>(Collection.Idiomas),
        OpcionesService.fetchItems<INivel>(Collection.Niveles),
    ]);

    if (!solicitud || !solicitud.id) {
        return notFound();
    }

    const safeTipos = Array.isArray(tiposSolicitud) ? tiposSolicitud : [];
    const safeIdiomas = Array.isArray(idiomas) ? idiomas : [];
    const safeNiveles = Array.isArray(niveles) ? niveles : [];

    return (
        <React.Fragment>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Constancias"
                extraPath={[{ label: `Detalle #${id}`, href: `/solicitudes/constancias/${id}` }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudConstanciasDetails
                    solicitud={solicitud}
                    tiposSolicitud={safeTipos}
                    idiomas={safeIdiomas}
                    niveles={safeNiveles}
                    estados={staticEstados}
                />
            </div>
        </React.Fragment>
    );
}
