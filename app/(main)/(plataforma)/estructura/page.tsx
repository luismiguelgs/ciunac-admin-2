import React from "react";
import NavigationBread from "@/components/navigation-bread";
import MyTabs from "@/components/my-tabs";
import OpPeriodos from "@/modules/estructura/components/op-periodos";
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
                    content: <div>Aulas</div>
                },
                {
                    value: "ciclos",
                    label: "Ciclos",
                    content: <div>Ciclos</div>
                },
                {
                    value: "idiomas",
                    label: "Idiomas",
                    content: <div>Idiomas</div>
                },
                {
                    value: "niveles",
                    label: "Niveles",
                    content: <div>Niveles</div>
                },
                {
                    value: "textos",
                    label: "Textos",
                    content: <div>Textos</div>
                }
            ]} />
        </div>
    </React.Fragment>
}
