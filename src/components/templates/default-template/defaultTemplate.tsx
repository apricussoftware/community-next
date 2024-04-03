import { FC } from "react";
import { CKEViewer, CKEViewerProps } from "../../CKEViewer/CKEViewer";

export const DefaultTemplate: FC<CKEViewerProps> = ({id, html}) => {
    return (<>
        <div>DefaultTemplate</div>
        <CKEViewer id={id} html={html}></CKEViewer>
    </>);
}
