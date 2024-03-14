import request from '@/utils/axios';
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

interface IUploadResponseType {
  code: number; // 可选的状态码
  msg: string; // 响应的消息
}

/**
 * 直播卡片接口
 */
export interface ILiveCard {
  objId: number;
  courseName: string;
  courseType: number;
  courseCategory?: any;
  courseDifficulty?: any;
  courseCharge: string;
  teacherName?: any;
  courseDescription?: any;
  courseTag?: any;
  coursePic: string;
  deptName?: any;
  streamViewr: number;
  vcUrl: string;
  thirdUrl?: any;
  pullUrl?: any;
  backUpUrlList?: any;
  steamBeginTime?: any;
  steamEndTime?: any;
  courseMode?: any;
}

export interface ILiveRoomContent {
  objId: number;
  courseName: string;
  courseType: number;
  courseCategory: number;
  courseDifficulty: number;
  courseCharge: string;
  teacherName: string;
  courseDescription: string;
  courseTag: string;
  coursePic: string;
  deptName: string;
  streamViewr: number;
  vcUrl?: any;
  thirdUrl: string;
  pullUrl: string;
  backUpUrlList?: any;
  steamBeginTime: string;
  steamEndTime: string;
  courseMode: number;
}

export interface IComment {
  id: number;
  isSender: number;
  msg: string;
  time: string;
}

const getLiveInfo = () => {
  return request<IResponseType<ILiveCard[]>>({
    url: '/LiveCard',
    method: 'post',
  });
};

const requestLiveRoomContent = (roomId: string) => {
  return request<IResponseType<ILiveRoomContent>>({
    url: '/app/livecourse/detail/' + roomId,
    method: 'get',
  });
};

const requestLiveCardList = ({
  recommend,
  pageSize = 10,
  pageNum = 1,
  courseType,
  vcUrl,
}: {
  recommend?: number;
  pageSize?: number;
  pageNum?: number;
  vcUrl: number;
  courseType?: number | string;
}) => {
  return request<IPageResponseType<ILiveCard[]>>({
    url: '/app/livecourse/list',
    method: 'get',
    params: {
      recommend,
      pageSize,
      pageNum,
      vcUrl,
      courseType,
    },
  });
};

const requestPlayBackList = (liveId: string) => {
  return request<IResponseType<ILiveRoomContent>>({
    url: '/app/livecourse/detail/' + liveId,
    method: 'get',
  });
};

const requestLiveWord = (liveId: string, id: string = undefined) => {
  return request<IResponseType<IComment[]>>({
    url: '/app/msg/list',
    method: 'get',
    params: {
      liveId,
      id,
    },
  });
};

const uploadLiveWord = (liveId: string, msg: string) => {
  return request<IUploadResponseType>({
    url: '/app/msg',
    method: 'post',
    data: {
      liveId,
      msg,
    },
  });
};

export {
  getLiveInfo,
  requestLiveRoomContent,
  requestLiveCardList,
  requestPlayBackList,
  requestLiveWord,
  uploadLiveWord,
};
