import request from '@/utils/axios';
import { IDict } from '@/types/reqOptions';
/**
 * 通用响应类型接口
 * @template P 泛型参数，用于表示响应结果的数据类型，默认为任意对象
 */
interface IResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  data: P; // 响应结果的数据
}

interface IPageResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  rows: P; // 响应结果的数据
  total: number; // 数据总数
}
/**
 * 分类信息接口
 */
interface ICategoryInfo {
  channelName: string; // 频道名称
  cateforyDtos: ICourseCategory[]; // 分类数组
}

/**
 * 分类接口
 */
export interface ICourseCategory {
  objId: number; // 分类的 ID
  typeName: string; // 分类的名称
}

/**
 * 课程接口
 */
export interface ICourseCard {
  objId: number;
  courseName: string;
  courseDifficulty: number;
  deptName: string;
  courseHour: string;
  courseCharge: string;
  courseDescription: string;
  courseTag: string;
  coursePic: string;
  studyCount: number;
  updateTime?: any;
  coursePrice: number;
  voList?: any;
}

export interface VoList {
  vcOrder: number;
  url: string;
  vcChapterName: string;
  duration: number;
}

/**
 * 课程详情接口
 */
export interface ICourseDetail {
  objId: number;
  courseName: string;
  courseDifficulty: number;
  deptName: string;
  courseHour: string;
  courseCharge: string;
  courseDescription: string;
  courseTag: string;
  coursePic: string;
  studyCount: number;
  updateTime: string;
  coursePrice: number;
  voList: VoList[];
}
/**
 * 课程视频接口
 */
interface ICourseVideo {
  videoId: number; // 视频的 ID
  parentId: number; // 父级的 ID
  name: string; // 视频的名称
  videoImageUrl: string; // 视频的图片 URL
  videoUrl: string; // 视频的 URL
  duration: number; // 视频的时长（秒）
  format: string; // 视频的格式
}

/**
 * 课程目录接口
 */
interface ICourseCatalog {
  id: number; // 目录的 ID
  name: string; // 目录的名称
  duraiton: number; // 目录的时长（秒）
  children: ICourseCatalog[]; // 子目录列表
}

interface IType {
  objId: number;
  typeName: string;
}

const requestCourseLabelDict = (pageNum: number, pageSize: number) => {
  return request<IPageResponseType<IDict[]>>({
    url: '/system/dict/data/list',
    method: 'get',
    params: {
      dictType: 'edu_label',
      pageNum,
      pageSize,
    },
  });
};
const requestCourseDifficultyDict = (pageNum: number, pageSize: number) => {
  return request<IPageResponseType<IDict[]>>({
    url: '/system/dict/data/list',
    method: 'get',
    params: {
      dictType: 'sys_difficulty',
      pageNum,
      pageSize,
    },
  });
};
const requestCourseChargeDict = (pageNum: number, pageSize: number) => {
  return request<IPageResponseType<IDict[]>>({
    url: '/system/dict/data/list',
    method: 'get',
    params: {
      dictType: 'edu_course_charge',
      pageNum,
      pageSize,
    },
  });
};
const requestCourseTypeList = () => {
  return request<IResponseType<IType[]>>({
    url: '/app/coursetype/list',
    method: 'get',
  });
};

const requestCourseListCard = ({
  recommend,
  pageSize = 10,
  pageNum = 1,
  courseType,
  courseTag,
  courseDifficulty,
  courseCharge,
}: {
  recommend?: number;
  pageSize?: number;
  pageNum?: number;
  courseType?: number | string;
  courseTag?: number | string;
  courseDifficulty?: number | string;
  courseCharge?: number | string;
}) => {
  return request<IPageResponseType<ICourseCard[]>>({
    url: '/app/videocourse/list',
    method: 'get',
    params: {
      recommend,
      pageSize,
      pageNum,
      courseType,
      courseTag,
      courseDifficulty,
      courseCharge,
    },
  });
};

const requestCourseDetail = (courseId: string) => {
  return request<IResponseType<ICourseDetail>>({
    url: '/app/videocourse/detail/' + courseId,
    method: 'get',
  });
};

const postStudyCount = (courseId: string) => {
  return request({
    url: '/app/videocourse/count',
    method: 'post',
    data: {
      courseId,
    },
  });
};

export {
  requestCourseLabelDict,
  requestCourseDifficultyDict,
  requestCourseChargeDict,
  requestCourseTypeList,
  requestCourseListCard,
  requestCourseDetail,
  postStudyCount,
};
