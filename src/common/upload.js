/*
 * @Author: guansheng.guo
 * @Date: 2022-04-18 22:57:43
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 23:55:34
 * @Description:
 */
import request from "./fetch";

//上传文件 -- FormData格式
export const uploadFirstFormData = (data, fn) => {
  return request({
    url: "upload_single",
    method: "POST",
    data,
    onUploadProgress: fn,
  });
};

//上传文件 -- base64格式
export const uploadSecondBase64 = (data) => {
  return request({
    url: "upload_single_base64",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const uploadFileList = (data) => {
  return request({
    url: "upload_fileList",
    method: "POST",
    data,
  });
};

//获取图片
export const getImage = (data) => {
  return request({
    url: "getImage",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//大文件上传 -- 上传切片
export const uploadChunks = (data) => {
  return request({
    url: "upload_chunk",
    method: "POST",
    data,
  });
};
//大文件上传 -- 切片上传完毕需要合并切片
export const uploadMerge = (data) => {
  return request({
    url: "upload_merge",
    method: "POST",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
//查看是否存在已经上传的切片
export const uploadAlready = (data) => {
  return request({
    url: "upload_already",
    method: "POST",
    data,
  });
};

//在浏览器上输入网址显示图片
export const showImage = (data) => {
  return request({
    url: "showImage",
    method: "GET",
    params: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

//在浏览器上输入网址显示图片
export const downloadFile = (data) => {
  return request({
    url: "downloadFile",
    method: "GET",
    params: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const test1 = (data) => {
  return request({
    url: "upload_chunk1",
    method: "GET",
    params: '',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};
   