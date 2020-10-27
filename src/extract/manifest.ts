// mainfest确定文件的路径
import normalise from './normalise';

type ManifestItem = {
  href: string;
  id: string;
  'media-type': string;
};

export type Manifest = {
  byId: {
    [index: string]: ManifestItem;
  };
  items: any[];
};

export default function manifest(xml: any) {
  const items: Array<ManifestItem> = xml.package.manifest.item;
  return normalise(
    items.map(({ href, id, 'media-type': mediaType }) => ({
      href,
      id,
      mediaType,
    })),
  );
}
