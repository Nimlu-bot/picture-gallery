const Backbone = require("backbone");
const _ = require("underscore");
const { v4: uuid } = require("uuid");

const App = require("./app");
const pictureModel = require("./models/picture.model");
const currentPictureModel = require("./models/current-picture.model");
const buttonModel = require("./models/button.model");
const picturesView = require("./views/pictures.view");
const pictureView = require("./views/picture.view");
const buttonView = require("./views/button.view");
const loadingView = require("./views/loading.view");

function listClickHandler() {
  Backbone.$(".image-wrapper").show();
}

function imageClickHandler() {
  Backbone.$(".image-wrapper").hide();
}

let isClickAttached = false;
const originalSync = Backbone.sync;
const titles = ["create", "read", "update", "delete"];
const helpers = {
  customSync: function (method, model, options) {
    switch (method) {
      case "create":
        App.db[options.dbCollection]
          .add(_.omit(model.attributes, "id"))
          .then(function (key) {
            model.set("id", key);
          });
        break;
      case "update":
        App.db[options.dbCollection].update(
          model.get("id"),
          _.omit(model.attributes, "id")
        );
        break;
      case "delete":
        App.db[options.dbCollection].where("_id").equals(model.id).delete();
        break;
      case "read":
        App.db.pictures.each(function (picture) {
          model.add({
            _id: picture._id,
            picture: picture.picture,
            src: picture.src,
          });
        });
        break;
    }
    App.db.pictures.count().then((count) => {
      const loader = document.querySelector(".loading__image");
      if (count) {
        Backbone.$(loader).css("opacity", 1);
      } else {
        Backbone.$(loader).css("opacity", 0);
      }
    });
  },
  setHandlers: function () {
    if (Backbone.$(window).width() < 600) {
      if (isClickAttached) return;
      isClickAttached = true;
      Backbone.$(".image-wrapper").hide();
      Backbone.$(".image-list").on("click", listClickHandler);
      Backbone.$(".image").on("click", imageClickHandler);
    } else {
      if (isClickAttached) {
        Backbone.$(".image-list").off("click", listClickHandler);
        Backbone.$(".image").off("click", imageClickHandler);
      }
      isClickAttached = false;
      Backbone.$(".image-wrapper").show();
    }
  },
  addCollectionListeners: function () {
    App.Pictures.on({
      add: function (model) {
        model.sync("create", model, { dbCollection: "pictures" });
        App.PicturesView.render();
      },
      remove: function (model) {
        model.sync("delete", model, { dbCollection: "pictures" });
        App.PicturesView.render();
      },
      change: function (model) {
        model.sync("update", model, { dbCollection: "pictures" });
        App.PicturesView.render();
      },
    });
  },
  addOnlineListeners: function () {
    const loader = document.querySelector(".loading__image");
    const customSync = this.customSync;
    window.addEventListener("offline", function (e) {
      Backbone.sync = customSync;
    });

    window.addEventListener("online", async function (e) {
      Backbone.sync = originalSync;
      const count = await App.db.pictures.count();

      if (count) {
        await App.db.pictures.each(function (picture) {
          App.Pictures.add({
            _id: uuid(),
            picture: picture.picture,
            src: picture.src,
          });
        });
        await App.db.pictures.clear();
      }
      App.Pictures.fetch();

      Backbone.$(loader).css("opacity", 0);
    });
  },
  createButtons: function () {
    new Array(4).fill(null).forEach((element, index) => {
      const button = new App.Models.Button({
        title: titles[index],
        id: index,
      });
      new App.Views.Button({
        model: button,
        $container: Backbone.$(".menu"),
      }).render();
    });
  },
  createCollectionsModelsAndViews: function () {
    App.Pictures = new App.Collections.Pictures();
    App.CurrentPicture = new App.Models.CurrentPicture();

    App.PicturesView = new App.Views.Pictures();
    App.PicturesView.render();

    App.PictureView = new App.Views.Picture();
    App.PictureView.render();

    App.loadingView = new App.Views.Loading();
    App.loadingView.render();
  },
  createConstructors: function () {
    App.Models.Picture = pictureModel;
    App.Models.CurrentPicture = currentPictureModel;
    App.Models.Button = buttonModel;

    App.Collections.Pictures = Backbone.Collection.extend({
      url: "/pictures",
      model: App.Models.Picture,
    });
    App.Collections.Menu = Backbone.Collection.extend({
      model: App.Models.Button,
    });

    App.Views.Pictures = picturesView;
    App.Views.Picture = pictureView;
    App.Views.Button = buttonView;
    App.Views.Loading = loadingView;
  },
};

module.exports = helpers;
