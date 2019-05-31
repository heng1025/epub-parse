### parse epub files(just epub xml,never .epub file)
- support weixin mini miniprogram and web 
- fetch is prereqire when it's browser client

### How To Use
- get epub Object infomation
`parseEpubBook(epubUri).then(bkEpub => bkEpub)`
- get chapter content by count
`const { spine,manifest,packageDirectory } = bkEpub;`
`loadEpubChapter(epubUri,packageDirectory,spine,manifest,spinePos) #spinePos (represent chapter no.)`

### parseEpubBook(epubUri: string):Promise
`epubUri` the root path of epub file
`Promise` which contains `packageDirectory`,`spine`,`manifest`

### loadEpubChapter(epubUri: string)
> 参考 https://github.com/dariocravero/parse-epub.git