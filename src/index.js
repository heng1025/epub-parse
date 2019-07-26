import resolvePathname from 'resolve-pathname';
import entityMap from './util/entities';
import { getDirname } from './util/path-helpers';
import {
  extractRootFile,
  extractManifest,
  extractMetadata,
  extractSpine,
  extractToc,
} from './extract';

import {
  chapterXml as fetchChaterXml,
  containerXml as fetchContainerXml,
  rootXml as fetchRootXml,
  tocHtml as fetchTocHtml,
} from './util/xml-request';

/**
 * 解析 .opf文件
 *
 * @params {String} rootURL contain.xml的根路径
 * @returns {Promise}
 */
function parseEpubBook(rootURL) {
  let packageDirectory;
  return fetchContainerXml(rootURL)
    .then(containerXml => extractRootFile(containerXml))
    .then(rootFile => {
      packageDirectory = getDirname(rootFile);
      return fetchRootXml(rootURL, rootFile);
    })
    .then(rootXml => {
      const manifest = extractManifest(rootXml);
      const spine = extractSpine(rootXml);
      const tocManifestId = manifest.items.find(
        id => id === rootXml.package.spine.toc,
      );
      const tocItem = manifest.byId[tocManifestId];
      return fetchTocHtml(rootURL, tocItem.href, packageDirectory).then(
        tocHtml => ({
          rootURL,
          packageDirectory,
          manifest,
          metadata: extractMetadata(rootXml, manifest),
          spine,
          toc: extractToc(tocHtml, manifest, spine),
        }),
      );
    })
    .catch(err => {
      let nextErr = err;
      if (/Cannot read property 'getAttribute' of null/.test(err.message)) {
        nextErr = new Error(`We couldn't find a book at ${uri}.`);
      }
      throw nextErr;
    });
}

/**
 * 加载每篇文章
 * @param {Epub} epub
 * @param {Number} chapterCount
 * @returns {Promise}
 */
function loadEpubChapter(epub, chapterCount) {
  const fileReg = /('|")[^'|"]*\.(jpg|png|bmp|jpeg|gif|mp3|wma|ogg|3gp|mp4|avi|wmv)\1/gi;
  const srcReg = /src=(?=('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\1)/gi;
  const contentLinkReg = /href=["'](.*?)\.(x?)html(#?)(.*?)['"]/gi;

  const { rootURL, packageDirectory, spine, manifest } = epub;
  const chapterPath = manifest.byId[spine.items[chapterCount]].href;

  return fetchChaterXml(rootURL, chapterPath, packageDirectory)
    .then(chapterText => {
      // prettier-ignore
      let chapterContent = chapterText.replace(/[\r\n]/g, '').match(/\<body[^\>]*>.*\<\/body\>/i)[0];
      chapterContent = chapterContent.replace(contentLinkReg, '');
      // prettier-ignore
      const rawImgPathList = chapterContent.replace(srcReg, 'src=').match(fileReg);

      // img/svg path replace
      if (rawImgPathList && rawImgPathList.length > 0) {
        rawImgPathList.forEach(v => {
          const r = v.replace(/['|"]/g, '');
          // prettier-ignore
          const absImgPath = resolvePathname(r,`/${packageDirectory}/${chapterPath}`,);
          chapterContent = chapterContent.replace(r, `${rootURL}${absImgPath}`);
          // svg
          if (/\<svg/.test(chapterContent)) {
            const svgMatch = /xlink\:href\=\".+\"/;
            if (chapterContent.match(svgMatch)) {
              // prettier-ignore
              const src = chapterContent.match(svgMatch)[0].replace(/xlink\:href/, 'src');
              // prettier-ignore
              chapterContent = chapterContent.replace(/\<svg (.+)\<\/svg>/,`<img ${src}>`,);
            }
          }
        });
      }

      return {
        rawTexts: chapterContent,
        formatTexts: formatText(chapterContent),
      };
    })
    .catch(err => {
      throw new Error(err);
    });
}

function formatText(rawText) {
  // entity char replace
  for (let key in entityMap) {
    const re = new RegExp('&' + key + ';', 'g');
    rawText = rawText.replace(re, entityMap[key]);
  }
  // add class property
  return rawText
    .replace(/\<a/g, '<a class="bk-epub-href"')
    .replace(
      /<img.*?src=(('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\2)[^>]*>/gi,
      '<img class="bk-epub-img" src=$1/>',
    )
    .replace(
      /<(h\d)[^>](.*?)>(.*?)<\/\1>/gi,
      '<h3 class="bk-epub-title" $2>$3</h3>',
    )
    .replace(/\<body/g, '<div class="bk-epub-wrap"')
    .replace(/\<\/body>/g, '<p>~本章完~</p></div>')
    .replace(/<p[^>]*>(.*?)<\/p>/gm, '<p class="bk-epub-txt">$1</p>');
}

export { parseEpubBook, loadEpubChapter };
