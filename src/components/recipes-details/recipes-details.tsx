import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipeDetails } from "../../store/slice/recipeDetailsSlice";
import { RootState, AppDispatch } from "../../store/store";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import "./recipes-details.css";

const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const recipe = useSelector((state: RootState) => state.recipeDetails.recipe);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) dispatch(fetchRecipeDetails(id));
  }, [dispatch, id]);

  if (!recipe) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="250"
          image={recipe.thumbnail}
          alt={recipe.name}
        />
        <CardContent>
          <div className="container">
            <div className="typography">
              <Typography variant="h4">{recipe.name}</Typography>
              <Typography variant="h6">Category: {recipe.category}</Typography>
              <Typography variant="h6">From: {recipe.area}</Typography>
            </div>
            <Button variant="contained" onClick={() => navigate("/recipe")}>
              Back
            </Button>
          </div>
          <div className="ingredients">
            {Object.entries(recipe.ingredients).map(([name, amount]) => (
              <Typography key={name} variant="body1">
                {name}: {amount}
              </Typography>
            ))}
          </div>
          <div className="instructions">
            <Typography variant="body1">{recipe.instructions}</Typography>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetails;
