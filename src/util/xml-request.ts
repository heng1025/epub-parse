import XmlParser from '../x2js';

declare const wx: any;

const fetch = async (url: string): Promise<any> => {
  if (!window && wx?.request) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        success(res: any) {
          resolve(res.data);
        },
        fail() {
          reject('~fail~');
        },
        error() {
          reject('~error~');
        },
      });
    });
  }

  const response = await window.fetch(url);
  const data = await response.text();
  return String(data);
};

const domParser = new XmlParser({
  attributePrefix: '',
});
const CONTAINER_XML = 'META-INF/container.xml';
const TOC_HTML = 'toc.ncx';
const OPS_DIRECTORY = 'OPS';

const xml = async (url: string, shouldParseXML = true) => {
  const xml = await fetch(url);
  return shouldParseXML ? domParser.xml2js(xml) : xml;
};

export const containerXml = (uri: string, source = CONTAINER_XML) => {
  return xml(`${uri}/${source}`);
};

export const rootXml = (uri: string, source: string) => xml(`${uri}/${source}`);

export const tocHtml = (
  uri: string,
  source = TOC_HTML,
  path = OPS_DIRECTORY,
) => {
  return xml(`${uri}/${path}/${source}`);
};

export const chapterXml = (
  uri: string,
  source: string,
  path = OPS_DIRECTORY,
) => {
  return xml(`${uri}/${path}/${source}`, false);
};
