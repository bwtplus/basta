import 'bootstrap-sass';

import { updateFoodMenu, fetchFoodMenu } from "./fetchFood.js";
import { initScroll } from "./scrollUtil.js";

$(document).ready(function () {
	fetchFoodMenu(updateFoodMenu, function (request, error) {
		console.log("Error getting menu: " + error);
	});
	initScroll();

	$("#myBtn").click(function(){
		$("#myModal").modal();
	});
});
