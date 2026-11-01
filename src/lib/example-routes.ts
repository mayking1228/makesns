export const exampleSlugs=['profile-bio','caption-spacing','symbols'] as const;
export type ExampleSlug=typeof exampleSlugs[number];
export function isExampleSlug(value:string):value is ExampleSlug{return (exampleSlugs as readonly string[]).includes(value);}
