$(function () {
  // initialize the plugins
  $("#upload").zyUpload({
    width: "100%", // width of the upload box
    height: "400px", // height of the upload box
    itemWidth: "200px", // the width of the file item
    itemHeight: "200px", // the height of the file item
    url: "/pet/album/image/upload.html", // the path of the uploaded file
    multiple: true, // indicate whether support multiple file upload
    dragDrop: false, // indicate whether supprt drag file to upload
    del: true, // indicate whether support to delete file
    finishDel: false, // indicate whether it could to delete file after uploaded
    languageUrl: "/plugins/upload/control/languages/en.json",
    hiddenData: { albumId: $("#albumId").val() },
    onSelect: function (files, allFiles) {
      // the callback function of the selection file
      console.info("当前选择了以下文件：");
      console.info(files);
      console.info("之前没上传的文件：");
      console.info(allFiles);
    },
    onDelete: function (file, surplusFiles) {
      // the callback of deletion file
      console.info("当前删除了此文件：");
      console.info(file);
      console.info("当前剩余的文件：");
      console.info(surplusFiles);
    },
    onSuccess: function (file) {
      // the callback function after upload file successfully
      console.info("此文件上传成功：");
      console.log("upload successfully!");
      console.log(file);
    },
    onFailure: function (file) {
      // the callback function after fail to upload file
      console.info("此文件上传失败：");
      console.info(file);
    },
    onComplete: function (responseInfo) {
      // the callback after finish the file upload
      console.log("upload finished");
      console.info("文件上传完成");
      console.log(responseInfo);
    },
  });
});
