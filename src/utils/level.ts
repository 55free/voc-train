// 根据难度获取等级
const getLevel = (level: string | number) => {
  // 将参数转换为数字
  level = Number(level);

  switch (level) {
    case 1:
      return '初级';
    case 2:
      return '中级';
    case 3:
      return '高级';
    default:
      return '未知';
  }
};
const getCharge = (charge: number | string) => {
  charge = Number(charge);
  switch (charge) {
    case 1:
      return '免费';
    case 2:
      return '收费';
    default:
      return '其他';
  }
};

export { getLevel, getCharge };
