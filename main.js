console.log("This is connected");
// File Upload
//
function ekUpload() {
	function Init() {
		console.log("Upload Initialised");

		var fileSelect = document.getElementById("file-upload"),
			fileDrag = document.getElementById("file-drag"),
			submitButton = document.getElementById("submit-button");

		fileSelect.addEventListener("change", fileSelectHandler, false);

		// Is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			// File Drop
			fileDrag.addEventListener("dragover", fileDragHover, false);
			fileDrag.addEventListener("dragleave", fileDragHover, false);
			fileDrag.addEventListener("drop", fileSelectHandler, false);
		}
	}

	function fileDragHover(e) {
		var fileDrag = document.getElementById("file-drag");

		e.stopPropagation();
		e.preventDefault();

		fileDrag.className =
			e.type === "dragover" ? "hover" : "modal-body file-upload";
	}

	function fileSelectHandler(e) {
		// Fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// Cancel event and hover styling
		fileDragHover(e);

		// Process all File objects
		for (var i = 0, f; (f = files[i]); i++) {
			parseFile(f);
			uploadFile(f);
		}
	}

	// Output
	function output(msg) {
		// Response
		var m = document.getElementById("messages");
		m.innerHTML = msg;
	}

	function parseFile(file) {
		// console.log(file);
		output("<strong>" + encodeURI(file.name) + "</strong>");

		// var fileType = file.type;
		// console.log(fileType);
		var imageName = file.name;

		var isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);
		if (isGood) {
			document.getElementById("start").classList.add("hidden");
			document.getElementById("response").classList.remove("hidden");
			document.getElementById("notimage").classList.add("hidden");
			// Thumbnail Preview
			document.getElementById("file-image").classList.remove("hidden");

			// here is the source
			src = document.getElementById("file-image").src = URL.createObjectURL(
				file
			);
			// I'll need to pass this to the converter
			imgURL = URL.createObjectURL(file);
			// console.log(imgURL);

			imgToAscii({
				canvas: document.getElementById("ascii"),
				image: imgURL,
				fontSize: 10,
				spaceing: 8
			});

			// dwn = document.getElementById("btndownload");

			// // Event handler for download
			// dwn.onclick = function() {
			// 	downloadAscii(imgURL);
			// };

			// document.getElementById("file-ascii").classList.remove("hidden");
		} else {
			document.getElementById("file-image").classList.add("hidden");
			document.getElementById("notimage").classList.remove("hidden");
			document.getElementById("start").classList.remove("hidden");
			document.getElementById("response").classList.add("hidden");
			document.getElementById("file-upload-form").reset();
		}
	}

	function setProgressMaxValue(e) {
		var pBar = document.getElementById("file-progress");

		if (e.lengthComputable) {
			pBar.max = e.total;
		}
	}

	function updateFileProgress(e) {
		var pBar = document.getElementById("file-progress");

		if (e.lengthComputable) {
			pBar.value = e.loaded;
		}
	}

	function uploadFile(file) {
		var xhr = new XMLHttpRequest(),
			fileInput = document.getElementById("class-roster-file"),
			pBar = document.getElementById("file-progress"),
			fileSizeLimit = 1024; // In MB
		if (xhr.upload) {
			// Check if file is less than x MB
			if (file.size <= fileSizeLimit * 1024 * 1024) {
				// Progress bar
				pBar.style.display = "inline";
				xhr.upload.addEventListener("loadstart", setProgressMaxValue, false);
				xhr.upload.addEventListener("progress", updateFileProgress, false);

				// File received / failed
				xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) {
						// Everything is good!
						// progress.className = (xhr.status == 200 ? "success" : "failure");
						// document.location.reload(true);
					}
				};

				// Start upload
				xhr.open(
					"POST",
					document.getElementById("file-upload-form").action,
					true
				);
				xhr.setRequestHeader("X-File-Name", file.name);
				xhr.setRequestHeader("X-File-Size", file.size);
				xhr.setRequestHeader("Content-Type", "multipart/form-data");
				xhr.send(file);
			} else {
				output("Please upload a smaller file (< " + fileSizeLimit + " MB).");
			}
		}
	}

	// Check for the various File API support.
	if (window.File && window.FileList && window.FileReader) {
		Init();
	} else {
		document.getElementById("file-drag").style.display = "none";
	}
}
ekUpload();

// imgToAscii({
// 	canvas: document.getElementById("ascii"),
// 	image:
// 		"https://cdn.glitch.com/b75055dd-03c2-47e5-9f5d-7923ac439cc1%2Fdarnell.png?v=1584322716006",
// 	fontSize: 10,
// 	spaceing: 8
// });

const map = (s, a1, a2, b1, b2) => b1 + ((s - a1) * (b2 - b1)) / (a2 - a1);

function imgToAscii(config) {
	let original = new Image();
	original.crossOrigin = "Anonymous";
	original.onload = function() {
		var canvas = document.getElementById("ascii");
		// context = canvas.getContext("2d");
		let dataCtx = document.createElement("canvas").getContext("2d");
		config.canvas.width = dataCtx.canvas.width = this.width;
		config.canvas.height = dataCtx.canvas.height = this.height;
		dwn = document.getElementById("btndownload");

		// canvas = document.getElementById("ascii"),
		// context = canvas.getContext("2d");

		dataCtx.drawImage(
			this,
			0,
			0,
			this.width / config.spaceing,
			this.height / config.spaceing
		);
		let data = dataCtx.getImageData(0, 0, original.width, original.height).data;

		let ctx = config.canvas.getContext("2d");
		ctx.fillStyle = "#fff";

		let represenation =
			"$@B%8&WM#*oahbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^'. ";

		for (let i = 0, ii = 0; i < data.length; i += 4, ii++) {
			let x = ii % this.width;
			let y = (ii / this.width) | 0;
			let grayscale = ((data[i] + data[i + 1] + data[i + 2]) / 3) | 0;
			let char =
				represenation[map(grayscale, 255, 0, 0, represenation.length - 1) | 0];

			ctx.fillStyle = `rgb(${grayscale},${grayscale},${grayscale})`;
			ctx.font = `${config.fontSize}px Courier New`;
			ctx.fillText(char, x * config.spaceing, y * config.spaceing);
		}

		// console.log(canvas.toDataURL());
		var myImage = canvas.toDataURL();
		downloadURI(myImage, "MaSimulation.png");
		// Event handler for download
		// console.log(config.image);
		// dwn.onclick = function() {
		// 	downloadAscii(config.image);
		// };
	};

	original.src = config.image;
	dwn = document.getElementById("btndownload");
	dwn.onclick = function() {
		downloadAscii(original.src);
	};
	console.log(original.src);
}

function downloadURI(uri, name) {
	var link = document.createElement("a");

	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	//after creating link you should delete dynamic link
	//clearDynamicLink(link);
}

// Initializing
// window.onload = function() {
// 	var dwn = document.getElementById("btndownload"),
// 		canvas = document.getElementById("ascii"),
// 		context = canvas.getContext("2d");

// 	// Drawing a circle
// 	var centerX = canvas.width / 2;
// 	var centerY = canvas.height / 2;
// 	var radius = 70;
// 	context.beginPath();
// 	context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
// 	context.fillStyle = "rgba(0,200,0, .7)";
// 	context.fill();
// 	context.lineWidth = 2;
// 	context.strokeStyle = "black";
// 	context.stroke();

// 	// Drawing a rect
// 	context.beginPath();
// 	context.rect(15, 50, 100, 100);
// 	context.fillStyle = "rgba(255,255,0, .7)";
// 	context.fill();
// 	context.lineWidth = 2;
// 	context.strokeStyle = "black";
// 	context.stroke();

// 	// Event handler for download
// 	dwn.onclick = function() {
// 		download(canvas, "myimage.png");
// 	};
// };

// Source from:  http://stackoverflow.com/questions/18480474/how-to-save-an-image-from-canvas

function downloadAscii(someData) {
	var img = new Image();
	img.onload = function() {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		var base64Image = getBase64Image(canvas);
		downloadURI(base64Image, "image.png");
	};
	img.setAttribute("crossOrigin", "anonymous");
	img.src = someData;
}

function getBase64Image(canvas) {
	var dataURL = canvas.toDataURL("image/png");
	return dataURL;
}

function downloadURI(uri, name) {
	// IE10+ : (has Blob, but not a[download] or URL)
	if (navigator.msSaveBlob) {
		const blob = dataURItoBlob(uri);
		return navigator.msSaveBlob(blob, name);
	}
	const link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function dataURItoBlob(dataurl) {
	const parts = dataurl.split(","),
		mime = parts[0].match(/:(.*?);/)[1];
	if (parts[0].indexOf("base64") !== -1) {
		const bstr = atob(parts[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	} else {
		const raw = decodeURIComponent(parts[1]);
		return new Blob([raw], { type: mime });
	}
}

/* Canvas Donwload */
// function download(canvas, filename) {
// 	console.log("We are in");
// 	/// create an "off-screen" anchor tag
// 	var lnk = document.createElement("a"),
// 		e;

// 	/// the key here is to set the download attribute of the a tag
// 	lnk.download = filename;

// 	/// convert canvas content to data-uri for link. When download
// 	/// attribute is set the content pointed to by link will be
// 	/// pushed as "download" in HTML5 capable browsers
// 	// lnk.href = canvas.toDataURL("image/png;base64");

// 	/// create a "fake" click-event to trigger the download
// 	if (document.createEvent) {
// 		e = document.createEvent("MouseEvents");
// 		e.initMouseEvent(
// 			"click",
// 			true,
// 			true,
// 			window,
// 			0,
// 			0,
// 			0,
// 			0,
// 			0,
// 			false,
// 			false,
// 			false,
// 			false,
// 			0,
// 			null
// 		);

// 		lnk.dispatchEvent(e);
// 	} else if (lnk.fireEvent) {
// 		lnk.fireEvent("onclick");
// 	}
// }
