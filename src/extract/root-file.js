import { getExtension } from '../util/path-helpers';

export default function rootFile(xml) {
  const packageDocumentPath = xml.container.rootfiles.rootfile['full-path'];
  if (getExtension(packageDocumentPath) === '.opf') {
    return packageDocumentPath;
  }
  throw new Error('no .opf file could be found in META-INF/container.xml');
}
