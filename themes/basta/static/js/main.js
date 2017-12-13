// scrollUtil.js
// TODO animateScrollDownArrow in CSS
function smoothScrollTo(e) {
	var me = this;
	var target = $(me.hash);
	if (target.length) {
		$('html, body').animate({scrollTop: target.offset().top}, 600, function () {
			window.history.pushState(null, null, me.hash);
		});
		return false;
	}
}
function initScroll() {
	$('.nav > li > a, #logo a').click(smoothScrollTo);
	$('#scrollDownArrow').click(smoothScrollTo);
}

// fetchFoot.js
function addLightBoxes() {
	var $lightbox = $('#lightbox');
	$('[data-target="#lightbox"]').on('click', function (event) {
		var $img = $(this).find('img'),
				src = $img.attr('src'),
				alt = $img.attr('alt'),
				css = {
					maxWidth: $(window).width() - 200,
					maxHeight: $(window).height() - 200
				};

		$lightbox.find('.close').addClass('hidden');
		$lightbox.find('img').attr('src', src);
		$lightbox.find('img').attr('alt', alt);
		$lightbox.find('img').css(css);
	});

	$lightbox.on('shown.bs.modal', function (e) {
		var $img = $lightbox.find('img');
		$lightbox.find('.modal-dialog').css({ 'width': $img.width() });
		$lightbox.find('.close').removeClass('hidden');
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
		' 		<a href="#" data-toggle="modal" data-target="#lightbox">' +
		' 			<img class="img-responsive img-thumbnail" src="{photo}" alt="">' +
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
	addLightBoxes();
}

// main.js
$(document).ready(function () {
	fetchFoodMenu(updateFoodMenu, function (request, error) {
		console.log("Error getting menu: " + error);
	});
	initScroll();
});
