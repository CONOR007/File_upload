<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-24 18:47:09
 * @Description: 
-->
<template>
  <div class="container">
    <div class="item">
      <h3>大文件上传（大文件上传）</h3>
      <input
        type="file"
        class="upload_ipt"
        style="display: none"
        ref="fileRef"
        @change="handleFileChange"
      />
      <div>
        <button @click="handleChooseFile">选择文件</button>
        <button @click="fetchUpload">上传到服务器</button>
        <button @click="queryImage">测试图片</button>
      </div>
      <a
        href="http://127.0.0.1:8888/showImage/RZU9jG8vL1kLEyFA74TR1G7W.jpg
"
        download=""
        >下载</a
      >
      <!-- 9713c7965d1d51c2d25e5c5cf223d91b.jpg -->
      <img :src="imageUrl" class="image" alt v-if="imageUrl" />
      <!-- <p class="progress" v-for="item,index in progressDetail" :key="index">进度：{{ item }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import SparkMD5 from "spark-md5";
import { getCurrentInstance } from "@vue/runtime-core";
import {
  uploadAlready,
  uploadMerge,
  uploadChunks,
  downloadFile,
  showImage,
} from "../common/upload";

const currentInstance = getCurrentInstance();
const fileResult = ref();
const imageUrl = ref();

const handleChooseFile = () => {
  currentInstance.ctx.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
};
//选择图片 file就是一个二进制格式的blob
const handleFileChange = async (e) => {
  console.log("e", e.target.files);
  const file = e.target.files[0];
  fileResult.value = file;
};

//TODO 思路
//1.根据file获取hash等
//2.请求接口获取已经上传的切片信息
//3.实现文件切片处理 （固定数量或固定大小两种方式）
//4.把每个切片都上传到服务器上
//5.切片都上传成功后调接口合并
const fetchUpload = async () => {
  const file = fileResult.value;
  let chunkList = []; //切片集合
  let alreadyChunkList = []; //已上传切片集合
  let maxSize = 1024 * 100; //固定每个切片都是100kb
  let maxCount = Math.ceil(file.size / maxSize); //拿到一共有多少个切片
  let index = 0; //循环次数
  if (!file) return alert("请先选择图片");
  const { HASH, suffix } = await changeBuffer(file);
  console.log('HASH', HASH)
  console.log('suffix', suffix)

  // 判断当前文件可以切出多少切片
  if (maxCount > 100) {
    // 如果切片数量大于最大值
    maxSize = file.size / 100; // 则改变切片大小
    maxCount = 100;
  }
  // index 0  （0-max） 0-1024
  // index 1  （max - max*2）1024 - 2048
  // index 3  （max*2 -max*3）2048 - 3072
  while (index < maxCount) {
    chunkList.push({
      file: file.slice(index * maxSize, (index + 1) * maxSize),
      filename: `${HASH}_${index + 1}.${suffix}`,
    });
    index++;
  }

  // 先获取已经上传的切片
  const data = await uploadAlready({ HASH });
  if (data && data.code === 200) {
    alreadyChunkList = data.fileList;
    console.log(chunkList, "chunkList");
  }
  index = 0;

  const completeUpload = async () => {
    index++;
    let progress = `(${index}/${maxCount})%`; // 进度条
    if (index >= maxCount) {
      console.log("ok, 切片完成");
    }
  };
  //上传切片
  //如果获取到切片有上传过，并且包含相对应的hash名字，就不再继续上传
  chunkList = chunkList.map((item) => {
    if (alreadyChunkList.length > 0 &&alreadyChunkList.includes(item.filename)) {
      // 表示切片已经存在
      completeUpload(); 
      return;
    }

    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("size", item.file.size);
    formData.append("name", item.filename);
    formData.append("filename", item.filename);
    return new Promise((resolve) => {
      uploadChunks(formData)
        .then(() => {
          completeUpload();
          resolve();
        })
        .catch(() => {
          //
        });
    });
  });
  Promise.all(chunkList).then((res) => {
    uploadMerge({
      HASH: HASH,
      count: maxCount,
      size:maxSize,
      filename:`${HASH}.${suffix}`
    }).then((res) => {
      if (res && res.code === 200) {
        alert("上传成功啦啦啦啦");
      }
    });
  });
};

   // 生成文件 hash（web-worker）
  //  const calculateHash=(fileChunkList) =>{
  //     return new Promise(resolve => {
  //       console.log('11111', 11111)
  //       let worker = new Worker("../common/hash.js");
  //       worker.postMessage({ fileChunkList });
  //       worker.onmessage = e => {
  //        console.log(' e.data;',  e.data)
  //           resolve(e.data);
        
  //       };
  //     });
  //   }

const queryImage = async () => {
  const fileName = "SDdpc36c6PUXS9C39pacWiht.jpeg";
  //  const res = await getImage({ name: fileName });
  try {
     const res = await downloadFile({ name: fileName });
    // const res = await showImage({ name: fileName });
    console.log('res====', res)
  } catch (error) {
    console.log("error", error);
  }
  //  const res = await showImage({ name: fileName });
};

//传文件，获取生成的hash，后缀名，文件名，buffer
const changeBuffer = (file) => {
  return new Promise((resolve) => {
    console.log("changeBase64", file);
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      console.log("first", e.target.result);
      const buffer = e.target.result;
      const spark = new SparkMD5.ArrayBuffer(); //通过文件内容生成hash值，不是名字，所以两张图片名字相同，内容相同，hash值还是一样的
      spark.append(buffer);
      const HASH = spark.end(); //表示处理完毕
      //得到文件的后缀名
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      console.log("根据文件名生成的hash值", HASH);
      resolve({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`,
      });
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
