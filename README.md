### parse epub files(just epub xml,never .epub file)

### install

```
npm install https://github.com/heng1025/epub-parse.git
```

### How To Use

1. node or miniprogram

```
import { parseEpubBook, loadEpubChapter } from '@heng1025/epub-parse';
```

2. browser

```
<script src="../dist/index.umd.min.js"></script>
<script>
// ...global Epub
const {spine, manifest,packageDirectory,toc} = await Epub.parseEpubBook(epubUri);
let chapterContent = await Epub.loadEpubChapter(
    epubUri,
    packageDirectory,
    spine,
    manifest,
    chapterCount,
);
// ...
<script>
```

### API

1. parseEpubBook

```typescript
function parseEpubBook(
  epubUri: string,
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
  rootURL: string,
  packageDirectory: string,
  spine: Array<any>,
  manifest: Array<any>,
  chapterCount: number,
): Promise<string>;
```

| params  |          description           |
| :-----: | :----------------------------: |
| epubUri | container.xm path of epub file |

> reference https://github.com/dariocravero/parse-epub.git
