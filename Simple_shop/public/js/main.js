$(document).ready(function () {
  // check input name
  $("#name").on("input", function () {
    const name = $(this).val();
    if (!checkUpperCaseFirstLetter(name)) {
      customRefValidity(
        "#name",
        "First letter of each word must be capitalized"
      );
    } else {
      customRefValidity("#name");
    }
  });

  // check input username
  $("#username").on("input", function () {
    const numError = checkUserName($(this).val());
    if (numError === 0) customRefValidity("#username");
    else if (numError === 1)
      customRefValidity("#username", "Username must not contain space");
    else if (numError === 2)
      customRefValidity(
        "#username",
        "Username must contain only letters, numbers and underscore characters"
      );
    else if (numError === 3)
      customRefValidity("#username", "Username must not start with number");
  });

  // check input password
  $("#password").on("input", function () {
    if (checkPassword($(this).val())) customRefValidity("#password");
    else
      customRefValidity(
        "#password",
        "Password must be at least 6 characters long"
      );
  });

  // check input confirm password
  $("#password_retype").on("input", function () {
    if ($(this).val() === $("#password").val())
      customRefValidity("#password_retype");
    else customRefValidity("#password_retype", "Passwords do not match");
  });

  $("#addCatForm").submit(function () {
    var toast = document.getElementById("addCatToast");
    var bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  });
  $("#delCatForm").submit(function () {
    var toast = document.getElementById("delCatToast");
    var bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  });
  $("#editCatForm").submit(function () {
    var toast = document.getElementById("editCatToast");
    var bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  });
  $("#addProForm").submit(function () {
    var toast = document.getElementById("addProToast");
    var bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  });
  $("#delProForm").submit(function () {
    var toast = document.getElementById("delProToast");
    var bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  });

  $("#File").change((e) => showPreview(e));

  $("#FileE").change((e) => showPreview1(e));
});

function customRefValidity(name, value = "") {
  $(`${name}`).get(0).setCustomValidity(value);
  $(`${name}`).get(0).reportValidity();
}

function checkPassword(password) {
  return password.length > 5;
}

function checkUpperCaseFirstLetter(name) {
  let splitName = name.split(" ");
  for (let i = 0; i < splitName.length; i++) {
    if (splitName[i].charAt(0).toUpperCase() !== splitName[i].charAt(0)) {
      return false;
    }
  }
  return true;
}

function checkUserName(name) {
  if (name.indexOf(" ") > 0) return 1;
  if (!/^[A-Za-z0-9_]*$/.test(name)) return 2;
  if (name.charAt(0) >= "0" && name.charAt(0) <= "9") return 3;
  return 0;
}

function showPreview(e) {
  if (e.target.files.length > 0) {
    var src = URL.createObjectURL(e.target.files[0]);
    var preview = document.getElementById("file-ip-2-preview");
    preview.src = src;
    preview.style.display = "block";
  }
}

function showPreview1(e) {
  if (e.target.files.length > 0) {
    var src = URL.createObjectURL(e.target.files[0]);
    var preview = document.getElementById("file-ip-1-preview");
    preview.src = src;
    preview.style.display = "block";
  }
}
