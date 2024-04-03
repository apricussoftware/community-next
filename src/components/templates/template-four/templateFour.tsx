import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";

export const TemplateFour: FC<CKEViewerProps> = ({id, html}) => {
    return (<>
        <div>TemplateFour</div>
        <CKEViewer id={id} html={html}></CKEViewer>
    </>);
}
