const Backbone = require("backbone");
import "./style.scss";
import Dexie from "dexie";

const App = require("./app");
const helpers = require("./helpers");

helpers.createConstructors();

Backbone.$(function () {
  "use strict";

  App.db = new Dexie("picturesDatabase");
  App.db.version(1).stores({ pictures: "++id, picture, src, _id" });
  App.db.open();

  helpers.createCollectionsModelsAndViews();
  helpers.createButtons();
  helpers.addCollectionListeners();
  helpers.addOnlineListeners();
  helpers.setHandlers();
  Backbone.$(window).on("resize", helpers.setHandlers);
});
