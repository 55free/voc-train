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

export interface IWareDetail {
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

const getCourseWareDetail = (id: number) => {
  return request<IResponseType<IWareDetail>>({
    url: `/app/courseware/detail/${id}`,
    method: 'get',
  });
};

const uploadCourseWareCount = (id: number) => {
  return request<IResponseType<IWareDetail>>({
    url: '/app/courseware/count',
    method: 'post',
    data: {
      objId: id,
    },
  });
};

export { getCourseWareDetail, uploadCourseWareCount };
