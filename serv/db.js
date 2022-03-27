const dataBase = {
  db: [],
  addItem: function (item) {
    if (!this.db.includes(item)) this.db.push(item);
    return item;
  },
  deleteItem: function (id) {
    this.db = this.db.filter((el) => el._id !== id);
    return this.db;
  },
  replaceItem: function (item) {
    this.db = this.db.map((el) => (el._id === item._id ? item : el));
    return item;
  },
  showItems: function () {
    return this.db;
  },
  replaceItems: function (items) {
    this.db = items;
    return this.db;
  },
};

module.exports = dataBase;
