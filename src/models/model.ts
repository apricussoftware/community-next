export enum ModuleType {
    DefaultTemplate = 0,
    TemplateOne = 1,
    TemplateTwo = 2,
    TemplateThree = 3,
    TemplateFour = 4,
    TemplateSideNav = 5,
}

export interface TenantCacheModel {
    languages: LanguageModel[]
    tenant: string;
    tenantId: string;
    enableLogin: boolean;
    pages: CommunityPageModel[];
    header: string,
    footer: string,
    googleTagManagerKey: string
}
  
export interface UserModel
{
    userId: string;
    userName: string;
    displayName: string;
    roles: string[];
}

export interface CommunityPageModel
{
    pageId: string;
    moduleType: ModuleType;
    url: string;
    roles: string[];
}

export interface LanguageModel
{
    key: string;
    name: string;
    isDefault: boolean;
}
