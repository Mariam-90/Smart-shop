const mongoose = require("mongoose");
const Joi = require("joi");
const { Content, contentSchema, contentValidationSchema } = require("./content");

const articleSchema = contentSchema.clone().add({
  imagePath: { type: String } // שדה לתמונת הכתבה
});

const Article = Content.discriminator('Article', articleSchema);

const validate = (data) => {
    return contentValidationSchema.concat(
        Joi.object({
            imagePath: Joi.string().allow('').optional().label("Image Path") // מאפשר נתיב תמונה ריק או לא קיים
        })
    ).validate(data);
};

module.exports = { Article, validate };
