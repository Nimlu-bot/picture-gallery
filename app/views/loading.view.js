const Backbone = require("backbone");
const _ = require("underscore");

const loadingTemplate = require("./loading.hbs");

const loadingView = {
  template: loadingTemplate,
  el: Backbone.$(".loading"),
  initialize: function () {
    _.bindAll(this, "render");
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  },
};

module.exports = Backbone.View.extend(loadingView);
