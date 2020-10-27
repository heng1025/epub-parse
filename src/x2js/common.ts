export enum DOMNodeTypes {
  'ELEMENT_NODE' = 1,
  'TEXT_NODE' = 3,
  'CDATA_SECTION_NODE' = 4,
  'COMMENT_NODE' = 8,
  'DOCUMENT_NODE' = 9,
}

export interface ParserConfig {
  attributePrefix: string;
  arrayAccessForm: string;
  emptyNodeForm: 'text' | 'object';
  jsAttributeFilter: (name: string, value: string) => boolean;
  jsAttributeConverter: (name: string, value: string) => number;
  attributeConverters: Array<any>;
  datetimeAccessFormPaths: Array<any>;
  arrayAccessFormPaths: Array<any>;
  xmldomOptions: XMLDocument;
  enableToStringFunc: boolean;
  skipEmptyTextNodesForObj: boolean;
  stripWhitespaces: boolean;
  useDoubleQuotes: boolean;
  ignoreRoot: boolean;
  escapeMode: boolean;
  selfClosingElements: boolean;
  keepCData: boolean;
  keepText: boolean;
  jsDateUTC: boolean;
}

export function getDomNodeLocalName(domNode: Partial<Element>) {
  let localName = domNode.localName;
  if (localName == null || localName === '') {
    // ==="" is IE too
    localName = domNode.nodeName;
  }
  return localName;
}

export function getDomNodeNamespacePrefix(node: Partial<Element>) {
  return node.prefix;
}

export function escapeXmlChars(str: string) {
  if (typeof str === 'string')
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  else return str;
}

export function unescapeXmlChars(str: string) {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}
