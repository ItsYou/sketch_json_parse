var path = "/Users/"+ NSUserName() + "/Desktop/sketch_export/";
var img_path = "/Users/"+ NSUserName() +"/Desktop/sketch_export/images/";
// document setup
var
	doc = context.document,
	page = doc.currentPage(),
	pages = [doc pages],
	selection = context.selection,
	artboards = doc.currentPage().artboards(),
	arrayOfImages = [],
	arrayOfArtBoards = [];


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
		var pageName = abObject.name;
		delete abObject["name"];
		var abString = JSON.stringify(abObject, null, '\t');
		var result = NSString.stringWithString_(abString);

		result.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path + pageName + '.json', true)
	}
	return artboardArray;
}


function createHotspots(artboard, arg) {
	var children = arg.children();

	for(var i = 0; i < children.length(); i++) {
		var child = children[i];
		// children is 1 dimentional.
		// folders and layers are coexisting in one array.
		if(':: Content' == child.name() || ':: Header' == child.name() || ':: Footer' == child.name()) {
			// indexOf or includes() does not work as intended with cocoascript
			var childName = child.name().replace(/\W/g, '').toLowerCase();
			var childSize = child.absoluteRect();
			var innerLayers = child.children();
			var imgName = artboard.name.toUpperCase() + '_' + childName;
			artboard[childName] = {};
			artboard[childName]["height"] = child.absoluteRect().height()
			artboard[childName]["hotSpots"] = [];
			artboard[childName]["img"] = "images/" + imgName + ".png";
			getInnerLayer(artboard, child, childName, innerLayers, imgName);
			log(img_path + imgName)
			log(doc.saveArtboardOrSlice_toFile(child.absoluteRect(), img_path + imgName + '.png'))
		}
	}
}

function getInnerLayer(artboard, parent, childName, layers, img) {
	for(var x = 0; x < layers.length(); x++){

		if(layers[x].name().startsWith('**')){
			var targetRoute = layers[x].name().match(/\w+/g)[0];
			var target = layers[x];
				artboard[childName]["hotSpots"].push(new HotSpot({
				height: target.absoluteRect().height(),
				width: target.absoluteRect().width(),
				left: target.absoluteRect().x() - 27,
				top: target.absoluteRect().y() - 102,
				target: targetRoute
			}));

		}
	}
}

findSpecialLayers(artboards);
