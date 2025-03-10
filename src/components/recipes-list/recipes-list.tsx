import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipes,
  setSearchQuery,
  setSelectedCategory,
  setCurrentPage,
} from "../../store/slice/recipesSlice";
import { RootState, AppDispatch } from "../../store/store";
import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./recipes-list.css";

const RecipesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filteredRecipes,
    searchQuery,
    selectedCategory,
    currentPage,
    itemsPerPage,
  } = useSelector((state: RootState) => state.recipes);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
      .then((res) => res.json())
      .then((data) =>
        setCategories(data.meals.map((meal: any) => meal.strCategory))
      );
  }, []);

  const handlePageChange = (event: any, value: number) => {
    dispatch(setCurrentPage(value));
  };

  return (
    <Container>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        fullWidth
        margin="normal"
      />
      <Select
        value={selectedCategory}
        onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
        fullWidth
      >
        <MenuItem selected value="">
          All category
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap={2}
        mt={2}
      >
        {filteredRecipes
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((recipe) => (
            <Link className="link" to={`/recipeDetails/${recipe.id}`}>
              <Card key={recipe.id}>
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.thumbnail}
                  alt={recipe.name}
                />
                <CardContent>
                  <Typography variant="h6">{recipe.name}</Typography>
                  <Typography variant="body2">
                    {recipe.category} - {recipe.area}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
      </Box>
      <Pagination
        count={Math.ceil(filteredRecipes.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
    </Container>
  );
};

export default RecipesList;
