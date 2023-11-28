const mark = "21447";

// Dien du lieu tu bien theo cu phap 21447{ x }
function custom1(rendered, value, name = "x") {
  return rendered.replaceAll(`${mark}{ ${name} }`, value);
}

/**
 * Xu ly bieu thuc vong lap
 * 21447{for e in arr }
 *      <p>21447{ e.prop1 }</p>
 *      <img src="21447{ e.prop 2}"/>
 * {/for}
 */
function custom3(rendered, value, name = "arr", name_index = "e") {
  let str_1 = `${mark}{for ${name_index} in ${name} }`;

  let position_start_for = rendered.indexOf(str_1);
  let position_end_for = rendered.indexOf("{/for}", position_start_for);
  let res = rendered.substring(
    position_start_for + str_1.length,
    position_end_for
  );

  // replace data in for loop
  let tam = res;
  res = "";
  value.forEach((element) => {
    let tam2 = tam;
    for (const [key, val] of Object.entries(element)) {
      tam2 = custom1(tam2, val, `${name_index}.${key}`);
    }
    res += tam2;
  });
  // end replace data in for loop

  return (
    rendered.substring(0, position_start_for) +
    res +
    rendered.substring(position_end_for + 6, rendered.length)
  );
}

/**
 * Xu li vong lap for long nhau
 * 21447{for a in arr }
 *    21447{for b in a.list}
 *        <p>21447{ b.name }</p>
 *    {/for}
 *    <img src="21447{ a.img }"></img>
 * {/for}
 */
function custom5(rendered, value1, name1, name_index1, name_index2) {
  let str_1 = `${mark}{for ${name_index1} in ${name1} }`;
  let position_start_for = rendered.indexOf(str_1);
  let position_end_for_1 = rendered.indexOf("{/for}", position_start_for);
  let position_end_for_2 = rendered.indexOf("{/for}", position_end_for_1 + 1);

  let tmp = rendered.substring(
    position_start_for + str_1.length,
    position_end_for_2
  );

  let tmp2 = "";
  value1.forEach((e) => {
    tmp2 += custom3(tmp, e, name_index1, name_index2);
  });

  return (
    rendered.substring(0, position_start_for) +
    tmp2 +
    rendered.substring(position_end_for_2 + 6, rendered.length)
  );
}

async function renderIndex(rendered, filePath, options) {
  if (filePath.includes("index.html")) {
    const listMovieBoxOffice = options.listMovieBoxOffice;
    const listMovieFavorites = options.listMovieFavorites;

    rendered = custom5(
      rendered,
      listMovieBoxOffice.splice(0, 1),
      "listTopBoxOffice_active",
      "movie",
      "m"
    );
    rendered = custom5(
      rendered,
      listMovieBoxOffice,
      "listTopBoxOffice",
      "movie",
      "m"
    );

    rendered = custom5(
      rendered,
      listMovieFavorites.splice(0, 1),
      "listTopFavorites_active",
      "movie",
      "m"
    );
    rendered = custom5(
      rendered,
      listMovieFavorites,
      "listTopFavorites",
      "movie",
      "m"
    );
  }
  return rendered;
}

module.exports = renderIndex;
