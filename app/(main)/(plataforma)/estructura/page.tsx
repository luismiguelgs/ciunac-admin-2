import React from "react";
import NavigationBread from "@/components/navigation-bread";
import MyTabs from "@/components/my-tabs";
import OpPeriodos from "@/modules/estructura/components/op-periodos";
import OpAulas from "@/modules/estructura/components/op-aulas";
import OpCiclos from "@/modules/estructura/components/op-ciclos";
import OpIdiomas from "@/modules/estructura/components/op-idiomas";
import OpNiveles from "@/modules/estructura/components/op-niveles";
import OpTextos from "@/modules/estructura/components/op-textos";

export default function Estructura() {
    return <React.Fragment>
        <NavigationBread section="Plataforma" href="/dashboard" page="Estructuración" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <MyTabs defaultValue="periodos" items={[
                {
                    value: "periodos",
                    label: "Periodos",
                    content: <OpPeriodos />
                },
                {
                    value: "aulas",
                    label: "Aulas",
                    content: <OpAulas />
                },
                {
                    value: "ciclos",
                    label: "Ciclos",
                    content: <OpCiclos />
                },
                {
                    value: "idiomas",
                    label: "Idiomas",
                    content: <OpIdiomas />
                },
                {
                    value: "niveles",
                    label: "Niveles",
                    content: <OpNiveles />
                },
                {
                    value: "textos",
                    label: "Textos",
                    content: <OpTextos />
                }
            ]} />
        </div>
    </React.Fragment>
}
