const Backbone = require("backbone");
const _ = require("underscore");

const menuTemplate = require("./menu.hbs");
const App = require("../app");
const { v4: uuid } = require("uuid");

const menuView = {
  template: menuTemplate,
  el: Backbone.$(".menu"),
  initialize: function () {
    _.bindAll(this, "render");
  },
  render: function () {
    this.$el.html(this.template({ items: App.Menu.toJSON() }));
    return this;
  },
  events: function () {
    return {
      "click .create": "onCreate",
      "click .read": "onRead",
      "click .update": "onUpdate",
      "click .delete": "onDelete",
    };
  },
  onCreate: function (event, id) {
    const image = Backbone.$("#image").get(0).files[0];
    if (!image) return;
    var FR = new FileReader();
    id = id || uuid();
    FR.addEventListener("load", function (e) {
      App.Pictures.add(
        { src: e.target.result, picture: image.name, _id: id },
        { merge: true }
      );

      App.CurrentPicture = _.clone(
        App.Pictures.findWhere({
          _id: id,
        })
      );
      App.PictureView.render();
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
    const id = App.CurrentPicture.attributes._id;
    this.onCreate(null, id);
  },
  onRead: function () {
    App.CurrentPicture.clear({ silent: true });
    App.PictureView.render();
    App.Pictures.fetch();
  },
};

module.exports = Backbone.View.extend(menuView);
