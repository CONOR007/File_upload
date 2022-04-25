const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const multiparty = require("multiparty");
const SparkMD5 = require("spark-md5");
const path = require("path");
const fse = require("fs-extra");
const app = express();
const PORT = 8888;
const HOST = "http://127.0.0.1";
const HOSTNAME = `${HOST}:${PORT}`;
const WEB_HOSTNAME = `${HOST}:${3000}`; // 前端起的服务

app.listen(PORT, () => {
  console.log(`serve is runnig at ${HOSTNAME}`);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  req.method === "OPITIONS"
    ? res.send("CURRENT SERVERICES SUPPORT CROSS DOMAIN REQUEST!")
    : next();
});

app.use(
  bodyParser.urlencoded({
    extended: false, //为false的时候，键值对中的值就为'String'或'Array'形式， 为true的时候，则可为任何数据类型。
    limit: "1024mb",
  })
);
// 延迟函数
const delay = function (interval) {
  typeof interval !== "number" ? interval === 1000 : interval;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

// 基于multiparty插件实现文件上传处理 & form-data解析
const uploadDir = `${__dirname}/upload`; //表示当前文件所在目录的绝对路径Users/guohao/Downloads/work/study/uploadDemo/server
const baseDir = path.resolve(__dirname, "../"); // /Users/guohao/Downloads/work/study/uploadDemo
//__dirname /Users/guohao/Downloads/work/study/uploadDemo/server

const multiparty_load = function (req, auto) {
  typeof auto !== "boolean" ? (auto = false) : null;
  let config = {
    maxFieldsSize: 200 * 1024 * 1024,
  };
  if (auto) config.uploadDir = uploadDir;
  console.log("config", config);
  return new Promise(async (resolve, reject) => {
    await delay(); //
    // 用来将客户端formData 结果解析
    new multiparty.Form(config).parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        fields,
        files,
      });
    });
  });
};

// 检测文件是否已经存在
const exists = function (path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) resolve(false);
      return resolve(true);
    });
  });
};

// 创建文件并写入到指定的目录 & 返回客户端结果，然后返回上传成功
const writeFile =  function (res, path, file, filename, stream) {
  console.log("file2", file);
  console.log("file.path2", file);
  return new Promise((resolve, reject) => {
    if (stream) {
        // saveFileWithStream(path,file)
    }
    fs.writeFile(path, file, (err) => {
      if (err) {
        reject(err);
        res.send({
          code: 1,
          codeText: err,
        });
        return;
      }
      resolve();
      let path = uploadDir;
      res.send({
        code: 200,
        codeText: "上传成功",
        filename: filename,
        url: path.replace(baseDir, WEB_HOSTNAME),
      });
    });
  });
};


//上传单个文件
app.post("/upload_single", async (req, res) => {
  try {
    let { files, fields } = await multiparty_load(req, true);
    let file = (files.file && files.file[0]) || {};
    const arr = file.path.split("/");
    res.send({
      code: 200,
      codeText: "上传成功",
      originFilename: file.originalFilename,
      url: file.path.replace(baseDir, WEB_HOSTNAME),
      fileName: arr[arr.length - 1],
    });
  } catch (err) {
    res.send({
      code: 1,
      codeText: err,
    });
  }
});

//根据链接可以在浏览器上显示该图片
app.get("/showImage", async (req, res) => {
  const { name } = req.query;
  const STATIC_PATH = `./upload/${name}`;
  const filePath = path.join(__dirname, STATIC_PATH);
  fs.readFile(filePath, function (err, data) {
    res.setHeader("Content-Type", "image/jpeg");
    res.end(data);
  });
});

//根据名字下载文件
app.get("/downloadFile", async (req, res) => {
    const { name } = req.query;
    const STATIC_PATH = `./upload/${name}`;
    const filePath = path.join(__dirname, STATIC_PATH);
    // res.download(filePath, name);
    fs.readFile(filePath, function (err, data) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Disposition", `attachment; filename=abc.jpg`);
      res.end(data);
    });
});

//根据名字获取照片
app.post("/getImage", async (req, res) => {
    try {
        const { name } = req.body;
        if (!/(png|jpg|jpeg)/i.test(name)) {
        res.send({
        code: 404,
        codeText: "不是照片类型",
        });
        return;
    }
    if (name) {
      const STATIC_PATH = `./upload/${name}`;
      const readStream = fs.readFileSync(path.join(__dirname, STATIC_PATH));
      const base64 = readStream.toString("base64");
      res.send({
        code: 200,
        data: "data:image/png;base64," + base64,
      });
    } else {
      res.send({
        code: 404,
        codeText: "未找到",
      });
    }
  } catch (err) {}
});

//base64格式上传
app.post("/upload_single_base64", async (req, res) => {
  let file = req.body.file;
  let filename = req.body.filename;
  let spark = new SparkMD5.ArrayBuffer(); // 根据文件内容,生成一个hash名字,所以如果两张图片名字不一样，内容一样，也会生成同样的名字
  let suffix = /\.([0-9a-zA-Z]+)$/.exec(filename)[1]; //拿到传进来名字的后缀名 例如.png .jepg等
  let isExists = false;
  let path;
  file = decodeURIComponent(file); //客户端防止乱码加密，所以这里需要用decode解密
  file = file.replace(/^data:image\/\w+;base64,/, ""); //去掉base64前面的一串东西，前面的是声明的格式，后面是具体的base64的值
  file = Buffer.from(file, "base64"); // 将base64转成正常的文件格式
  spark.append(file); //通过spark.end就能获取根据文件内容生成的hash名字
  path = `${uploadDir}/${spark.end()}.${suffix}`;
  await delay();
  // 检测是否存在
  isExists = await exists(path);
  if (isExists) {
    res.send({
      code: 200,
      codeText: "file is exists",
      urlName: filename,
      url: path.replace(baseDir, WEB_HOSTNAME),
    });
    return;
  }
  // fs.writeFile(res)

  writeFile(res, path, file, filename, false);
});

//一次上传多张图片
app.post("/upload_fileList", async (req, res) => {
  try {
    const { fields, files } = await multiparty_load(req, true);
    console.log("files", files);
    const nameArray = files.file.map(function (item) {
      return { name: item.originalFilename };
    });
    res.send({
      code: 200,
      codeText: "上传成功",
      url: nameArray,
    });
  } catch (e) {
    res.send({
      code: 1,
      codeText: e,
    });
  }
});

// 大文件上传 & 合并切片
const merge = (HASH, count,file,size) => {
  return new Promise(async (resolve, reject) => {
    let path = `${uploadDir}/${HASH}`; //临时目录
    let fileList = [];
    let suffix;
    let isExists = await exists(path); // 判断文件是否存在
    if (!isExists) {
      reject("HASH path  is not found!");
      return;
    }
    fileList = fs.readdirSync(path); //获取所有切片
    if (fileList.length < count) {
      reject("the slice has not been uploaded!");
      return;
    }
    fileList
      .sort((a, b) => {
        //按序号排序
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      })
      .forEach((item,index) => {
        !suffix ? (suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1]) : null; // 处理文件后缀
        fs.appendFileSync(
          `${uploadDir}/${HASH}.${suffix}`,
          fs.readFileSync(`${path}/${item}`)
        );
        fs.unlinkSync(`${path}/${item}`);

        // pipeStream(path,fs.createWriteStream(`${uploadDir}/${HASH}.${suffix}`, {
        //   start: index * size,
        //   end: (index + 1) * size
        // }))
      });
    fs.rmdirSync(path); // 删除临时文件夹
    resolve({
      path: `${uploadDir}/${HASH}.${suffix}`,
      filename: `${HASH}.${suffix}`,
    });
  });
};
const pipeStream = (path, writeStream) =>{
  new Promise(resolve => {
    const readStream = fs.createReadStream(path);
    readStream.on("end", () => {
      fs.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
}

/**
 * 上传切片
 */
app.post("/upload_chunk", async (req, res) => {
  try {
    const { fields, files } = await multiparty_load(req);
    const file = (files.file && files.file[0]) || {};
    const filename = (fields.filename && fields.filename[0]) || '';
    // const path = `${uploadDir}/${filename}`
    let isExists = false;
    // 创建存放切片的临时目录
    const [,HASH] = /^([^_]+)_(\d+)/.exec(filename);
    let path = `${uploadDir}/${HASH}`; // 用hash生成一个临时文件夹
    !fs.existsSync(path) ? fs.mkdirSync(path) : null; // 判断该文件夹是否存在，不存在的话，新建一个文件夹
    path = `${uploadDir}/${HASH}/${filename}`; // 将切片存到临时目录中
    isExists = await exists(path);
    if (isExists) {
        res.send({
        code: 200,
        codeText: "file is already exists",
        url: path.replace(WEB_HOSTNAME, HOSTNAME),
        });
        return;
    }
    writeFile(res, path, file.path, filename, true);
  } catch (e) {
    res.send({
      code: 1,
      codeText: e,
    });
  }
});
app.post("/upload_chunk2", async (req, res) => {
    const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录
    const multipart = new multiparty.Form();
      multipart.parse(req, async (err, fields, files) => {
            if (err) {
              return;
            }
            const filename = (fields.filename && fields.filename[0]) || "";
            const [HASH] = /^([^_]+)_(\d+)/.exec(filename);
            console.log('files', files)
            console.log('filename', filename)
            console.log('HASH', HASH)
            console.log('fields', fields)
            const [chunk] = files.path;
            const [hash] = HASH;
            const chunkDir = path.resolve(UPLOAD_DIR, filename);
        
           // 切片目录不存在，创建切片目录
            if (!fse.existsSync(chunkDir)) {
              await fse.mkdirs(chunkDir);
        
              // fs-extra 专用方法，类似 fs.rename 并且跨平台
              // fs-extra 的 rename 方法 windows 平台会有权限问题
              // https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
              await fse.move(chunk.path, `${chunkDir}/${hash}`);
            res.end("received file chunk");
          }
        })
       
})


/**
 * 合并切片
 */
app.post("/upload_merge", async (req, res) => {
  const { HASH, count,filename,size } = req.body;
  try {
    const { filname, path } = await merge(HASH, count,filename,size);
    res.send({
      code: 200,
      codeText: "merge 合并成功",
      url: path.replace(baseDir, WEB_HOSTNAME),
    });
  } catch (e) {
    res.send({
      code: 1,
      codeText: e,
    });
  }
});

app.post("/upload_already", async (req, res) => {
  let { HASH } = req.body;
  let path = `${uploadDir}/${HASH}`;
  let fileList = [];
  try {
    fileList = fs.readdirSync(path);
    fileList = fileList.sort((a, b) => {
      let reg = /_(\d+)/;
      return reg.exec(a)[1] - reg.exec(b)[1];
    });
    res.send({
      code: 200,
      codeText: "",
      fileList: fileList,
    });
  } catch (e) {
    res.send({
      code: 1,
      codeText: e,
      fileList: fileList,
    });
  }
});
