import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText } from "lucide-react";
import { DetalleResultado } from "../interfaces/detalle-resultado.interface";

export default function DetalleRankingCumplimiento({ detalleResultado }: { detalleResultado: DetalleResultado | null }) {
    const cumplimiento = (detalleResultado?.cumplimiento ?? []).filter(item => {
        const rubro = item.rubro.toLowerCase();
        return !rubro.includes('gestión metodológica') && !rubro.includes('gestión de aula');
    });
    return (
        <React.Fragment>
            <Card className="md:col-span-2 xl:col-span-3 border-border/50 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4 bg-muted/20 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        Detalle de Cumplimiento Administrativo (20%)
                    </CardTitle>
                    <CardDescription>Visualización detallada de la puntualidad en los procesos documentales del docente.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cumplimiento.map((item, i) => {
                            const isOk = item.puntaje === 100;
                            const estado = isOk ? 'A tiempo' : item.puntaje > 0 ? 'Con retraso' : 'Pendiente';

                            return (
                                <div key={i} className="relative overflow-hidden flex flex-col p-5 rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow group">
                                    {/* Accent line on top */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${isOk ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl transition-colors ${isOk ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40' : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40'}`}>
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant={isOk ? 'default' : 'destructive'} className={`${isOk ? 'bg-emerald-500 hover:bg-emerald-600 shadow-sm' : 'shadow-sm'}`}>
                                                {estado}
                                            </Badge>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-sm md:text-base leading-tight flex-1 mt-2">{item.rubro}</h4>

                                    <div className="mt-6 pt-4 border-t border-border/50">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Efectividad</span>
                                            <span className={`text-xl font-black ${isOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>{item.puntaje}%</span>
                                        </div>
                                        <Progress value={item.puntaje} className={`h-2 ${isOk ? 'bg-emerald-500/20 [&>div]:bg-emerald-500' : 'bg-amber-500/20 [&>div]:bg-amber-500'}`} />
                                    </div>
                                </div>
                            )
                        })}
                        {cumplimiento.length === 0 && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl bg-muted/5">
                                <p className="text-muted-foreground">No se encontraron datos de cumplimiento para este periodo.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
