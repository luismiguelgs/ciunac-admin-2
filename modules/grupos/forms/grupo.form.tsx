'use client'

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues, GrupoSchema, schema } from "./grupo.schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input.field";
import { SelectField } from "@/components/forms/select.field";
import { X, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IGrupo } from "../interfaces/grupo.interface";
import GruposService from "../grupo.service";
import useOpciones from "@/modules/estructura/hooks/use-opciones";
import { Collection } from "@/modules/estructura/services/opciones.service";
import ICiclo from "@/modules/estructura/interfaces/ciclo.interface";
import DocentesService from "@/modules/seguimiento-docente/docentes/docente.service";
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface";
import SaveButton from "@/components/save.button";
import { ComboField } from "@/components/forms/combo.field";
import { AuditSection } from "@/components/audit.section";
import { SelectPeriodo } from "@/components/select-periodo";

interface IItem {
    id: number;
    nombre: string;
    activo?: boolean;
}

export default function GrupoForm({ grupo }: { grupo?: IGrupo }) {
    const form = useForm<GrupoSchema>({
        resolver: zodResolver(schema),
        defaultValues: grupo ? {
            moduloId: String(grupo.moduloId),
            cicloId: String(grupo.cicloId),
            codigo: grupo.codigo,
            docenteId: grupo.docenteId,
            frecuencia: grupo.frecuencia,
            modalidad: grupo.modalidad,
            aulaId: grupo.aulaId ? String(grupo.aulaId) : null,
        } : defaultValues,
    })

    const [isEditing, setIsEditing] = React.useState(!grupo);
    const router = useRouter();
    const [docentes, setDocentes] = React.useState<IDocente[]>([]);
    const [loadingDocentes, setLoadingDocentes] = React.useState(false);

    const { data: ciclos, loading: loadingCiclos } = useOpciones<ICiclo>(Collection.Ciclos);
    const { data: aulas, loading: loadingAulas } = useOpciones<IItem>(Collection.Salones);

    React.useEffect(() => {
        const fetchDocentes = async () => {
            setLoadingDocentes(true);
            try {
                const data = await DocentesService.fetchItems();
                setDocentes(data);
            } catch (error) {
                console.error("Error fetching docentes", error);
            } finally {
                setLoadingDocentes(false);
            }
        };
        fetchDocentes();
    }, []);

    const onSubmit = async (data: GrupoSchema) => {
        try {
            const payload: IGrupo = {
                ...data,
                moduloId: Number(data.moduloId),
                cicloId: Number(data.cicloId),
                aulaId: data.aulaId ? Number(data.aulaId) : undefined,
            };

            if (grupo) {
                await GruposService.updateItem<IGrupo>({ ...payload, id: grupo.id } as IGrupo);
                toast.success("Grupo actualizado", { description: "El grupo se ha actualizado correctamente." });
            } else {
                const newGrupo = await GruposService.newItem<IGrupo>(payload as IGrupo);
                toast.success("Grupo creado", { description: "El grupo se ha creado correctamente." });
                router.push(`/grupos/${newGrupo.id}`);
            }
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Ha ocurrido un error al guardar." });
        }
    }

    const optionsCiclos = ciclos?.map(c => ({ label: c.nombre, value: String(c.id) })) || [];
    const optionsAulas = aulas?.map(a => ({ label: a.nombre, value: String(a.id) })) || [];
    const optionsDocentes = docentes?.filter(d => d.activo).map(d => ({ label: `${d.nombres} ${d.apellidos}`, value: String(d.id) })) || [];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{grupo ? 'Editar Grupo' : 'Nuevo Grupo'}</CardTitle>
                    <CardDescription>
                        Complete la información del grupo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="grupo-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectPeriodo
                                control={form.control}
                                name="moduloId"
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="cicloId"
                                label="Ciclo"
                                placeholder="Seleccionar ciclo"
                                options={optionsCiclos}
                                loading={loadingCiclos}
                                disabled={!isEditing}
                            />
                            <ComboField
                                control={form.control}
                                name="docenteId"
                                label="Docente"
                                placeholder="Buscar docente..."
                                description="Seleccione un docente."
                                options={optionsDocentes}
                                loading={loadingDocentes}
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="aulaId"
                                label="Aula"
                                placeholder="Seleccionar aula"
                                options={optionsAulas}
                                loading={loadingAulas}
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="frecuencia"
                                label="Frecuencia"
                                placeholder="Ingrese frecuencia (ej. Lun-Vie)"
                                options={[
                                    { label: 'Lun-Vie', value: 'LV' },
                                    { label: 'Lun-Mie-Vie', value: 'IT' },
                                    { label: 'Sab-Dom', value: 'SD' },
                                ]}
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="modalidad"
                                label="Modalidad"
                                placeholder="Ingrese modalidad"
                                options={[
                                    { label: 'INTENSIVO', value: 'I' },
                                    { label: 'REGULAR', value: 'R' },
                                ]}
                                disabled={!isEditing}
                            />
                            <InputField
                                control={form.control}
                                name="codigo"
                                label="Código"
                                placeholder="Ingrese código"
                                disabled={!isEditing}
                            />
                        </div>

                        {grupo && (
                            <AuditSection creadoEn={grupo.creadoEn} modificadoEn={grupo.modificadoEn} />
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {grupo && !isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                    )}
                    {isEditing && (
                        <>
                            {grupo && (
                                <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={form.formState.isSubmitting}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                            )}
                            <SaveButton form={form} formId="grupo-form" />
                        </>
                    )}
                </CardFooter>
            </Card>
        </>)
}
