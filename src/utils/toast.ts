import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import { ElMessage, MessageParams, ElMessageBox } from 'element-plus';

export function toast(options: MessageParams) {
  ElMessage(options);
}

export function confirm(args) {
  return ElMessageBox.confirm(args);
}
// 封装ElMessageBox
export function prompt(options: any) {
  return ElMessageBox.prompt(options);
}

export { ElMessage, ElMessageBox };
