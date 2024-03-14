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

export interface UserAreaVO {
  areaCode?: any;
  num: number;
}

export interface StudentHour {
  month: string;
  hourType: string;
  hourTotal: string;
}

export interface TeacherHour {
  month: string;
  hourType: string;
  hourTotal: string;
}

export interface GradeAnalysisVO {
  month: string;
  passRate: string;
}

export interface ScreenData {
  teacherNum: number;
  studentNum: number;
  vodNum: number;
  expNum: number;
  examNum: number;
  gradeNum: number;
  teacherTotalHour: number;
  studentTotalHour: number;
  userAreaVOS: UserAreaVO[];
  studentHours: StudentHour[];
  teacherHours: TeacherHour[];
  gradeAnalysisVOS: GradeAnalysisVO[];
}

const getBigScreenData = () => {
  return request<IResponseType<ScreenData>>({
    url: '/app/bigScreen',
    method: 'get',
  });
};

export { getBigScreenData };
