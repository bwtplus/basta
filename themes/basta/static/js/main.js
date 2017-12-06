(function($,sr) {
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
				                  func.apply(obj, args);
				timeout = null;
			}
			;
			if (timeout)
			              clearTimeout(timeout); else if (execAsap)
			              func.apply(obj, args);
			timeout = setTimeout(delayed, threshold || 100);
		}
		;
	}
	// smartresize 
	jQuery.fn[sr] = function(fn) {
		return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
	}
	;
}
)(jQuery,'smartresize');


$(document).ready(function() {
	///////////////////////////////
	// Set Home Slideshow Height
	///////////////////////////////
	function setHomeBannerHeight() {
		var windowHeight = jQuery(window).height();
		jQuery('#header').height(windowHeight);
	}
	///////////////////////////////
	// Center Home Slideshow Text
	///////////////////////////////
	function centerHomeBannerText() {
		var bannerText = jQuery('#header > .center');
		var bannerTextTop = (jQuery('#header').actual('height')/2) - (jQuery('#header > .center').actual('height')/2) - 20;
		bannerText.css('padding-top', bannerTextTop+'px');
		bannerText.show();
	}
	setHomeBannerHeight();
	centerHomeBannerText();
	//Resize events
	jQuery(window).smartresize(function() {
		setHomeBannerHeight();
		centerHomeBannerText();
	});
	
	function scroll() {
		if ($(window).scrollTop() == 0 ) {
			//$('.nav > li').removeClass('active');
			console.log($(window).scrollTop());
		} else {
			
		}
	}
	document.onscroll = scroll;
	var $scrollDownArrow = $('#scrollDownArrow');
	var animateScrollDownArrow = function() {
		$scrollDownArrow.animate( {
			top: 5,
		}
		, 400, "linear", function() {
			$scrollDownArrow.animate( {
				top: -5,
			}
			, 400, "linear", function() {
				animateScrollDownArrow();
			}
			);
		});
	}
	animateScrollDownArrow();
	//Set Down Arrow Button
	jQuery('#scrollDownArrow').click(function(e) {
		e.preventDefault();
		jQuery.scrollTo("#food-menu", 1000, {
			offset:-(jQuery('#header #food-menu').height()), axis:'y'
		}
		);
	});
	jQuery('.nav > li > a, #logo a').click(function(e) {
		e.preventDefault();

		jQuery.scrollTo(jQuery(this).attr('href'), 400, {
			offset:-(jQuery('#header #food-menu').height()), axis:'y'
		}
		);
	});
});

function addLightBoxes() {
    var $lightbox = $('#lightbox');
    
    $('[data-target="#lightbox"]').on('click', function(event) {
        var $img = $(this).find('img'), 
            src = $img.attr('src'),
            alt = $img.attr('alt'),
            css = {
                'maxWidth': $(window).width() - 200,
                'maxHeight': $(window).height() - 200
            };
    
        $lightbox.find('.close').addClass('hidden');
        $lightbox.find('img').attr('src', src);
        $lightbox.find('img').attr('alt', alt);
        $lightbox.find('img').css(css);
    });
    
    $lightbox.on('shown.bs.modal', function (e) {
        var $img = $lightbox.find('img');
            
        $lightbox.find('.modal-dialog').css({'width': $img.width()});
        $lightbox.find('.close').removeClass('hidden');
    });
}

function fetchFoodMenu(success, error) {
    $.ajax({
		url : 'http://127.0.0.1:1313/js/updatedoffer.js',
		type : 'GET',
		dataType: 'json',
		success : success,
		error : error
	});
}

function updateFoodMenu(data) {
	var list = $.map(data, function( value, index ) { return value; });
	var template = '<div class="col-md-6 col-sm-6">' + 
'	<div class="pricing-item">' + 
'		<a href="#" data-toggle="modal" data-target="#lightbox">' + 
'			<img class="img-responsive img-thumbnail" src="{photo}" alt="">' + 
'		</a>' + 
'		<div class="pricing-item-details">' + 
'			<h3><a href="#food-menu">{name}</a></h3>' + 
'			<p>{description}</p>' + 
'		</div>' + 
'		<span class="hot-tag br-red">{price}</span>' + 
'		<div class="clearfix"></div>' + 
'	</div>' + 
'</div>';

	var foodMenuContent = list.reduce(function(acc, val, id) {
		acc += fillTemplate(template, val);
		if ( id % 2 === 1 ){
			acc +='<div class="clearfix"></div>';
		}
		return acc;
	}, '');
	$("#upadatedMenu").html(foodMenuContent);
	addLightBoxes();
}

function fillTemplate(template, dataItem) {
	var result = template;
	for(var propertyName in dataItem) {
		result = result.replace('{'+propertyName+'}', dataItem[propertyName]);
	}
	return result;
}

$(document).ready(function () {
	fetchFoodMenu(updateFoodMenu, function(request,error) {
			console.log("Error getting menu: " + error);
	});
});
	