import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Recipe {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  area: string;
}

interface RecipesState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
  status: "idle" | "loading" | "failed";
}

const initialState: RecipesState = {
  recipes: [],
  filteredRecipes: [],
  searchQuery: "",
  selectedCategory: "",
  currentPage: 1,
  itemsPerPage: 10,
  status: "idle",
};

export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async () => {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  const data = await response.json();
  return data.meals.map((meal: any) => ({
    id: meal.idMeal,
    name: meal.strMeal,
    thumbnail: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
  }));
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      recipesSlice.caseReducers.applyFilters(state);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      recipesSlice.caseReducers.applyFilters(state);
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    applyFilters: (state) => {
      let filtered = state.recipes;
      if (state.searchQuery) {
        filtered = filtered.filter((recipe) =>
          recipe.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      if (state.selectedCategory) {
        filtered = filtered.filter((recipe) => recipe.category === state.selectedCategory);
      }
      state.filteredRecipes = filtered;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "idle";
        state.recipes = action.payload;
        recipesSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchRecipes.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setSearchQuery, setSelectedCategory, setCurrentPage } = recipesSlice.actions;
export default recipesSlice.reducer;
