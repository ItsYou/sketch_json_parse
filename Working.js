require('lodash');
// document setup
var
	doc = context.document,
	page = doc.currentPage(),
	pages = [doc pages],
	selection = context.selection,
	artboards = doc.currentPage().artboards(),
	arrayOfImages = [],
	arrayOfArtBoards = [];

//======================================================================================== Find Special Layers

/*
	This fn loops through all the layers and finds
	the ones with specail charecters in their name
*/

// save out all the artboards with the correct name.
function ArtBoard(args) {
	this.name = args.name;
	this.content = null;
	this.header = null;
	this.footer = null;
}

function HotSpot(args) {
	this.height = args.height;
	this.width = args.width;
	this.left = args.left;
	this.top = args.top;
	this.target= args.target;
}

function createHotspots(artboard, arg) {
	var children = arg.children();

	for(var i = 0; i < children.length(); i++) {
		var child = children[i];

		if(':: Content' == child.name() || ':: Header' == child.name() || ':: Footer' == child.name()) {

			var childName = child.name().replace(/\W/g, '').toLowerCase();
			var childSize = child.absoluteRect();
			var innerLayers = child.children();


			getInnerLayer(artboard, childName, innerLayers);

		}
	}
}

function getInnerLayer(artboard, childName, layers) {
	for(var x = 0; x < layers.length(); x++){
		if(layers[x].name().startsWith('**')){
			var target = layers[x];

			artboard[childName] = [];
			artboard[childName].push(new HotSpot({
				height: target.absoluteRect().height(),
				width: target.absoluteRect().width(),
				left: target.absoluteRect().x() - 27,
				top: target.absoluteRect().y() - 102,
				target: target.name().match(/\w+/g).pop().toLowerCase()
			}));
		}
	}
}
function findSpecialLayers(artboards) {

	var sections;
	var artboard;
	var artboardArray = [];
	for (var i = 0; i < artboards.length(); i++) {
		artboard = artboards.objectAtIndex(i);
		artboardName = artboard.name().replace(/\W*/, '').toLowerCase();
		var abObject = new ArtBoard({ name: artboardName });
		createHotspots(abObject, artboard);
		artboardArray.push(abObject);
	}
	log(artboardArray);
	return artboardArray;

}


findSpecialLayers(artboards);

//======================================================================================== Find Special Layers !






// function checkLayerName(name){

// 	// for each group passed save to the desktop
// 	for (var i=0; i<layers.length(); i++) {
// 	}


// }




// function stripStaticNames(name){

// 	// for each group passed save to the desktop
// 	for (var i=0; i<layers.length(); i++) {

// 		var layer = layers.objectAtIndex(i),
// 			layerName = layer.name().toString();

// 		// check to see if the strig contains "::"
// 		if(layerName.indexOf('::') == 0){
// 			log('this is true')
// 		}
// 		else {
// 			log('this is not true')
// 		}

// 		log(layer.name())

// 	}

// 	// if the string has

// }






// // image data needs to be an array


// function saveOutImages(imageData){

// }

// function createLayerData(layerData){

// }


// function mapData(mixedData) {
//     return user.friendIds.map(function(id) {
//         return usersById[id].name
//     })
// }





//======================================================================================== Save Out Images

// create all the images / store their names here
var allImages = saveToImage(artboards)

// save out all the artboards with the correct name.
function saveToImage(images){

	var arrayOfImages = [];

	// for each AB passed save to the desktop
	for (var i=0; i<images.count(); i++) {

		// save the data we need and parse down to the actual name
		var imagesPassed = images[i].toString(),
	            startPos = imagesPassed.indexOf('>') + 1,
	              endPos = imagesPassed.indexOf('(', startPos),
	        imagesNamed = imagesPassed.substring(startPos,endPos).replace(/\s+/g, '');
	        arrayOfImages.push(imagesNamed);

	    // save out the AB to the desktop
		doc.saveArtboardOrSlice_toFile(images[i],"~/desktop/"+imagesNamed+".png")

		log(imagesNamed)
	}
	log('ALL NAME: ' + JSON.stringify(arrayOfImages));

	return arrayOfImages;
}

//======================================================================================== Save Out Images !





//======================================================================================== Find Later Type

//---  Types of layers that can be selected
// MSLayerGroup
// MSShapeGroup
// MSShapePathLayer
// MSTextLayer
// MSArtboardGroup


var findLayerType = function(layerType, containerLayer) {

    // Filter layers using NSPredicate
	var scope = (typeof containerLayer !== 'undefined') ? [containerLayer children] : [[doc currentPage] children],
		predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
		layers = [scope filteredArrayUsingPredicate:predicate];

		// testLog(layers, "this is in the function");

	// Deselect current selection
	[[doc currentPage] deselectAllLayers]

	// Loop through filtered layers and select them
	var loop = [layers objectEnumerator], layer;
	while (layer = [loop nextObject]) {
		[layer select:true byExpandingSelection:true]
	}
	log([layers count] + " " + layerType + "s selected")

	return layers;
}

// Select all Artboards in current page


//======================================================================================== Find Later Type

var layers = findLayerType("MSLayerGroup");


// testLog(layers, "after the function runs");












//======================================================================================== Test Log

function testLog(output, title){
	var logLine = ' =================================================================================== ' + title;
	log(logLine + output + logLine);
}

//======================================================================================== Test Log


// Art Boards | testLog(artboards);
// Document   | testLog(doc);
// Page       | testLog(page);
// Pages      | testLog(pages);
// Selection  | testLog(selection);
// All Images | testLog(allImages);
// testLog();
