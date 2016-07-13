var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
pageMod.PageMod({
  include: "*.hbonow.com",
  contentScriptFile: data.url("bundle.js"),
  contentStyleFile: data.url("content.css")
});
