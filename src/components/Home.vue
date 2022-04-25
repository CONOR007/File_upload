<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-23 14:24:59
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 21:38:32
 * @Description: 
-->
<!--
 * @Author: guansheng.guo
 * @Date: 2022-04-23 14:19:38
 * @LastEditors: guansheng.guo
 * @LastEditTime: 2022-04-23 14:23:48
 * @Description: 
-->
<template>
  <div>
    <upload-single></upload-single>
    <upload-base-64></upload-base-64>
    <upload-batch></upload-batch>
    <upload-list></upload-list>
    <upload-big-file></upload-big-file>
  </div>
</template>

<script setup>
import UploadSingle from "./UploadSingle.vue";
import UploadBase64 from "./UploadBase64.vue";
import UploadBatch from "./UploadBatch.vue";
import UploadList from "./UploadList.vue";
import UploadBigFile from "./UploadBigFile.vue";
</script>
<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
</style>
