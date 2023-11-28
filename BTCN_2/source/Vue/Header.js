export default {
  props: ["isDarkMode"],
  template: `
  <div class="rounded border" :class="isDarkMode?'bg-dark text-white border-secondary':'bg-body-tertiary text-black'" >
    <div class="row header">
      <div class="col-4 d-flex align-items-center px-2">21120447</div>
      <h2 class="col-4 text-center d-flex align-items-center justify-content-around">Movies info</h2>
      <div class="col-4 d-flex align-items-end flex-column bd-highlight justify-content-between">
        <div class="p-2 bd-highlight">21447</div>
        <div class="form-check form-switch mt-auto p-2 bd-highlight">
          <input class="form-check-input" type="checkbox" name="darkmode" id="darkmode" value="light" v-model="isDarkMode"  @change="$emit('changeDarkMode')">
          <label class="form-check-label" for="darkmode">Dark mode</label>
        </div>
      </div>
    </div>
  </div>
  `,
};
