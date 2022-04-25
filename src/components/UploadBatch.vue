<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 16:14:05
 * @Description: 一次性上传多张
-->

<template>
  <div class="container">
    <div class="item">
      <h3>文件上传（一次性上传多文件）</h3>
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

<script setup>
import { ref, reactive } from "vue";
import SparkMD5 from "spark-md5";
import { getCurrentInstance } from "@vue/runtime-core";
import { uploadFileList } from "../common/upload";

const currentInstance = getCurrentInstance();
const fileList = ref();
const imageUrl = ref();

// 第三个文件上传 多文件上传 ============开始================
const handleChooseFile = () => {
  currentInstance.ctx.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
};
//选择图片
const handleFileChange = (e) => {
  console.log("e", e.target.files);
  // const [file] = e.target.files;
  // if (!file) return;
  // if (!/(png|jpg|jpeg)/i.test(file.type)) {
  //   alert("上传文件格式不正确");
  // }
  // // 限制文件上传的大小
  // if (file.size > 2 * 1024 * 1024) {
  //   alert("上传文件不能超过2MB");
  //   return;
  // }
  fileList.value = e.target.files;
  // changeBase64Third(file);
  // fetchUpload(e.target.files);
};
const fetchUploadFile = async () => {
  // const fileList = thirdFile.value;
  // const { fileName } = await changeBufferThird(file);
  // 把多个文件放到同一个请求里，这样只会请求一次接口。否则一个文件就会请求一次

  const list = Array.from(fileList.value);
  const formData = new FormData();
  list.forEach((item) => {
    formData.append("file", item);
    formData.append("filename", item.name);
  });
  const { code, codeText } = await uploadFileList(formData);
  if (code === 200) {
    alert(codeText);
  }
};
const changeBase64Third = (file) => {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    // readAsDataURL 方法会读取指定的 Blob 或 File 对象。读取操作完成的时候，
    // readyState 会变成已完成DONE，并触发 loadend (en-US) 事件，
    // 同时 result 属性将包含一个data:URL格式的字符串（base64编码）以表示所读取文件的内容。
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      console.log("first112", e.target.result);
      imageUrl.value = e.target.result;
      resolve(e.target.result);
    };
  });
};

const changeBufferThird = (file) => {
  return new Promise((resolve) => {
    console.log("changeBase64Third", file);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      console.log("first", e.target.result);
      const buffer = e.target.result;
      const spark = new SparkMD5.ArrayBuffer(); //通过文件内容生成hash值，不是名字，所以两张图片名字相同，内容相同，hash值还是一样的
      spark.append(buffer);
      const hashName = spark.end(); //表示处理完毕
      //得到文件的后缀名
      const typeName = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      console.log("根据文件名生成的hash值", hashName);
      resolve({
        buffer,
        hashName,
        typeName,
        fileName: `${hashName}.${typeName}`,
      });
    };
  });
};
</script>

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
