import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, Users } from "lucide-react";
import React from "react";
import { CartesianGrid, XAxis, YAxis, Area, Bar, AreaChart, BarChart } from "recharts";
import { IPerfilResultado } from "../interfaces/perfil-resultado.interface";
import { DetalleResultado } from "../interfaces/detalle-resultado.interface";

const tendenciaConfig = {
    puntaje: {
        label: "Puntaje Final",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

const aulasConfig = {
    promedio: {
        label: "Promedio",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function DetalleRankingGraficos({ resultados, detalleResultado }: { resultados: IPerfilResultado[] | null, detalleResultado: DetalleResultado | null }) {
    const tendenciaData = (resultados ?? [])
        .map(res => ({
            periodo: res.modulo?.nombre ?? '-',
            puntaje: Number(res.resultadoFinal)
        }))
        .reverse(); // assuming they come newest first, we want them chronological for the area chart

    const valoracionData = (detalleResultado?.promediosGrupos ?? []).map(g => ({
        aula: g.grupo,
        promedio: Number(g.promedio)
    }));

    return (
        <React.Fragment>
            {/* 4. Tendencia Histórica */}
            <Card className="flex flex-col border-border/50 shadow-sm md:col-span-1 xl:col-span-2">
                <CardHeader className="bg-muted/20 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Tendencia Histórica
                    </CardTitle>
                    <CardDescription>Evolución en los últimos periodos</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                    <div className="h-[250px] w-full">
                        {tendenciaData.length > 0 ? (
                            <ChartContainer config={tendenciaConfig} className="h-full w-full">
                                <AreaChart data={tendenciaData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="fillPuntaje" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-puntaje)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--color-puntaje)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="hsl(var(--muted-foreground))" />
                                    <XAxis dataKey="periodo" tickLine={false} axisLine={false} tickMargin={12} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={12} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="puntaje"
                                        stroke="var(--color-puntaje)"
                                        fill="url(#fillPuntaje)"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center border-2 border-dashed rounded-xl bg-muted/5">
                                <p className="text-muted-foreground text-sm">No hay datos históricos suficientes.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 5. Promedio de Valoración por Aula */}
            <Card className="flex flex-col border-border/50 shadow-sm md:col-span-1 xl:col-span-1">
                <CardHeader className="bg-muted/20 border-b pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        Valoración Estudiantil
                    </CardTitle>
                    <CardDescription>Promedio por grupos asignados</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                    <div className="h-[250px] w-full">
                        {valoracionData.length > 0 ? (
                            <ChartContainer config={aulasConfig} className="h-full w-full">
                                <BarChart data={valoracionData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} stroke="hsl(var(--muted-foreground))" />
                                    <XAxis type="number" domain={[0, 100]} hide />
                                    <YAxis dataKey="aula" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: 'hsl(var(--foreground))', fontSize: 11, fontWeight: 500 }} />
                                    <ChartTooltip content={<ChartTooltipContent cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />} />
                                    <Bar
                                        dataKey="promedio"
                                        fill="var(--color-promedio)"
                                        radius={[0, 6, 6, 0]}
                                        barSize={24}
                                        label={{ position: 'right', fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 'bold', formatter: (val: number) => val }}
                                    />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center border-2 border-dashed rounded-xl bg-muted/5">
                                <p className="text-muted-foreground text-sm text-center px-4">No se encontraron valoraciones para este periodo.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
