interface requestWithPage {
  recommend?: number;
  pageSize: number;
  pageNum: number;
  examType?: number;
  expType?: number;
  courseType?: number;
}

interface IDict {
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

export type { requestWithPage, IDict };
