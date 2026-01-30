import React from "react";
import NavigationBread from "@/components/navigation-bread";
import ImportarGrupos from "@/modules/grupos/components/importar-grupos";
import BackButton from "@/components/back.button";

export default async function ImportarGruposPage() {
    return (
        <React.Fragment>
            <NavigationBread section="Grupos" href="/grupos" page="Importar" />
            <div className="container mx-auto p-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-4">Importar Grupos</h1>
                    <BackButton href="/grupos" />
                </div>
                <ImportarGrupos />
            </div>
        </React.Fragment>
    )
}