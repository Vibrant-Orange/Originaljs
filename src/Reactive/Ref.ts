import { ICustomElement, TElement } from "../Typings/CustomElementTypings";
import { TRefTree } from "../Typings/RefTreeTypings";
import { RefRules } from "./Rules";
import Transform from "./Transform";
import View from "./View";
const matchRefItem: RegExp = new RegExp(RefRules.keyItem, "g");
const matchAndExtract: RegExp = new RegExp(RefRules.extractItem, "g");
const matchAndExtractVariableName: RegExp = new RegExp(RefRules.extractVariableName, "g");

/**
 * 获取模板片段的引用key，包括表达式以及属性
 * @param sourceString 模板片段
 * @param extract 是否抽取引用key，如果不抽取就会返回 ['{ user.a }']，否则就返回 ['user.a']，也就是没有大括号
 * @returns 引用key
 */
function getRefKey(sourceString: string, extract: boolean = true): string[] {
  let refs: string[] = sourceString.match(extract ? matchAndExtract : matchRefItem) || [];

  return refs.map(refItem => {
    return refItem.trim();
  });
}

/**
 * 获取模板片段里的引用属性名
 * @param sourceString 模板片段
 * @returns 模板里的引用属性名数组
 */
function collecRef(sourceString: string): string[][] {
  let refs: string[] | string[][] = sourceString.match(matchAndExtractVariableName) || [];

  refs = refs.map(refItem => {
    return Transform.transformPropertyNameToArray(refItem);
  });

  return refs;
}

function updateRef(refTree: TRefTree, refProperties: ICustomElement | TElement | Record<string, any>): void {
  for (const branchName in refTree) {
    if (refProperties[branchName] === undefined) continue;
    let branch: TRefTree = refTree[branchName];
    let branchProperty: Record<string, any> = refProperties[branchName];

    if (typeof branch === "object") {
      updateRef(branch, branchProperty);
    }
    View.setUpdateView(refProperties, branchName, branchProperty, refProperties);
  }
}

export default {
  collecRef,
  getRefKey,
  updateRef
}