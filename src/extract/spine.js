// spin确定文件顺序
import normalise from './normalise';

export default function spine(xml) {
  const items = Array.isArray(xml.package.spine.itemref)
    ? xml.package.spine.itemref
    : [xml.package.spine.itemref];

  const spineProp = normalise(
    items.map(({ idref: id }) => ({
      id,
    })),
  );
  return spineProp;
}
