<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-24 17:28:47
 * @Description: 文件上传 -- FormData 单个文件上传
-->

<template>
  <div class="container">
    <div class="item">
      <h3>文件上传（FormData）</h3>
      <input
        type="file"
        accept=".png,.jpg"
        style="display: none"
        ref="fileRef"
        @change="handleFileChange"
      />
      <div>
        <button @click="handleChooseFile">选择文件</button>
        <button @click="fetchUploadFile">上传到服务器</button>
      </div>
      <div class="upload_tip">大小不能超过2ＭＢ</div>
      <img :src="imageUrl" class="image" alt v-if="imageUrl" />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { getCurrentInstance } from "@vue/runtime-core";
import { uploadFirstFormData, getImage } from "../common/upload";

const currentInstance = getCurrentInstance();
const fileResult = ref();
const imageUrl = ref();

// 第一个文件上传 ============开始================
const handleChooseFile = () => {
  currentInstance.ctx.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
};

//选择图片
const handleFileChange = (e) => {
  console.log("e", e.target.files);
  const [file] = e.target.files;
  if (!file) return;
  if (!/(png|jpg|jpeg)/i.test(file.type)) {
    alert("上传文件格式不正确");
  }
  // 限制文件上传的大小
  if (file.size > 2 * 1024 * 1024) {
    alert("上传文件不能超过2MB");
    return;
  }
  fileResult.value = file;
};

//上传图片
const fetchUploadFile = async () => {
  const file = fileResult.value;
  let formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);
  const { code, codeText, url, originFilename, fileName } =
    await uploadFirstFormData(formData, function (progress) {
      //loaded：当前上传的进度  //total：总共要上传多少
      const { loaded, total } = progress;
      //当前传的进度 除以 总进度 ✖️ 100
      console.log("progress", progress);
      console.log("progress", (loaded / total) * 100) + "% ";
    });
  if (code === 200) {
    const res = await getImage({ name: fileName });
    imageUrl.value = res?.data;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}

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
