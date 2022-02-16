import { TModuleOptions } from "../../Typings/ModuleType";
import { TStatement, TRefs, TRefItemTypeFor } from "../../Typings/RefType";
import Ref from "../Ref";
import Transform from "../Transform";

function collectRefs(target: Node | Element): TRefs {
  if (target.nodeName !== "O-FOR") {
    return null;
  }

  const refs: TRefs = {};

  const attributes: NamedNodeMap = (target as Element).attributes;
  if (attributes.length === 0) return null;
  let itemAttr: Attr = null;
  let indexAttr: Attr = null;
  let keyAttr: Attr = null;
  let inAttr: Attr = attributes.getNamedItem("in");
  if (!inAttr) return null;

  if (attributes.length > 1) {
    itemAttr = attributes.item(0);
    if (attributes.length === 4) {
      keyAttr = attributes.item(1);
      indexAttr = attributes.item(2);
    }
    if (attributes.length === 3) {
      indexAttr = attributes.item(1);
    }
  }

  const itemName: string = itemAttr?.nodeName ?? "item";
  const indexName: string = indexAttr?.nodeName ?? "index";
  const keyName: string = keyAttr?.nodeName ?? "key";
  const refKey: string = inAttr.value;
  const template: string = (target as Element).innerHTML;
  const statements: TStatement[] = Ref.collectStatement(refKey);
  console.log(statements);


  statements.forEach(({ statementRefsMap, refKeysMap, executableStatements, statementsRaw, refKeyMap }) => {
    statementsRaw.forEach((statementRaw) => {
      const statementRefs: string[] = statementRefsMap.get(statementRaw) ?? [];

      statementRefs.forEach(refRawStr => {
        Ref.addRefToRefs<TRefItemTypeFor>(refs, refKeyMap.get(refRawStr), refKeysMap.get(refRawStr), "__for", {
          target: target as Element,
          statement: {
            refs: statementRefs,
            value: executableStatements.get(statementRaw),
            raw: statementRaw
          },
          for: {
            itemName,
            indexName,
            keyName,
            refKey,
            template
          }
        });
      })
    });
  });
  (target as Element).innerHTML = "";

  return refs;
}

export default {
  name: "For",
  collectRefs
} as TModuleOptions