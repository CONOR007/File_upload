<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:17:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-25 15:29:08
 * @Description: 
-->

## 运行
    1. npm install
    2. npm run start
## demo介绍
    server为node服务端，upload为上传文件的文件夹
    前端首页为Home页面，Home页面有对应的上传demo组件
## 文件上传的几种方式
    1.FormData文件上传 form-data形式上传二进制(binary)
        Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryOg0GwkuARmuvVcsD
        Payload -- Form Data 
            file：（binary）

    2.BASE64上传
        Content-Type: application/x-www-form-urlencoded
        Payload -- Form Data 
            file: data%3Aimage%2Fjpeg%3Bb...... (base64)

    3.FormData多文件上传 
        Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryfYNIfMLSqdkD2yHH
         Payload -- Form Data 
            file：（binary）

    4.大文件上传

## content-type 类型
    Content-Type：用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件
        1.application/x-www-form-urlencoded
            浏览器的原生form表单，
            提交的数据按照 key1=val1&key2=val2 的方式进行编码，key和val都进行了URL转码
        2.multipart/form-data
            1.常见的 POST 数据提交的方式
            2.首先生成了一个 boundary 用于分割不同的字段，为了避免与正文内容重复，boundary 很长很复杂
            3.然后 Content-Type 里指明了数据是以 multipart/form-data 来编码，本次请求的 boundary 是什么内容
            4.消息主体里按照字段个数又分为多个结构类似的部分，每部分都是以 --boundary 开始，紧接着是内容描述信息，然后是回车，最后是字段具体内容（文本或二进制）
            5.如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 --boundary-- 标示结束。
        3.application/json
            消息主体是序列化后的 JSON 字符串,这个类型越来越多地被大家所使用
        4.text/xml
            是一种使用 HTTP 作为传输协议，XML 作为编码方式的远程调用规范

## 相关名词

    File,Blob,FileReader,FormData,ArrayBuffer
    MDN解释：
        File：https://developer.mozilla.org/zh-CN/docs/Web/API/File
        Blob：https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
        FormData：https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
        FileReader：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
    
    File：
        1. 文件（File）接口提供有关文件的信息，并允许网页中的 JavaScript 访问其内容
        2. File 对象是特殊类型的 Blob，且可以用在任意的 Blob 类型的 context 中。比如说， FileReader, URL.createObjectURL(), createImageBitmap() (en-US), 及 XMLHttpRequest.send() 都能处理 Blob 和 File。
        3.返回一个新构建的文件对象（File）。
        4.File对象是特殊类型的Blob,所以顺便也继承了Blob特有的方法和属性,同时又有自己独特的属性和方法
    File的参数：
        lastModified: 1645070603228 //返回当前 File 对象所引用文件最后修改时间
        lastModifiedDate: Thu Feb 17 2022 12:03:23 GMT+0800 (中国标准时间){} //File 对象所引用文件最后修改时间的Date对象。
        name: "loginBg.png" //返回当前 File 对象所引用文件的名字。
        size: 73425 //返回文件的大小。
        type: "image/png" //返回文件的类型
        webkitRelativePath: "" //返回 File 相关的 path 或 URL。

    Blob:
        Blob是Binary Large Object的缩写，表示二进制大对象
        1.Blob 对象表示一个不可变、原始数据的类文件对象。
        2.它的数据可以按文本或二进制的格式进行读取，也可以转换成 ReadableStream 来用于数据操作
        3.File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。

    Blob主要包含两个属性
        Blob.size：只读，对象中所包含数据的大小（字节）
        Blob.type：只读，一个字符串，表明该 Blob 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串。（MIME类型参考）
        创建一个Blob对象，需要调用Blob构造函数：
            function Blob( array, options ){};
                1.array 是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。

                2.options 是一个可选的BlobPropertyBag字典，它可能会指定如下两个属性：

                        1.type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。
                        2.endings，默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个： "native"，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 "transparent"，代表会保持blob中保存的结束符不变

    FileReader:
        1.FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容
        2.使用 File 或 Blob 对象指定要读取的文件或数据。

    ArrayBuffer：
    内存上一段连续的二进制数据

## File和Blob
    相同点： File和Blob都可以用来表示类文件对象，处理文件；

    FIle: File可以看作一个承载文件的桥梁，将DOM接口和文件联系起来，通过File这个桥梁，获取计算及内的文件，从而对才能对文件做进一步处理。

    Blob：File继承自Blob，他们之间很方便进行转换，Blob是File都原型对象。

    联系：File继承自Blob，同时又有自己独特的属性和方法。从下面的打印可以看出，其实Blob对象就是File的原型对象，自然就拥有了Blob对象的方法和属性。

##  Blob与ArrayBuffer
    相同点： Blob和ArrayBuffer都是二进制的容器。

    ArrayBuffer：ArrayBuffer更底层，是一段纯粹的内存上的二进制数据，我们可以对其任何一个字节进行单独的修改，也可以根据我们的需要以我们指定的形式读取指定范围的数据。

    Blob：Blob就是将二进制数据做了一个封装，我们拿到的就是一个整体，可以看到它的整体属性大小、类型；可以对其分割，但看不到它内部的细节

    联系：Blob可以接受一个ArrayBuffer作为参数生成一个Blob对象，此行为就相当于对ArrayBuffer数据做一个封装。

    应用上的区别：由于ArrayBuffer和Blob的特性，Blob作为一个整体文件，适合用于文件传输；而只有需要关注细节（比如要修改某一段数据时），此时使用ArrayBuffer比较好。

```js
//readAsDataURL-- 开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的Base64字符串以表示所读取文件的内容。
//readAsArrayBuffer --开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.   
//onload -- 该事件在读取操作完成时触发。
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e) => {
                console.log(e.target.result)
            };

```
    FormData：FormData 接口提供了一种表示表单数据的键值对 key/value 的构造方式，并且可以轻松的将数据通过XMLHttpRequest.send() 方法发送出去
    ​FormData的主要用处：
        网络请求中处理表单数据
        网络请求中处理用来异步的上传文件
    用法：
 ```js
        // append和set的区别： append方法和set方法的不同之处在于它不会覆盖而是以数组push的方式来处理同名的数据。
        var formData1 = new FormData();   //创建空的实例对象
        formData1.append("filename","test"); //设置数据 (追加)
        formData1.set("age","18"); //设置数据 (添加)
        formData1.set("age","19"); //设置数据 (修改)
 ```
## node相关名词
    Express,fs,body-parser,multiparty,path,Spark-MD5
        Express: 基于 Node.js 平台，快速、开放、极简的 Web 开发框架
        fs: File system：文件系统，用于操作文件与文件夹
        body-parser: body-parser是一类处理request的body的中间件函数
        multiparty: multiparty模块是一个基于node.js的文件上传模块
        path: Node.js 常用的内置 npm 模块，主要为了更加方便的处理文件与目录路径
        Spark-MD5: Spark-MD5获取文件MD5的hash标识
