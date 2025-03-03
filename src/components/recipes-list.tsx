import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../src/store/store";
import { fetchRecipes } from "store/slice/recipesSlice";

const RecipesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recipes = useSelector((state: RootState) => state.recipes.filteredRecipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.name}</h3>
          <img src={recipe.thumbnail} alt={recipe.name} />
        </div>
      ))}
    </div>
  );
};

export default RecipesList;
