import {
  getExtension
} from '../util/path-helpers';

const ROOT_FILE = 'rootfile';
const FULL_PATH = 'full-path';

export default function rootFile(xml) {
  const packageDocumentPath = xml.container.rootfiles.rootfile['full-path'];
  if (getExtension(packageDocumentPath) === '.opf') {
    return packageDocumentPath;
  }
  throw new Error('no .opf file could be found in META-INF/container.xml');
}