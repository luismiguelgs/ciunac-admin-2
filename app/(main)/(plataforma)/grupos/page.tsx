import React, { Suspense } from "react";
import NavigationBread from "@/components/navigation-bread";
import GrupoService from "@/modules/grupos/grupo.service";
import { GruposDataTable } from "@/modules/grupos/components/grupos-data-table";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { IGrupo } from "@/modules/grupos/interfaces/grupo.interface";

async function fetchGrupos() {
    const grupos = await GrupoService.fetchItems<IGrupo>();
    return grupos.map(grupo => ({
        ...grupo,
        docenteFullName: grupo.docente ? `${grupo.docente.nombres} ${grupo.docente.apellidos}` : "No asignado"
    }));
}

export default async function Grupos() {
    const grupos = await fetchGrupos();

    return <React.Fragment>
        <NavigationBread section="Plataforma" href="/dashboard" page="Grupos" />
        <div className="container mx-auto py-2 px-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Grupos</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/grupos/importar">
                            <Download className="mr-2 h-4 w-4" />
                            Importar
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/grupos/nuevo">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Grupo
                        </Link>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<DataTableSkeleton />}>
                <GruposDataTable data={grupos} />
            </Suspense>

        </div>
    </React.Fragment>
}
