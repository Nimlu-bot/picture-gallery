const dataBase = {
  db: [
    {
      picture: "p1",
      id: "1",
      src: "",
    },
    {
      picture: "p2",
      id: "2",
      src: "",
    },
    {
      picture: "p3",
      id: "3",
      src: "",
    },
    {
      picture: "p4",
      id: "4",
      src: "",
    },
  ],
  addItem: function (item) {
    this.db.push(item);
    return item;
  },
  deleteItem: function (id) {
    this.db = this.db.filter((el) => el.id !== id);
    return this.db;
  },
  replaceItem: function (item) {
    this.db = this.db.map((el) => (el.id === item.id ? item : el));
    return item;
  },
  showItems: function () {
    return this.db;
  },
};

module.exports = dataBase;
