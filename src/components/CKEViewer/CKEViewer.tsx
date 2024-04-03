import { FC } from "react";

export interface CKEViewerProps {
    id: string;
    html: string;
}

export const CKEViewer: FC<CKEViewerProps> = ({id, html}) => {
    return <div className={`ckeeditor-${id}-container`} dangerouslySetInnerHTML={{__html: html ?? ""}}></div>;
}
