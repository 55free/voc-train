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
/**
 * 课程接口
 */
export interface IExpCard {
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

export interface IExpType {
  objId: number;
  typeName: string;
  typeCode: string;
}

const requestExpListCard = ({
  recommend,
  pageSize,
  pageNum,
  expType,
}: {
  recommend?: number;
  pageSize: number;
  pageNum: number;
  expType?: number;
}) => {
  return request<IPageResponseType<IExpCard[]>>({
    url: '/app/exp/list',
    method: 'get',
    params: {
      recommend,
      pageSize,
      pageNum,
      expType,
    },
  });
};

const requestExpTypeList = () => {
  return request<IResponseType<IExpType[]>>({
    url: '/app/exp/expTypeList',
    method: 'get',
  });
};

export { requestExpListCard, requestExpTypeList };
