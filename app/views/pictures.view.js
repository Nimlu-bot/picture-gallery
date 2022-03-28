const Backbone = require("backbone");
const _ = require("underscore");

const picturesTemplate = require("./pictures.hbs");
const App = require("../app");

const picturesView = {
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
      "click .row": "showPicture",
    };
  },

  showPicture: function (e) {
    const id = e.target.getAttribute("data-id");
    if (!id) return;
    App.CurrentPicture = _.clone(
      App.Pictures.findWhere({
        _id: id,
      })
    );
    App.PictureView.render();
  },
};

module.exports = Backbone.View.extend(picturesView);
