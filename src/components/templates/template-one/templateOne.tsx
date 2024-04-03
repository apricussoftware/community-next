import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";
import { FAQComponent } from "@/components/FAQComponent/FAQComponent";
import { FAQModel } from "@/components/FAQComponent/FAQ.model";

export interface TemplateOneProps {
    id: string;
    html: string;
    model: FAQModel[];
}

export const TemplateOne: FC<TemplateOneProps> = ({id, html, model}) => {
    return (<>
        <div>TemplateOne</div>
        <CKEViewer id={id} html={html}></CKEViewer>

        <div>FAQ Section</div>
        <FAQComponent model={model}></FAQComponent>
    </>);
}
