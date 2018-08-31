// mainfest确定文件的路径
import normalise from './normalise.js';

export default function manifest(xml) {
  const items = xml.package.manifest.item;
  return normalise(items.map(({
    href,
    id,
    'media-type': mediaType,
  }) => ({
    href,
    id,
    mediaType,
  })));
}