import 'bootstrap-sass';

import { updateFoodMenu, fetchFoodMenu } from "./fetchFood.js";
import { initScroll } from "./scrollUtil.js";

$(document).ready(() => {
	fetchFoodMenu(updateFoodMenu, (request, error) => {
		console.log("Error getting menu: " + error);
	});
	initScroll();
});
