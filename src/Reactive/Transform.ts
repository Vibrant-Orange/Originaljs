/**
 * 转换插入在模板的属性名为属性名数组，例如user.name -> ['user','name']，user['age'] -> ['user','age']
 * @param propertyNameString 模板插入的变量名称
 * @returns 转换解析后的变量名称数组
 */
function transformPropertyKey(propertyNameString: string): string[] {
  const splitChars: string[] = propertyNameString.split("");
  const propertys: string[] = [];
  let fragment: string = ""; //* [] 段
  let arounds: number = 0; //* 记录遇到了 [ 的次数
  let hitComma: boolean = false; //* 命中了逗号 .
  splitChars.forEach(charItem => {
    switch (charItem) {
      case "[":
        //* 进入包围圈
        ++arounds;
        //* 把以后的Push
        if (fragment) {
          propertys.push(fragment);
        }
        //* 清空存储的，重新开始记录属性名
        fragment = "";
        break;
      case "]":
        //* 进入包围圈的数量递减
        --arounds;
        if (fragment) {
          propertys.push(fragment);
        }
        fragment = "";
        break;
      case ".":
        //* 把已有的push
        //* 然后清空，重新开始记录属性名
        if (fragment) {
          propertys.push(fragment);
          fragment = "";
        }
        //* 命中了 .
        hitComma = true;
        break;
      default:
        hitComma = false;
        if (!["'", "\"", "\\"].includes(charItem)) {
          fragment += charItem.trim();
        }
        break;
    }
  });
  if (fragment) {
    hitComma = false;
    propertys.push(fragment);
    fragment = "";
  }

  if (hitComma || arounds) {
    throw new Error("Template syntax error:" + propertyNameString);
  }

  return propertys;
}

/**
 * 把属性名数组转换成属性名路径。['user','age'] -> user['age']
 * @param propertyNames 属性名数组
 * @returns 属性名路径字符串
 */
function transformPropertyKeyToString(propertyNames: (string | number)[]): string {
  propertyNames = [...propertyNames];
  let propertyPath: string = String(propertyNames[0]);
  propertyNames.splice(0, 1);

  for (let index = 0; index < propertyNames.length; index++) {
    const name = propertyNames[index];
    if (isNaN(Number(name))) {
      propertyPath += `['${name}']`;
    } else {
      propertyPath += `[${name}]`;
    }
  }

  return propertyPath;
}

export default {
  transformPropertyKey,
  transformPropertyKeyToString
}