// spin确定文件顺序
import normalise from './normalise';

type SpinItem = {
  idref: string;
};

export type Spine = {
  byId: {
    [index: string]: SpinItem;
  };
  items: string[];
};

export default function spine(xml: any) {
  const items: Array<SpinItem> = Array.isArray(xml.package.spine.itemref)
    ? xml.package.spine.itemref
    : [xml.package.spine.itemref];

  const spineProp = normalise(
    items.map(({ idref: id }) => ({
      id,
    })),
  );
  return spineProp;
}
