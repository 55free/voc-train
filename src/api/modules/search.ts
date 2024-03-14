import request from '@/utils/axios';
import { RouteRecordRaw } from 'vue-router';
/**
 * 通用响应类型接口
 * @template P 泛型参数，用于表示响应结果的数据类型，默认为任意对象
 */
interface IPageResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  rows: P; // 响应结果的数据
  total: number; // 数据总数
}

interface IResponseType<P = Record<string, any>> {
  code?: number; // 可选的状态码
  msg: string; // 响应的消息
  data: P; // 响应结果的数据
}

/**
 * 频道接口
 */
interface IChannelSummary {
  channelId: number; // 频道的 ID
  channelName: string; // 频道的名称
}

export interface ISearchWareCard {
  objId: number;
  cwName: string;
  deptName: string;
  userName: string;
  cwDescribe: string;
  cwTag: string;
  difficulty: number;
  cwCharge: number;
  cwCount: number;
  cwPath: string;
  attachmentVOList?: any;
}
export interface ISearchCourseCard {
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

export interface ISearchExpCard {
  objId: number;
  expType: number;
  expName: string;
  expTypeName: string;
  expDescription: string;
  expDifficulty: string;
  expAddress: string;
  expCharge: number;
  expTag: string;
  expPic: string;
}

const requestWareListCard = ({
  cwName,
  pageSize = 10,
  pageNum = 1,
}: {
  cwName: string;
  pageSize?: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<ISearchWareCard[]>>({
    url: '/app/courseware/list',
    method: 'get',
    params: {
      cwName,
      pageSize,
      pageNum,
    },
  });
};

const requestCourseListCard = ({
  courseName,
  pageSize = 10,
  pageNum = 1,
}: {
  courseName: string;
  pageSize?: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<ISearchCourseCard[]>>({
    url: '/app/videocourse/list',
    method: 'get',
    params: {
      courseName,
      pageSize,
      pageNum,
    },
  });
};

const requestExpListCard = ({
  expName,
  pageSize = 10,
  pageNum = 1,
}: {
  expName: string;
  pageSize?: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<ISearchExpCard[]>>({
    url: '/app/exp/list',
    method: 'get',
    params: {
      expName,
      pageSize,
      pageNum,
    },
  });
};

export { requestWareListCard, requestCourseListCard, requestExpListCard };
