const moneyFormat = new Intl.NumberFormat('en-IN', {
	minimumFractionDigits: 0
}).format;

const getCoinsData = async() => {
	const isAll = document.getElementById('typeChange').checked;
	if (isAll) {
		document.getElementById('header_content').innerHTML = "All Coins";
		document.querySelectorAll('.only_full')[0].style.display = "block";
	} else {
		document.getElementById('header_content').innerHTML = "Top Coins";
		document.querySelectorAll('.only_full')[0].style.display = "none";
		document.querySelectorAll('.only_full')[1].style.display = "none";
	}
	try {
		await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr')
			.then(response => response.json())
			.then(data => {
				let cardsData = '';
				let size = isAll ? data.length : 5;
				for (let i = 0; i < size; i++) {
					if (data[i]) {
						let {
							image = '',
								name = '',
								// symbol,
								id = i,
								current_price = '',
								last_updated = '',
								price_change_24h = '',
								price_change_percentage_24h = ''
						} = data[i];
						if (image && name && id && current_price &&
							last_updated &&
							price_change_24h &&
							price_change_percentage_24h) {
							let date = new Date(last_updated);
							let hours = date.getHours();
							let ampm = hours >= 12 ? 'pm' : 'am';
							let priceChange24h = Number(price_change_24h);
							let priceChange24hPer = Number(price_change_percentage_24h).toFixed(2);
							let priceChange = priceChange24h > 0;
							let priceChangeIcon = priceChange24h > 0 ? '+' : '';

							cardsData += `
					<div class="card" id=${'card_'+id}>
						<p class="details" id=${id}>
							<small>
								<span class="date">
								${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}
								</span> | 
								<span class="time">${hours}:${date.getMinutes()} 
								${ampm} 
								</span>
								<span class="coinName">-${name}</span>
							</small>
						</p>
						<p class="price">₹${moneyFormat(current_price)}</p>
						<p class="data">
							<span class="dataPrice ${priceChange24h<0 || priceChange24hPer<0.00 && 'hide'}">
								<small class="percentage ${priceChange?'increase':'decrease'}">
									${priceChangeIcon}${moneyFormat(priceChange24h)}(${priceChangeIcon}${priceChange24hPer}%)
	
									<span class="${priceChange?'bg-increase':'bg-decrease'} arrow">
										${priceChange?'▲':'▼'}
									</span>
								</small>
							</span>
							<img class="coinImg" src="${image}" width="15" height="15"/>
						</p>
					</div>`
							hours = '';
							ampm = '';
							priceChange = '';
							priceChangeIcon = '';
							priceChange24hPer = '';
						}
					} else {
						continue;
					}
				}
				document.getElementById('fullCoinList').innerHTML = cardsData;
				cardsData = '';
			});
	} catch (err) {
		console.log('err', err)
	}
}


const updateCoindata = async() => {
	const isAll = document.getElementById('typeChange').checked;
	
	try {
		await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr')
			.then(response => response.json())
			.then(data => {
				console.log('aaaa',data);
				let size = isAll ? data.length : 5;
				for (let i = 0; i < size; i++) {
					let {
						id = i,
							current_price = '',
							last_updated = '',
							price_change_24h = '',
							price_change_percentage_24h = ''
					} = data[i];
					let date = new Date(last_updated);
					let hours = date.getHours();
					let ampm = hours >= 12 ? 'pm' : 'am';
					let priceChange24h = Number(price_change_24h);
					let priceChange24hPer = Number(price_change_percentage_24h).toFixed(2);
					let priceChange = priceChange24h > 0;
					let priceChangeIcon = priceChange24h > 0 ? '+' : '';

					let eleCard = document.getElementById('card_' + id);
					let ele = document.getElementById(id);

					if (ele) {
						ele.getElementsByClassName('date')[0].innerHTML = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

						ele.getElementsByClassName('time')[0].innerHTML = `${hours}:${date.getMinutes()} ${ampm}`;

						eleCard.getElementsByClassName('price')[0].innerHTML = `₹${moneyFormat(current_price)}`;

						let dataEle = eleCard.getElementsByClassName('data')[0];

						dataEle.getElementsByClassName('dataPrice').class = `dataPrice ${priceChange24h<0 || priceChange24hPer<0.00 && 'hide'}`;

						dataEle.getElementsByClassName('dataPrice').innerHTML = `${priceChangeIcon}${moneyFormat(priceChange24h)}(${priceChangeIcon}${priceChange24hPer}%)
						<span class="${priceChange?'bg-increase':'bg-decrease'} arrow">
							${priceChange?'▲':'▼'}
						</span>`;
					}
					hours = '';
					ampm = '';
					priceChange = '';
					priceChangeIcon = '';
					priceChange24hPer = '';
				}

			});
	} catch (err) {
		console.log('err', err)
	}
}

document.getElementById('searchCoin').addEventListener('change', function () {
	let input, filter, ul, i, txtValue, check = true;
	input = document.getElementById('searchCoin');
	filter = input.value.toUpperCase();
	ul = document.getElementsByClassName('details');
	for (i = 0; i < ul.length; i++) {
		txtValue = ul[i].id.toUpperCase();
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			document.getElementById('card_' + ul[i].id).style.display = "block";
			check = false;
		} else {
			document.getElementById('card_' + ul[i].id).style.display = "none";
		}
	}
	if (check) {
		document.querySelectorAll('.only_full')[1].style.display = "block";
	} else {
		document.querySelectorAll('.only_full')[1].style.display = "none";
	}
});

document.getElementById('typeChange').addEventListener('click', function () {
	getCoinsData()
});

getCoinsData();
setInterval(updateCoindata, 15000);