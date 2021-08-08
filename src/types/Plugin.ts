import { IEl } from "./ElementType";
import { IProperties } from "./Properties";
import { IRefTree } from "./Ref";

export type TPluginItem = {
  [key: string]: any,
  collectElRef?(target: IEl | Node[], properties: IProperties): IRefTree;
  collectRef?(target: IEl | Node[], properties: IProperties): IRefTree,
  setUpdateView?(target: IProperties, refTree: IRefTree, propertyKey: string | number, value: any): Boolean;
  deleteUpdateView?(target: IProperties, propertyKey: string | number): Boolean;
  updateRef?(refTree: IRefTree, properties: IProperties, propertyKeyPaths: string): void;
}

export type TPlugins = TPluginItem[];