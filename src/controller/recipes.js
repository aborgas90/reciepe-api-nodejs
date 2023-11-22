const service = require("../services/recipes");

const getAll = async (req, res, next) => {
  try {
    res.json({ data: await service.getAll() });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
    try {
        res.json({data: res.locals.recipe})
    } catch (error) {
        next(error);
    }
}

const save = async (req, res, next) => {
  try {
    // Extract only the data that is needed from the request body
    const {
      name,
      healthLabels,
      cookTimeMinutes,
      prepTimeMinutes,
      ingredients,
    } = req.body;

    // Format the new recipe you want to save to the database
    const newRecipe = {
      name,
      healthLabels: [...healthLabels], // make a copy of the `healthLabels` array to store in the db
      cookTimeMinutes,
      prepTimeMinutes,
      ingredients: [...ingredients], // make a copy of the `ingredients` array to store in the db
    };

    // Respond with a 201 Created status code along with the newly created recipe
    res.status(201).json({ data: await service.save(newRecipe) });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
    try {
        const recipe = await service.get(req.params.id);

        if(recipe === undefined) {
            const err = new Error("Recipe not found")
            err.statusCode = 404;
            throw err;
        }

        const {
            name,
            healthLabels,
            cookTimeMinutes,
            prepTimeMinutes,
            ingredients,
        } = req.body

        const updated = await service.update(req.params.id, {
            name,
            healthLabels: [...healthLabels],
            cookTimeMinutes,
            prepTimeMinutes,
            ingredients: [...ingredients],
        });

        res.json({data : update});
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const recipe = await service.get(req.params.id)

        if(recipe === undefined) {
            const err = new Error("Recipe not found")
            err.statusCode = 404;
            throw err;
        }

        await service.remove(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

const recipeExists = async (req, res, next) => {
  const recipe = await service.get(req.params.id);

  if (recipe === undefined) {
    const err = new Error("Recipe not found");
    err.statusCode = 404;
    next(err);
  }else{
    res.locals.recipe = recipe
    next();
  }
}

module.exports = {
  getAll,
  get: [recipeExists, get],
  save,
  update: [recipeExists, update],
  remove: [recipeExists, remove],
};