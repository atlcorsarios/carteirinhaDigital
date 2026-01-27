import type { IHeaderPaginatorModel } from "@/classes/models/ModelHeaderPaginator";
import type { ICategory } from "@/classes/models/ModelIProduct";

export const categoriesServices = {
  async getAllCategories(offset: number, limit: number): Promise<IHeaderPaginatorModel<ICategory>> {
    try {
      const mockData: IHeaderPaginatorModel<ICategory> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idCategory: 1,
            description: 'First',
            group: 'PRODUCTS',
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

  async saveCategory () {

  }
}
