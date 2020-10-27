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
  REQUIRED: ['identifier', 'language', 'title'],
};

export default function metadata(rootXml: any) {
  const ret: any = {};
  const metadataInfo = rootXml.package.metadata;
  const uniqueIdentifierId = rootXml.package['unique-identifier'];

  function attribute(attr: string, required: boolean) {
    try {
      const attrInfo = metadataInfo[attr];
      if (Array.isArray(attrInfo)) {
        if (attr === 'identifier') {
          ret[attr] = attrInfo.find(
            (attrItem) => attrItem.id === uniqueIdentifierId,
          ).__text;
        } else {
          ret[attr] = attrInfo.map((attrItem) => attrItem.__text);
        }
      } else {
        ret[attr] = attrInfo.__text;
      }
    } catch (exception) {
      if (required) {
        ret[attr] = undefined;
        console.warn(`Can't get required attribute '${attr}' on metadata.`);
      }
    }
  }
  ATTRIBUTES.OPTIONAL.forEach((attr) => attribute(attr, false));
  ATTRIBUTES.REQUIRED.forEach((attr) => attribute(attr, true));
  return ret;
}
