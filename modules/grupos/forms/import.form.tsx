'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useOpciones from '@/modules/estructura/hooks/use-opciones'
import { Collection } from '@/modules/estructura/services/opciones.service'
import { IModulo } from '@/modules/estructura/interfaces/types.interface'
import { SelectField } from '@/components/forms/select.field'
import GrupoService from '../grupo.service'
import React from "react"
import { Download, Loader2, Search } from 'lucide-react'
import { ICursoQ10 } from "../interfaces/cursoq10.interface";
import { useRouter } from 'next/navigation'

const ImportForm = ({ onImport }: { onImport: (cursos: ICursoQ10[]) => void }) => {
    const router = useRouter();
    const { data, loading } = useOpciones<IModulo>(Collection.Modulos);
    const [isFetching, setIsFetching] = React.useState(false);
    const [isImporting, setIsImporting] = React.useState(false);

    const onSubmit = async (result: z.infer<typeof schema>) => {
        const periodo = Number(result.periodo);
        const nombrePeriodo = data?.find((item) => item.id === periodo)?.nombre;

        setIsImporting(true);
        try {
            await GrupoService.importItems(periodo, nombrePeriodo ?? "");
            router.push('/grupos');
        } finally {
            setIsImporting(false);
        }
    }

    const onClickImport = async () => {
        const fieldPeriodo = form.getValues("periodo");
        if (!fieldPeriodo) return;

        setIsFetching(true);
        try {
            const periodo = Number(fieldPeriodo);
            const nombrePeriodo = data?.find((item) => item.id === periodo)?.nombre;
            const cursos = await GrupoService.getImportItems(nombrePeriodo ?? "");
            onImport(cursos);
        } finally {
            setIsFetching(false);

        }
    }

    const schema = z.object({
        periodo: z.string().min(1, "Periodo es requerido"),
    })

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            periodo: "",
        },
    })

    const options = data?.filter((item) => item.activo).map((item) => ({
        label: item.nombre,
        value: String(item.id)
    })) || []

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Importar Grupos</CardTitle>
                <CardDescription>
                    Seleccionar periodo para importar grupos
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-import" onSubmit={form.handleSubmit(onSubmit)}>
                    <SelectField
                        control={form.control}
                        name="periodo"
                        label="Periodo"
                        placeholder="Seleccionar periodo"
                        description="Seleccionar periodo"
                        options={options}
                        loading={loading}
                        orientation="horizontal"
                    />
                </form>
            </CardContent>
            <CardFooter>
                <div className='flex gap-2 justify-end w-full'>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClickImport}
                        disabled={isFetching || !form.watch("periodo")}
                    >
                        {isFetching ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="mr-2 h-4 w-4" />
                        )}
                        Ver Cursos
                    </Button>
                    <Button
                        type="submit"
                        form="form-import"
                        disabled={isImporting || isFetching || !form.watch("periodo")}
                    >
                        {isImporting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Download className="mr-2 h-4 w-4" />
                        )}
                        Importar
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ImportForm