const Backbone = require("backbone");

const pictureModel = {
  idAttribute: "_id",
  defaults: {
    id: "",
    picture: "",
    src: "",
    _id: "",
  },
  initialize: function () {
    return this;
  },
};

module.exports = Backbone.Model.extend(pictureModel);
