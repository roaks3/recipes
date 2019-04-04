import angular from 'angular';

import categoryService from '../../scripts/services/categoryService';
import ingredientTypeahead from '../ingredientTypeahead/ingredientTypeahead';
import categorySelect from '../categorySelect/categorySelect';

import template from './newRecipeIngredientInput.html';

class NewRecipeIngredientInputCtrl {

  constructor (categoryService) {
    'ngInject';

    this.categoryService = categoryService;
  }

  isNewIngredient () {
    return !this.ingredient.id;
  }

  changeIngredient (ingredient) {
    this.onIngredientChange({ingredient: ingredient});
    this.onCategoryChange({category: this.categoryService.get(ingredient.category_id)});
  }

}

export default angular
  .module('components.newRecipeIngredientInput', [
    categoryService,
    ingredientTypeahead,
    categorySelect
  ])
  .component('newRecipeIngredientInput', {
    template,
    bindings: {
      ingredient: '<',
      amount: '<',
      unit: '<',
      category: '<',
      onRemove: '&',
      onIngredientChange: '&',
      onAmountChange: '&',
      onUnitChange: '&',
      onCategoryChange: '&'
    },
    controller: NewRecipeIngredientInputCtrl,
    controllerAs: 'vm'
  })
  .name;
