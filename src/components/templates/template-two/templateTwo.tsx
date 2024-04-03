import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";

export const TemplateTwo: FC<CKEViewerProps> = ({id, html}) => {
    return (<>
        <div>TemplateTwo</div>
        <CKEViewer id={id} html={html}></CKEViewer>
    </>);
}
