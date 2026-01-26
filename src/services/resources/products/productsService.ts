import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { IProduct } from "@/classes/models/ModelIProduct";

export const productsServices = {
  async getAllProducts(offset: number, limit: number): Promise<IHeaderPaginatorModel<IProduct>> {
    try {
      const mockData: IHeaderPaginatorModel<IProduct> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idProduct: 1,
            description: 'First',
            image: 'https://imgs.search.brave.com/lDiW-1b5kOsYRosEPnXWw06Shr1RFjwCkeiXswevt70/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNz/dGF0aWMubmV0L3lt/ZndPLnBuZw',
            imageFile: null,
            price: 18,
            active: true,
            category: {
              idCategory: 1,
              description: 'First',
              group: 'PRODUCTS',
              active: true
            },
            recipe: {
              idRecipe: 1,
              description: 'First recipe',
              ingredients: [
                {
                  amount: 1,
                  ingredient: {
                    idIngredient: 1,
                    description: '',
                    measurement: 'KG',
                    stock: 4,
                    category: {
                      idCategory: 1,
                      description: '',
                      group: 'INGREDIENTS',
                      active: true
                    }
                  }
                }
              ],
              category: {
                idCategory: 1,
                description: '',
                group: 'RECIPES',
                active: true
              },
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
