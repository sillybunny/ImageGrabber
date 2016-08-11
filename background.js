// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var grabberMode = "";


// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'dribbble.com/shots/' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'dribbble.com/search' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

/*
chrome.pageAction.onClicked.addListener(function(tab) {
  console.log('onClicked');
	chrome.tabs.executeScript(tab[0], {file: "myscript.js"});
});
*/


chrome.pageAction.onClicked.addListener(function(tab) {
  var tabId = tab.id;
  //console.log(tab.url);
  if (tab.url.match('dribbble.com/shots')){
    grabberMode = "DribbbleShots";

  } else if (tab.url.match('dribbble.com/search')){
    grabberMode = "DribbbleSearch";
  }
  console.log(grabberMode + " on click");
  chrome.tabs.executeScript(tabId, { file: "content-script.js"});
});

chrome.runtime.onMessage.addListener(function(msg) {
    console.log(grabberMode + " on msg");
    switch(grabberMode)
    {
    case "DribbbleShots":

      //var n_match  = ntc.name("#6195ED");
      //console.log(n_match[0] + n_match[1]);

      grabSingleShots(msg);
      break;
    case "DribbbleSearch":
      grabMultiShots(msg);

      break;
    default:
      console.log("grabberMode is empty");
    }
    
});


function grabSingleShots(msg) {
  chrome.downloads.download({url: msg.url, filename: msg.filename});
};

function grabMultiShots (msg) {
  console.log(msg);
  var c = 0;
  while (msg[c]){
    chrome.downloads.download( msg[c] );
    console.log(msg[c]);
    c++;
  }
};



