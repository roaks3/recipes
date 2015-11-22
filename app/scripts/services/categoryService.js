'use strict';

angular.module('bruleeApp.services')

  .service('categoryService', function ($q, bruleeDataService) {

    this.categories = function() {
      return bruleeDataService.search({
        index: 'ashlea2',
        type: 'category',
        size: 500,
        body: {
          query: {
            match_all: {}
          }
        }
      })
        .then(function (data) {
          return _.map(data.hits.hits, function (hit) {
            return _.assign(hit._source, {
              id: hit._id
            });
          });
        });
    };

    this.categoryCreate = function (category) {
      return bruleeDataService.create({
        index: 'ashlea',
        type: 'category',
        body: category
      })
        .then(function (data) {
          return data._id;
        });
    };

    this.categoryUpdate = function (category) {
      return bruleeDataService.update({
        index: 'ashlea',
        type: 'category',
        id: category.id,
        body: {
          doc: {
            items: category.items
          }
        }
      });
    };

    this.categoryBulkUpdate = function (categories) {
      var scope = this;
      return $q.all(
        _.map(categories, function (category) {
          return scope.categoryUpdate(category);
        })
      );
    };

    this.categoryDelete = function (categoryId) {
      return bruleeDataService.delete({
        index: 'ashlea',
        type: 'category',
        id: categoryId
      });
    };

    return this;

  });
