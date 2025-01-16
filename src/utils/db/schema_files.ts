import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export const getSchemaFilesInFolder = (folderPath: string): string[] => {
  try {
    const files = readdirSync(folderPath).map((file) => join(folderPath, file));
    const filePaths = files.filter((file) => statSync(file).isFile());
    return filePaths;
  } catch (error) {
    throw new Error(`Error trying to read schema files directory. ${(error as Error).toString()}`);
  }
};
