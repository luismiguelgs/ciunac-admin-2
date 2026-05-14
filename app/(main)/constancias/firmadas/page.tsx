import NavigationBread from "@/components/navigation-bread";
import React from "react";
import { ConstanciasTable } from "@/modules/constancias/components/constancias.table";

export default function PageConstanciasFirmadas() {
    return (
        <React.Fragment>
            <NavigationBread section="Constancias" href="/constancias" page="Constancias firmadas" />
            <div className="container mx-auto py-4 px-4 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Constancias firmadas</h1>
                    <p className="text-muted-foreground">
                        Lista de constancias que han sido aceptadas y están listas para ser impresas o entregadas.
                    </p>
                </div>

                <div className="bg-card rounded-xl border shadow-sm p-6">
                    <ConstanciasTable state="impresos" />
                </div>
            </div>
        </React.Fragment>
    );
}
