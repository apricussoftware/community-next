import { headers } from "next/headers";
import { metadata } from "../layout";
import { redirect } from 'next/navigation'
import { getPageData, getPageTemplate } from "@/utils/helper";
import { ModuleType } from "@/models/model";
import { DefaultTemplate, TemplateFive, TemplateFour, TemplateOne, TemplateThree, TemplateTwo } from "@/components";

export default async function Page() {
  const headersList = headers();
  const relativePath = headersList.get("x-pathname");
  const tenant = headersList.get('host')?.split(':')[0];
  let errorMessage = "";
  let pageTemplate = ModuleType.DefaultTemplate;
  let pageData;

  try {  
    pageTemplate = await getPageTemplate(tenant!, relativePath);
    pageData = await getPageData(tenant!, relativePath)
  } catch (error: any) {
    if (error instanceof Response) { 
      try {
        const errors = await error.json();
        if (errors.status === 404 || errors.status === 401 || errors.status === 403) {
          redirect(`/${errors.status}`)
        } else {
          errorMessage = `${errors}`;
        }
      } catch (reason) {
        errorMessage = `Unexpected Error: ${reason}, Please contact administrator.}`;          
      }
    }
  }

  metadata.description = "";
  metadata.keywords = "";

  switch (pageTemplate) {
    case ModuleType.TemplateOne:
      return <div>
        <TemplateOne {...pageData}/> 
      </div>     
    case ModuleType.TemplateTwo:
      return <div>
        <TemplateTwo id="one" html={`<div>${headersList.get("x-pathname")}</div>`}/> 
      </div>
    case ModuleType.TemplateThree:
      return <div>
        <TemplateThree id="one" html={`<div>${headersList.get("x-pathname")}</div>`}/> 
      </div>
    case ModuleType.TemplateFour:
      return <div>
        <TemplateFour id="one" html={`<div>${headersList.get("x-pathname")}</div>`}/> 
      </div>
    case ModuleType.TemplateSideNav:
      return <div>
        <TemplateFive id="one" html={`<div>${headersList.get("x-pathname")}</div>`}/> 
      </div>
    default:
      case ModuleType.DefaultTemplate:
      return <div>
        <DefaultTemplate  id="one" html={`<div>${headersList.get("x-pathname")}</div>`} /> 
      </div>
  }
}

