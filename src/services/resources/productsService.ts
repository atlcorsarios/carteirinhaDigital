import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import type { IProduct } from '@/classes/models/resources/ModelIProduct'

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
            image:
              'https://imgs.search.brave.com/lDiW-1b5kOsYRosEPnXWw06Shr1RFjwCkeiXswevt70/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnNz/dGF0aWMubmV0L3lt/ZndPLnBuZw',
            imageFile: null,
            price: 18,
            active: true,
            category: {
              idCategory: 1,
              description: 'First',
              group: 'PRODUCTS',
              active: true,
            },
            recipe: {
              idRecipe: 1,
              description: 'First recipe',
              preparation:
                '1. Descasque as cenouras e corte-as em rodelas.\n2. Bata no liquidificador com os ovos e o óleo até obter um creme liso.\n3. Em uma tigela separada, misture o açúcar e a farinha de trigo.\n4. Junte a mistura do liquidificador e mexa bem.\n5. Despeje em uma forma untada e asse em forno pré-aquecido a 180°C por 40 minutos.',
              ingredients: [
                {
                  idRecipe: 1,
                  amount: 1,
                  ingredient: {
                    idIngredient: 1,
                    description: 'INGREDIENT 1',
                    measurement: 'KG',
                    stock: 4,
                    category: {
                      idCategory: 1,
                      description: 'INGREDIENTS CATEGORY 1',
                      group: 'INGREDIENTS',
                      active: true,
                    },
                  },
                },
                {
                  idRecipe: 1,
                  amount: 1,
                  ingredient: {
                    idIngredient: 1,
                    description: 'INGREDIENT 1',
                    measurement: 'KG',
                    stock: 4,
                    category: {
                      idCategory: 1,
                      description: 'INGREDIENTS CATEGORY 1',
                      group: 'INGREDIENTS',
                      active: true,
                    },
                  },
                },
              ],
              category: {
                idCategory: 1,
                description: 'RECIPE CATEGORY 1',
                group: 'RECIPES',
                active: true,
              },
              active: true,
            },
          },
        ],
      }

      await new Promise((resolve) => setTimeout(resolve, 2500))
      return mockData
    } catch (error) {
      throw error
    }
  },

  async saveProduct() {},
}
