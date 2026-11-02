import {shuffle} from "./basics.js";
import {showKeepCut} from "./keepcut.js"

export function startHalf(list) {
  shuffle(list);

  let keepCount = Math.floor(list.length / 2);
  showKeepCut(list, keepCount);
}