import { ICustomElement } from "./CustomElementTypings";
import { TRefTree } from "./RefTreeTypings";

export type TModuleHookNames = {
  //* 生命周期
  "lifeCycle.instantiate",
  "lifeCycle.connected",
  "lifeCycle.disconnected",
  "lifeCycle.adopted",
  "lifeCycle.propertyChanged",
  "lifeCycle.render",
  "lifeCycle.rendered",
  //* 响应式
  "reactive.start",
  "reactive.collecElRef",
  "reactive.collectAttrRef",
  "reactive.collectRef",
  "reactive.beforeUpdateView",
  "reactive.beforeUpdateElView",
  "reactive.beforeUpdateAttrView",
  "reactive.setUpdateView",
  "reactive.deleteUpdateView",
  "reactive.afterUpdatedElView",
  "reactive.afterUpdateAttrView",
  "reactive.afterUpdatedView",
  "reactive.clearRefTree",
  "reactive.clearTargetRefTree",
  "reactive.end",
}

export type TModuleOptions = {
  lifeCycle?: {
    instantiate?: (instance: ICustomElement) => void;
    connected?: (instance: ICustomElement) => void;
    disconnected?: () => void;
    adopted?: () => void;
    propertyChanged?: () => void;
    render?: (templateString: string) => string;
    rendered?: (instance: ICustomElement) => void;
    include?: string[],
    exclude?: string[]
  },
  reactive?: {
    start?: () => void;
    collecElRef?: () => TRefTree;
    collectAttrRef?: () => TRefTree;
    collectRef?: () => TRefTree;
    beforeUpdateView?: () => void;
    beforeUpdateElView?: () => void;
    beforeUpdateAttrView?: () => void;
    setUpdateView?: () => void;
    deleteUpdateView?: () => void;
    afterUpdatedElView?: () => void;
    afterUpdateAttrView?: () => void;
    afterUpdatedView?: () => void;
    clearRefTree?: () => void;
    clearTargetRefTree?: () => void;
    end?: () => void;
  }
};