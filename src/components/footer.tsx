import React from "react";

export interface Footerprops {
    html: string;
}

export const Footer : React.FC<Footerprops> = async ({html}) => { 
    return <footer dangerouslySetInnerHTML={ { __html: html } }/>
}

