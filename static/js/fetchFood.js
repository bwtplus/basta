function addGallery() {
	$('.img-placeholder').click(function(){
		$('.modal-img').empty();
		const img = `<img src="${this.dataset.url}" alt="${this.dataset.title}" title="${this.dataset.title}"/>`;
		$(img).appendTo('.modal-img');
		$('#myModal').modal({show: true});
	});
}

const formatter = new Intl.NumberFormat('sk-SK', {minimumFractionDigits: 2});

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

function createMealElement(meal, currency) {
	var price = formatter.format(meal.price);
	return `
		<div class="col-md-6 col-sm-6">
			<div class="pricing-item">      
				<div class="img-placeholder" style="background-image:url('${meal.imageUrl}');" data-url="${meal.imageUrl}" data-title="${meal.name}">
				</div>
				<div class="pricing-item-details">
					<h3>${meal.name}</h3>
					<p>${meal.description || ""}</p>
				</div>
				<span class="hot-tag br-red">${price} ${currency}</span>
				<div class="clearfix"></div>
			</div>
		</div>`;
}

function updateFoodMenu(meals, offers, currency) {
	Object.values(offers).forEach(offer => {
		const offerName = offer.conf.name
		const offerMeals = Object.entries(offer.data.mealIds)
			.map(([mealId, order])=> ({
				imageUrl: meals[mealId].imageUrl,
				name: meals[mealId].name,
				description: meals[mealId].description,
				price: meals[mealId].price,
				order
			}))
			.sort((a,b) => a.order > b.order)
		const offerMealElements = offerMeals.reduce((acc, meal, id) => {
			acc += createMealElement(meal, currency);
			if (id % 2 === 1) {
				acc += '<div class="clearfix"></div>';
			}
			return acc;
		}, '');
		$("#upadatedMenu").append(`<h2 class="row section-title text-center">${offerName}</h2>`);
		$("#upadatedMenu").append(offerMealElements);
		$("#upadatedMenu").append(`<div class="clearfix"></div>`);
	});
	addGallery();
}

export function initFoodMenu() {
	Promise.all([fetchJson(mealsUrl), fetchJson(offersUrl), fetchJson(currencyUrl)])
		.then(([meals, offers, currency]) => updateFoodMenu(meals, offers, currency))
		.catch(error => console.log("Error getting menu", error));
}
