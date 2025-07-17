const mongoose = require("mongoose");
const Joi = require("joi");
const { Content, contentSchema, contentValidationSchema } = require("./content");

const recipeSchema = contentSchema.clone().add({
  products: { type: String, required: true },
  imagePath: { type: String } // שדה לתמונת המתכון
});

const Recipe = Content.discriminator('Recipe', recipeSchema);

const validate = (data) => {
  return contentValidationSchema.concat(
    Joi.object({
      products: Joi.string().required().label("Products"),
      imagePath: Joi.string().allow('').optional().label("Image Path") // מאפשר נתיב תמונה ריק או לא קיים
    })
  ).validate(data);
};

module.exports = { Recipe, validate };
