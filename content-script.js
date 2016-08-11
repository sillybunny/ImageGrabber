// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var grabberMode = "";

if (document.URL.match('shots')){
    grabberMode = "shots";
    console.log('shots');
  } else if (document.URL.match('search')){
    grabberMode = "search";
    console.log('search');
  }


switch (grabberMode){

	case "shots":
		console.log('shots');

		var imgUrl = document.getElementById("screenshot-title-section").nextSibling.nextSibling.firstChild.nextSibling.getAttribute("data-img-src");;
		console.log('imgUrl :' + imgUrl);

		var title = document.getElementsByTagName("title")[0].textContent;

		var fileName = "Dribbble/" + trimSting(title).replace(/[^0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_\s]/, "") + " [tags]" + findTags();
		fileName += findColors();
		fileName += imgUrl.substring(imgUrl.length-4,imgUrl.length);
		console.log(fileName);

		var msg = {
			url: imgUrl, 
			filename: fileName
		}

		chrome.runtime.sendMessage(msg);

		break;

	case "search":

		var allHref = document.getElementsByTagName("noscript");
		console.log(allHref[0]);
		var c = 0;
		var msg = {};
		while(allHref[c] != allHref.lastChild){
			var imgUrl = allHref[c].textContent.match(/src="(.*)"/)[1]+"";
			var fileName = allHref[c].textContent.match(/alt="([^"]*)*"/)[1]+"";
			//imgUrl = imgUrl.replace("_teaser","");
			fileName += imgUrl.substring(imgUrl.length-4,imgUrl.length);
			fileName = "Dribbble Search " + document.URL.replace("https://dribbble.com/search?q=", "") + "/" + fileName;
			msg[c] = {url: imgUrl, filename: fileName}
			console.log(allHref[c].textContent.match(/alt="([^"]*)"/)[1]+"");
			c ++;
		}

		console.log(msg);
		chrome.runtime.sendMessage(msg);
		break;

	default:
};


function findColors() {
	var c = document.getElementsByTagName("li");
	var colors= " [colors]";
	for (i=0; i<c.length; i++)
	  {
	  	if(c[i].className == "color"){
	  		var matcher  = ntc.name(trimSting(c[i].textContent));
	  		colors += " " + matcher[0] + " " + matcher[1];
	  	}
	  };

	return colors;
}


function findTags() {

	var str = "";
	var tags = document.getElementById("tags").childNodes;

	for(i=0; i<tags.length; i++){
		if(tags[i].nodeName == "LI"){
			str += " " + trimSting(tags[i].textContent);
		}
	}
	console.log('Tags of the shot are :' + str);
	return str;
};

function trimSting(string) {
	return string.replace(/\n/, "").replace(/^\s+|\s+$/g,"");
};





