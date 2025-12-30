const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const DescriptionSchema = new mongoose.Schema({
        description:String
});

const DescriptionModel = model('Description', DescriptionSchema);

module.exports = DescriptionModel;