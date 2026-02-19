'use client'

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfilDocenteDefaultValues, PerfilDocenteSchema, perfilDocenteSchema } from "./perfil-docente.schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/forms/input.field";
import { SelectField } from "@/components/forms/select.field";
import { X, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PerfilDocente } from "../interfaces/perfil-docente.interface";
import PerfilDocenteService from "../services/perfil-docente.service";
import useOpciones from "@/modules/estructura/hooks/use-opciones";
import { Collection } from "@/modules/estructura/services/opciones.service";
import { IIdioma } from "@/modules/estructura/interfaces/types.interface";
import DocentesService from "@/modules/seguimiento-docente/docentes/docente.service";
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface";
import SaveButton from "@/components/save.button";
import { ComboField } from "@/components/forms/combo.field";
import { AuditSection } from "@/components/audit.section";

export default function PerfilDocenteForm({ perfil }: { perfil?: PerfilDocente }) {
    const form = useForm<PerfilDocenteSchema>({
        resolver: zodResolver(perfilDocenteSchema),
        defaultValues: perfil ? {
            docenteId: perfil.docenteId,
            experienciaTotal: String(perfil.experienciaTotal),
            idiomaId: String(perfil.idiomaId),
            nivelIdioma: perfil.nivelIdioma,
            puntajeFinal: String(perfil.puntajeFinal),
        } : perfilDocenteDefaultValues,
    })

    const [isEditing, setIsEditing] = React.useState(!perfil);
    const router = useRouter();
    const [docentes, setDocentes] = React.useState<IDocente[]>([]);
    const [loadingDocentes, setLoadingDocentes] = React.useState(false);

    const { data: idiomas, loading: loadingIdiomas } = useOpciones<IIdioma>(Collection.Idiomas);

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

    const onSubmit = async (data: PerfilDocenteSchema) => {
        try {
            const payload: PerfilDocente = {
                ...data,
                nivelIdioma: data.nivelIdioma ? String(data.nivelIdioma) : null,
                experienciaTotal: Number(data.experienciaTotal),
                idiomaId: Number(data.idiomaId),
                puntajeFinal: Number(data.puntajeFinal),
            };

            if (perfil) {
                await PerfilDocenteService.updateItem({ ...payload, id: perfil.id });
                toast.success("Perfil docente actualizado", { description: "El perfil se ha actualizado correctamente." });
            } else {
                await PerfilDocenteService.newItem(payload);
                toast.success("Perfil docente creado", { description: "El perfil se ha creado correctamente." });
                router.push(`/perfil-docente/ranking-docentes`);
            }
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Error", { description: "Ha ocurrido un error al guardar." });
        }
    }

    const optionsIdiomas = idiomas?.map(i => ({ label: i.nombre, value: String(i.id) })) || [];
    const optionsDocentes = docentes?.filter(d => d.activo).map(d => ({ label: `${d.nombres} ${d.apellidos}`, value: String(d.id) })) || [];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{perfil ? 'Editar Perfil Docente' : 'Nuevo Perfil Docente'}</CardTitle>
                    <CardDescription>
                        Complete la información del perfil del docente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="perfil-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <InputField
                                control={form.control}
                                name="experienciaTotal"
                                label="Experiencia Total (años)"
                                placeholder="Ingrese años de experiencia"
                                type="number"
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="idiomaId"
                                label="Idioma"
                                placeholder="Seleccionar idioma"
                                options={optionsIdiomas}
                                loading={loadingIdiomas}
                                disabled={!isEditing}
                            />
                            <SelectField
                                control={form.control}
                                name="nivelIdioma"
                                label="Nivel de Idioma"
                                placeholder="Seleccionar nivel"
                                options={[
                                    { label: 'B2 - Usuario Independiente (Intermedio Alto)', value: 'B2' },
                                    { label: 'C1 - Usuario Competente (Avanzado)', value: 'C1' },
                                    { label: 'C2 - Usuario (Maestria)', value: 'C2' },
                                ]}
                                disabled={!isEditing}
                            />
                            <InputField
                                control={form.control}
                                name="puntajeFinal"
                                label="Puntaje Final"
                                placeholder="Ingrese puntaje final"
                                type="number"
                                disabled={true}
                            />
                        </div>

                        {perfil && (
                            <AuditSection
                                creadoEn={perfil.creadoEn ? new Date(perfil.creadoEn) : undefined}
                                modificadoEn={perfil.modificadoEn ? new Date(perfil.modificadoEn) : undefined}
                            />
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {perfil && !isEditing && (
                        <Button onClick={() => setIsEditing(true)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                    )}
                    {isEditing && (
                        <>
                            {perfil && (
                                <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={form.formState.isSubmitting}>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                </Button>
                            )}
                            <SaveButton form={form} formId="perfil-form" />
                        </>
                    )}
                </CardFooter>
            </Card>
        </>)
}
