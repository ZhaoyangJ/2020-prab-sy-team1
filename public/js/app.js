// customer field check
async function exists(fieldName, fieldValue) {
  let res = await request({
    url: `/customer/exists.json/${fieldName}/${fieldValue}`,
    method: "GET",
  });
  if (200 !== res.code) {
    return res.msg;
  } else {
    return null;
  }
}

function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  return false;
}

$(function () {
  $("#register-btn").on("click", async function () {
    // username check
    let username = $("#username").val();
    let uerrorContainer = $("#username-error-tip");
    if (isEmpty(username)) {
      uerrorContainer.html("Please input your username!");
      return;
    } else {
      let msg = await exists("username", username);
      if (msg) {
        uerrorContainer.html(msg);
        return;
      } else {
        uerrorContainer.html("");
      }
    }
    // password
    let password = $("#password").val();
    let pwdErrContainer = $("#password-error-tip");
    if (isEmpty(password)) {
      pwdErrContainer.html("Please input password!");
      return;
    } else {
      if (password.length < 6) {
        pwdErrContainer.html("Length should be more than 6!");
        return;
      } else {
        pwdErrContainer.html("");
      }
    }

    // email check
    let email = $("#email").val();
    let eerrorContainer = $("#email-error-tip");
    if (isEmpty(email)) {
      eerrorContainer.html("Please input your email!");
      return;
    } else {
      let msg = await exists("email", email);
      if (msg) {
        eerrorContainer.html(msg);
        return;
      } else {
        eerrorContainer.html("");
      }
    }
    // submit form
    $("#customer-register-form").submit();
  });
});
