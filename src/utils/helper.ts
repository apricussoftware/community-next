import { ModuleType, TenantCacheModel } from '@/models/model';
import { cache } from 'react';
import { promises as fs } from 'fs';
import { access } from 'fs/promises';

export const fileExists = async (filename:string|null) => {
  try {
      if (filename) {
        await access(filename);
        return true;
      }
  } catch (err) {}

  return false;
}

export const getPageData = async (tenant: string, relativePath: string|null) => {
  const filePath = `./public/sites/${tenant}${relativePath}.json`;
  const exists = await fileExists(filePath);
  if (exists) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }
  
  return null;
}

export const getTenantData = cache(async (tenant: string) => {
  const data = await fs.readFile(`./public/sites/${tenant}/TenantCacheModel.json`, 'utf8');
  
  const result = JSON.parse(data) as TenantCacheModel;
  
  const header = await fs.readFile(`./public/sites/${tenant}/header.html`, 'utf8');
  const footer = await fs.readFile(`./public/sites/${tenant}/footer.html`, 'utf8');
  
  result.header = header;
  result.footer = footer;

  return result;
});

export const getPageTemplate = cache(async (tenant: string, relativePath: string|null) => {
  const data = await getTenantData(tenant);
  const matches = data.pages.filter(c => c.url === relativePath);
  if (matches && matches.length > 0) {
    return matches[0].moduleType;
  }

  return ModuleType.DefaultTemplate;
});