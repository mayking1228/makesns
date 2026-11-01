import dictionary from './locales/library-ui.json';
import type {Lang} from './site';
export const libraryCopy=dictionary;
export function libraryText(lang:Lang){return libraryCopy[lang];}
