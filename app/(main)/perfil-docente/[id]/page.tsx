import NavigationBread from "@/components/navigation-bread";
import BackButton from "@/components/back.button";
import React from "react";
import PerfilDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/perfil-docente.service";
import { PerfilDocente } from "@/modules/seguimiento-docente/perfil-docente/interfaces/perfil-docente.interface";
import PerfilDocenteForm from "@/modules/seguimiento-docente/perfil-docente/forms/perfil-docente.form";
import DocumentosPerfil from "@/modules/seguimiento-docente/perfil-docente/components/documentos-perfil";
import IDocumentosPerfil from "@/modules/seguimiento-docente/perfil-docente/interfaces/documentos-perfil.interface"
import DocumentosDocenteService from "@/modules/seguimiento-docente/perfil-docente/services/documentos-docente.service";

async function getData(id: string) {
    const perfil = await PerfilDocenteService.getItem(id);
    return perfil;
}
async function getDocuments(perfilId: string): Promise<IDocumentosPerfil[]> {
    const documentos = await DocumentosDocenteService.getDocuments(perfilId);
    return documentos;
}

export default async function PageDetallePerfil({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const perfil = await getData(id);
    const documentos = await getDocuments(id);

    return (
        <React.Fragment>
            <NavigationBread section="Perfil Docente" href="/perfil-docente/ranking-docentes" page="Detalle Perfil Docente" />
            <div className="container mx-auto p-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Detalle Perfil Docente {id}</h1>
                    <BackButton href="/perfil-docente/documentos" />
                </div>
                <PerfilDocenteForm perfil={perfil as PerfilDocente} />
                <DocumentosPerfil documentos={documentos} perfilId={id} />
            </div>
        </React.Fragment>
    )
}