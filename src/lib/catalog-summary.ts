import {fontStyles,symbolGroups} from './text';
import expansionIds from './symbol-expansion-ids.json';
import legacyIds from './legacy-symbol-ids.json';
import categories from './symbol-category-keys.json';
import {decorationPresets} from './decoration-catalog';
export const catalogCounts={fonts:fontStyles.length,decorations:decorationPresets.length,symbols:new Set([...Object.values(symbolGroups).flat(),...legacyIds,...expansionIds]).size,categories:new Set([...Object.keys(symbolGroups),...categories]).size};
