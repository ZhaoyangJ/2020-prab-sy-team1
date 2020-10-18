$(function() {
    $("#register-btn").click(function() {
        let email = $("#email").val();
        let password = $("#password").val();
        let avatarFiles = document.getElementById("img-file").files;
        // email validation
        if (!email) {
            $("#email-error-tip").html("Email can't be empty!");
            return;
        } else {
            $("#email-error-tip").html("");
        }
        // password validation
        if (!password) {
            $("#password-error-tip").html("Password can't be empty!");
            return;
        } else {
            if (password.length < 6) {
                $("#password-error-tip").html("Password length should be more than 6!");
                return
            } else {
                $("#password-error-tip").html("");
            }
        }
        // avatar validation
        if (!avatarFiles || avatarFiles.length <= 0) {
            $("#avatar-error-tip").html("Please upload your avatar!");
            return;
        } else {
            $("#avatar-error-tip").html("");
        }
        // build veterinary register form data
        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("introduction", $("#introduction").val());
        formData.append("photo", avatarFiles[0]);
        // ajax submit form data
        $.ajax({
          url: "/veterinary/register.html",
          type: "post",
          dataType: "json",
          cache: false,
          data: formData,
          processData: false,
          contentType: false,
          success: function (res) {
            if (200 === res.code) {
              window.location.href = "/veterinary/login.html";
            } else {
              $("#error-tip").html(res.msg);
            }
          },
        });
    });
});