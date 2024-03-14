import { IDict } from '@/types/reqOptions';
interface DictType {
  [key: number]: string;
  total?: number;
}
/**
 * @description 是否为空，针对 `数组`、`对象`、`字符串`、`new Map()`、`new Set()`、`null`、`undefined` 进行判断，`null`、`undefined` 直接返回 `true`，也就是直接等于空
 */
export const isEmpty = (val: any) => {
  if (val === undefined || val === null || val === '') {
    return true;
  }
  if (typeof val === 'object') {
    if (Object.keys(val).length === 0) {
      return true;
    }
  }
  return false;
};

export function flatten(data) {
  return data.reduce((acc, cur) => {
    acc.push(cur);
    if (cur.children) {
      acc = acc.concat(flatten(cur.children));
    }
    return acc;
  }, []);
}

export function createGetDictFn(
  requestFn: (pageNum: number, pageSize: number) => Promise<any>,
  setStorageFn: (data: any) => void,
  property: string,
) {
  return function (pageNum = 1, pageSize = 10) {
    return new Promise<IDict[]>((resolve, reject) => {
      requestFn(pageNum, pageSize).then((res) => {
        if (res.code === 200) {
          const dictMap = res.rows.reduce((acc: DictType, item) => {
            acc[item.dictSort] = item.dictLabel;
            return acc;
          }, {});
          dictMap.total = res.total;
          if (res.rows.length < res.total) {
            requestFn(pageNum, res.total).then((res) => {
              if (res.code === 200) {
                const dictMap = res.rows.reduce((acc: DictType, item) => {
                  acc[item.dictSort] = item.dictLabel;
                  return acc;
                }, {});
                dictMap.total = res.total;
                this[property] = dictMap;
                setStorageFn(dictMap);
                resolve(res.rows);
              }
            });
          } else {
            this[property] = dictMap;
            setStorageFn(dictMap);
            resolve(res.rows);
          }
        }
      });
    });
  };
}

export function createThisTest(my) {
  return function () {
    console.log('my', this);
  };
}
