import NavigationBread from "@/components/navigation-bread";
import React from "react";
import ConstanciaForm from "@/modules/constancias/components/constancia.form";
import { ConstanciasService } from "@/modules/constancias/constancias.service";
import { IConstancia } from "@/modules/constancias/constancias.interface";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function PageConstanciaDetalle({ params }: PageProps) {
    const { id } = await params;

    let constancia: IConstancia;
    try {
        constancia = await ConstanciasService.getItem<IConstancia>(id);
    } catch {
        notFound();
    }

    return (
        <React.Fragment>
            <NavigationBread
                section="Constancias"
                href="/constancias"
                page={`Detalle - ${constancia.estudiante}`}
            />
            <div className="container mx-auto py-4 px-4 max-w-6xl">
                <ConstanciaForm constancia={constancia} />
            </div>
        </React.Fragment>
    );
}
