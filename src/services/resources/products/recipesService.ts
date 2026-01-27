import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { IRecipe } from "@/classes/models/ModelIProduct";

export const recipesServices = {
  async getAllRecipes(offset: number, limit: number): Promise<IHeaderPaginatorModel<IRecipe>> {
    try {
      const mockData: IHeaderPaginatorModel<IRecipe> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idRecipe: 1,
            description: 'RECEITA',
            preparation: 'PASSO 1, PASSO 2',
            ingredients: [
              {
                idRecipe: 1,
                amount: 10,
                ingredient: {
                  idIngredient: 1,
                  description: 'INGREDIENTE',
                  measurement: 'KG',
                  stock: 4,
                  category: {
                    idCategory: 1,
                    description: 'CATEGORIA DE INGREDIENTE',
                    group: 'INGREDIENTS',
                    active: true
                  }
                }
              }
            ],
            category: {
              idCategory: 1,
              description: 'CATEGORIA DE RECEITA',
              group: 'RECIPES',
              active: true
            },
            active: true
          }
        ]
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      return mockData;
    } catch(error) {
      throw error;
    }
  },

  async saveRecipe() {

  }
}
