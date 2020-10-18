$(function () {
  $("#add-btn").on("click", function () {
    $("#add-pet-form").submit();
  });

  /**
   * search pet by pet category
   */
  $(".pet-category").each(function() {
    let _this = $(this);
    _this.on("click", function() {
      window.location.href = $(this).attr("data-href");
    });
  });

  $("#pet-search-btn").on("click", function() {
      let petName = $("#pet-name").val();
      window.location.href = `/pet/search.html/${petName}`;
  });

  // update pet information
  $("#pet-edit-btn").on("click", async function() {
    // alert("update pet...");
    let petId = $("#petId").val();
    let petCategoryId = $("#petCategory").val();
    let petName = $("#petName").val();
    let sex = $("#sex").val();
    let weight = $("#weight").val();
    let dateOfBirth = $("#dateOfBirth").val();
    let husbandryInfo = $("#husbandryInfo").val();
    if (!petName) {
      $("#pname-error-tip").html("Pet name can't be empty!");
      return;
    }
    let result = await request({
      url: `/pet/edit.json/${petId}`,
      method: "PUT",
      param: {
          pet_category_id: petCategoryId,
          name: petName,
          sex: sex,
          weight: weight,
          date_of_birth: dateOfBirth,
          husbandry_info: husbandryInfo
      }
    });
    let _html = "";
    if (204 === result.code) {
        _html += "<div class='alert alert-success alert-dismissible fade show' role='alert'>";
    } else {
        _html += "<div class='alert alert-danger alert-dismissible fade show' role='alert'>";
    }
    _html += result.msg;
    _html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
    _html += '<span aria-hidden="true">&times;</span>';
    _html += "</button>";
    _html += "</div>";
    $("#tips").html(_html);
  });

});
