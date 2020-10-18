let request = function(params) {
  const promise = new Promise(function(resolve, reject) {
    $.ajax({
      type: params.method,
      url: params.url,
      data: params.param,
      dataType: params.dataType || "json",
      success(res) {
        resolve(res);
      },
      error(res) {
        reject("Response error!");
      }
    });
  });
  return promise;
};
// let request = function (methods, url, param) {
//   return new Promise(function (resolve, reject) {
//     $.ajax({
//       type: methods,
//       url: url,
//       data: param,
//       dataType: "json",
//       success: function (data) {
//         resolve(data);
//       },
//       error: function (error) {
//         reject(error);
//       },
//     });
//   });
// };
