/**
 * @desc AnimationFrame简单兼容hack
 */
export const animationFrame = () => {
  window.cancelAnimationFrame = (() => {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function (id) {
        return window.clearTimeout(id);
      }
    );
  })();
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
};

/**
 * @desc 判断数组是否相等
 * @return {Boolean}
 * @param arr1
 * @param arr2
 */
export const arrayEqual = (arr1: Array<any>, arr2: Array<any>) => {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

/**
 * @desc 深浅合并拷贝
 */
export function copyObj(
  deep = false,
  target: any = {},
  ...sources: any[]
): any {
  sources.forEach((source) => {
    if (source != null) {
      for (const name in source) {
        const src = target[name];
        const copy = source[name];
        const copyIsArray = Array.isArray(copy);

        if (deep && copy && (typeof copy === 'object' || copyIsArray)) {
          let clone;
          if (copyIsArray) {
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && typeof src === 'object' ? src : {};
          }
          target[name] = copyObj(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  });
  return target;
}
