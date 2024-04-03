import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";

export const TemplateThree: FC<CKEViewerProps> = ({id, html}) => {
    return (<>
        <div>TemplateThree</div>
        <CKEViewer id={id} html={html}></CKEViewer>
    </>);
}
