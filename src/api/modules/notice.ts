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

export interface NoticeDict {
  createBy: string;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark: string;
  params: any;
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass: string;
  listClass: string;
  isDefault: string;
  status: string;
  default: boolean;
}

export interface NoticePiece {
  noticeId: number;
  noticeTitle: string;
  noticeContent: string;
  createTime: string;
}

const getPageNoticeDict = ({
  pageSize = 10,
  pageNum = 1,
  dictType = 'sys_notice_type',
}: {
  pageSize?: number;
  pageNum?: number;
  dictType?: string;
} = {}) => {
  return request<IPageResponseType<NoticeDict[]>>({
    url: '/system/dict/data/list',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      dictType,
    },
  });
};

const getNoticeList = ({
  noticeTitle,
  pageSize,
  pageNum,
  noticeType,
}: {
  noticeTitle?: string;
  pageSize?: number;
  pageNum?: number;
  noticeType?: number;
}) => {
  return request<IPageResponseType<NoticePiece[]>>({
    url: '/app/notice/list',
    method: 'get',
    params: {
      noticeTitle,
      pageSize,
      pageNum,
      noticeType,
    },
  });
};

export { getPageNoticeDict, getNoticeList };
