
var Ingredient = (function() {

	var Ingredient = function(item, amount) {
		this._item = item;
		this._amount = amount;
	};

	Ingredient.parse = function(text) {
		if (text == null) {
			return null;
		}

		text = text.trim();
		if (text == "") {
			return null;
		}

		var amount = "" + text.match(/^\d[\/\d]*/);
		if (amount == null) {
			amount = "1";
		}

		var item = text.substr(amount.length);
		item = item.trim();

		return new Ingredient(item, amount);
	};

	return Ingredient;

} ());

var Ingredients = (function() {

	var Ingredients = function() {
		this._ingredients = [];
	};

	Ingredients.parse = function(text) {
		if (text == null) {
			return null;
		}

		var ingredients = new Ingredients();
		var unparsedIngredients = text.split("\n");
		for (var i = 0; i < unparsedIngredients.length; i++) {
			var ingredient = Ingredient.parse(unparsedIngredients[i]);
			ingredients.add(ingredient);
		}

		return ingredients;
	};

	Ingredients.prototype.size = function() {
		return this._ingredients.length;
	}

	Ingredients.prototype.get = function(index) {
		return this._ingredients[index];
	}

	Ingredients.prototype.add = function(ingredient) {
		if (ingredient == null) {
			return;
		}

		this._ingredients.push(ingredient);
	};

	Ingredients.prototype.combine = function(ingredient) {
		if (ingredient == null) {
			return;
		}

		var item = ingredient._item;
		var amount = ingredient._amount;

		for (var i = 0; i < this._ingredients.length; i++) {
			var existingIngredient = this._ingredients[i];
			if (existingIngredient._item == item) {
				existingIngredient._amount = existingIngredient._amount + " + " + amount;
				//existingIngredient._amount = Ratio.parse(existingIngredient._amount).add(amount).simplify().toLocaleString();
				return;
			}
		}

		// Ingredient does not exist yet
		this._ingredients.push(ingredient);
	};

	Ingredients.prototype.addAll = function(ingredients) {
		for (var i = 0; i < ingredients._ingredients.length; i++) {
			var ingredient = ingredients._ingredients[i];
			this.add(ingredient);
		}
	};

	Ingredients.prototype.combineAll = function(ingredients) {
		for (var i = 0; i < ingredients._ingredients.length; i++) {
			var ingredient = ingredients._ingredients[i];
			this.combine(ingredient);
		}
	};

	return Ingredients;

} ());
