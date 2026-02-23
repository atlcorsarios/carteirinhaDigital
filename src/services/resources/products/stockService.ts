import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { IStock } from "@/classes/models/ModelIStock";

export const stockServices = {
  async getAllStock(offset: number, limit: number, typeItem: 'INGREDIENT' | 'PRODUCT' = 'INGREDIENT'): Promise<IHeaderPaginatorModel<IStock>> {
    try {
      const mockData: IHeaderPaginatorModel<IStock> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idStock: 1,
            category: {
              idCategory: 1,
              description: 'CATEGORIA DO INGREDIENTE',
              group: 'INGREDIENTS',
              active: true
            },
            description: 'INGREDIENTE',
            measurement: 'G',
            amount: 10
          }
        ]
      }

      await new Promise(resolve => setTimeout(resolve, 2500));
      return mockData;
    } catch (error) {
      throw error;
    }
  },

  async saveStock() {

  }
}
