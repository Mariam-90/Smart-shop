const mongoose = require("mongoose");
const Joi = require("joi");

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    heartCount: { type: Number, default: 0 },
    tzunaiName: { type: String, required: true },
    PictureUrl: { type: String, required: false },
}, { discriminatorKey: 'type' });

const contentValidationSchema = Joi.object({
    title: Joi.string()
        .required()
        .label("Title"),
    text: Joi.string()
        .required()
        .label("Text"),
    heartCount: Joi.number()
        .label("Heart Count"),
    tzunaiName: Joi.string()
        .required()
        .label("Tzunai Name"),
});


const Content = mongoose.model('Content', contentSchema);

module.exports = { Content, contentSchema, contentValidationSchema };