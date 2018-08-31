import XmlParser from 'x2js';
import fetch from './ajax'

const domParser = new XmlParser({
  attributePrefix: '',
});
const CONTAINER_XML = 'META-INF/container.xml';
const TOC_HTML = 'toc.ncx';
const OPS_DIRECTORY = 'OPS';
const xml = (url, shouldParseXML = true) => fetch(url).then(xml => shouldParseXML ? domParser.xml2js(xml) : xml)
export const containerXml = (uri, source = CONTAINER_XML) => xml(`${uri}/${source}`);
export const rootXml = (uri, source) => xml(`${uri}/${source}`);
export const tocHtml = (uri, source = TOC_HTML, path = OPS_DIRECTORY) => xml(`${uri}/${path}/${source}`);
export const chapterXml = (uri, source, path = OPS_DIRECTORY) => xml(`${uri}/${path}/${source}`, false)