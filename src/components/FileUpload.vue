<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 12:38:43
 * @Description: 
-->
<script setup>
import { ref, reactive } from "vue";
import SparkMD5 from "spark-md5";
import { getCurrentInstance } from "@vue/runtime-core";
import {
  uploadFirstFormData,
  uploadSecondBase64,
  uploadFileList,
  getImage,
  uploadAlready,
  uploadMerge,
  uploadChunks,
  downloadFile,
  showImage,
} from "../common/upload";

const currentInstance = getCurrentInstance();

const firstFile = ref();
const secondFile = ref();
const thirdFile = ref();
const FourthFile = ref();
const fileList = ref();
const progressDetail = ref();
const imageUrl = ref();
const fiveFile = ref();

// 第一个文件上传 ============开始================
const chooseFileFirst = () => {
  currentInstance.ctx.$refs.firstFileRef.dispatchEvent(new MouseEvent("click"));
};
//选择图片
const fileChangeFirst = (e) => {
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
  firstFile.value = file;
};
//上传图片
const fetchUploadFirst = async () => {
  const file = firstFile.value;
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
    console.log("resgetImage", res);
  }
};
// 第一个文件上传 ============结束================

// 第二个文件上传 base64 ============开始================
const chooseFileSecond = () => {
  currentInstance.ctx.$refs.secondFileRef.dispatchEvent(
    new MouseEvent("click")
  );
};
//选择图片
const fileChangeSecond = (e) => {
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
  secondFile.value = file;
};
const fetchUploadSecond = async () => {
  const file = secondFile.value;
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
// 第二个文件上传 base64 ============结束================

// 第三个文件上传 多文件上传 ============开始================
const chooseFileThird = () => {
  currentInstance.ctx.$refs.thirdFileRef.dispatchEvent(new MouseEvent("click"));
};
//选择图片
const fileChangeThird = (e) => {
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
  thirdFile.value = e.target.files;
  // changeBase64Third(file);
  fetchUploadThird(e.target.files);
};
const fetchUploadThird = async (fileList) => {
  // const fileList = thirdFile.value;
  // const { fileName } = await changeBufferThird(file);
  // 把多个文件放到同一个请求里，这样只会请求一次接口。否则一个文件就会请求一次
  console.log("first");
  const list = Array.from(fileList);
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
// 第三个文件上传 多文件上传 ============结束================

// 第四个文件上传 多文件============开始================
const chooseFileFourth = () => {
  currentInstance.ctx.$refs.FourthFileRef.dispatchEvent(
    new MouseEvent("click")
  );
};
//选择图片
const fileChangeFourth = (e) => {
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
  fileList.value = list;
  console.log("first", list);
};
//上传图片 -- 多个文件，所以循环发送请求
const fetchUploadFourth = async () => {
  const fileListArray = fileList.value;
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
// 第四个文件上传 多文件============结束================

// 第五个文件上传 大文件上传 ============开始================
const chooseFileFive = () => {
  currentInstance.ctx.$refs.fiveFileRef.dispatchEvent(new MouseEvent("click"));
};
//选择图片
const fileChangeFive = async (e) => {
  console.log("e", e.target.files);
  const file = e.target.files[0];
  fiveFile.value = file;
};

//TODO 思路
//1.根据file获取hash等
//2.请求接口获取已经上传的切片信息
//3.实现文件切片处理 （固定数量或固定大小两种方式）
//4.把每个切片都上传到服务器上
//5.切片都上传成功后调接口合并
const fetchUploadFive = async () => {
  const file = fiveFile.value;
  let chunkList = []; //切片集合
  let alreadyChunkList = []; //已上传切片集合
  let maxSize = 1024 * 100; //固定每个切片都是100kb
  let maxCount = Math.ceil(file.size / maxSize); //拿到一共有多少个切片
  let index = 0; //循环次数
  if (!file) return alert("请先选择图片");
  const { HASH, suffix } = await changeBufferFive(file);
  // 判断当前文件可以切出多少切片
  if (maxCount > 100) {
    // 如果切片数量大于最大值
    maxSize = file.size / 100; // 则改变切片大小
    maxCount = 100;
  }
  // index 0  （0-max） 0-1024
  // index 1  （max - max*2）2024 - 2048
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
    if (alreadyChunkList.length > 0 && alreadyChunkList.includes(item.filename)) {
      // 表示切片已经存在
      completeUpload();
      return;
    }

    const formData = new FormData();
    formData.append("file", item.file);
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
  Promise.all(chunkList).then(() => {
    uploadMerge({
      HASH: HASH,
      count: maxCount,
    }).then((res) => {
      if(res && res.code === 200 ){
        alert("上传成功啦啦啦啦")
      }
    });
  });
};

const queryImage=async()=>{
  const fileName = "RZU9jG8vL1kLEyFA74TR1G7W.jpg"
  //  const res = await getImage({ name: fileName });
  try {
    //  const res = await downloadFile({ name: fileName });
      const res = await downloadFile({ name: fileName });
  } catch (error) {
    console.log('error', error)
  }
  //  const res = await showImage({ name: fileName });

};

//传文件，获取生成的hash，后缀名，文件名，buffer
const changeBufferFive = (file) => {
  return new Promise((resolve) => {
    console.log("changeBase64Third", file);
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

// 第五个文件上传 大文件上传 ============结束================
</script>

<template>
  <div class="container">
    <div class="item">
      <h3>文件上传（FormData）</h3>
      <input
        type="file"
        accept=".png,.jpg"
        class="upload_ipt"
        style="display: none"
        ref="firstFileRef"
        @change="fileChangeFirst"
      />
      <div>
        <button @click="chooseFileFirst">选择文件</button>
        <button @click="fetchUploadFirst">上传到服务器</button>
      </div>
      <div class="upload_tip">大小不能超过2ＭＢ</div>
      <img :src="imageUrl" class="image" alt v-if="imageUrl" />
    </div>

    <div class="item">
      <h3>文件上传（Base64）</h3>
      <input
        type="file"
        accept=".png,.jpg"
        class="upload_ipt"
        style="display: none"
        ref="secondFileRef"
        @change="fileChangeSecond"
      />
      <div>
        <button @click="chooseFileSecond">选择文件</button>
        <button @click="fetchUploadSecond">上传到服务器</button>
      </div>
      <div class="upload_tip">大小不能超过2ＭＢ</div>
    </div>

    <div class="item">
      <h3>文件上传（多文件上传）</h3>
      <input
        type="file"
        accept=".png,.jpg"
        class="upload_ipt"
        style="display: none"
        ref="thirdFileRef"
        multiple
        @change="fileChangeThird"
      />
      <div>
        <button @click="chooseFileThird">选择文件</button>
        <button @click="fetchUploadThird">上传到服务器</button>
      </div>
      <img :src="imageUrl" class="image" alt v-if="imageUrl" />
    </div>

    <div class="item">
      <h3>文件上传（多文件循环上传）</h3>
      <input
        type="file"
        class="upload_ipt"
        style="display: none"
        ref="FourthFileRef"
        multiple
        @change="fileChangeFourth"
      />
      <div>
        <button @click="chooseFileFourth">选择文件</button>
        <button @click="fetchUploadFourth">上传到服务器</button>
      </div>
      <li v-for="file in fileList" :key="file.uid">
        <p class="fileItem">{{ file.fileName }}</p>
      </li>
      <!-- <p class="progress" v-for="item,index in progressDetail" :key="index">进度：{{ item }}</p> -->
    </div>

    <div class="item">
      <h3>大文件上传（大文件上传）</h3>
      <input
        type="file"
        class="upload_ipt"
        style="display: none"
        ref="fiveFileRef"
        @change="fileChangeFive"
      />
      <div>
        <button @click="chooseFileFive">选择文件</button>
        <button @click="fetchUploadFive">上传到服务器</button>
        <button @click="queryImage">测试图片</button>
      </div>
      <a href="http://127.0.0.1:8888/showImage/RZU9jG8vL1kLEyFA74TR1G7W.jpg
" download="">下载</a>
<!-- 9713c7965d1d51c2d25e5c5cf223d91b.jpg -->
 <img :src="imageUrl" class="image" alt v-if="imageUrl" />
      <!-- <p class="progress" v-for="item,index in progressDetail" :key="index">进度：{{ item }}</p> -->
    </div>
  </div>
</template>

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
