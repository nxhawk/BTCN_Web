import _data from "../db/data.js";

const _split_string = (params) => {
  let word = params.split("/");
  let _type = word[0],
    _class = word[1],
    _pattern = "";
  word = word[word.length - 1].split("?");
  if (_type == "detail" && word.length == 1) _pattern = word[0];
  if (word.length > 1) _pattern = word[0];
  word = word[word.length - 1].split("&");
  let _per_page = 10,
    _page = 1;
  word.forEach((item) => {
    let tmp = item.split("=");
    if (tmp.length > 1) {
      try {
        let num = parseInt(tmp[1]);
        if (tmp[0] == "per_page") _per_page = num;
        else if (tmp[0] == "page") _page = num;
      } catch (error) {
        console.log(error);
      }
    }
  });

  return { _type, _class, _pattern, _per_page, _page };
};

const _to_Int = (str) => {
  let d = 0;
  for (let i = 0; i < str.length; i++)
    if (str[i] >= "0" && str[i] <= "9") d = d * 10 + str[i];
  return d;
};

const ListResponse = (_type, _class, _pattern, _per_page, _page) => {
  if (_type == "get" && _class == "movie") {
    let _total_page = Math.floor(_data.Movies.length / _per_page);
    _total_page += _data.Movies.length % _per_page == 0 ? 0 : 1;
    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(_data.Movies.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(_data.Movies[i]);
    let data = {
      page: _page,
      per_page: _per_page,
      total: _data.Movies.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }

  if (_type == "get" && _class == "mostpopular") {
    let _total_page = Math.floor(_data.MostPopularMovies.length / _per_page);
    _total_page += _data.MostPopularMovies.length % _per_page == 0 ? 0 : 1;
    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(_data.MostPopularMovies.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(_data.MostPopularMovies[i]);
    let data = {
      page: _page,
      per_page: _per_page,
      total: _data.MostPopularMovies.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }

  if (_type == "get" && _class == "top50") {
    let _total_page = Math.floor(_data.Top50Movies.length / _per_page);
    _total_page += _data.Top50Movies.length % _per_page == 0 ? 0 : 1;
    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(_data.Top50Movies.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(_data.Top50Movies[i]);
    let data = {
      page: _page,
      per_page: _per_page,
      total: _data.Top50Movies.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }

  if (_type == "search" && _class == "movie") {
    _pattern = _pattern.toLowerCase();
    let movies = [];
    _data.Movies.forEach((obj) => {
      if (obj.fullTitle.toLowerCase().includes(_pattern)) movies.push(obj);
    });

    let _total_page = Math.floor(movies.length / _per_page);
    _total_page += movies.length % _per_page == 0 ? 0 : 1;

    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(movies.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(movies[i]);

    let data = {
      detail: _pattern,
      page: _page,
      per_page: _per_page,
      total: movies.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }

  if (_type == "detail" && _class == "movie") {
    _pattern = _pattern.toLowerCase();
    let movies = [];
    _data.Movies.forEach((obj) => {
      if (obj.id.toLowerCase().includes(_pattern)) movies.push(obj);
    });
    let data = {
      detail: _pattern,
      items: movies,
    };
    return data;
  }

  if (_type == "detail" && _class == "name") {
    _pattern = _pattern.toLowerCase();
    let actor = [];
    _data.Names.forEach((obj) => {
      if (obj.id.toLowerCase().includes(_pattern)) actor.push(obj);
    });
    let data = {
      items: actor,
    };
    return data;
  }

  if (_type == "detail" && _class == "reviews") {
    _pattern = _pattern.toLowerCase();
    let reviews = [];
    _data.Reviews.forEach((obj) => {
      if (obj.movieId.toLowerCase().includes(_pattern)) reviews.push(obj.items);
    });
    let data = {
      items: reviews,
    };
    return data;
  }

  if (_type == "search" && _class == "name") {
    _pattern = _pattern.toLowerCase();
    let actors = [];
    _data.Movies.forEach((obj) => {
      for (let i = 0; i < obj.actorList.length; i++) {
        let actor = obj.actorList[i];
        if (actor.name.toLowerCase().includes(_pattern)) {
          actors.push(obj);
          return;
        }
      }
    });

    let _total_page = Math.floor(actors.length / _per_page);
    _total_page += actors.length % _per_page == 0 ? 0 : 1;

    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(actors.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(actors[i]);

    let data = {
      detail: _pattern,
      page: _page,
      per_page: _per_page,
      total: actors.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }

  if (_type == "get" && _class == "topboxoffice") {
    let _movies = [];
    _data.Movies.map((obj) => _movies.push(obj));
    _movies.sort(function (a, b) {
      let _sa = a.boxOffice.cumulativeWorldwideGross;
      let _sb = b.boxOffice.cumulativeWorldwideGross;
      return _to_Int(_sb) - _to_Int(_sa);
    });

    let _total_page = Math.floor(_movies.length / _per_page);
    _total_page += _movies.length % _per_page == 0 ? 0 : 1;
    let items = [];
    for (
      let i = _per_page * (_page - 1);
      i <= Math.min(_movies.length - 1, _per_page * _page - 1);
      i++
    )
      items.push(_movies[i]);
    let data = {
      page: _page,
      per_page: _per_page,
      total: _movies.length,
      total_page: _total_page,
      items: items,
    };
    return data;
  }
};

export default function fetch(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { _type, _class, _pattern, _per_page, _page } =
        _split_string(params);

      let data = ListResponse(_type, _class, _pattern, _per_page, _page);
      resolve(data);
    }, 100);
  });
}
