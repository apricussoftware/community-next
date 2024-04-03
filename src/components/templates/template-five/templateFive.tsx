import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";

export const TemplateFive: FC<CKEViewerProps> = ({id, html}) => {
    return (<>
        <div>TemplateFive</div>
        <CKEViewer id={id} html={html}></CKEViewer>
    </>);
}
