interface Spine {
  byId: {
    [index: string]: {
      id: string;
    };
  };
  items: string[];
}

interface Manifest {
  byId: {
    [index: string]: {
      href: string;
      id: string;
      mediaType: string;
    };
  };
  items: string[];
}

export interface Toc {
  id: number;
  name: string;
  href: string;
  isLeaf: boolean;
  tocIndex: number;
  sublevels: Toc[];
}

interface Epub {
  rootURL: string;
  toc: Array<Toc>;
  spine: Spine;
  manifest: Manifest;
  packageDirectory: string;
}

export function parseEpubBook(rootURL: string): Promise<Epub>;
export function loadEpubChapter(
  ebub: Epub,
  chapterCount: number,
): Promise<{
  rawTexts: string;
  formatTexts: string;
}>;
