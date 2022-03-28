const Backbone = require("backbone");
const _ = require("underscore");

const pictureTemplate = require("./picture.hbs");
const App = require("../app");

const pictureView = {
  template: pictureTemplate,
  el: Backbone.$(".image"),
  initialize: function () {
    _.bindAll(this, "render");
  },
  render: function () {
    this.$el.html(this.template(App.CurrentPicture.toJSON()));
    return this;
  },
};

module.exports = Backbone.View.extend(pictureView);
