const Dao = require("./dao.js");

module.exports = class PersonDao extends Dao {
  getAll(callback) {
    super.query("select name, age, address from person", [], callback);
  }

  getPerson(id, callback) {
    super.query(
      "select name, age, address from person where id = ?",
      [id],
      callback
    );
  }

  createPerson(json, callback) {
    super.query(
      "insert into person (name, age, address) values (?, ?, ?)",
      [json.navn, json.adresse, json.alder],
      callback
    );
  }
};
