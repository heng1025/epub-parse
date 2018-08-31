### epub文件解析
- 支持小程序和web
- web端需要fetch支持

### 使用方法
- 解析epub路径
`parseEpubBook(epubUri).then(bkEpub => bkEpub)`
- 获取每章内容
`const { spine,manifest,packageDirectory } = kEpub;`
`loadEpubChapter(epubUri,packageDirectory,spine,manifest,spinePos) #spinePos表示章节序号`


> 参考 https://github.com/dariocravero/parse-epub.git