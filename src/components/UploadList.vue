
<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 16:20:06
 * @Description:文件上传 -- 多文件循环上传
-->
<script setup>
import { ref, reactive } from "vue";
import SparkMD5 from "spark-md5";
import { getCurrentInstance } from "@vue/runtime-core";
import {
  uploadFirstFormData,
} from "../common/upload";

const currentInstance = getCurrentInstance();
const fileResult = ref();
const imageUrl = ref();

const handleChooseFile = () => {
  currentInstance.ctx.$refs.fileRef.dispatchEvent(
    new MouseEvent("click")
  );
};
//选择图片
const handleFileChange = (e) => {
  console.log("e", e.target.files);
  const files = Array.from(e.target.files);
  if (files.length === 0) return;
  console.log("files", files);
  const list = files.map((file) => {
    return {
      file,
      fileName: file.name,
      key: Math.random() * new Date(),
    };
  });
  // if (!/(png|jpg|jpeg)/i.test(file.type)) {
  //   alert("上传文件格式不正确");
  // }
  // // 限制文件上传的大小
  // if (file.size > 2 * 1024 * 1024) {
  //   alert("上传文件不能超过2MB");
  //   return;
  // }
  fileResult.value = list;
};
//上传图片 -- 多个文件，所以循环发送请求
const fetchUploadFile = async () => {
  const fileListArray = fileResult.value;
  //循环
  const files = fileListArray.map((item, index) => {
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("filename", item.fileName);
    return uploadFirstFormData(formData, function (progress) {
      //loaded：当前上传的进度  //total：总共要上传多少
      const { loaded, total } = progress;
      //当前传的进度 除以 总进度 ✖️ 100
      const progressInfo = `${((loaded / total) * 100).toFixed(2)}%`;
      console.log("progressInfo", progressInfo);
    }).then((data) => {
      if (data.code === 200) {
        return Promise.resolve(data);
      }
      return Promise.reject();
    });
  });

  Promise.all(files)
    .then((res) => {
      console.log(res);
      setTimeout(() => {
        alert("上传成功");
      }, 1000);
    })
    .catch(() => {
      alert("catch上传失败");
    });
};
</script>

<template>
  <div class="container">
    <div class="item">
      <h3>文件上传（循环上传多文件）</h3>
      <input
        type="file"
        accept=".png,.jpg"
        style="display: none"
        multiple
        ref="fileRef"
        @change="handleFileChange"
      />
      <div>
        <button @click="handleChooseFile">选择文件</button>
        <button @click="fetchUploadFile">上传到服务器</button>
      </div>
      <img :src="imageUrl" class="image" alt v-if="imageUrl" />
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  margin-bottom: 20px;
  width: 300px;
  height: 250px;
  border: 1px dashed salmon;
}

button {
  width: 100px;
  height: 40px;
  margin: 10px;
}
.image {
  width: 100px;
  height: 100px;
}
li {
  list-style: none;
}
.fileItem {
  height: 30px;
  margin: 0;
}
.progress {
  color: #ff6600;
}
</style>
