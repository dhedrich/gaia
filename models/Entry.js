var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  temp: Number,
  rh: Number
})

var Entry = mongoose.model("Entry", EntrySchema);

module.exports = Entry;