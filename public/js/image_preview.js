$(function () {
  // update album information
  $("#update-album-btn").on("click", function () {
    let albumName = $("#albumName").val();
    if (!albumName) {
      $("#album-error-tip").html("Album name can't be empty!");
      return;
    }
    $("#update-pet-album-form").submit();
  });

  $(".img-item").each(function () {
    let _this = $(this);
    _this
      .on("mouseenter", function () {
        _this.find(".operation-pane").show(500);
      })
      .on("mouseleave", function () {
        _this.find(".operation-pane").hide(500);
      });
  });
});
