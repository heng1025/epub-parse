(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Epub = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function isAbsolute(pathname) {
        return pathname.charAt(0) === '/';
    }
    function spliceOne(list, index) {
        for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
            list[i] = list[k];
        }
        list.pop();
    }
    function resolvePathname(to, from) {
        if (from === undefined)
            from = '';
        var toParts = (to && to.split('/')) || [];
        var fromParts = (from && from.split('/')) || [];
        var isToAbs = to && isAbsolute(to);
        var isFromAbs = from && isAbsolute(from);
        var mustEndAbs = isToAbs || isFromAbs;
        if (to && isAbsolute(to)) {
            fromParts = toParts;
        }
        else if (toParts.length) {
            fromParts.pop();
            fromParts = fromParts.concat(toParts);
        }
        if (!fromParts.length)
            return '/';
        var hasTrailingSlash;
        if (fromParts.length) {
            var last = fromParts[fromParts.length - 1];
            hasTrailingSlash = last === '.' || last === '..' || last === '';
        }
        else {
            hasTrailingSlash = false;
        }
        var up = 0;
        for (var i = fromParts.length; i >= 0; i--) {
            var part = fromParts[i];
            if (part === '.') {
                spliceOne(fromParts, i);
            }
            else if (part === '..') {
                spliceOne(fromParts, i);
                up++;
            }
            else if (up) {
                spliceOne(fromParts, i);
                up--;
            }
        }
        if (!mustEndAbs)
            for (; up--; up)
                fromParts.unshift('..');
        if (mustEndAbs &&
            fromParts[0] !== '' &&
            (!fromParts[0] || !isAbsolute(fromParts[0])))
            fromParts.unshift('');
        var result = fromParts.join('/');
        if (hasTrailingSlash && result.substr(-1) !== '/')
            result += '/';
        return result;
    }

    var entityMap = {
        lt: '',
        gt: '',
        amp: '&',
        quot: '"',
        apos: "'",
        Agrave: 'À',
        Aacute: 'Á',
        Acirc: 'Â',
        Atilde: 'Ã',
        Auml: 'Ä',
        Aring: 'Å',
        AElig: 'Æ',
        Ccedil: 'Ç',
        Egrave: 'È',
        Eacute: 'É',
        Ecirc: 'Ê',
        Euml: 'Ë',
        Igrave: 'Ì',
        Iacute: 'Í',
        Icirc: 'Î',
        Iuml: 'Ï',
        ETH: 'Ð',
        Ntilde: 'Ñ',
        Ograve: 'Ò',
        Oacute: 'Ó',
        Ocirc: 'Ô',
        Otilde: 'Õ',
        Ouml: 'Ö',
        Oslash: 'Ø',
        Ugrave: 'Ù',
        Uacute: 'Ú',
        Ucirc: 'Û',
        Uuml: 'Ü',
        Yacute: 'Ý',
        THORN: 'Þ',
        szlig: 'ß',
        agrave: 'à',
        aacute: 'á',
        acirc: 'â',
        atilde: 'ã',
        auml: 'ä',
        aring: 'å',
        aelig: 'æ',
        ccedil: 'ç',
        egrave: 'è',
        eacute: 'é',
        ecirc: 'ê',
        euml: 'ë',
        igrave: 'ì',
        iacute: 'í',
        icirc: 'î',
        iuml: 'ï',
        eth: 'ð',
        ntilde: 'ñ',
        ograve: 'ò',
        oacute: 'ó',
        ocirc: 'ô',
        otilde: 'õ',
        ouml: 'ö',
        oslash: 'ø',
        ugrave: 'ù',
        uacute: 'ú',
        ucirc: 'û',
        uuml: 'ü',
        yacute: 'ý',
        thorn: 'þ',
        yuml: 'ÿ',
        nbsp: ' ',
        iexcl: '¡',
        cent: '¢',
        pound: '£',
        curren: '¤',
        yen: '¥',
        brvbar: '¦',
        sect: '§',
        uml: '¨',
        copy: '©',
        ordf: 'ª',
        laquo: '«',
        not: '¬',
        shy: '­­',
        reg: '®',
        macr: '¯',
        deg: '°',
        plusmn: '±',
        sup2: '²',
        sup3: '³',
        acute: '´',
        micro: 'µ',
        para: '¶',
        middot: '·',
        cedil: '¸',
        sup1: '¹',
        ordm: 'º',
        raquo: '»',
        frac14: '¼',
        frac12: '½',
        frac34: '¾',
        iquest: '¿',
        times: '×',
        divide: '÷',
        forall: '∀',
        part: '∂',
        exist: '∃',
        empty: '∅',
        nabla: '∇',
        isin: '∈',
        notin: '∉',
        ni: '∋',
        prod: '∏',
        sum: '∑',
        minus: '−',
        lowast: '∗',
        radic: '√',
        prop: '∝',
        infin: '∞',
        ang: '∠',
        and: '∧',
        or: '∨',
        cap: '∩',
        cup: '∪',
        int: '∫',
        there4: '∴',
        sim: '∼',
        cong: '≅',
        asymp: '≈',
        ne: '≠',
        equiv: '≡',
        le: '≤',
        ge: '≥',
        sub: '⊂',
        sup: '⊃',
        nsub: '⊄',
        sube: '⊆',
        supe: '⊇',
        oplus: '⊕',
        otimes: '⊗',
        perp: '⊥',
        sdot: '⋅',
        Alpha: 'Α',
        Beta: 'Β',
        Gamma: 'Γ',
        Delta: 'Δ',
        Epsilon: 'Ε',
        Zeta: 'Ζ',
        Eta: 'Η',
        Theta: 'Θ',
        Iota: 'Ι',
        Kappa: 'Κ',
        Lambda: 'Λ',
        Mu: 'Μ',
        Nu: 'Ν',
        Xi: 'Ξ',
        Omicron: 'Ο',
        Pi: 'Π',
        Rho: 'Ρ',
        Sigma: 'Σ',
        Tau: 'Τ',
        Upsilon: 'Υ',
        Phi: 'Φ',
        Chi: 'Χ',
        Psi: 'Ψ',
        Omega: 'Ω',
        alpha: 'α',
        beta: 'β',
        gamma: 'γ',
        delta: 'δ',
        epsilon: 'ε',
        zeta: 'ζ',
        eta: 'η',
        theta: 'θ',
        iota: 'ι',
        kappa: 'κ',
        lambda: 'λ',
        mu: 'μ',
        nu: 'ν',
        xi: 'ξ',
        omicron: 'ο',
        pi: 'π',
        rho: 'ρ',
        sigmaf: 'ς',
        sigma: 'σ',
        tau: 'τ',
        upsilon: 'υ',
        phi: 'φ',
        chi: 'χ',
        psi: 'ψ',
        omega: 'ω',
        thetasym: 'ϑ',
        upsih: 'ϒ',
        piv: 'ϖ',
        OElig: 'Œ',
        oelig: 'œ',
        Scaron: 'Š',
        scaron: 'š',
        Yuml: 'Ÿ',
        fnof: 'ƒ',
        circ: 'ˆ',
        tilde: '˜',
        ensp: ' ',
        emsp: ' ',
        thinsp: ' ',
        zwnj: '‌',
        zwj: '‍',
        lrm: '‎',
        rlm: '‏',
        ndash: '–',
        mdash: '—',
        lsquo: '‘',
        rsquo: '’',
        sbquo: '‚',
        ldquo: '“',
        rdquo: '”',
        bdquo: '„',
        dagger: '†',
        Dagger: '‡',
        bull: '•',
        hellip: '…',
        permil: '‰',
        prime: '′',
        Prime: '″',
        lsaquo: '‹',
        rsaquo: '›',
        oline: '‾',
        euro: '€',
        trade: '™',
        larr: '←',
        uarr: '↑',
        rarr: '→',
        darr: '↓',
        harr: '↔',
        crarr: '↵',
        lceil: '⌈',
        rceil: '⌉',
        lfloor: '⌊',
        rfloor: '⌋',
        loz: '◊',
        spades: '♠',
        clubs: '♣',
        hearts: '♥',
        diams: '♦',
        '#8226': '•',
    };

    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function (filename) { return splitPathRe.exec(filename).slice(1); };
    var getDirname = function (path) {
        var result = splitPath(path);
        var root = result[0];
        var dir = result[1];
        if (!root && !dir) {
            return '.';
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
    };
    var getExtension = function (path) { return splitPath(path)[3]; };

    function rootFile(rootXML) {
        var packageDocumentPath = rootXML.container.rootfiles.rootfile['full-path'];
        if (getExtension(packageDocumentPath) === '.opf') {
            return packageDocumentPath;
        }
        throw new Error('no .opf file could be found in META-INF/container.xml');
    }

    var ATTRIBUTES = {
        OPTIONAL: [
            'creator',
            'contributor',
            'coverage',
            'creator',
            'date',
            'description',
            'format',
            'publisher',
            'relation',
            'rights',
            'source',
            'subject',
            'type',
        ],
        REQUIRED: ['identifier', 'language', 'title'],
    };
    function metadata(rootXml) {
        var ret = {};
        var metadataInfo = rootXml.package.metadata;
        var uniqueIdentifierId = rootXml.package['unique-identifier'];
        function attribute(attr, required) {
            try {
                var attrInfo = metadataInfo[attr];
                if (Array.isArray(attrInfo)) {
                    if (attr === 'identifier') {
                        ret[attr] = attrInfo.find(function (attrItem) { return attrItem.id === uniqueIdentifierId; }).__text;
                    }
                    else {
                        ret[attr] = attrInfo.map(function (attrItem) { return attrItem.__text; });
                    }
                }
                else {
                    ret[attr] = attrInfo.__text;
                }
            }
            catch (exception) {
                if (required) {
                    ret[attr] = undefined;
                    console.warn("Can't get required attribute '" + attr + "' on metadata.");
                }
            }
        }
        ATTRIBUTES.OPTIONAL.forEach(function (attr) { return attribute(attr, false); });
        ATTRIBUTES.REQUIRED.forEach(function (attr) { return attribute(attr, true); });
        return ret;
    }

    function normalise(list) {
        var byId = {};
        var items = list.map(function (item) {
            byId[item.id] = item;
            return item.id;
        });
        return {
            byId: byId,
            items: items,
        };
    }

    function manifest(xml) {
        var items = xml.package.manifest.item;
        return normalise(items.map(function (_a) {
            var href = _a.href, id = _a.id, mediaType = _a["media-type"];
            return ({
                href: href,
                id: id,
                mediaType: mediaType,
            });
        }));
    }

    function spine(xml) {
        var items = Array.isArray(xml.package.spine.itemref)
            ? xml.package.spine.itemref
            : [xml.package.spine.itemref];
        var spineProp = normalise(items.map(function (_a) {
            var id = _a.idref;
            return ({
                id: id,
            });
        }));
        return spineProp;
    }

    function toc(tocHtml, manifest, spine) {
        var tocList = [];
        var tocItem = {
            sublevels: [],
            id: '',
            isLeaf: false,
            href: '',
            tocIndex: 0,
            name: '',
        };
        parse(tocItem, tocHtml.ncx.navMap.navPoint);
        tocList = tocItem.sublevels;
        function parse(parent, childNode) {
            var childNodeList = Array.isArray(childNode) ? childNode : [childNode];
            childNodeList.forEach(function (val) {
                var hrefWithoutHash = val.content.src && val.content.src.split('#')[0];
                var manifestId = manifest.items.find(function (itemId) { return manifest.byId[itemId].href === hrefWithoutHash; });
                var tocIndex = spine.items.findIndex(function (itemId) { return itemId === manifestId; });
                var tocName = val.navLabel.text;
                for (var key in entityMap) {
                    var re = new RegExp('&' + key + ';', 'g');
                    tocName = tocName.replace(re, entityMap[key]);
                }
                var child = {
                    sublevels: [],
                    id: val.id,
                    isLeaf: false,
                    href: val.content.src,
                    tocIndex: tocIndex,
                    name: tocName,
                };
                parent.isLeaf = true;
                parent.sublevels.push(child);
                if (val.navPoint) {
                    parse(child, val.navPoint);
                }
            });
        }
        return tocList;
    }

    var DOMNodeTypes;
    (function (DOMNodeTypes) {
        DOMNodeTypes[DOMNodeTypes["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
        DOMNodeTypes[DOMNodeTypes["TEXT_NODE"] = 3] = "TEXT_NODE";
        DOMNodeTypes[DOMNodeTypes["CDATA_SECTION_NODE"] = 4] = "CDATA_SECTION_NODE";
        DOMNodeTypes[DOMNodeTypes["COMMENT_NODE"] = 8] = "COMMENT_NODE";
        DOMNodeTypes[DOMNodeTypes["DOCUMENT_NODE"] = 9] = "DOCUMENT_NODE";
    })(DOMNodeTypes || (DOMNodeTypes = {}));
    function getDomNodeLocalName(domNode) {
        var localName = domNode.localName;
        if (localName == null || localName === '') {
            localName = domNode.nodeName;
        }
        return localName;
    }
    function getDomNodeNamespacePrefix(node) {
        return node.prefix;
    }
    function unescapeXmlChars(str) {
        return str
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&amp;/g, '&');
    }

    var X2JS = (function () {
        function X2JS(config) {
            this.config = __assign({ arrayAccessFormPaths: [], attributeConverters: [], datetimeAccessFormPaths: [] }, config);
        }
        X2JS.prototype.parseXml = function (xml) {
            if (!xml || typeof xml !== 'string') {
                return null;
            }
            var parser = null;
            var domNode = null;
            if (window && window.DOMParser) {
                parser = new window.DOMParser();
                try {
                    domNode = parser.parseFromString(xml, 'text/xml');
                }
                catch (err) {
                    domNode = null;
                }
            }
            return domNode;
        };
        X2JS.prototype.xmlDateTimeToDate = function (prop) {
            var MINUTES_PER_HOUR = 60;
            var bits = prop.split(/[-T:+Z]/g);
            var d = new Date(bits[0], bits[1] - 1, bits[2]);
            var secondBits = bits[5].split('.');
            d.setHours(bits[3], bits[4], secondBits[0]);
            if (secondBits.length > 1)
                d.setMilliseconds(secondBits[1]);
            if (bits[6] && bits[7]) {
                var offsetMinutes = bits[6] * MINUTES_PER_HOUR + Number(bits[7]);
                var sign = /\d\d-\d\d:\d\d$/.test(prop) ? '-' : '+';
                offsetMinutes = 0 + (sign === '-' ? -1 * offsetMinutes : offsetMinutes);
                d.setMinutes(d.getMinutes() - offsetMinutes - d.getTimezoneOffset());
            }
            else if (prop.indexOf('Z', prop.length - 1) !== -1) {
                d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
            }
            return d;
        };
        X2JS.prototype.convertToDateIfRequired = function (value, childName, fullPath) {
            var config = this.config;
            if (config.datetimeAccessFormPaths.length > 0) {
                var pathWithoutTextNode = fullPath.split('.#')[0];
                for (var i = 0; i < config.datetimeAccessFormPaths.length; i++) {
                    var candidatePath = config.datetimeAccessFormPaths[i];
                    if (typeof candidatePath === 'string') {
                        if (candidatePath === pathWithoutTextNode)
                            return this.xmlDateTimeToDate(value);
                    }
                    else if (candidatePath instanceof RegExp) {
                        if (candidatePath.test(pathWithoutTextNode))
                            return this.xmlDateTimeToDate(value);
                    }
                    else if (typeof candidatePath === 'function') {
                        if (candidatePath(pathWithoutTextNode))
                            return this.xmlDateTimeToDate(value);
                    }
                }
            }
            return value;
        };
        X2JS.prototype.ensureProperArrayAccessForm = function (element, childName, elementPath) {
            var config = this.config;
            switch (config.arrayAccessForm) {
                case 'property':
                    if (!(element[childName] instanceof Array))
                        element[childName + '_asArray'] = [element[childName]];
                    else
                        element[childName + '_asArray'] = element[childName];
                    break;
            }
            if (!(element[childName] instanceof Array) &&
                config.arrayAccessFormPaths.length > 0) {
                var match = false;
                for (var i = 0; i < config.arrayAccessFormPaths.length; i++) {
                    var arrayPath = config.arrayAccessFormPaths[i];
                    if (typeof arrayPath === 'string') {
                        if (arrayPath === elementPath) {
                            match = true;
                            break;
                        }
                    }
                    else if (arrayPath instanceof RegExp) {
                        if (arrayPath.test(elementPath)) {
                            match = true;
                            break;
                        }
                    }
                    else if (typeof arrayPath === 'function') {
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
        };
        X2JS.prototype.deserializeRootElementChildren = function (rootElement) {
            var result = {};
            var children = rootElement.childNodes;
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                if (child.nodeType === DOMNodeTypes.ELEMENT_NODE) {
                    var childName = getDomNodeLocalName(child);
                    if (this.config.ignoreRoot) {
                        result = this.deserializeDomChildren(child, childName);
                    }
                    else {
                        result[childName] = this.deserializeDomChildren(child, childName);
                    }
                }
            }
            return result;
        };
        X2JS.prototype.deserializeElementChildren = function (element, elementPath) {
            var result = {
                __cnt: 0,
                __text: '',
                __cdata: '',
                __prefix: '',
            };
            var config = this.config;
            var nodeChildren = element.childNodes;
            for (var iChild = 0; iChild < nodeChildren.length; iChild++) {
                var child = nodeChildren.item(iChild);
                var childName = getDomNodeLocalName(child);
                if (child.nodeType === DOMNodeTypes.COMMENT_NODE)
                    continue;
                result.__cnt++;
                if (result[childName] == null) {
                    result[childName] = this.deserializeDomChildren(child, elementPath + '.' + childName);
                    this.ensureProperArrayAccessForm(result, childName, elementPath + '.' + childName);
                }
                else {
                    if (!(result[childName] instanceof Array)) {
                        result[childName] = [result[childName]];
                        this.ensureProperArrayAccessForm(result, childName, elementPath + '.' + childName);
                    }
                    result[childName][result[childName].length] = this.deserializeDomChildren(child, elementPath + '.' + childName);
                }
            }
            for (var iAttribute = 0; iAttribute < element.attributes.length; iAttribute++) {
                var attribute = element.attributes.item(iAttribute);
                result.__cnt++;
                var adjustedValue = attribute.value;
                for (var iConverter = 0; iConverter < config.attributeConverters.length; iConverter++) {
                    var converter = config.attributeConverters[iConverter];
                    if (converter.test.call(null, attribute.name, attribute.value))
                        adjustedValue = converter.convert.call(null, attribute.name, attribute.value);
                }
                result[config.attributePrefix + attribute.name] = adjustedValue;
            }
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
                result.__text = this.convertToDateIfRequired(result.__text, '#text', elementPath + '.#text');
            }
            if (result.hasOwnProperty('#cdata-section')) {
                result.__cdata = result['#cdata-section'];
                delete result['#cdata-section'];
                if (config.arrayAccessForm === 'property')
                    delete result['#cdata-section_asArray'];
            }
            if (result.__cnt === 1 && result.__text && !config.keepText) {
                result = result.__text;
            }
            else if (result.__cnt === 0 && config.emptyNodeForm === 'text') {
                result = '';
            }
            else if (result.__cnt > 1 &&
                result.__text !== undefined &&
                config.skipEmptyTextNodesForObj) {
                if ((config.stripWhitespaces && result.__text === '') ||
                    String(result.__text).trim() === '') {
                    delete result.__text;
                }
            }
            delete result.__cnt;
            if (!config.keepCData &&
                !result.hasOwnProperty('__text') &&
                result.hasOwnProperty('__cdata') &&
                Object.keys(result).length === 1) {
                return result.__cdata ? result.__cdata : '';
            }
            if (config.enableToStringFunc && (result.__text || result.__cdata)) {
                result.toString = function toString() {
                    return ((this.__text ? this.__text : '') + (this.__cdata ? this.__cdata : ''));
                };
            }
            return result;
        };
        X2JS.prototype.deserializeDomChildren = function (node, parentPath) {
            if (node.nodeType === DOMNodeTypes.DOCUMENT_NODE) {
                return this.deserializeRootElementChildren(node);
            }
            else if (node.nodeType === DOMNodeTypes.ELEMENT_NODE) {
                return this.deserializeElementChildren(node, parentPath);
            }
            else if (node.nodeType === DOMNodeTypes.TEXT_NODE ||
                node.nodeType === DOMNodeTypes.CDATA_SECTION_NODE) {
                return node.nodeValue;
            }
            else {
                return null;
            }
        };
        X2JS.prototype.dom2js = function (domNode) {
            return this.deserializeDomChildren(domNode, null);
        };
        X2JS.prototype.xml2js = function (xml) {
            var domNode = this.parseXml(xml);
            if (domNode) {
                return this.dom2js(domNode);
            }
        };
        return X2JS;
    }());

    var fetch = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window && (wx === null || wx === void 0 ? void 0 : wx.request)) {
                        return [2, new Promise(function (resolve, reject) {
                                wx.request({
                                    url: url,
                                    success: function (res) {
                                        resolve(res.data);
                                    },
                                    fail: function () {
                                        reject('~fail~');
                                    },
                                    error: function () {
                                        reject('~error~');
                                    },
                                });
                            })];
                    }
                    return [4, window.fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4, response.text()];
                case 2:
                    data = _a.sent();
                    return [2, String(data)];
            }
        });
    }); };
    var domParser = new X2JS({
        attributePrefix: '',
    });
    var CONTAINER_XML = 'META-INF/container.xml';
    var TOC_HTML = 'toc.ncx';
    var OPS_DIRECTORY = 'OPS';
    var xml = function (url, shouldParseXML) {
        if (shouldParseXML === void 0) { shouldParseXML = true; }
        return __awaiter(void 0, void 0, void 0, function () {
            var xml;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fetch(url)];
                    case 1:
                        xml = _a.sent();
                        return [2, shouldParseXML ? domParser.xml2js(xml) : xml];
                }
            });
        });
    };
    var containerXml = function (uri, source) {
        if (source === void 0) { source = CONTAINER_XML; }
        return xml(uri + "/" + source);
    };
    var rootXml = function (uri, source) { return xml(uri + "/" + source); };
    var tocHtml = function (uri, source, path) {
        if (source === void 0) { source = TOC_HTML; }
        if (path === void 0) { path = OPS_DIRECTORY; }
        return xml(uri + "/" + path + "/" + source);
    };
    var chapterXml = function (uri, source, path) {
        if (path === void 0) { path = OPS_DIRECTORY; }
        return xml(uri + "/" + path + "/" + source, false);
    };

    function parseEpubBook(containerPath) {
        return __awaiter(this, void 0, void 0, function () {
            var container, rootFilePath, packageDirectory, rootFile$1, manifest$1, metadata$1, spine$1, tocManifestId, result, tocItem, tocHtml$1, toc$1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, containerXml(containerPath)];
                    case 1:
                        container = _a.sent();
                        console.log('container', container);
                        rootFilePath = rootFile(container);
                        packageDirectory = getDirname(rootFilePath);
                        return [4, rootXml(containerPath, rootFilePath)];
                    case 2:
                        rootFile$1 = _a.sent();
                        manifest$1 = manifest(rootFile$1);
                        metadata$1 = metadata(rootFile$1);
                        spine$1 = spine(rootFile$1);
                        tocManifestId = manifest$1.items.find(function (id) { return id === rootFile$1.package.spine.toc; });
                        result = {
                            rootURL: containerPath,
                            packageDirectory: packageDirectory,
                            manifest: manifest$1,
                            metadata: metadata$1,
                            spine: spine$1,
                        };
                        if (!tocManifestId) return [3, 4];
                        tocItem = manifest$1.byId[tocManifestId];
                        return [4, tocHtml(containerPath, tocItem.href, packageDirectory)];
                    case 3:
                        tocHtml$1 = _a.sent();
                        toc$1 = toc(tocHtml$1, manifest$1, spine$1);
                        return [2, __assign(__assign({}, result), { toc: toc$1 })];
                    case 4: return [2, result];
                }
            });
        });
    }
    function loadEpubChapter(epub, chapterCount) {
        var fileReg = /('|")[^'|"]*\.(jpg|png|bmp|jpeg|gif|mp3|wma|ogg|3gp|mp4|avi|wmv)\1/gi;
        var srcReg = /src=(?=('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\1)/gi;
        var contentLinkReg = /href=["'](.*?)\.(x?)html(#?)(.*?)['"]/gi;
        var rootURL = epub.rootURL, packageDirectory = epub.packageDirectory, spine = epub.spine, manifest = epub.manifest;
        var chapterPath = manifest.byId[spine.items[chapterCount]].href;
        return chapterXml(rootURL, chapterPath, packageDirectory)
            .then(function (chapterText) {
            var chapterContent = chapterText.replace(/[\r\n]/g, '').match(/\<body[^\>]*>.*\<\/body\>/i)[0];
            chapterContent = chapterContent.replace(contentLinkReg, '');
            var rawImgPathList = chapterContent.replace(srcReg, 'src=').match(fileReg);
            if (rawImgPathList && rawImgPathList.length > 0) {
                rawImgPathList.forEach(function (v) {
                    var r = v.replace(/['|"]/g, '');
                    var absImgPath = resolvePathname(r, "/" + packageDirectory + "/" + chapterPath);
                    chapterContent = chapterContent.replace(r, "" + rootURL + absImgPath);
                    if (/\<svg/.test(chapterContent)) {
                        var svgMatch = /xlink\:href\=\".+\"/;
                        if (chapterContent.match(svgMatch)) {
                            var src = chapterContent.match(svgMatch)[0].replace(/xlink\:href/, 'src');
                            chapterContent = chapterContent.replace(/\<svg (.+)\<\/svg>/, "<img " + src + ">");
                        }
                    }
                });
            }
            return {
                rawTexts: chapterContent,
                formatTexts: formatText(chapterContent),
            };
        })
            .catch(function (err) {
            throw new Error(err);
        });
    }
    function formatText(rawText) {
        for (var key in entityMap) {
            var re = new RegExp('&' + key + ';', 'g');
            rawText = rawText.replace(re, entityMap[key]);
        }
        return rawText
            .replace(/\<a/g, '<a class="bk-epub-href"')
            .replace(/<img.*?src=(('|")[^'|"]*\.(jpg|png|gif|bmg|jpeg)\2)[^>]*>/gi, '<img class="bk-epub-img" src=$1/>')
            .replace(/<(h\d)[^>](.*?)>(.*?)<\/\1>/gi, '<h3 class="bk-epub-title" $2>$3</h3>')
            .replace(/\<body/g, '<div class="bk-epub-wrap"')
            .replace(/\<\/body>/g, '<p>~本章完~</p></div>')
            .replace(/<p[^>]*>(.*?)<\/p>/gm, '<p class="bk-epub-txt">$1</p>');
    }

    exports.loadEpubChapter = loadEpubChapter;
    exports.parseEpubBook = parseEpubBook;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.umd.js.map
