module.exports = {
  uisPlaying: function (name) {
    name = parseInt(name);
    if (name == -1) return false;
    return true;
  },
  uWin: function (state) {
    state = parseInt(state);
    if (state == 1 || state == 2) return true
    return false;
  }
}