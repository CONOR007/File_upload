<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 16:15:15
 * @Description: 文件上传 -- base64格式上传
-->
<template>
  <div class="container">
    <div class="item">
      <h3>文件上传（Base64）</h3>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SparkMD5 from "spark-md5";
import { getCurrentInstance } from "@vue/runtime-core";
import { uploadSecondBase64, getImage } from "../common/upload";

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
const fetchUploadFile = async () => {
  const file = fileResult.value;
  const base64 = await changeBase64(file);
  const params = {
    file: encodeURIComponent(base64), // 防止乱码问题
    filename: file.name,
  };
  const { code, codeText } = await uploadSecondBase64(params);
  if (code === 200) {
    alert(codeText);
  }
};
const changeBase64 = (file) => {
  return new Promise((resolve) => {
    console.log("changeBase64", file);
    let fileReader = new FileReader();
    // readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，
    // readyState 会变成已完成DONE，并触发 loadend (en-US) 事件，
    // 同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      console.log("first", e);
      resolve(e.target.result);
    };
  });
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
