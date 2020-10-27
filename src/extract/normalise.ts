export default function normalise(list: Array<any>) {
  const byId: any = {};
  const items = list.map((item) => {
    byId[item.id] = item;
    return item.id;
  });

  return {
    byId,
    items,
  };
}
