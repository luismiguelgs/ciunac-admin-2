"use client"

import React from "react"
import NavigationBread from "@/components/navigation-bread"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Area,
    AreaChart,
    RadialBar,
    RadialBarChart,
    PolarGrid,
} from "recharts"
import {
    Users,
    Star,
    TrendingUp,
    CheckCircle2,
    AlertCircle
} from "lucide-react"

// Mock Data
const overviewData = [
    {
        title: "Total Docentes",
        value: "124",
        description: "+12% desde el mes pasado",
        icon: Users,
        color: "text-blue-500",
    },
    {
        title: "Cumplimiento Docente",
        value: "85%",
        description: "+5% desde el ciclo anterior",
        icon: CheckCircle2,
        color: "text-emerald-500",
    },
    {
        title: "Promedio Ranking",
        value: "4.8",
        description: "-0.2 vs meta global",
        icon: Star,
        color: "text-amber-500",
    },
    {
        title: "Documentos Pendientes",
        value: "12",
        description: "Requiere atención inmediata",
        icon: AlertCircle,
        color: "text-red-500",
    },
]

const rankingData = [
    { language: "Inglés", score: 4.5, fill: "var(--color-ingles)" },
    { language: "Francés", score: 4.8, fill: "var(--color-frances)" },
    { language: "Alemán", score: 4.2, fill: "var(--color-aleman)" },
    { language: "Portugués", score: 4.9, fill: "var(--color-portugues)" },
    { language: "Italiano", score: 4.6, fill: "var(--color-italiano)" },
]

const rankingConfig = {
    score: {
        label: "Puntaje Promedio",
    },
    ingles: {
        label: "Inglés",
        color: "hsl(var(--chart-1))",
    },
    frances: {
        label: "Francés",
        color: "hsl(var(--chart-2))",
    },
    aleman: {
        label: "Alemán",
        color: "hsl(var(--chart-3))",
    },
    portugues: {
        label: "Portugués",
        color: "hsl(var(--chart-4))",
    },
    italiano: {
        label: "Italiano",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const complianceData = [
    { status: "complete", value: 75, fill: "var(--color-complete)" },
    { status: "pending", value: 25, fill: "var(--color-pending)" },
]

const complianceConfig = {
    value: { label: "Porcentaje" },
    complete: {
        label: "Completado",
        color: "hsl(var(--chart-2))",
    },
    pending: {
        label: "Pendiente",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

const academicTrendData = [
    { month: "Ene", load: 1200 },
    { month: "Feb", load: 1500 },
    { month: "Mar", load: 1100 },
    { month: "Abr", load: 1800 },
    { month: "May", load: 2200 },
    { month: "Jun", load: 1900 },
]

const trendConfig = {
    load: {
        label: "Carga Académica",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function Dashboard() {
    return (
        <React.Fragment>
            <NavigationBread section="Dashboard" href="/dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
                {/* Overview Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {overviewData.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.title}
                                </CardTitle>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.value}</div>
                                <p className="text-muted-foreground text-xs">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Ranking by Language - Bar Chart */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Ranking Promedio por Idioma</CardTitle>
                            <CardDescription>
                                Desempeño docente basado en las últimas evaluaciones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={rankingConfig} className="aspect-auto h-[300px] w-full">
                                <BarChart
                                    data={rankingData}
                                    layout="vertical"
                                    margin={{ left: 40 }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="language"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="score" layout="vertical" radius={5} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 font-medium leading-none">
                                Portugués lidera el ranking este ciclo <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                                Datos actualizados según el registro de notas final.
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Documentation Compliance - Radial Chart */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Cumplimiento de Documentación</CardTitle>
                            <CardDescription>
                                Estado de entrega de actas y registros.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer
                                config={complianceConfig}
                                className="mx-auto aspect-square max-h-[250px]"
                            >
                                <RadialBarChart
                                    data={complianceData}
                                    startAngle={0}
                                    endAngle={360}
                                    innerRadius={80}
                                    outerRadius={110}
                                >
                                    <PolarGrid
                                        gridType="circle"
                                        radialLines={false}
                                        stroke="none"
                                        className="first:fill-muted last:fill-background"
                                    />
                                    <RadialBar dataKey="value" background cornerRadius={10} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel nameKey="status" />}
                                    />
                                </RadialBarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                75% completado hasta la fecha <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                                12 docentes con documentos pendientes.
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Academic Load Trend - Area Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencia de Carga Académica</CardTitle>
                        <CardDescription>
                            Evolución de horas dictadas durante el primer semestre.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={trendConfig} className="aspect-auto h-[250px] w-full">
                            <AreaChart
                                data={academicTrendData}
                                margin={{ left: 12, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dot" hideLabel />}
                                />
                                <Area
                                    dataKey="load"
                                    type="natural"
                                    fill="var(--color-load)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-load)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter>
                        <div className="flex w-full items-start gap-2 text-sm">
                            <div className="grid gap-2">
                                <div className="flex items-center gap-2 font-medium leading-none">
                                    Incremento del 15% en Mayo <TrendingUp className="h-4 w-4" />
                                </div>
                                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                    Periodo Enero - Junio 2026
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </React.Fragment>
    )
}