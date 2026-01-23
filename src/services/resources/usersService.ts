// Models
import type { IHeaderPaginatorModel } from '@/classes/models/ModelHeaderPaginator'
import type { IUser } from '@/classes/models/ModelUser'

// Services
import http from '../axios';

export const usersServices = {
  async getAllUsers(offset: number, limit: number): Promise<IHeaderPaginatorModel<IUser>> {
    try {
      // const { data } = await http.get('/usuarios/consulta', { params: { offset, limit } })
      // return data

      const mockData: IHeaderPaginatorModel<IUser> = {
        limit: limit,
        offset: offset,
        total: 100,
        items: [
          {
            idUser: 1,
            username: 'AVELITO',
            email: 'avelito@gmail.com',
            role: 'ADMIN',
            phoneNumber: '(32) 99999-9999',
            receiveNotifications: true,
            active: true,
          },
          {
            idUser: 2,
            username: 'DUDA',
            email: 'duda@gmail.com',
            role: 'USER',
            phoneNumber: '(32) 98888-8888',
            receiveNotifications: false,
            active: true,
          },
          {
            idUser: 3,
            username: 'MOISES',
            email: 'moises@gmail.com',
            role: 'USER',
            phoneNumber: '(32) 97777-7777',
            receiveNotifications: false,
            active: false,
          },
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 2500));

      return mockData;
    } catch (error) {
      throw error
    }
  },

  async searchUsuarios() {
    try {
      const { data } = await http.get('/usuarios/search', {
        // params: paginador,
      })
      return data
    } catch (error) {
      throw error
    }
  },

  async getUserById(idUsuario?: number): Promise<IUser> {
    if (idUsuario) {
    }
    try {
      const { data } = await http.get(`/usuarios/${idUsuario}`)
      return data.usuario
    } catch (error) {
      throw error
    }
  },

  async createUser(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  async solicitarAcesso(newUser: IUser): Promise<IUser> {
    try {
      const { data } = await http.post('/usuarios/registrar', newUser)
      return data
    } catch (error) {
      throw error
    }
  },

  async updateUser(user: IUser): Promise<IUser> {
    await this.getUserById(user.idUser!)
    try {
      const { data } = await http.put(`/usuarios/${user.idUser}`, user)
      return data
    } catch (error) {
      throw error
    }
  },

  async deleteUser(id: number): Promise<void> {
    await this.getUserById(id)
    try {
      await http.delete(`/usuarios/${id}`)
    } catch (error) {
      throw error
    }
  },
}
