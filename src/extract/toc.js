import entityMap from '../util/entities';

export default function toc(tocHtml, manifest, spine) {
  let tocList = [];
  const tocItem = {
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
    const childNodeList = Array.isArray(childNode) ? childNode : [childNode];
    childNodeList.forEach(val => {
      const hrefWithoutHash = val.content.src && val.content.src.split('#')[0];
      const manifestId = manifest.items.find(
        itemId => manifest.byId[itemId].href === hrefWithoutHash,
      );
      const tocIndex = spine.items.findIndex(itemId => itemId === manifestId);
      let tocName = val.navLabel.text;
      for (let key in entityMap) {
        const re = new RegExp('&' + key + ';', 'g');
        tocName = tocName.replace(re, entityMap[key]);
      }
      const child = {
        sublevels: [],
        id: val.id,
        isLeaf: false,
        href: val.content.src,
        tocIndex,
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