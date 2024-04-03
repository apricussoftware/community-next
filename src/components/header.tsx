import React from "react";

export interface Headerprops {
    html: string;
}

export const Header: React.FC<Headerprops> = async ({html}) => { 
    return <header id="cms-header" className="cms cms-header" dangerouslySetInnerHTML={ { __html: html } } />
}

