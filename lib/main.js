const {Cc, Ci} = require("chrome");
var contextMenu = require("sdk/context-menu");
var data = require("sdk/self").data;

function runcmd (cmd, args) {
	var execFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);

	execFile.initWithPath(cmd);

	if (execFile.exists()) {
		process.init(execFile);
		process.run(true, args, args.length);
	}
}

var linkScript = 'self.on("click", function (node) { self.postMessage(node.href); });'
var selectScript = 'self.on("click", function () {' +
	'var text = window.getSelection().toString();' +
	'self.postMessage(node.href); });'

var menuType = {
	LINK : {type: contextMenu.SelectorContext("a[href]"), script: linkScript},
  SELECT : {type: contextMenu.SelectionContext(), script: selectScript}
};

function addItem (menu, name, func) {
  var mi = contextMenu.Item({
    label: name,
    context: menu.type,
    contentScript: menu.script,
    onMessage: function (selectionText) {
	  func(selectionText);
    },
  });
  return mi;
}

function addPanel (menu, name, func) {
	var text_entry = require("sdk/panel").Panel({
		width: 590,
		height: 40,
		contentURL: data.url("text-entry.html"),
		contentScriptFile: data.url("get-text.js")
	});
	var item = addItem(menu, name, function (selectionText) {
		text_entry.port.emit("value", selectionText);
		text_entry.show();
	});

	text_entry.on("show", function() {
	  text_entry.port.emit("show");
	});

	text_entry.port.on("text-entered", function (text) {
	  func(text);
	  text_entry.hide();
	});
}

// ugly hack, should really look for " and '
function getArgs(str) {
	var ar = str.split(" "); 
	var head = ar.shift();
	return [head, ar.join(" ")];
}

var addlink = addPanel(menuType.LINK, "addlink", function (selectionText) {
	runcmd('/home/dagle/bin/addlink', getArgs(selectionText));});
var plumb = addItem(menuType.SELECT, "plumb", function (selectionText) {
	runcmd('/home/dagle/lib/plan9/bin/plumb', [selectionText]);});
