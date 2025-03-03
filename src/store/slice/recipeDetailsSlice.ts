import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Recipe {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  area: string;
}

interface RecipeDetails extends Recipe {
  instructions: string;
  ingredients: { [key: string]: string };
}

interface RecipeDetailsState {
  recipe: RecipeDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecipeDetailsState = {
  recipe: null,
  isLoading: false,
  error: null,
};

export const fetchRecipeDetails = createAsyncThunk(
  "recipeDetails/fetchRecipeDetails",
  async (recipeId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
      );
      const data = await response.json();
      if (!data.meals) throw new Error("Recipe not found");

      const meal = data.meals[0];
      const ingredients: { [key: string]: string } = {};
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients[ingredient] = measure?.trim() || "";
        }
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        thumbnail: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        instructions: meal.strInstructions,
        ingredients,
      } as RecipeDetails;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Redux Slice
const recipeDetailsSlice = createSlice({
  name: "recipeDetails",
  initialState,
  reducers: {
    resetRecipe: (state) => {
      state.recipe = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRecipeDetails.fulfilled,
        (state, action: PayloadAction<RecipeDetails>) => {
          state.isLoading = false;
          state.recipe = action.payload;
        }
      )
      .addCase(fetchRecipeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRecipe } = recipeDetailsSlice.actions;
export default recipeDetailsSlice.reducer;
export const selectRecipeDetails = (state: RootState) =>
  state.recipeDetails.recipe;
export const selectRecipeLoading = (state: RootState) =>
  state.recipeDetails.isLoading;
export const selectRecipeError = (state: RootState) =>
  state.recipeDetails.error;
