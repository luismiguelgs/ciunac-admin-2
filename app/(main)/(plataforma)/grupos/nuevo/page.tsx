import React from "react"
import NavigationBread from "@/components/navigation-bread"
import BackButton from "@/components/back.button"
import GrupoForm from "@/modules/grupos/forms/grupo.form"

export default function NuevoGrupo() {
    return (
        <React.Fragment>
            <NavigationBread section="Grupos" href="/grupos" page="Nuevo Grupo" />
            <div className="container mx-auto p-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Nuevo Grupo</h1>
                    <BackButton href="/grupos" />
                </div>
                <GrupoForm />
            </div>
        </React.Fragment>
    )
}