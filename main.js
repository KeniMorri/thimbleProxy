define(function (require, exports, module) {
	"use strict";

 	var AppInit = brackets.getModule("utils/AppInit");
	var EditorManager = brackets.getModule("editor/EditorManager");
	var PreferencesManager = brackets.getModule("preferences/PreferencesManager");
	var UrlParams = brackets.getModule("utils/UrlParams").UrlParams;

	var fs = appshell.MakeDrive.fs();
	var parentWindow = window.parent;
	var sourceCode;
	var codeMirror;
	var params = new UrlParams();

	var defaultHTML = require("text!default.html");

	// Force entry to if statments on line 262 of brackets.js to create 
	// a new project
	PreferencesManager.setViewState("afterFirstLaunch", false);
	params.remove("skipSampleProjectLoad");

	AppInit.appReady(function() {
		// Once the app has loaded our file,
		// and we can be confident the editor is open,
		// get a reference to it and attach our "onchange"
		// listener to codemirror
		codeMirror = EditorManager.getActiveEditor()._codeMirror;

		parentWindow.postMessage(JSON.stringify({
			type: "bramble:change",
			sourceCode: codeMirror.getValue()
		}), "*");

		codeMirror.on("change", function(e){
			parentWindow.postMessage(JSON.stringify({
				type: "bramble:change",
				sourceCode: codeMirror.getValue()
			}), "*");
		});
	});

	// Eventually, we'll listen for a message from
	// thimble containing the make's initial code.
	// For now, we are defaulting to thimble's starter
	// make.
	exports.initExtension = function() {
		var deferred = new $.Deferred();

		fs.writeFile('/index.html', defaultHTML, function(err) {
			if (err) {
				deferred.reject();
				return;
			}

			deferred.resolve();
		});

		return deferred.promise();
	}
});