console.log("This is connected");
// File Upload
//
function myUploader() {
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
			// imgURL = URL.createObjectURL(file);
			console.log(file.name);
			var origName = file.name.replace(/\.[^/.]+$/, "");

			imgToAscii(
				{
					canvas: document.getElementById("ascii"),
					image: src,
					fontSize: 10,
					spaceing: 8
				},
				origName
			);

			setTimeout(showDownloader, 500);
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
myUploader();

const map = (s, a1, a2, b1, b2) => b1 + ((s - a1) * (b2 - b1)) / (a2 - a1);

function imgToAscii(config, origName) {
	let original = new Image();
	original.crossOrigin = "Anonymous";
	original.onload = function() {
		var canvas = document.getElementById("ascii");
		dataCtx = document.createElement("canvas").getContext("2d");
		config.canvas.width = dataCtx.canvas.width = this.width;
		config.canvas.height = dataCtx.canvas.height = this.height;
		dwn = document.getElementById("btndownload");

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
			"$@B%8&WM#*oahbdpqwmZO0Q..............,,@B%8&WM#*oahbdp............cccccccccccc----________************@@@@@@@@@@@@@@@@@@@@@@@@++++++++++++++++===============qwmZO0Q@B%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q,,,,,,,,,,,,,,,,,:::::::::::::;;;;;;;;;;;;;;;;''''''''''''''``````````hgeGKJAKHFLKHQLAKWEF;QJWNLJefw hiuwgbjhfejhvjfwkejhsvhjvsjhsjhgsrggsziuhiuksbrksbksbkrjkfsfwgi4qoifbwsbsbjgugoq74t3y96469757;;akl]]]OOO=N[UU9`V`HHHHHDDKKKEKsjsjsjsjsjkjkewkwelewioewioewouewoewouehqhoiewoeoueouewouewouewouewouewoufwffyfyufuysysdhkuuuduuducccgcggcgcooppppppqqqquuuuuuuuuueeeeegeggggcccccccoooooooooooooooqqoqqoqoqiiiiiiii........,,,,''''00000XPVTCVOICOcvcavcllblsncihighbvjccmzb,xBVNBnNDNLjbksgahjwhoqh]4oq]5o84i20q43y5u349871ty82u9p3hiqoi]qu430e8to3u4t[57t4y8]ncjkjfd%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q---------------LCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^'. ";

		//"$@B%8&WM#*oahbdpqwmZO0Q..............,,@B%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q,,,,,,,,,,,,,,,,,:::::::::::::;;;;;;;;;;;;;;;;''''''''''''''``````````hgeGKJAKHFLKHQLAKWEF;QJWNLJefw hiuwgbjhfejhvjfwkejhsvhjvsjhsjhgsrggsziuhiuksbrksbksbkrjkfsfwgi4qoifbwsbsbjgugoq74t3y96469757;;akl]]]OOO=N[UU9`V`HHHHHDDKKKEKsjsjsjsjsjkjkewkwelewioewioewouewoewouehqhoiewoeoueouewouewouewouewouewoufwffyfyufuysysdhkuuuduuducccgcggcgcooppppppqqqquuuuuuuuuueeeeegeggggcccccccoooooooooooooooqqoqqoqoqiiiiiiii........,,,,''''00000XPVTCVOICOcvcavcllblsncihighbvjccmzb,xBVNBnNDNLjbksgahjwhoqh]4oq]5o84i20q43y5u349871ty82u9p3hiqoi]qu430e8to3u4t[57t4y8]ncjkjfd%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q@B%8&WM#*oahbdpqwmZO0Q---------------LCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^'. ");

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

		// Event handler for download
		dwn.onclick = function() {
			var myAscii = canvas.toDataURL();
			downloadAscii(myAscii, `myAscii${origName}.png`);
			setTimeout(hideDownloader, 3000);
		};
	};

	original.src = config.image;

	// console.log(original.src);
}

function downloadAscii(uri, name) {
	var link = document.createElement("a");

	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	//after creating link you should delete dynamic link
	//clearDynamicLink(link);
}

function showDownloader() {
	document.getElementById("ascii").classList.remove("hidden");
	document.getElementById("btndownload").classList.remove("hidden");

	// Show the copyright
	document.getElementById("FooterContainer").classList.remove("hidden");
}

function hideDownloader() {
	document.getElementById("ascii").classList.add("hidden");
	document.getElementById("btndownload").classList.add("hidden");

	// Show the copyright
	document.getElementById("FooterContainer").classList.add("hidden");

	// Show the uploader
	document.getElementById("start").classList.remove("hidden");
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////// Plugging Footer /////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

var year = new Date().getFullYear();
var date = `Copyright &copy; ${year} | Rightbrainpapi.`;
document.getElementsByClassName("footer")[0].innerHTML = date;
