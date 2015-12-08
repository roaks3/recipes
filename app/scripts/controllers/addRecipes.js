
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, categoryService, ingredientService, recipesService) {
    $scope.recipe = new Recipe('', null, '');
    $scope.isParsed = false;
    $scope.isSaved = false;
    $scope.isNameInvalid = false;

    $scope.categoryMap = {};
    $scope.items = [];
    $scope.categoryNames = [];
    $scope.categories = [];

    $q.all([
      categoryService.categories(),
      ingredientService.ingredients()
    ])
      .then(function (data) {
        var categories = data[0];
        var ingredients = data[1];

        var ingredientsById = _.indexBy(ingredients, 'id');

        $scope.categories = _.map(categories, function (category) {
          return {
            id: category.id,
            name: category.name,
            order: category.order,
            items: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId].name;
            }),
            ingredients: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId];
            })
          };
        });

        $scope.categoryNames = categories.map(function (category) {
          return category.name;
        });

        _.each($scope.categories, function (category) {
          _.each(category.ingredients, function (ingredient) {
            $scope.categoryMap[ingredient.name] = category.name;
            $scope.items.push(ingredient.name);
          });
        });
      });

    // NOTE: With current implementation, first category wins
    $scope.addIngredientToCategory = function (ingredient, categoryName) {
      var category = _.find($scope.categories, 'name', categoryName);
      category.ingredients.push(ingredient);
      $scope.categoryMap[ingredient.name] = categoryName;
      $scope.items.push(ingredient.name);
    };

    $scope.addRecipe = function() {
      // Make sure there is a recipe name present
      if (!$scope.recipe.name) {
        $scope.isNameInvalid = true;
        return;
      }

      // Add ingredients to categories by name
      _.each($scope.recipe.recipe_ingredients, function (recipe_ingredient) {
        if (recipe_ingredient.selectedCategory && !$scope.isCategorized(recipe_ingredient)) {
          $scope.addIngredientToCategory(recipe_ingredient.ingredient, recipe_ingredient.selectedCategory);
        }
      });

      // Add all new ingredients
      $q.all(_.map($scope.recipe.recipe_ingredients, function (recipeIngredient) {
        return ingredientService.ingredientCreate(recipeIngredient.ingredient);
      }))
        .then(function (data) {
          _.each(data, function (id, index) {
            _.assign($scope.recipe.recipe_ingredients[index].ingredient, {
              id: id
            });
          });

          return categoryService.categoryUpdateBulk(_.map($scope.categories, function (category) {
            return {
              id: category.id,
              ingredient_ids: _(category.ingredients).pluck('id').uniq().value()
            };
          }));
        })
        .then(function () {
          return recipesService.recipeCreate($scope.recipe)
            .then(function () {
              $scope.isSaved = true;
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.parseRecipeText = function() {
      $scope.recipe.recipe_ingredients = Ingredients.parse($scope.recipe.originalText);
      $scope.isParsed = true;
    };

    $scope.removeIngredient = function (index) {
      $scope.recipe.recipe_ingredients.splice(index, 1);
    };

    $scope.getCategory = function (recipe_ingredient) {
      if (recipe_ingredient && recipe_ingredient.ingredient) {
        var item = $scope.categoryMap[recipe_ingredient.ingredient.name];
        if (item) {
          return $scope.categoryMap[recipe_ingredient.ingredient.name];
        }
      }
      return 'None';
    };

    $scope.isCategorized = function (recipe_ingredient) {
      if (recipe_ingredient && recipe_ingredient.ingredient) {
        var item = $scope.categoryMap[recipe_ingredient.ingredient.name];
        if (item) {
          return true;
        }
      }
      return false;
    };

    $scope.setSelectedCategory = function (recipe_ingredient, category) {
      recipe_ingredient.selectedCategory = category;
    };
  });
