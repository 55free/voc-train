<script lang="ts" setup>
import { ArrowRight, BottomRight, Printer } from '@element-plus/icons-vue';
import 'element-plus/es/components/table/style/css';
import { ElTable } from 'element-plus';
import {
  getCourseWareDetail,
  IWareDetail,
  uploadCourseWareCount,
} from '@/api/modules/ware';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from '@/utils/toast';

// interface TheFile {
//   name: string;
//   creater: string;
//   createTime: string;
//   size: string;
//   type: string;
//   status: string;
//   url: string;
// }
interface TheFile {
  name: string;
  url: string;
}
// 从router中获取参数id
const id = useRoute().params.id;
const courseWare = ref<IWareDetail>({
  objId: 0,
  cwName: '',
  deptName: '',
  userName: '',
  cwDescribe: '',
  cwTag: '',
  difficulty: 0,
  cwCharge: 0,
  cwCount: 0,
  cwPath: '',
  attachmentVOList: null,
});
const tableData = ref<TheFile[]>([
  // {
  //   name: 'test.pdf',
  //   url: 'https://bestyy.oss-cn-beijing.aliyuncs.com/pdf/%E7%AC%AC%E4%BA%8C%E5%AD%A3%E5%BA%A6%E5%B7%A5%E4%BD%9C%E6%80%BB%E7%BB%93%E5%8F%8A%E7%AC%AC%E4%B8%89%E5%AD%A3%E5%BA%A6%E5%B7%A5%E4%BD%9C%E8%AE%A1%E5%88%92%285%E7%AF%87%29-%E5%B7%B2%E5%8A%A0%E6%B0%B4%E5%8D%B0.pdf',
  // },
]);

getCourseWareDetail(parseInt(id as string)).then((res) => {
  courseWare.value = res.data;
  tableData.value.push(...courseWare.value.attachmentVOList!);
});
const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<TheFile[]>([]);
// const handleSelectable = (row: TheFile) => {
//   return row.status === '已完成';
// };
const handleLinkClick = (row: TheFile) => {
  downLoadFile(row.url, row.name);
};
const handleSelectedClick = () => {
  // 下载multipleSelection中的文件
  // 保存地址和文件名
  const downLoadFiles = multipleSelection.value.map((item) => {
    return {
      url: item.url,
      name: item.name,
    };
  });

  const zip = new JSZip();
  // 假设你有一个 files 数组，其中包含了你要下载的文件的 URL
  // 对每个文件，我们发送一个 fetch 请求，然后将响应的数据添加到 zip 文件中
  const filePromises = downLoadFiles.map((file) => {
    return fetch(file.url)
      .then((response) => response.blob())
      .then((blob) => {
        zip.file(file.name, blob, { binary: true });
      });
  });

  // 使用 Promise.all 等待所有的 fetch 请求完成
  Promise.all(filePromises)
    .then(() => {
      // 生成 zip 文件并下载
      return zip.generateAsync({ type: 'blob' });
    })
    .then((blob) => {
      saveAs(blob, courseWare.value.cwName + '.zip');
      uploadCourseWareCount(courseWare.value.objId);
    })
    .catch((error) => console.error(error));
};

const downLoadFile = (url: string, filename: string) => {
  // 使用file-saver
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      saveAs(blob, filename);
      uploadCourseWareCount(courseWare.value.objId);
    })
    .catch((error) => {
      console.error(error);
      toast({
        message: '下载失败',
        type: 'error',
      });
    });
};
const handleSelectionChange = (val: TheFile[]) => {
  multipleSelection.value = val;
};
</script>

<template>
  <section class="p-6 max-w-4/5 mx-auto xl:max-w-3/5">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item>课件</el-breadcrumb-item>
      <el-breadcrumb-item>{{ courseWare.deptName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ courseWare.userName }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" class="mt-6">
      <template #header>
        <div class="relative">
          <div class="font-medium">{{ courseWare.cwName }}</div>
          <div class="flex justify-between text-#a8a8b3">
            <span>全部文件</span>
            <span
              >已选{{ multipleSelection.length }}个, 当前页共{{
                tableData.length
              }}个</span
            >
          </div>
          <div class="absolute top-3 left-20">
            <el-button
              v-if="multipleSelection.length"
              round
              type="primary"
              plain
              @click="handleSelectedClick"
            >
              下载
            </el-button>
          </div>
        </div>
      </template>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        header-row-class-name="bg-#f5f6f7 text-left"
        row-class-name="h-66px leading-66px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="文件名">
          <template #default="{ row }">
            <div>
              <el-link
                :underline="false"
                :href="row.url"
                target="_blank"
                @click="handleLinkClick(row)"
              >
                <span class="mr-2">
                  <Printer
                    style="
                      width: 1.5em;
                      height: 1.5em;
                      color: rgb(20, 116, 211);
                    "
                  />
                </span>
                {{ row.name }}
              </el-link>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column property="size" label="大小" />
        <el-table-column property="creater" label="创建者" />
        <el-table-column property="createTime" label="创建时间" /> -->
      </el-table>
    </el-card>
  </section>
</template>

<style lang="scss" scoped>
.title {
  font-size: 32px;
  font-weight: bold;
  line-height: 100px;
}

.user-info {
  margin: 20px auto;
  font-weight: bold;
  color: green;
}
</style>
