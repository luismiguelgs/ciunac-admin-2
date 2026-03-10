import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award, CheckCircle2, BookOpen, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress"
import React from "react";

type Props = {
    perfilProfesional: { obtenido: number, maximo: number }
    cumplimientoAdmin: { obtenido: number, maximo: number }
    gestionAula: { obtenido: number, maximo: number }
    valoracionEstudiantil: { obtenido: number, maximo: number }
}

export default function DetalleRankingPilares({ perfilProfesional, cumplimientoAdmin, gestionAula, valoracionEstudiantil }: Props) {

    return (
        <React.Fragment>
            <Card className="md:col-span-2 xl:col-span-3 overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                                Desglose por Pilares
                            </CardTitle>
                            <CardDescription>Puntajes obtenidos vs Máximos posibles por área de evaluación</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Pilar 1: Perfil Profesional */}
                        <div className="space-y-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                    <Award className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold leading-tight">Perfil Profesional</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-foreground">{perfilProfesional.obtenido.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground font-semibold mb-1">/ {perfilProfesional.maximo} pts</span>
                                </div>
                                <Progress value={(perfilProfesional.obtenido / perfilProfesional.maximo) * 100} className="h-2.5 bg-primary/20 [&>div]:bg-primary" />
                            </div>
                        </div>

                        {/* Pilar 2: Cumplimiento Admin */}
                        <div className="space-y-4 p-4 rounded-xl bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors border border-emerald-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold leading-tight">Cumplimiento Admin</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-foreground">{cumplimientoAdmin.obtenido.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground font-semibold mb-1">/ {cumplimientoAdmin.maximo} pts</span>
                                </div>
                                <Progress value={(cumplimientoAdmin.obtenido / cumplimientoAdmin.maximo) * 100} className="h-2.5 bg-emerald-500/20 [&>div]:bg-emerald-500" />
                            </div>
                        </div>

                        {/* Pilar 3: Gestión Aula */}
                        <div className="space-y-4 p-4 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors border border-blue-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold leading-tight">Gestión de Aula</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-foreground">{gestionAula.obtenido.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground font-semibold mb-1">/ {gestionAula.maximo} pts</span>
                                </div>
                                <Progress value={(gestionAula.obtenido / gestionAula.maximo) * 100} className="h-2.5 bg-blue-500/20 [&>div]:bg-blue-500" />
                            </div>
                        </div>

                        {/* Pilar 4: Valoración Estudiantil */}
                        <div className="space-y-4 p-4 rounded-xl bg-purple-500/5 hover:bg-purple-500/10 transition-colors border border-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold leading-tight">Valoración Estudiantil</span>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-3xl font-bold text-foreground">{valoracionEstudiantil.obtenido.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground font-semibold mb-1">/ {valoracionEstudiantil.maximo} pts</span>
                                </div>
                                <Progress value={(valoracionEstudiantil.obtenido / valoracionEstudiantil.maximo) * 100} className="h-2.5 bg-purple-500/20 [&>div]:bg-purple-500" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}