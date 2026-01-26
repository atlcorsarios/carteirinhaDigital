import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { IIngredient } from "@/classes/models/ModelIProduct";

export const ingredientsServices = {
  async getAllIngredients(offset: number, limit: number): Promise<IHeaderPaginatorModel<IIngredient>> {
    try {
      const mockData: IHeaderPaginatorModel<IIngredient> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
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
        ]
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      return mockData;
    } catch(error) {
      throw error;
    }
  }
}
