const Backbone = require("backbone");

const buttonModel = {
  defaults: {
    title: "",
    id: "",
  },
  initialize: function () {
    return this;
  },
};

module.exports = Backbone.Model.extend(buttonModel);
