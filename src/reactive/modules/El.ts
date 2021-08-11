import { TPluginItem } from "../../types/Plugin";
import { IRefTree, TAttr } from "../../types/Ref";
import Utils, { deepCopy } from "../../Utils";
import { removeTargetRefTree } from "../../View";
import Reactive from "../index";

function updateRef(refTree: IRefTree, properties): void {
  if (!refTree.__attrs) return;
  let attrs: TAttr[] = refTree.__attrs;

  for (const attrItem of attrs) {
    if (attrItem.ownerElement.tagName !== "O-EL") continue;

    if (attrItem.nodeName === "html") {
      attrItem.ownerElement.innerHTML = attrItem.nodeValue;
    } else if (attrItem.nodeName === "value") {
      removeTargetRefTree(attrItem.ownerElement, true);
      attrItem.ownerElement.innerHTML = attrItem.nodeValue;

      Reactive.collectEl(attrItem.ownerElement, properties, properties.__og__.reactive);
    }
  }
}

export default {
  updateRef
} as TPluginItem