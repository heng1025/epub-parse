/* eslint {no-underscore-dangle: 0, indent: 0} */

const ATTRIBUTES = {
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
  REQUIRED: [
    'identifier',
    'language',
    'title',
  ],
}

export default function metadata(parsedRootXml, manifest) {
  const ret = {};
  const metadataInfo = parsedRootXml.package.metadata;
  const uniqueIdentifierId = parsedRootXml.package['unique-identifier'];

  function attribute(attr, required) {
    try {
      const attrInfo = metadataInfo[attr];
      if (Array.isArray(attrInfo)) {
        if (attr === 'identifier') {
          ret[attr] = attrInfo.find(attrItem => attrItem.id === uniqueIdentifierId).__text;
        } else {
          ret[attr] = attrInfo.map(attrItem => attrItem.__text)
        }
      } else {
        ret[attr] = attrInfo.__text
      }
    } catch (exception) {
      if (required) {
        ret[attr] = undefined;
        console.error(`Can't get required attribute '${attr}' on metadata.`);
      }
    }
  }
  ATTRIBUTES.OPTIONAL.forEach(attr => attribute(attr, false));
  ATTRIBUTES.REQUIRED.forEach(attr => attribute(attr, true));
  return ret;
}