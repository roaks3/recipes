'use strict';

angular.module('bruleeApp.services')

  .service('ingredientService', function (Ingredient) {

    this.getByName = function (name) {
      return _.head(Ingredient.filter({name}));
    };

    this.findAllIngredientsByName = (names) => {
      return Ingredient
        .findAll({
          q: {
            name: {
              '$in': names
            }
          }
        });
    };

    this.findAllIngredientsById = ids => {
      return Ingredient
        .findAll({
          q: {
            _id: {
              $in: _.map(ids, id => ({ $oid: id }))
            }
          }
        });
    };

    return this;

  });
