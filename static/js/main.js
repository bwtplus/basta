// scrollUtil.js
function changeHistory(hashPath) {
	if (/(MSIE\ [0-9]{1})/i.test(navigator.userAgent)) {
		var path = window.location.pathname.split('#')[0] + hashPath;
		window.location = path;
	} else {
		window.history.pushState(null, null, hashPath);
	}
}
function smoothScrollTo(e) {
	$('#navbar.collapse').removeClass('in');
	var me = this;
	var target = $(me.hash);
	if (target.length) {
		$('html, body').animate({scrollTop: target.offset().top}, 600, function () {
			changeHistory(me.hash);
		});
		return false;
	}
}
function initScroll() {
	$('.nav > li > a, #logo a').click(smoothScrollTo);
	$('#scrollDownArrow').click(smoothScrollTo);
}

// fetchFoot.js
function addGallery() {
	$('.thumbnail').click(function(){
		  $('.modal-body').empty();
		var title = $(this).parent('a').attr("title");
		$('.modal-title').html(title);
		$($(this).parents('div').html()).appendTo('.modal-body');
		$('#myModal').modal({show:true});
	});
}

function fetchFoodMenu(success, error) {
	$.ajax({
		url: feedUrl,
		type: 'GET',
		dataType: 'json',
		success: success,
		error: error
	});
}

function updateFoodMenu(data) {
	var list = $.map(data, function (value, index) {
		return value;
	});
	var template = '<div class="col-md-6 col-sm-6">' +
		' 	<div class="pricing-item">' +
		' 		<a href="#" data-toggle="modal">' +
		' 			<img class="img-responsive thumbnail" src="{photo}" alt="">' +
		' 		</a>' +
		'	  	<div class="pricing-item-details">' +
		'		  	<h3><a href="#food-menu">{name}</a></h3>' +
		'			<p>{description}</p>' +
		' 		</div>' +
		'	  	<span class="hot-tag br-red">{price}</span>' +
		'	  	<div class="clearfix"></div>' +
		'	 </div>' +
		'</div>';
	var fillTemplate = function (template, dataItem) {
		var result = template;
		for (var propertyName in dataItem) {
			result = result.replace('{' + propertyName + '}', dataItem[propertyName]);
		}
		return result;
	}
	var foodMenuContent = list.reduce(function (acc, val, id) {
		acc += fillTemplate(template, val);
		if (id % 2 === 1) {
			acc += '<div class="clearfix"></div>';
		}
		return acc;
	}, '');
	$("#upadatedMenu").html(foodMenuContent);
	addGallery();
}

// main.js
$(document).ready(function () {
	fetchFoodMenu(updateFoodMenu, function (request, error) {
		console.log("Error getting menu: " + error);
	});
	initScroll();
});
