const Backbone = require("backbone");
const _ = require("underscore");
const picturesTemplate = require("./image-list.hbs");
const pictureTemplate = require("./image.hbs");
const menuTemplate = require("./menu.hbs");
const loadingTemplate = require("./loading.hbs");
import "./style.scss";
import Dexie from "dexie";

const titles = ["create", "read", "update", "delete"];

let isItemsInDB = false;

const App = {
  db: {},
  Models: {},
  Collections: {},
  Views: {},
  Pictures: {},
  CurrentPicture: {},
  PicturesView: {},
  PictureView: {},
  MenuView: {},
  loadingView: {},
};

Backbone.sync = function (method, model, options) {
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
      App.db[options.dbCollection].delete(model.id);
      break;
  }
};

App.Models.Picture = Backbone.Model.extend({
  defaults: {
    id: "",
    picture: "",
    src: "",
  },
  initialize: function () {
    return this;
  },
});

App.Models.Button = Backbone.Model.extend({
  defaults: {
    title: "",
    id: 1,
  },
  initialize: function () {
    return this;
  },
});

App.Collections.Pictures = Backbone.Collection.extend({
  model: App.Models.Picture,
});

App.Collections.Menu = Backbone.Collection.extend({
  model: App.Models.Button,
});

App.Views.Pictures = Backbone.View.extend({
  template: picturesTemplate,
  el: Backbone.$(".image-list"),

  initialize: function () {
    _.bindAll(this, "render");
  },

  render: function () {
    this.$el.html(this.template({ items: App.Pictures.toJSON() }));

    return this;
  },

  events: function () {
    return {
      "click .preview": "showPicture",
    };
  },

  showPicture: function (e) {
    showPicture(+e.target.getAttribute("data-id"));
  },
});

App.Views.Picture = Backbone.View.extend({
  template: pictureTemplate,
  el: Backbone.$(".image"),
  initialize: function () {
    _.bindAll(this, "render");
  },
  render: function () {
    this.$el.html(this.template(App.CurrentPicture.toJSON()));
    return this;
  },
});

App.Views.Button = Backbone.View.extend({
  template: menuTemplate,
  $container: null,
  initialize: function (options) {
    _.bindAll(this, "render");
    this.$container = options.$container;
    this.insert();
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  insert: function () {
    this.$container.append(this.$el);
  },
  events: function () {
    return {
      "click .create": "onCreate",
      "click .read": "onRead",
      "click .update": "onUpdate",
      "click .delete": "onDelete",
    };
  },
  onCreate: function (id = undefined) {
    const image = Backbone.$("#image").get(0).files[0];
    if (!image) return;
    var FR = new FileReader();
    FR.addEventListener("load", function (e) {
      App.Pictures.add(
        { src: e.target.result, picture: image.name, id: id },
        { merge: true }
      );
      showPicture(id);
    });
    FR.readAsDataURL(image);
  },
  onDelete: function () {
    if (!App.CurrentPicture) return;
    App.Pictures.remove(App.CurrentPicture);
    App.CurrentPicture.clear();
    App.PictureView.render();
  },
  onUpdate: function () {
    if (!App.CurrentPicture) return;
    const id = App.CurrentPicture.attributes.id;
    this.onCreate(id);
  },
});

App.Views.Loading = Backbone.View.extend({
  template: loadingTemplate,
  el: Backbone.$(".loading"),
  initialize: function () {
    _.bindAll(this, "render", "destroy");
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
  destroy: function () {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    Backbone.View.prototype.remove.call(this);
  },
});

function showPicture(id) {
  if (!id) return;
  App.CurrentPicture = App.Pictures.findWhere({
    id: id,
  });
  App.PictureView.render();
}

Backbone.$(function () {
  "use strict";

  App.db = new Dexie("picturesDatabase");
  App.db.version(1).stores({ pictures: "++id, picture, src" });
  App.db.open();
  App.Pictures = new App.Collections.Pictures();
  App.CurrentPicture = new App.Models.Picture();
  App.db.pictures
    .each(function (picture) {
      App.Pictures.add({
        id: picture.id,
        picture: picture.picture,
        src: picture.src,
      });
    })
    .then(function () {
      new Array(4).fill(null).forEach((_, index) => {
        const button = new App.Models.Button({
          title: titles[index],
          id: index,
        });
        new App.Views.Button({
          model: button,
          $container: Backbone.$(".menu"),
        }).render();
      });

      App.PicturesView = new App.Views.Pictures();
      App.PicturesView.render();

      App.PictureView = new App.Views.Picture();
      App.PictureView.render();

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

      if (App.Pictures.length === 0) {
        App.Pictures.add([
          {
            picture: "p1",
          },
        ]);
      }
    });

  setInterval(() => {
    App.db.pictures.count().then((count) => {
      if (count) {
        isItemsInDB = true;
        App.loadingView = new App.Views.Loading();
        App.loadingView.render();
      } else {
        isItemsInDB = false;
        App.loadingView.destroy();
      }
    });
  }, 1000);
});
