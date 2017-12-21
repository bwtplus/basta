function addGallery() {
	$('.img-placeholder').click(function(){
		$('.modal-title').empty();
		$('.modal-img').empty();
		$('.modal-description').empty();
		var img = '<img src="'+this.style[this.style[0]].replace('url(','').replace(')','').replace(/\"/gi, "")+'"/>';
		var title = $(this).parent('div').parent('div').find('h3').text();
		var description = $(this).parent('div').parent('div').find('p').text();
		$(img).appendTo('.modal-img');
		$('<h3>'+title+'</h3>').appendTo('.modal-title');
		$('<span>'+description+'</span>').appendTo('.modal-description');
		//$('.modal-open').style='';
		$('#myModal').modal({show: true});
	});
}

export function fetchFoodMenu(success, error) {
	$.ajax({
		url: feedUrl,
		type: 'GET',
		dataType: 'json',
		success: success,
		error: error
	});
}

function fillTemplate(meal) {
	return `
		<div class="col-md-6 col-sm-6">
			<div class="pricing-item">      
				<div class="img-placeholder" style="background-image:url('${meal.photo}');">
				</div>
				<div class="pricing-item-details">
					<h3>${meal.name}</h3>
					<p>${meal.description}</p>
				</div>
				<span class="hot-tag br-red">${meal.price}</span>
				<div class="clearfix"></div>
			</div>
		</div>`;
}

export function updateFoodMenu(data) {
	const foodMenuContent = Object.values(data).reduce((acc, val, id) => {
		acc += fillTemplate(val);
		if (id % 2 === 1) {
			acc += '<div class="clearfix"></div>';
		}
		return acc;
	}, '');
	$("#upadatedMenu").html(foodMenuContent);
	addGallery();
}
