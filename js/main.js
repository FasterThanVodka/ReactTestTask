const HOST_URL = "https://ec-test-react.herokuapp.com/";
const HOST_URL_ITEMS = "api/v1/items"; // response object: { width:number, height:number }
const HOST_URL_PICTURES = "api/v1/pictures"; // response object: { pictures: ['static/1.jpg', 'static/2.jpg', ...] }

let pictureUrls = [];
let cells = [];

let selectedItem1;
let selectedItem2;

function init() {
	getData(onGetDataSuccess);
}

function getData(onResult) {
	let items;
	let pictures;

	const requestPictures = new XMLHttpRequest();
	const requestItems = new XMLHttpRequest();

	requestItems.open("GET", HOST_URL + HOST_URL_ITEMS, true);
	requestItems.addEventListener("load", function(){
		items = JSON.parse(requestItems.responseText);

		requestPictures.open("GET", HOST_URL + HOST_URL_PICTURES, true);
		requestPictures.addEventListener("load", function() {
			pictures = JSON.parse(requestPictures.responseText);

			onResult({
				width:items.width,
				height:items.height,
				pictures:pictures
			});
		});
		requestPictures.send(null);
	});
	requestItems.send(null);
}

function onGetDataSuccess(data) {
	data.pictures.forEach(function(url) {
		pictureUrls.push(HOST_URL + url);
	});

	createItems(data.width, data.height);
}

function createItems(width, height) {
	let count = 0;
	let container = createItem("containerTable");

	for (let i=0; i<height; ++i) {
		let row = createItem("containerRow");

		for (let j=0; j<width; ++j) {
			let img = createNextImage(count);

			let cell = createItem("containerCell");
			cell.id = "cell" + count++;
			cell.imageType = function() { return img.imageType; };
			cell.appendChild(img);

			cells.push(cell);

			row.appendChild(cell);
		}

		container.appendChild(row);
	}

	shuffleImages();

	document.body.appendChild(container);

	setTimeout(function() {
		cells.forEach(function(item) {
			unselectItem(getImg(item));
		})
	}, 3000);
}

function createItem(classType) {
	let result = document.createElement("div");
		result.className = classType;
	return result;
}

function createNextImage(count) {
	let nextIndex = count % pictureUrls.length;
	let result = new Image();
		result.imageType = nextIndex;
		result.src = pictureUrls[nextIndex];
		result.addEventListener("click", onItemClick);
	return result;
}

function shuffleImages() {
	for (let i=0; i<cells.length-1; ++i) {
		swapItems(cells[i], cells[Math.ceil(Math.random() * cells.length-1)]);
	}
}

function swapItems(item1, item2) {
	let image1 = getImg(item1);
	let image2 = getImg(item2);

	let tempImageSrc = image1.src;
	image1.src = image2.src;
	image2.src = tempImageSrc;

	let tempImageType = image1.imageType;
	image1.imageType = image2.imageType;
	image2.imageType = tempImageType;
}

function getImg(item) {
	return item.getElementsByTagName("img")[0];
}

function onItemClick(event) {
	let targetItem = event.target;

	if (selectedItem1 && selectedItem1 != targetItem)
	{
		selectedItem2 = targetItem;

		if (selectedItem.imageType == targetItem.imageType) {
			selectedItem.parentNode.innerHTML = targetItem.parentNode.innerHTML = "<p>x</p>";            
			selectedItem1 = null;
			selectedItem2 = null;
		} else {
			unselectItem(selectedItem1);
			unselectItem(selectedItem2);
			selectedItem1 = null;
			selectedItem2 = null;
		}
	} else {
		selectItem(targetItem);
		selectedItem1 = targetItem;
	}
}

function isSelected(item) {
	return !!item.style.opacity;
}

function selectItem(item) {
	selectedItem = item;

	item.style.opacity = 1;

	let delayId;
		delayId = setTimeout(function() {
		unselectItem(item);
		clearTimeout(delayId);
	}, 1200);
}

function unselectItem(item) {
	if (item)
		item.style.opacity = 0;
}