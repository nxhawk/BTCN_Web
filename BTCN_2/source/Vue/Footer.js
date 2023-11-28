export default {
  props: ["isDarkMode"],
  template: `
  <div class="alert text-center mb-2" :class="isDarkMode?'bg-dark text-white border-secondary':'bg-body-tertiary text-black'" role="alert">
  Copyright © Nguyễn Nhật Hào - 21120447 - 21447
  </div>
  `,
};
