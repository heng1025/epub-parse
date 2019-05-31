import resolvePathname from 'resolve-pathname';
import extractManifest from './extract/manifest';
import extractMetadata from './extract/metadata';
import extractRootFile from './extract/root-file';
import extractSpine from './extract/spine';
import extractToc from './extract/toc';
import entityMap from './util/entities';
import { getDirname } from './util/path-helpers';
import {
  chapterXml as fetchChaterXml,
  containerXml as fetchContainerXml,
  rootXml as fetchRootXml,
  tocHtml as fetchTocHtml,
} from './util/xml-request';

/**
 * 解析 .opf文件
 *
 * @params {String} uri contain.xml的根路径
 * @returns {Promise}
 */
function parseEpubBook(uri) {
  let packageDirectory;
  return fetchContainerXml(uri)
    .then(containerXml => extractRootFile(containerXml))
    .then(rootFile => {
      packageDirectory = getDirname(rootFile);
      return fetchRootXml(uri, rootFile);
    })
    .then(rootXml => {
      const manifest = extractManifest(rootXml);
      const spine = extractSpine(rootXml);
      const tocManifestId = manifest.items.find(
        id => id === rootXml.package.spine.toc,
      );
      const tocItem = manifest.byId[tocManifestId];
      return fetchTocHtml(uri, tocItem.href, packageDirectory).then(
        tocHtml => ({
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
 *
 * @param {String} rootURL
 * @param {String} packageDirectory
 * @param {Object} spine
 * @param {Object} manifest
 * @param {Number} chapterCount
 * @returns {Promise}
 */
function loadEpubChapter(
  rootURL,
  packageDirectory,
  spine,
  manifest,
  chapterCount,
) {
  const fileReg = /('|")[^'|"]*\.(jpg|png|bmp|jpeg|gif|mp3|wma|ogg|3gp|mp4|avi|wmv)\1/gi;
  const srcReg = /src=(?=('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\1)/gi;
  const contentLinkReg = /href=["'](.*?)\.(x?)html(#?)(.*?)['"]/gi;
  const splitReg1 = /(\>)([^\>\<]+)(\<)/g;
  const splitReg2 = /(\<span class\=\'bk_avd\'\>)([^\>\<]+)(\<\/span\>)/g; // just as temp
  const splitReg3 = /(\<\/span>)([^\>\<]+)(\<)/g;
  const chapterPath = manifest.byId[spine.items[chapterCount]].href;
  return fetchChaterXml(rootURL, chapterPath, packageDirectory).then(
    chapterText => {
      let chapterContent = chapterText
        .replace(/[\r\n]/g, '')
        .match(/\<body[^\>]*>.*\<\/body\>/i)[0];
      const rawImgPathList = chapterContent
        .replace(srcReg, 'src=')
        .match(fileReg);
      chapterContent = chapterContent.replace(contentLinkReg, '');
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
              const src = chapterContent
                .match(svgMatch)[0]
                .replace(/xlink\:href/, 'src');
              chapterContent = chapterContent.replace(
                /\<svg (.+)\<\/svg>/,
                `<img ${src}>`,
              );
            }
          }
        });
      }

      for (let key in entityMap) {
        const re = new RegExp('&' + key + ';', 'g');
        chapterContent = chapterContent.replace(re, entityMap[key]);
      }

      // add class property
      chapterContent = chapterContent
        .replace(/\<a/g, '<a class="bk-epub-href"')
        .replace(
          /<img.*?src=(('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\2)[^>]*>/gi,
          '<img class="bk-epub-img" src=$1/>',
        )
        .replace(
          /<(h\d)(.*)>(.*)(<\/\1>)/g,
          '<h3 class="bk-epub-title">$3</h3>',
        )
        .replace(/\<body/g, '<div class="bk-epub-wrap"')
        .replace(/\<\/body>/g, '<p>~本章完~</p></div>')
        .replace(/<p[^>]*>(.*?)<\/p>/gm, '<p class="bk-epub-txt">$1</p>');

      return chapterContent;
    },
  );
}

export { parseEpubBook, loadEpubChapter };
