import { ICustomElement, TElement, TReferrerElement, TReferrerElementOGProperties } from "../../Typings/CustomElementTypings";
import { TModuleOptions } from "../../Typings/ModuleTypings";
import { TMethodBranch, TRefTree } from "../../Typings/RefTypings";
import { MethodRules, RefRules } from "../Rules";
import Parser from "../Parser";
import Utils from "../../Utils";
import Ref from "../Ref";
import Transform from "../Transform";
import Expression from "../Expression";

const GlobalMatchMethodName: RegExp = new RegExp(MethodRules.MatchMethodName, "g");

function bindMethod(methodItem: TMethodBranch, properties: Record<string, any>) {
  if (!properties[methodItem.methodName]) {
    console.error(`Method ${methodItem.methodName} is not define`);
    return;
  }

  //* 引用参数转换
  if (methodItem.refParamsMap.size > 0) {
    methodItem.refParamsMap.forEach((refParamItem, paramIndex) => {
      methodItem.params[paramIndex] = Transform.transformObjectToString(Utils.getObjectProperty(properties, refParamItem));
    })
  }

  //* 表达式参数转换
  if (methodItem.expressionParamMap.size > 0) {
    methodItem.expressionParamMap.forEach((expressionItem, paramIndex) => {
      methodItem.params[paramIndex] = Transform.transformObjectToString(Expression.executeExpression(expressionItem.expression, properties, expressionItem.params));
    })
  }

  const listener = function (event): any {
    properties[methodItem.methodName].apply(properties, [...methodItem.params, event, methodItem.ownerElement]);
  }

  //* 移除旧的监听事件
  if (methodItem.listener !== null) {
    methodItem.ownerElement.removeEventListener(methodItem.eventType, methodItem.listener);
  }
  //* 监听元素事件
  methodItem.ownerElement.addEventListener(methodItem.eventType, listener);
  methodItem.listener = listener;
}

export default {
  reactive: {
    collectAttrRef(target: Attr, properties: ICustomElement): TRefTree {
      if (target.ownerElement === null) return {};
      if (MethodRules.OnAttributeName.test(target.nodeName) === false || MethodRules.MethodNameAttibuteValue.test(target.nodeValue) === false) return {};

      //* 绑定的方法，可多个
      const methodNames: string[] = target.nodeValue.match(GlobalMatchMethodName);
      //* 方法触发类型
      const eventType: string = target.nodeName.match(MethodRules.MethodType)[0];
      if (!eventType || !methodNames) return {};

      const refTree: TRefTree = {};

      const ownerElement: HTMLElement = target.ownerElement as HTMLElement;
      ownerElement[target.nodeName] = null; //* 清除已有方法

      const refPropertyKeyMap: Map<symbol, string[][]> = new Map();
      for (let methodName of methodNames) {
        let listener = null;
        let paramString = methodName.match(MethodRules.MethodParams);
        let params: string[] = [];
        const branchKey: symbol = Symbol();

        let refParamsMap: Map<number, string[]> = new Map();
        const expressionParamMap: Map<number, {
          expression: string, params: string[][]
        }> = new Map();
        const refExpressionParams: string[][] = [];

        if (paramString) {
          params = Parser.parseMethodParams(paramString[0]);
          params.forEach((param, index) => {
            if (RefRules.refItem.test(param)) {
              params[index] = param = param.match(RefRules.extractRefItem)[0];

              if (Expression.isExpression(`{ ${param} }`)) {
                const params: string[][] = Ref.collecRef(param) as string[][]
                expressionParamMap.set(index, {
                  expression: Expression.handleExpressionRef(`{ ${param} }`).expression,
                  params
                });
                refExpressionParams.push(...params);
              } else {
                refParamsMap.set(index, Transform.transformPropertyNameToArray(param));
              }
            }
          });
        }

        let extractMethodName: string[] | string = methodName.match(MethodRules.MethodName);
        extractMethodName = extractMethodName ? extractMethodName[0] : null;
        const branch: TMethodBranch = {
          params,
          refParamsMap,
          expressionParamMap,
          listener,
          eventType,
          methodName: extractMethodName,
          ownerElement,
          target
        }
        //* 没有响应式的参数方法先绑定
        if (refParamsMap.size === 0 && expressionParamMap.size === 0) {
          bindMethod(branch, properties);
        } else {
          const params = Array.from(refParamsMap.values());
          params.push(...refExpressionParams);
          refPropertyKeyMap.set(branchKey, params);

          Utils.objectMerge(refTree, Ref.generateRefTreeByRefString(methodName, target, branchKey, branch, "__methods"));
        }
      }
      ownerElement.removeAttribute(target.nodeName); //* 移除属性

      Utils.defineOGProperty(ownerElement, {
        refs: {
          "__methods": refPropertyKeyMap
        }
      } as TReferrerElementOGProperties);

      return refTree;
    },
    setUpdateView(refTree: TRefTree, properties: ICustomElement): void {
      if (refTree?.__methods === undefined) return;
      const methods: Map<symbol, TMethodBranch> = refTree.__methods;

      methods.forEach(methodItem => {
        bindMethod(methodItem, properties.__OG__.properties);
      });
    }
  }
} as TModuleOptions