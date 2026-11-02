export function startHalf(list) {
  shuffle(list);

  let keepCount = Math.floor(list.length / 2);
  showKeepCutAll(list, keepCount);
}