export function parseEpubBook(uri: string): Promise<any>;
export function loadEpubChapter(
  rootURL: string,
  packageDirectory: string,
  spine: object,
  manifest: object,
  chapterCount: number,
): Promise<any>;
