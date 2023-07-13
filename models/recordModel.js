const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    mathScore: Number,
    englishScore: Number,
    createdBy: {type: Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true});

module.exports = mongoose.model("Record", recordSchema);