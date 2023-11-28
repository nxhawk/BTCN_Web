const items_left = document.querySelectorAll(".item_left");
const open_content = document.querySelectorAll(".open_content");
const moves = document.querySelectorAll(".move");
var tt = [0, 1, 2, 3];
let margin = 5;
//update left
function updateLeftContent() {
  var topX = 0;
  for (let id = 0; id < tt.length; id++) {
    items_left[tt[id]].style.left = "0px";
    items_left[tt[id]].style.top = topX + "px";
    topX = topX + items_left[tt[id]].getBoundingClientRect().height + margin;
  }
  document.querySelector(".left").style.minHeight = topX + margin + "px";
}

updateLeftContent();
// open content
function open_ctx(e, key) {
  if (items_left[key].classList.contains("close")) {
    e.innerHTML = "&#8595;";
  } else {
    e.innerHTML = "&#9658;";
  }
  items_left[key].classList.toggle("close");
  updateLeftContent();
}

open_content.forEach((e, key) => {
  e.addEventListener("click", () => open_ctx(e, key));
});
//-----------------------------

//move content
current = null;
function handleMousemove(e) {
  if (current) {
    const dY = e.clientY - current.oldY;
    current.style.top = +current.style.top.replace("px", "") + dY + "px";
    current.oldY = e.clientY;
  }
}

function handleMouseup(e) {
  if (current) {
    let x_from = -1;
    let x_to = -1;

    tt.forEach((key) => {
      if (items_left[key].style.top == current.main.style.top)
        return (x_from = key);
    });

    for (let i = 0; i < tt.length; i++) {
      if (
        +current.style.top.replace("px", "") <
        +items_left[tt[i]].style.top.replace("px", "")
      ) {
        x_to = tt[i];
        break;
      }
      if (i == tt.length - 1) x_to = tt.length;
    }

    let x_1, x_2;
    for (let i = 0; i < tt.length; i++) {
      if (tt[i] == x_from) x_1 = i;
      else if (tt[i] == x_to) x_2 = i;
    }

    if (x_1 > x_2) {
      for (let i = x_1; i > x_2; i--) tt[i] = tt[i - 1];
      tt[x_2] = x_from;
    } else if (x_1 < x_2) {
      for (let i = x_1; i < x_2; i++) tt[i] = tt[i + 1];
      tt[x_2 - 1] = x_from;
    } else if (x_to == tt.length) {
      for (let i = x_1; i < tt.length - 1; i++) tt[i] = tt[i + 1];
      tt[tt.length - 1] = x_from;
    }

    updateLeftContent();

    current.main.parentNode.removeChild(current);
  }
  current = null;
}

function handleMousedown(e) {
  current = this.parentNode.parentNode.cloneNode(true);
  current.main = this.parentNode.parentNode;
  current.oldY = e.clientY;

  current.rect = this.parentNode.parentNode.getBoundingClientRect();
  current.rectP = this.parentNode.parentNode.parentNode.getBoundingClientRect();

  current.querySelector(".move").addEventListener("mousemove", handleMousemove);
  current.querySelector(".move").addEventListener("mouseup", handleMouseup);
  current.querySelector(".move").addEventListener("mouseleave", handleMouseup);
  current.style.position = "absolute";

  current.style.top = current.rect.top - current.rectP.top + "px";
  current.style.left = current.rect.left - current.rectP.left + "px";
  current.classList.add("thumb");

  this.parentNode.parentNode.parentNode.appendChild(current);
}

moves.forEach((element) => {
  element.addEventListener("mousedown", handleMousedown);
});
//-----------------------

//----------------------kiểm tra input
const _check_dienthoai = (str) => {
  if (str == undefined || str.length != 10) return false;
  if (str[0] !== "0") return false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] < "0" || str[i] > "9") return false;
  }
  return true;
};

const _check_word = (str) => {
  let count = 0;
  let ss = "";
  str += " ";
  for (let i = 0; i < str.length; i++)
    if (str[i] == " ") {
      if (ss.length > 0) count++;
      ss = "";
    } else ss += str[i];
  return count >= 2;
};

const _check_email = (email) => {
  var filter =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(email)) {
    return false;
  }
  return true;
};

const _check_ngaygiao = (ngay) => {
  if (ngay == "") return false;
  let inputDate = new Date(ngay);
  let currentDate = new Date();
  if (
    inputDate.getDate() == currentDate.getDate() &&
    inputDate.getMonth() == currentDate.getMonth() &&
    inputDate.getFullYear() == currentDate.getFullYear()
  )
    return true;
  if (inputDate < currentDate) return false;
  return true;
};

const notion = document.querySelectorAll(".notion");

let hoten = document.getElementById("hoten");
let diachi = document.getElementById("diachi");
let dienthoai = document.getElementById("dienthoai");
let ngaygiao = document.getElementById("ngaygiao");
let email = document.getElementById("email");
let gioitinh = document.querySelectorAll("input[type='radio']");

var _gioitinh;

const _signup = () => {
  let all_selected_item = "";

  product_state_right.forEach((e, key) => {
    all_selected_item += product_item[e][1];
    if (key != product_state_right.length - 1) all_selected_item += "; ";
  });

  let day = new Date(ngaygiao.value);
  let _ngaygiao = "";
  _ngaygiao += day.getDate() < 10 ? "0" + day.getDate() : day.getDate();
  _ngaygiao +=
    day.getMonth() + 1 < 10
      ? "/0" + (day.getMonth() + 1)
      : "/" + (day.getMonth() + 1);
  _ngaygiao += "/" + day.getFullYear();

  document.getElementById("customers").querySelector("tbody").innerHTML += `
  <tr>
      <td>${hoten.value}</td>
      <td>${_gioitinh}</td>
      <td>${diachi.value}</td>
      <td>${_ngaygiao}</td>
      <td>${all_selected_item}</td>
  </tr>
  `;
  handleClear_data();
};

function handleInput() {
  let chk = [true, true, true, true, true, true, true];
  hoten.classList.remove("warning");
  diachi.classList.remove("warning");
  dienthoai.classList.remove("warning");
  ngaygiao.classList.remove("warning");
  email.classList.remove("warning");

  notion.forEach((n) => {
    n.classList.remove("show");
  });

  _gioitinh = gioitinh[0].checked ? "Nam" : gioitinh[1].checked ? "Nữ" : "";

  if (_check_word(hoten.value) == false) {
    hoten.classList.add("warning");
    notion[0].innerHTML = "*Họ tên chưa hợp lệ";
    notion[0].classList.add("show");
    chk[0] = false;
  }

  if (_check_word(diachi.value) == false) {
    diachi.classList.add("warning");
    notion[1].innerHTML = "*Địa chỉ chưa hợp lệ";
    notion[1].classList.add("show");
    chk[1] = false;
  }

  if (_check_dienthoai(dienthoai.value) == false) {
    dienthoai.classList.add("warning");
    notion[2].innerHTML = "*Số điện thoại chưa hợp lệ";
    notion[2].classList.add("show");
    chk[2] = false;
  }

  if (_gioitinh == "") {
    notion[3].innerHTML = "*Giới tính chưa hợp lệ";
    notion[3].classList.add("show");
    chk[3] = false;
  }

  if (_check_ngaygiao(ngaygiao.value) == false) {
    ngaygiao.classList.add("warning");
    notion[4].innerHTML = "*Ngày giao chưa hợp lệ";
    notion[4].classList.add("show");
    chk[4] = false;
  }

  if (_check_email(email.value) == false) {
    email.classList.add("warning");
    notion[5].innerHTML = "*Email chưa hợp lệ";
    notion[5].classList.add("show");
    chk[5] = false;
  }

  if (product_state_right.length == 0) {
    notion[6].innerHTML = "*Vui lòng chọn mặt hàng cần mua";
    notion[6].classList.add("show");
    chk[6] = false;
  }

  for (let i = 0; i < chk.length; i++) if (chk[i] == false) return;

  _signup();
}

function _clear_table() {
  document.getElementById("customers").innerHTML = `
  <tbody><tr>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Ngày giao</th>
              <th>Sản phẩm</th>
            </tr>
  </tbody>`;
}

function handleClear_data() {
  hoten.classList.remove("warning");
  diachi.classList.remove("warning");
  dienthoai.classList.remove("warning");
  ngaygiao.classList.remove("warning");
  email.classList.remove("warning");

  hoten.value = "";
  diachi.value = "";
  dienthoai.value = "";
  ngaygiao.value = "";
  email.value = "";
  gioitinh[0].checked = false;
  gioitinh[1].checked = false;

  product_state_left = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  product_state_right = [];
  select_item_left = [];
  select_item_right = [];

  _changeItem();

  //clear notion
  notion.forEach((n) => {
    n.classList.remove("show");
  });
}
function handleClear() {
  //handleClear_data();
  _clear_table();
}

document.getElementById("signup").addEventListener("click", handleInput);
document.getElementById("clear").addEventListener("click", handleClear);
//--------------------------------------

//----------------------render product items----------
const box_product = document.querySelector(".box_left");
const box_product_2 = document.querySelector(".box_right");

let p_top = margin;
product_item.forEach((item, id) => {
  let cell = document.createElement("div");
  cell.classList.add("product_item");
  cell.setAttribute("data-id", id);
  cell.innerHTML = `
            <img src=${item[0]} draggable="false" />
            <div><b>${item[1]}</b></div>
            <div class="gia">${item[2]}</div>
  `;

  cell.style.top = p_top + "px";
  p_top = p_top + 55 + margin;
  cell.style.width = box_product.getBoundingClientRect().width - 30 + "px";

  box_product.appendChild(cell);
});

// -chọn item
const product_items = document.querySelectorAll(".product_item");
var select_item_left = [];
var select_item_right = [];

function _show_selected_item() {
  product_items.forEach((item) => {
    item.classList.remove("select");
  });
  select_item_left.forEach((e) => {
    product_items[e].classList.add("select");
  });
  select_item_right.forEach((e) => {
    product_items[e].classList.add("select");
  });
}

function handleMouseclick(item, key) {
  //----toggle
  if (select_item_left.includes(key)) {
    select_item_left.splice(select_item_left.indexOf(key), 1);
    item.classList.remove("select");
    return;
  }
  if (select_item_right.includes(key)) {
    select_item_right.splice(select_item_right.indexOf(key), 1);
    item.classList.remove("select");
    return;
  }
  //--------------------

  if (product_state_left.includes(key)) select_item_left.push(key);
  else select_item_right.push(key);

  _show_selected_item();
}

const _changeItem = (tt = 0) => {
  let p_top_1 = margin;
  let p_top_2 = margin;

  // to right
  if (tt == 1) {
    product_state_right.push(...select_item_left);
    select_item_left.forEach((e) => {
      product_state_left.splice(product_state_left.indexOf(e), 1);
    });
    select_item_left = [];
  } else if (tt == 2) {
    product_state_left.push(...select_item_right);
    select_item_right.forEach((e) => {
      product_state_right.splice(product_state_right.indexOf(e), 1);
    });
    select_item_right = [];
  }

  for (let i = 0; i < product_state_left.length; i++) {
    product_items[product_state_left[i]].style.top = p_top_1 + "px";
    box_product.appendChild(product_items[product_state_left[i]]);

    p_top_1 = p_top_1 + 55 + margin;
  }

  for (let i = 0; i < product_state_right.length; i++) {
    product_items[product_state_right[i]].style.top = p_top_2 + "px";
    box_product_2.appendChild(product_items[product_state_right[i]]);

    p_top_2 = p_top_2 + 55 + margin;
  }

  _show_selected_item();
};

const _changeItem_toRight = () => {
  if (select_item_left.length == 0) return;

  select_item_left = select_item_left.sort();

  _changeItem(1);
};

const _changeItem_toLeft = () => {
  if (select_item_right.length == 0) return;

  select_item_right = select_item_right.sort();

  _changeItem(2);
};

const _changeItem_toAllRight = () => {
  for (let i = 0; i < product_state_left.length; i++)
    product_state_right.push(product_state_left[i]);
  product_state_left = [];
  select_item_left = [];

  _changeItem();
};

const _changeItem_toAllLeft = () => {
  for (let i = 0; i < product_state_right.length; i++)
    product_state_left.push(product_state_right[i]);
  product_state_right = [];
  select_item_right = [];

  _changeItem();
};

//button click
document.querySelector(".btn1").addEventListener("click", _changeItem_toRight);
document
  .querySelector(".btn2")
  .addEventListener("click", _changeItem_toAllRight);
document.querySelector(".btn3").addEventListener("click", _changeItem_toLeft);
document
  .querySelector(".btn4")
  .addEventListener("click", _changeItem_toAllLeft);
//----------------------------------------------------

//mouse click - drap and drop

current_item = null;

function handleProductMousemove(e) {
  if (current_item) {
    const dY = e.clientY - current_item.oldY;
    const dX = e.clientX - current_item.oldX;
    current_item.style.top =
      +current_item.style.top.replace("px", "") + dY + "px";
    current_item.style.left =
      +current_item.style.left.replace("px", "") + dX + "px";
    current_item.oldY = e.clientY;
    current_item.oldX = e.clientX;
  }
}

const _check_inline = (e1, e2) => {
  if (e1.style.top == e2.style.top && e1.style.left == e2.style.left)
    return true;
  return false;
};

function handleProductMouseup(e) {
  if (current_item) {
    key = current_item.key;
    current_item.parent.removeChild(current_item);

    let cr = -1,
      lefttoright = true;
    product_state_left.forEach((e) => {
      if (e == key) return (cr = e);
    });
    if (cr == -1)
      product_state_right.forEach((e) => {
        if (e == key) {
          lefttoright = false;
          cr = e;
          return;
        }
      });

    if (lefttoright && cr != -1) {
      if (
        e.clientX > box_product_2.getBoundingClientRect().left &&
        e.clientX <
          box_product_2.getBoundingClientRect().left +
            box_product_2.getBoundingClientRect().width
      ) {
        if (
          e.clientY > box_product_2.getBoundingClientRect().top &&
          e.clientY <
            box_product_2.getBoundingClientRect().top +
              box_product_2.getBoundingClientRect().height
        ) {
          product_state_left.splice(product_state_left.indexOf(cr), 1);
          product_state_right.push(cr);
          select_item_left.splice(select_item_left.indexOf(cr), 1);
          _changeItem();
        }
      }
    } else if (cr != -1) {
      if (
        e.clientX > box_product.getBoundingClientRect().left &&
        e.clientX <
          box_product.getBoundingClientRect().left +
            box_product.getBoundingClientRect().width
      ) {
        if (
          e.clientY > box_product.getBoundingClientRect().top &&
          e.clientY <
            box_product.getBoundingClientRect().top +
              box_product.getBoundingClientRect().height
        ) {
          product_state_right.splice(product_state_right.indexOf(cr), 1);
          product_state_left.push(cr);
          select_item_right.splice(select_item_right.indexOf(cr), 1);

          _changeItem();
        }
      }
    }
  }
  current_item = null;
}

const pr = document.querySelector(".product");

function handleProductMousedown(e) {
  handleMouseclick(this, +this.getAttribute("data-id"));

  current_item = this.cloneNode(true);
  current_item.key = +this.getAttribute("data-id");
  current_item.parent = this.parentNode.parentNode.parentNode;
  current_item.main = this;
  current_item.old_top = this.style.top;
  current_item.old_left = this.style.left;
  current_item.oldY = e.clientY;
  current_item.oldX = e.clientX;

  current_item.addEventListener("mousemove", handleProductMousemove);
  current_item.addEventListener("mouseup", handleProductMouseup);

  current_item.style.top =
    +this.style.top.replace("px", "") +
    this.parentNode.getBoundingClientRect().top -
    pr.getBoundingClientRect().top -
    this.parentNode.scrollTop +
    "px";

  current_item.style.left =
    this.parentNode.getBoundingClientRect().left -
    pr.getBoundingClientRect().left +
    "px";

  current_item.classList.add("thumb");
  current_item.style.width = this.style.width;

  this.parentNode.parentNode.parentNode.appendChild(current_item);
}

product_items.forEach((item, key) => {
  item.addEventListener("mousedown", handleProductMousedown);
  item.addEventListener("mousemove", handleProductMousemove);
  item.addEventListener("mouseup", handleProductMouseup);
});
//---------------------------------------------------

// change size item when resize window
window.onresize = () => {
  updateLeftContent();
  product_items.forEach((e) => {
    e.style.width = box_product.getBoundingClientRect().width - 30 + "px";
  });
};

// handle menu nav and footer
const navbar_list = document.querySelectorAll("nav ul li");
const footer_list = document.querySelectorAll(".footer ul li");
const _remove_choice = () => {
  navbar_list.forEach((e, key) => {
    navbar_list[key].classList.remove("choice");
    footer_list[key].classList.remove("choice");
  });
};

navbar_list[0].classList.add("choice");
footer_list[0].classList.add("choice");

navbar_list.forEach((e, key) => {
  e.addEventListener("click", () => {
    _remove_choice();
    navbar_list[key].classList.add("choice");
    footer_list[key].classList.add("choice");
  });
});

footer_list.forEach((e, key) => {
  e.querySelector("div").addEventListener("click", () => {
    _remove_choice();
    navbar_list[key].classList.add("choice");
    footer_list[key].classList.add("choice");
  });
});
