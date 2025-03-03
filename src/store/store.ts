import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../store/slice/recipesSlice";
import recipeDetailsReducer from "../store/slice/recipeDetailsSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetails: recipeDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
