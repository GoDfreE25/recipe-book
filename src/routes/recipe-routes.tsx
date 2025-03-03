import { Route, Routes } from "react-router-dom";
import { Paths } from "./route-names";
import RecipesList from "components/recipes-list/recipes-list";
import RecipeDetails from "components/recipes-details/recipes-details";

export const RecipeRoutes = () => {
  return (
    <Routes>
      <Route path={Paths.Recipe} element={<RecipesList />} />
      <Route path={Paths.RecipeDetails} element={<RecipeDetails />} />
      <Route path="*" element={<RecipesList />} />
    </Routes>
  );
};
