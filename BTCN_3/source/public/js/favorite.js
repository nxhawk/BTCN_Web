let currentPage3 = 1;

async function myFunc(id) {
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

function paginationHandle3(e) {
  let page = 0;
  let currentActive = $(".page-item-3").get(0);
  let $newdiv = $(`<div class='page-link' style='cursor: pointer'>1</div>`);
  if (e == null) {
    page = currentPage3;
  } else {
    if ($(e.currentTarget).has("div").length === 0) return;
    page = $(e.target).text().replaceAll(/\s/g, "");
    currentActive = $(".page-item-3").get(currentPage3 - 1);
    $newdiv = $(
      `<div class='page-link' style='cursor: pointer'>${currentPage3}</div>`
    );
  }

  // remove active
  currentActive.querySelector("span")?.remove();
  $(currentActive).removeClass("active").append($newdiv);

  // new active
  currentPage3 = page;
  const newActive = $(".page-item-3").get(currentPage3 - 1);
  const $newspan = $(`<span class='page-link'>${currentPage3}</span>`);
  // remove active
  newActive.querySelector("div").remove();
  $(newActive).addClass("active").append($newspan);

  // get new review
  fetch(`/favorites/page/${page}`, {
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
              <div class="d-flex justify-content-end align-content-end">
                <button
                  type="button"
                  class="btn btn-danger btn-delete"
                  data-id="${movie.id}"
                  onclick="myFunc('${movie.id}')"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
      </div>
          `;
      });
      $("#movies-favorites div").remove("div");
      document.querySelector("#movies-favorites").innerHTML += str;
    });
  });
}

$(document).ready(function () {
  // paginagation handle
  $(".page-item-3").on("click", (e) => paginationHandle3(e, currentPage3));
});
