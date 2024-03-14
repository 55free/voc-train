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

export interface IExamCategory {
  objId: number; // 分类的 ID
  typeName: string; // 分类的名称
  typeCode: number; // 分类所属的频道 ID
}

export interface IExamDetailInfo {
  objId: number;
  examName: string;
  examFullscore: string;
  deptName: string;
  crName: string;
  crAddress: string;
  startTime: string;
  endTime: string;
  examHour: string;
  examTypeName: string;
  examCategory: number;
  examTeacherName: string;
  imagePath: string;
  count: number;
  participationStatus: number;
  remaining?: any;
  remark?: any;
}

export interface IQuizState {
  objId: number;
  userName: string;
  grdResult?: any;
  grdExam: number;
  examName: string;
  score: string;
  grdScore?: any;
  examTime: string;
  grdStartTime: string;
  grdFinishTime?: any;
}

/**
 * 考试卡片接口
 */
export interface IExamCard {
  objId: number;
  examName: string;
  deptName: string;
  examCategory: number;
  imagePath: string;
  count: number;
}

export interface IFinishedExam {
  gradeId: number;
  examName: string;
  deptName: string;
  examTypeName: string;
  examCategory: number;
  imagePath: string;
  grdResult: number;
  score: string;
  grdScore: string;
  examTime: string;
  grdStartTime: string;
}

export interface IFinishedDetail {
  objId: number;
  examName: string;
  startTime: string;
  endTime: string;
  examCategory: number;
  grdResult: number;
  userName: string;
  examTime: string;
  examUseTime: string;
  score: string;
  grdScore: string;
  answerVOList: AnswerVOList[];
  grdMarker?: any;
  grdMarkTime?: any;
  grdMarkContent?: any;
}

export interface AnswerVOList {
  quesSort: number;
  quesContent: string;
  items: IQuestion[];
  quesAnswer: string;
  answer: string;
  quesScore: string;
  analysis: string;
}

/**
 * 测验试卷接口
 */
export interface IQuizPaper {
  paperId: number;
  quesSort: number;
  quesContent: string;
  quesOption?: any;
  items: IQuestion[];
  answer?: any;
  quesScore: string;
}

/**
 * 问题接口
 */
interface IQuestion {
  prefix: string;
  content: string;
}

/**
 * 选项接口
 */
interface IOptionDto {
  id: number; // 选项的 ID
  content: string; // 选项的内容
}

interface ExamDict {
  createBy: string;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  params?: any;
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  cssClass?: any;
  listClass: string;
  isDefault: string;
  status: string;
  default: boolean;
}

const getExamInfo = () => {
  return request<IResponseType<IExamCard[]>>({
    url: '/examInfo',
    method: 'post',
  });
};

const getExamCategory = () => {
  return request<IResponseType<IExamCategory[]>>({
    url: '/app/exam/examTypeList',
    method: 'get',
  });
};

const getQuizQuestions = ({
  quizId,
  pageSize = 10,
  pageNum = 1,
}: {
  quizId: number;
  pageSize?: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<IQuizPaper[]>>({
    url: '/app/exam/examPaperList/' + quizId,
    method: 'get',
    params: {
      pageSize,
      pageNum,
    },
  });
};

const getEduExamDict = () => {
  return request<IResponseType<ExamDict[]>>({
    url: '/system/dict/data/type/edu_exam_category',
    method: 'get',
  });
};

const getExamCardList = ({
  recommend,
  pageSize,
  pageNum,
  examType,
}: {
  recommend?: number;
  pageSize?: number;
  pageNum?: number;
  examType?: number;
}) => {
  return request<IPageResponseType<IExamCard[]>>({
    url: '/app/exam/list',
    method: 'get',
    params: {
      recommend,
      pageSize,
      pageNum,
      examType,
    },
  });
};

const getExamDetailInfo = (id: number) => {
  return request<IResponseType<IExamDetailInfo>>({
    url: '/app/exam/detail/' + id,
    method: 'get',
  });
};
const getQuizState = (grdExam: number) => {
  return request<IResponseType<IQuizState>>({
    url: '/app/exam/startExam',
    method: 'post',
    data: {
      grdExam,
    },
  });
};

const endExam = (objId: number) => {
  return request<IResponseType<IQuizState>>({
    url: '/app/exam/endExam',
    method: 'post',
    data: {
      objId,
    },
  });
};

const uploadAnswer = ({
  gradeId,
  paperId,
  answer,
}: {
  gradeId: number;
  paperId?: number;
  answer?: string;
}) => {
  return request<IPageResponseType<IQuizPaper[]>>({
    url: '/app/exam/answer',
    method: 'post',
    data: {
      gradeId,
      paperId,
      answer,
    },
  });
};

const getMyExamList = ({
  pageSize = 8,
  pageNum = 1,
}: {
  pageSize: number;
  pageNum?: number;
}) => {
  return request<IPageResponseType<IFinishedExam[]>>({
    url: '/app/exam/listCompletedExam',
    method: 'get',
    params: {
      pageSize,
      pageNum,
    },
  });
};

const getFinishedDetail = (gradeId: number) => {
  return request<IResponseType<IFinishedDetail>>({
    url: '/app/exam/examDetail/' + gradeId,
    method: 'get',
  });
};

export {
  getExamInfo,
  getExamCategory,
  getQuizQuestions,
  getEduExamDict,
  getExamCardList,
  getExamDetailInfo,
  getQuizState,
  endExam,
  uploadAnswer,
  getMyExamList,
  getFinishedDetail,
};
