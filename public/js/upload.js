$(function () {
  /**
   * get the url of the uploading image
   * */
  function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }

  /**
   * judge whether the file is image format
   * */
  function isTypeImage(file) {
    let _type = file.type;
    if (
      "image/jpg" === _type ||
      "image/jpeg" === _type ||
      "image/gif" === _type ||
      "image/png" === _type
    ) {
      return true;
    }
    return false;
  }

  $("#upload-img-btn").on("click", function () {
    $("#img-file").trigger("click");
  });
  $("#img-file").on("change", function (e) {
    let file = e.currentTarget;
    if (file && file.files.length > 0) {
      let imgHtml = "";
      let files = file.files;
      for (const f of files) {
        imgHtml += '<div class="img-item mt-3 mr-3 border">';
        imgHtml += `<img src="${getObjectURL(f)}" />`;
        imgHtml += "</div>";
      }
      if (imgHtml) {
        // console.log(imgHtml);
        $("#image-preview").prepend(imgHtml);
      }
    }
  });
});
