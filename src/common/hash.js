/*
 * @Author: guansheng.guo
 * @Date: 2022-04-24 12:32:27
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-24 15:51:54
 * @Description:
 */
self.importScripts("./spark-md5.min.js"); // 导入脚本

// 生成文件 hash
self.onmessage = (e) => {
  console.log('importScripts("spark-md5")', e.data);
  const { fileChunkList } = e.data;
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  fileReader.onload = (e) => {
    console.log("first", e.target.result);
    const buffer = e.target.result;
    // const spark = new SparkMD5.ArrayBuffer(); //通过文件内容生成hash值，不是名字，所以两张图片名字相同，内容相同，hash值还是一样的
    const spark = new self.SparkMD5.ArrayBuffer();
    spark.append(buffer);
    const HASH = spark.end(); //表示处理完毕
    //得到文件的后缀名
    const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
    console.log("根据文件名生成的hash值", HASH);
    self.postMessage({
      buffer,
      HASH,
      suffix,
      filename: `${HASH}.${suffix}`,
    });
    self.close();
  };
};
