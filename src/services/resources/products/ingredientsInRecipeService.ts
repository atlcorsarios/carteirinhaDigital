import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { IIngredientsInRecipe } from "@/classes/models/ModelIProduct";

export const ingredientsInRecipeServices = {
  async getAllUsers(offset: number, limit: number): Promise<IHeaderPaginatorModel<IIngredientsInRecipe>> {
    try {
      const mockData: IHeaderPaginatorModel<IIngredientsInRecipe> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idRecipe: 1,
            amount: 10,
            ingredient: {
              idIngredient: 1,
              description: 'First',
              measurement: 'g',
              stock: 20,
              category: {
                idCategory: 1,
                description: '',
                group: 'PRODUCTS',
                active: true
              }
            }
          }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 2500));

      return mockData;
    } catch (error) {
      throw error
    }
  }
}
