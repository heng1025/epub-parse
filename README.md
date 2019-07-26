### parse epub files(just epub xml,never .epub file)

### Install

```
npm install https://github.com/heng1025/epub-parse.git
```

### How To Use

1.weixin miniprogram

```
import { parseEpubBook, loadEpubChapter, Epub } from '@heng1025/epub-parse';
```

2. browser

```HTML
<script src="../dist/index.umd.min.js"></script>
<script>
// ...global Epub
const {spine, manifest,packageDirectory,toc} = await Epub.parseEpubBook(epubUri);
let { rawTexts } = await Epub.loadEpubChapter(epub,chapterCount);
// ...
<script>
```

### API

1. parseEpubBook

```typescript
function parseEpubBook(
  rootURL: string,
): Promise<{
  spine: Array<any>;
  manifest: Array<any>;
  packageDirectory: string;
  toc: Array<any>;
}>;
```

2. loadEpubChapter

```typescript
export function loadEpubChapter(
  epub: Epub,
  chapterCount: number,
): Promise<{ rawText: string; formatTexts: string }>;
```

| params  |          description           |
| :-----: | :----------------------------: |
| epubUri | container.xm path of epub file |

> reference https://github.com/dariocravero/parse-epub.git
