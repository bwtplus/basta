function addGallery() {
	$('.img-placeholder').click(function(){
		$('.modal-img').empty();
		const img = `<img src="${this.dataset.url}" alt="${this.dataset.title}" title="${this.dataset.title}"/>`;
		$(img).appendTo('.modal-img');
		$('#myModal').modal({show: true});
	});
}

const offerUrl = jsonOfferUrl;
const mealsUrl = jsonMenuUrl;

function fetchJson(url) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			url,
			type: 'GET',
			dataType: 'json',
			success: resolve,
			error: reject
		});
	});
}

function fetchFoodMenu(successCallback, errorCallback) {
	Promise.all([fetchJson(offerUrl), fetchJson(mealsUrl)])
		.then(([offer, meals])=> {
			const foodMenu = Object.keys(offer.mealIds).map(id => meals[id])
			successCallback(foodMenu);
		})
		.catch(errorCallback);
}

function fillTemplate(meal) {
	return `
		<div class="col-md-6 col-sm-6">
			<div class="pricing-item">      
				<div class="img-placeholder" style="background-image:url('${meal.imageUrl}');" data-url="${meal.imageUrl}" data-title="${meal.name}">
				</div>
				<div class="pricing-item-details">
					<h3>${meal.name}</h3>
					<p>${meal.description || ""}</p>
				</div>
				<span class="hot-tag br-red">${meal.price}</span>
				<div class="clearfix"></div>
			</div>
		</div>`;
}

function updateFoodMenu(data) {
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

export function initFoodMenu() {
	fetchFoodMenu(updateFoodMenu, (request, error) => {
		console.log("Error getting menu: " + error);
	});
}
