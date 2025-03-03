import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipeDetails } from "../store/slice/recipeDetailsSlice";
import { RootState, AppDispatch } from "..//store/store";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const recipe = useSelector((state: RootState) => state.recipeDetails.recipe);

  useEffect(() => {
    if (id) dispatch(fetchRecipeDetails(id));
  }, [dispatch, id]);

  if (!recipe) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={recipe.thumbnail}
          alt={recipe.name}
        />
        <CardContent>
          <Typography variant="h4">{recipe.name}</Typography>
          <Typography variant="h6">Category: {recipe.category}</Typography>
          <Typography variant="h6">From: {recipe.area}</Typography>
          <Typography variant="body1">{recipe.instructions}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetails;
