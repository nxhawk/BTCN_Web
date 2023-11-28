let currentPage = 1;
let currentPage2 = 1;

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
};

function paginationHandle(e) {
  let page = 0;
  let currentActive = $(".page-item-1").get(0);
  let $newdiv = $(`<div class='page-link' style='cursor: pointer'>1</div>`);
  if (e == null) {
    page = currentPage;
  } else {
    if ($(e.currentTarget).has("div").length === 0) return;
    page = $(e.target).text().replaceAll(/\s/g, "");
    currentActive = $(".page-item-1").get(currentPage - 1);
    $newdiv = $(
      `<div class='page-link' style='cursor: pointer'>${currentPage}</div>`
    );
  }

  // remove active
  currentActive.querySelector("span")?.remove();
  $(currentActive).removeClass("active").append($newdiv);

  // new active
  currentPage = page;
  const newActive = $(".page-item-1").get(currentPage - 1);
  const $newspan = $(`<span class='page-link'>${currentPage}</span>`);
  // remove active
  newActive.querySelector("div").remove();
  $(newActive).addClass("active").append($newspan);

  // get new review
  let id = getUrlParameter("id") || null;
  let search = getUrlParameter("search") || null;
  if (id != null) {
    fetch(`/reviews/${id}/${page}`, {
      method: "POST",
    }).then((res) => {
      res.json().then((data) => {
        let str = "";
        data = data.data;
        data.forEach((review) => {
          str += `
          <div class="card alert alert-info" style="padding: 5px">
          <div class="card-body">
            <h5 class="card-header text-warning-emphasis">
              From: ${review.username}
            </h5>
            <div class="card-text">
              <div><b>Title:</b> ${review.title}</div>
              <span><b>Rate:</b> ${review.rate}</span>
              <span style="margin-left: 40px"
                ><b>Date:</b> ${review.date}</span
              >
              <p class="card-text" style="font-size: 18px">
                <b>Content:</b>
                ${review.content}
              </p>
            </div>
          </div>
        </div>
          `;
        });
        $("#reviews-container .card").remove("div");
        document.querySelector("#reviews-container").innerHTML += str;
      });
    });
  } else if (search != null) {
    fetch(`/search/${search}/${page}`, {
      method: "POST",
    }).then((res) => {
      res.json().then((data) => {
        let str = "";
        let link = "";
        data = data.data;
        let dark = getUrlParameter("dark") || false;
        if (dark) link = "&dark=true";

        data.forEach((movie) => {
          str += `
          <div class="col-4 mb-4">
          <div
          class="card ms-auto me-auto"
          style="width: 18rem; height: 100%"
          >
          <a href="/detail/?id=${movie.id}${link}">
            <img
              style="cursor: pointer"
              src="${movie.image}"
              class="card-img-top"
              alt="${movie.title}"
              />
              </a>
            <div class="card-body rounded d-flex flex-column justify-content-between">
              <p class="text-center fw-bold">${movie.title}</p>
              <div class="text-center mb-4">
                <span>(${movie.year})</span>
                <span>- Rate: ${movie.imDbRating}</span>
              </div>
              <div class="d-flex align-content-end justify-content-end">
                <button
                  type="button"
                  class="btn btn-primary"
                  onclick="handleAdd('${movie.id}')"
                >
                  Add to FAV
                </button>
              </div>
            </div>
          </div>
      </div>
          `;
        });
        $("#movies-search div").remove("div");
        document.querySelector("#movies-search").innerHTML += str;
      });
    });
  }
}

function paginationHandle2(e) {
  if ($(e.currentTarget).has("div").length === 0) return;
  let page = $(e.target).text().replaceAll(/\s/g, "");
  let currentActive = $(".page-item-2").get(currentPage2 - 1);
  let $newdiv = $(
    `<div class='page-link' style='cursor: pointer'>${currentPage2}</div>`
  );

  // remove active
  currentActive.querySelector("span")?.remove();
  $(currentActive).removeClass("active").append($newdiv);

  // new active
  currentPage2 = page;
  const newActive = $(".page-item-2").get(currentPage2 - 1);
  const $newspan = $(`<span class='page-link'>${currentPage2}</span>`);
  // remove active
  newActive.querySelector("div").remove();
  $(newActive).addClass("active").append($newspan);

  // get new review
  let search = getUrlParameter("search") || null;
  if (search != null) {
    fetch(`/actor/${search}/${page}`, {
      method: "POST",
    }).then((res) => {
      res.json().then((data) => {
        let str = "";
        let link = "";
        data = data.data;
        let dark = getUrlParameter("dark") || false;
        if (dark) link = "&dark=true";

        data.forEach((actor) => {
          str += `
          <tr>
            <th scope="row">${actor.id}</th>
            <td>${actor.name}</td>
            <td class="d-flex justify-content-center">
              <img
                style="cursor: pointer; width: 150px; height: fit-content"
                src="${actor.image}"
                class="card-img-top"
                alt="${actor.name}"
              />
            </td>
          </tr>
          `;
        });
        $("tbody tr").remove("tr");
        document.querySelector("tbody").innerHTML += str;
      });
    });
  }
}

async function handleDelete(e) {
  const id = $(e.target).data("id");
  await fetch("/favorites/" + id, { method: "DELETE" }).then((JS) => {
    JS.json().then((data) => {
      if (data) {
        alert("Remove successs");
        location.reload();
      } else {
        alert("Error, Please try again");
      }
    });
  });
}

async function handleAdd(id) {
  const res = await fetch("/favorites/exist/" + id);
  const data = await res.json();

  if (data) {
    alert("This movie is already in FAV");
  } else {
    await fetch("/favorites/" + id, { method: "POST" });
    alert("Add to FAV success!");
  }
}

$(document).ready(function () {
  // dark mode handle

  $("#darkmode").on("click", () => {
    let url = window.location.href;
    if ($("#darkmode").is(":checked")) {
      if (url.includes("id=") || url.includes("search=")) {
        url += "&dark=true";
      } else if (url[url.length - 1] === "/") url += "?dark=true";
      else url += "/?dark=true";
    } else {
      url = url
        .replace("&dark=true", "")
        .replace("?dark=true&", "")
        .replace("?dark=true/", "")
        .replace("?dark=true", "");
    }

    window.location.href = url;
  });

  // paginagation handle
  $(".page-item-1").on("click", (e) => paginationHandle(e, currentPage));
  $(".page-item-2").on("click", (e) => paginationHandle2(e, currentPage2));

  // search
  $("form").on("submit", (e) => {
    e.preventDefault();
    const search = $("input[type='search']").val();
    if (search.length === 0) return;
    const dark = getUrlParameter("dark") === "true" ? true : false;
    if (dark) window.location.href = `/search/?search=${search}&dark=true`;
    else window.location.href = `/search/?search=${search}`;
  });

  // delete
  $(".btn-delete").on("click", (e) => handleDelete(e));

  // add
  $(".btn-add").on("click", async (e) => {
    const id = $(e.target).data("id");
    await fetch("/favorites/" + id, { method: "POST" });
    alert("Add to FAV successs");

    location.reload();
  });
});
