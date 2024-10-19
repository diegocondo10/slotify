import $ from "jquery";

export const addIconInButton = (selector: string, iconClass: string) => {
  const $reloadButton = $(selector);
  const $iconElement = $("<i>").addClass(iconClass);
  $reloadButton.empty().append($iconElement);
};
