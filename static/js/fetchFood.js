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

function fillTemplate(meal) {
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
				<span class="hot-tag br-red">${price}€</span>
				<div class="clearfix"></div>
			</div>
		</div>`;
}

function updateFoodMenu(offers, meals) {
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
		const foodMenuContent = offerMeals.reduce((acc, val, id) => {
			acc += fillTemplate(val);
			if (id % 2 === 1) {
				acc += '<div class="clearfix"></div>';
			}
			return acc;
		}, '');
		$("#upadatedMenu").append(`<h2 class="row section-title text-center">${offerName}</h2>`);
		$("#upadatedMenu").append(foodMenuContent);
		$("#upadatedMenu").append(`<div class="clearfix"></div>`);
	});
	addGallery();
}

export function initFoodMenu() {
	Promise.all([fetchJson(offerUrl), fetchJson(mealsUrl)])
	.then(([offers, meals]) => updateFoodMenu(offers, meals))
	.catch(error => console.log("Error getting menu", error));
}
