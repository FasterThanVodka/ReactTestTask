const hostUrl = "https://ec-test-react.herokuapp.com/";
const hostUrlItems = "api/v1/items"; // response object: { width:number, height:number }
const hostUrlPictures = "api/v1/pictures"; // response object: { pictures: ['static/1.jpg', 'static/2.jpg', ...] }

var pictureUrls = [];
var cells = [];

var selectedItem;

function init() {
    getData(onGetDataSuccess);
}

function getData(onResult) {
    var items;
    var pictures;

    const requestPictures = new XMLHttpRequest();
    const requestItems = new XMLHttpRequest();

    requestItems.open("GET", hostUrl + hostUrlItems, true);
    requestItems.addEventListener("load", function(){
        items = JSON.parse(requestItems.responseText);

        requestPictures.open("GET", hostUrl + hostUrlPictures, true);
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
        pictureUrls.push(hostUrl + url);
    });

    createItems(data.width, data.height);
}

function createItems(width, height) {
    var count = 0;
    var container = createItem("containerTable");

    for (var i=0; i<height; ++i) {
        var row = createItem("containerRow");

        for (var j=0; j<width; ++j) {
            var img = createNextImage(count);

            var cell = createItem("containerCell");
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
            unselectItem(item.getElementsByTagName("img")[0]);
        })
    }, 3000);
}

function createItem(classType) {
    var result = document.createElement("div");
        result.className = classType;
    return result;
}

function createNextImage(count) {
    var nextIndex = count % pictureUrls.length;
    var result = new Image();
        result.imageType = nextIndex;
        result.src = pictureUrls[nextIndex];
        result.addEventListener("click", onItemClick);
    return result;
}

function shuffleImages() {
    for (var i=0; i<cells.length-1; ++i) {
        swapItems(cells[i], cells[Math.ceil(Math.random() * cells.length-1)]);
    }
}

function swapItems(item1, item2) {
    var image1 = item1.getElementsByTagName("img")[0];
    var image2 = item2.getElementsByTagName("img")[0];

    var tempImageSrc = image1.src;
    image1.src = image2.src;
    image2.src = tempImageSrc;

    var tempImageType = image1.imageType;
    image1.imageType = image2.imageType;
    image2.imageType = tempImageType;
}

function onItemClick(event) {
    var targetItem = event.target;

    if (selectedItem) {
        if (selectedItem.imageType == targetItem.imageType) {
            selectedItem.parentNode.innerHTML = targetItem.parentNode.innerHTML = "<p>x</p>";
        } else {
            selectItem(targetItem);
        }

    } else {
        selectItem(targetItem);
    }
}

function selectItem(item) {
    selectedItem = item;

    item.style.opacity = 1;

    var delayId;
        delayId = setTimeout(function() {
        unselectItem(item);
        clearTimeout(delayId);
    }, 2000);
}

function unselectItem(item) {
    if (item)
    {
        item.style.opacity = 0.0;
    }

    selectedItem = null;
}