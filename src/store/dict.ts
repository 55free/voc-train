import { defineStore } from 'pinia';
import { getEduExamDict } from '@/api/modules/exam';
import { getPageNoticeDict } from '@/api/modules/notice';
import {
  requestCourseLabelDict,
  requestCourseDifficultyDict,
  requestCourseChargeDict,
} from '@/api/modules/study';
import { IDict } from '@/types/reqOptions';
import {
  examDictStorage,
  setExamDictStorage,
  noticeDictStorage,
  setNoticeDictStorage,
  courseLabelDictStorage,
  setCourseLabelDictStorage,
  courseDifficultyDictStorage,
  setCourseDifficultyDictStorage,
  courseChargeDictStorage,
  setCourseChargeDictStorage,
} from '@/utils/storage';
import { createGetDictFn } from '@/utils/helper';
interface DictType {
  [key: number]: string;
  total?: number;
}

export const useDictStore = defineStore({
  id: 'dict',
  state() {
    return {
      examDict: examDictStorage.value ?? ({} as DictType),
      noticeDict: noticeDictStorage.value ?? ({} as DictType),
      courseLabelDict: courseLabelDictStorage.value ?? ({} as DictType),
      courseDifficultyDict:
        courseDifficultyDictStorage.value ?? ({} as DictType),
      courseChargeDict: courseChargeDictStorage.value ?? ({} as DictType),
      quesDict: { 1: '单选题', 2: '多选题', 3: '判断题' },
    };
  },
  getters: {
    courseDictTotal() {
      const { courseLabelDict, courseDifficultyDict, courseChargeDict } = this;
      return {
        courseLabel: courseLabelDict.total,
        courseDifficulty: courseDifficultyDict.total,
        courseCharge: courseChargeDict.total,
      };
    },
  },
  actions: {
    getExamDict() {
      getEduExamDict().then((res) => {
        if (res.code === 200) {
          const examMap = res.data.reduce((acc: DictType, item) => {
            acc[item.dictValue] = item.dictLabel;
            return acc;
          }, {});

          this.examDict = examMap;
          setExamDictStorage(examMap);
        }
      });
    },
    getNoticeDict() {
      getPageNoticeDict().then((res) => {
        if (res.code === 200) {
          const noticeMap = res.rows.reduce((acc: DictType, item) => {
            acc[item.dictValue] = item.dictLabel;
            return acc;
          }, {});
          noticeMap.total = res.total;
          this.noticeDict = noticeMap;
          setNoticeDictStorage(noticeMap);
          return res;
        }
      });
    },
    getCourseLabelDict: createGetDictFn(
      requestCourseLabelDict,
      setCourseLabelDictStorage,
      'courseLabelDict',
    ),
    getCourseDifficultyDict: createGetDictFn(
      requestCourseDifficultyDict,
      setCourseDifficultyDictStorage,
      'courseDifficultyDict',
    ),
    // getCourseChargeDict(pageNum: number, pageSize: number) {
    //   return new Promise<IDict[]>((resolve, reject) => {
    //     requestCourseChargeDict(pageNum, pageSize).then((res) => {
    //       if (res.code === 200) {
    //         const courseChargeMap = res.rows.reduce((acc: DictType, item) => {
    //           acc[item.dictValue] = item.dictLabel;
    //           return acc;
    //         }, {});
    //         console.log('getCourseChargeDict', courseChargeMap);
    //         courseChargeMap.total = res.total;
    //         this.courseChargeDict = courseChargeMap;
    //         setCourseChargeDictStorage(courseChargeMap);
    //         resolve(res.rows);
    //       }
    //     });
    //   });
    // },
    getCourseChargeDict: createGetDictFn(
      requestCourseChargeDict,
      setCourseChargeDictStorage,
      'courseChargeDict',
    ),
    // testTheThis: createThisTest('courseChargeDict'),
  },
});
