import entityMap from '../util/entities';
import { Manifest } from './manifest';
import { Spine } from './spine';

export interface Toc {
  id: number | string;
  name: string;
  href: string;
  isLeaf: boolean;
  tocIndex: number;
  sublevels: Toc[];
}

export default function toc(tocHtml: any, manifest: Manifest, spine: Spine) {
  let tocList: Toc[] = [];
  const tocItem: Toc = {
    sublevels: [],
    id: '',
    isLeaf: false,
    href: '',
    tocIndex: 0,
    name: '',
  };
  parse(tocItem, tocHtml.ncx.navMap.navPoint);
  tocList = tocItem.sublevels;

  function parse(parent: Toc, childNode: any) {
    const childNodeList = Array.isArray(childNode) ? childNode : [childNode];
    childNodeList.forEach((val) => {
      const hrefWithoutHash = val.content.src && val.content.src.split('#')[0];
      const manifestId = manifest.items.find(
        (itemId) => manifest.byId[itemId].href === hrefWithoutHash,
      );
      const tocIndex = spine.items.findIndex((itemId) => itemId === manifestId);
      let tocName = val.navLabel.text;
      for (let key in entityMap) {
        const re = new RegExp('&' + key + ';', 'g');
        tocName = tocName.replace(re, entityMap[key]);
      }
      const child: Toc = {
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
