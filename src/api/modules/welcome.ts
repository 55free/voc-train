import request from '@/utils/axios';
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


export interface IChannelCard {
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

const getCourseListChannelSummary = () => {
  return request<IResponseType<IChannelSummary[]>>({
    url: '/courseListChannelSummary',
    method: 'post',
  });
};

const getCourseListChannelCard = () => {
  return request<IResponseType<IChannelCard[]>>({
    url: '/courseListChannelCard',
    method: 'post',
  });
};

const getExamListChannelSummary = () => {
  return request<IResponseType<IChannelSummary[]>>({
    url: '/examListChannelSummary',
    method: 'post',
  });
};

const getExamListChannelCard = () => {
  return request<IResponseType<IChannelCard[]>>({
    url: '/examListChannelCard',
    method: 'post',
  });
};

const getCourseWareListCard = ({
  recommend,
  pageSize = 10,
  pageNum = 1,
}: {
  recommend?: number;
  pageSize?: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<IChannelCard[]>>({
    url: '/app/courseware/list',
    method: 'get',
    params: {
      recommend,
      pageSize,
      pageNum,
    },
  });
};

const getCourseWareDetail = (id: number) => {
  return request<IResponseType<IChannelCard>>({
    url: `/app/courseware/detail/${id}`,
    method: 'get',
  });
};

export {
  getCourseListChannelSummary,
  getCourseListChannelCard,
  getExamListChannelSummary,
  getExamListChannelCard,
  getCourseWareListCard,
  getCourseWareDetail,
};
