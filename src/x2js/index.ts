/*
	Copyright 2015 Axinom
	Copyright 2011-2013 Abdulla Abdurakhmanov
	Original sources are available at https://code.google.com/p/x2js/
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	http://www.apache.org/licenses/LICENSE-2.0
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/
import {
  DOMNodeTypes,
  getDomNodeLocalName,
  getDomNodeNamespacePrefix,
  ParserConfig,
  unescapeXmlChars,
} from './common';

export default class X2JS {
  private config: Partial<ParserConfig>;
  constructor(config: Partial<ParserConfig>) {
    this.config = {
      arrayAccessFormPaths: [],
      attributeConverters: [],
      datetimeAccessFormPaths: [],
      ...config,
    };
  }
  private parseXml(xml: XMLDocument) {
    if (!xml || typeof xml !== 'string') {
      return null;
    }
    let parser = null;
    let domNode = null;
    if (window && window.DOMParser) {
      parser = new window.DOMParser();
      try {
        domNode = parser.parseFromString(xml, 'text/xml');
      } catch (err) {
        domNode = null;
      }
    }
    return domNode;
  }
  private xmlDateTimeToDate(prop: any) {
    // Implementation based up on http://stackoverflow.com/questions/8178598/xml-datetime-to-javascript-date-object
    // Improved to support full spec and optional parts
    const MINUTES_PER_HOUR = 60;

    const bits = prop.split(/[-T:+Z]/g);

    var d = new Date(bits[0], bits[1] - 1, bits[2]);
    var secondBits = bits[5].split('.');
    d.setHours(bits[3], bits[4], secondBits[0]);
    if (secondBits.length > 1) d.setMilliseconds(secondBits[1]);

    // Get supplied time zone offset in minutes
    if (bits[6] && bits[7]) {
      var offsetMinutes = bits[6] * MINUTES_PER_HOUR + Number(bits[7]);
      var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';

      // Apply the sign
      offsetMinutes = 0 + (sign === '-' ? -1 * offsetMinutes : offsetMinutes);

      // Apply offset and local timezone
      d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
    } else if (prop.indexOf('Z', prop.length - 1) !== -1) {
      d = new Date(
        Date.UTC(
          d.getFullYear(),
          d.getMonth(),
          d.getDate(),
          d.getHours(),
          d.getMinutes(),
          d.getSeconds(),
          d.getMilliseconds(),
        ),
      );
    }

    // d is now a local time equivalent to the supplied time
    return d;
  }
  private convertToDateIfRequired(
    value: string,
    childName: string,
    fullPath: string,
  ) {
    const config = this.config;
    if (config.datetimeAccessFormPaths.length > 0) {
      const pathWithoutTextNode = fullPath.split('.#')[0];

      for (var i = 0; i < config.datetimeAccessFormPaths.length; i++) {
        const candidatePath = config.datetimeAccessFormPaths[i];
        if (typeof candidatePath === 'string') {
          if (candidatePath === pathWithoutTextNode)
            return this.xmlDateTimeToDate(value);
        } else if (candidatePath instanceof RegExp) {
          if (candidatePath.test(pathWithoutTextNode))
            return this.xmlDateTimeToDate(value);
        } else if (typeof candidatePath === 'function') {
          if (candidatePath(pathWithoutTextNode))
            return this.xmlDateTimeToDate(value);
        }
      }
    }

    return value;
  }
  private ensureProperArrayAccessForm(
    element: any,
    childName: string,
    elementPath: string,
  ) {
    const config = this.config;
    switch (config.arrayAccessForm) {
      case 'property':
        if (!(element[childName] instanceof Array))
          element[childName + '_asArray'] = [element[childName]];
        else element[childName + '_asArray'] = element[childName];
        break;
    }

    if (
      !(element[childName] instanceof Array) &&
      config.arrayAccessFormPaths.length > 0
    ) {
      let match = false;

      for (let i = 0; i < config.arrayAccessFormPaths.length; i++) {
        var arrayPath = config.arrayAccessFormPaths[i];
        if (typeof arrayPath === 'string') {
          if (arrayPath === elementPath) {
            match = true;
            break;
          }
        } else if (arrayPath instanceof RegExp) {
          if (arrayPath.test(elementPath)) {
            match = true;
            break;
          }
        } else if (typeof arrayPath === 'function') {
          if (arrayPath(childName, elementPath)) {
            match = true;
            break;
          }
        }
      }

      if (match) {
        element[childName] = [element[childName]];
      }
    }
  }
  private deserializeRootElementChildren(rootElement: Node) {
    let result = {} as any;
    const children = rootElement.childNodes;

    // Alternative for firstElementChild which is not supported in some environments
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (child.nodeType === DOMNodeTypes.ELEMENT_NODE) {
        const childName = getDomNodeLocalName(child);

        if (this.config.ignoreRoot) {
          result = this.deserializeDomChildren(child, childName);
        } else {
          result[childName] = this.deserializeDomChildren(child, childName);
        }
      }
    }

    return result;
  }
  private deserializeElementChildren(
    element: Partial<Element>,
    elementPath: string,
  ) {
    type Result = {
      __cnt: number;
      __text: string | string[];
      __cdata: string;
      __prefix: string;
    };

    let result: Result | any = {
      __cnt: 0,
      __text: '',
      __cdata: '',
      __prefix: '',
    };
    const config = this.config;
    const nodeChildren = element.childNodes;

    // Child nodes.
    for (let iChild = 0; iChild < nodeChildren.length; iChild++) {
      var child = nodeChildren.item(iChild);
      var childName = getDomNodeLocalName(child);

      if (child.nodeType === DOMNodeTypes.COMMENT_NODE) continue;

      result.__cnt++;

      // We deliberately do not accept everything falsey here because
      // elements that resolve to empty string should still be preserved.
      if (result[childName] == null) {
        result[childName] = this.deserializeDomChildren(
          child,
          elementPath + '.' + childName,
        );
        this.ensureProperArrayAccessForm(
          result,
          childName,
          elementPath + '.' + childName,
        );
      } else {
        if (!(result[childName] instanceof Array)) {
          result[childName] = [result[childName]];
          this.ensureProperArrayAccessForm(
            result,
            childName,
            elementPath + '.' + childName,
          );
        }

        result[childName][
          result[childName].length
        ] = this.deserializeDomChildren(child, elementPath + '.' + childName);
      }
    }

    // Attributes
    for (
      var iAttribute = 0;
      iAttribute < element.attributes.length;
      iAttribute++
    ) {
      var attribute = element.attributes.item(iAttribute);
      result.__cnt++;

      var adjustedValue = attribute.value;
      for (
        var iConverter = 0;
        iConverter < config.attributeConverters.length;
        iConverter++
      ) {
        var converter = config.attributeConverters[iConverter];
        if (converter.test.call(null, attribute.name, attribute.value))
          adjustedValue = converter.convert.call(
            null,
            attribute.name,
            attribute.value,
          );
      }

      result[config.attributePrefix + attribute.name] = adjustedValue;
    }

    // Node namespace prefix
    var namespacePrefix = getDomNodeNamespacePrefix(element);
    if (namespacePrefix) {
      result.__cnt++;
      result.__prefix = namespacePrefix;
    }

    if (result['#text']) {
      result.__text = result['#text'];

      if (result.__text instanceof Array) {
        result.__text = result.__text.join('\n');
      }

      if (config.escapeMode) {
        result.__text = unescapeXmlChars(result.__text);
      }

      if (config.stripWhitespaces) {
        result.__text = String(result.__text).trim();
      }

      delete result['#text'];

      if (config.arrayAccessForm === 'property') {
        delete result['#text_asArray'];
      }

      result.__text = this.convertToDateIfRequired(
        result.__text,
        '#text',
        elementPath + '.#text',
      );
    }

    if (result.hasOwnProperty('#cdata-section')) {
      result.__cdata = result['#cdata-section'];
      delete result['#cdata-section'];

      if (config.arrayAccessForm === 'property')
        delete result['#cdata-section_asArray'];
    }

    if (result.__cnt === 1 && result.__text && !config.keepText) {
      result = result.__text;
    } else if (result.__cnt === 0 && config.emptyNodeForm === 'text') {
      result = '';
    } else if (
      result.__cnt > 1 &&
      result.__text !== undefined &&
      config.skipEmptyTextNodesForObj
    ) {
      if (
        (config.stripWhitespaces && result.__text === '') ||
        String(result.__text).trim() === ''
      ) {
        delete result.__text;
      }
    }
    delete result.__cnt;

    /**
     * We are checking if we are creating a __cdata property or if we just add the content of cdata inside result.
     * But, if we have a property inside xml tag (<tag PROPERTY="1"></tag>), and a cdata inside, we can't ignore it.
     * In this case we are keeping __cdata property.
     */
    if (
      !config.keepCData &&
      !result.hasOwnProperty('__text') &&
      result.hasOwnProperty('__cdata') &&
      Object.keys(result).length === 1
    ) {
      return result.__cdata ? result.__cdata : '';
    }

    if (config.enableToStringFunc && (result.__text || result.__cdata)) {
      result.toString = function toString() {
        return (
          (this.__text ? this.__text : '') + (this.__cdata ? this.__cdata : '')
        );
      };
    }

    return result;
  }
  private deserializeDomChildren(node: Node, parentPath: string) {
    if (node.nodeType === DOMNodeTypes.DOCUMENT_NODE) {
      return this.deserializeRootElementChildren(node);
    } else if (node.nodeType === DOMNodeTypes.ELEMENT_NODE) {
      return this.deserializeElementChildren(node, parentPath);
    } else if (
      node.nodeType === DOMNodeTypes.TEXT_NODE ||
      node.nodeType === DOMNodeTypes.CDATA_SECTION_NODE
    ) {
      return node.nodeValue;
    } else {
      return null;
    }
  }
  private dom2js(domNode: Node) {
    return this.deserializeDomChildren(domNode, null);
  }
  xml2js(xml: XMLDocument) {
    const domNode = this.parseXml(xml);
    if (domNode) {
      return this.dom2js(domNode);
    }
  }
}
