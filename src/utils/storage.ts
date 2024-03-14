interface DictType {
  [key: number]: string;
  total?: number;
}
export const examDictStorage = useStorage<DictType>('examDict', {});
export const noticeDictStorage = useStorage<DictType>('noticeDict', {});
export const courseLabelDictStorage = useStorage<DictType>(
  'courseLabelDict',
  {},
);
export const courseDifficultyDictStorage = useStorage<DictType>(
  'courseDifficultyDict',
  {},
);
export const courseChargeDictStorage = useStorage<DictType>(
  'courseChargeDict',
  {},
);
export const selectedMenuStorage = useStorage<number>('selectedMenu', 0);
/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setExamDictStorage(dict: DictType) {
  examDictStorage.value = dict;
}

export function getExamDictStorage() {
  return examDictStorage.value;
}

export function removeExamDictStorage() {
  examDictStorage.value = {};
}

export function setNoticeDictStorage(dict: DictType) {
  noticeDictStorage.value = dict;
}

export function getNoticeDictStorage() {
  return noticeDictStorage.value;
}

export function removeNoticeDictStorage() {
  noticeDictStorage.value = {};
}

export function setCourseLabelDictStorage(dict: DictType) {
  courseLabelDictStorage.value = dict;
}

export function getCourseLabelDictStorage() {
  return courseLabelDictStorage.value;
}

export function removeCourseLabelDictStorage() {
  courseLabelDictStorage.value = {};
}

export function setCourseDifficultyDictStorage(dict: DictType) {
  courseDifficultyDictStorage.value = dict;
}

export function setCourseChargeDictStorage(dict: DictType) {
  courseChargeDictStorage.value = dict;
}

export function setSelectedMenuStorage(menu: number) {
  selectedMenuStorage.value = menu;
}
