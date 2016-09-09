/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");

	var query = loaderUtils.parseQuery(this.query);
	var configKey = query.config || "fileLoader";
	var options = this.options[configKey] || {};

	var config = {
		publicPath: false,
		name: "[hash].[ext]"
	};

	// options takes precedence over config
	Object.keys(options).forEach(function(attr) {
		config[attr] = options[attr];
	});

	// query takes precedence over config and options
	Object.keys(query).forEach(function(attr) {
		config[attr] = query[attr];
	});

	var url = loaderUtils.interpolateName(this, config.name, {
		context: config.context || this.options.context,
		content: content,
		regExp: config.regExp
	});

	var publicPath = "__webpack_public_path__ + " + JSON.stringify(url);

	if (config.publicPath) {
		if (typeof config.publicPath === "string") {
			publicPath = JSON.stringify(loaderUtils.interpolateName(this, query.publicPath, {
				context: config.context || this.options.context,
				content: content,
				regExp: config.regExp
			}));
		} else if (typeof config.publicPath === "function") {
			publicPath = JSON.stringify(config.publicPath(url))
		}
	}

	if (query.emitFile === undefined || query.emitFile) {
		this.emitFile(url, content);
	}

	return "module.exports = " + publicPath + ";";
};

module.exports.raw = true;
