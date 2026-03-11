import HomeView from '@/views/HomeView.vue'
import ErrorsView from '@/views/ErrorsView.vue'
import { ClassDefinitions } from '@/classes/ClassDefinitions'
import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'routes.home',
      icon: 'mdi-home',
      hotkey: 'cmd+h',
    },
  },
  {
    path: '/carteirinha',
    name: 'Carteirinha',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      title: 'routes.carteirinha',
      icon: 'mdi-card-account-details',
      hotkey: 'cmd+shift+c',
    },
  },
  {
    path: '/parceiros',
    name: 'Parceiros',
    component: () => import('@/views/ParceirosView.vue'),
    meta: {
      title: 'routes.parceiros',
      icon: 'mdi-handshake-outline',
      hotkey: 'cmd+shift+d',
    },
  },
  {
    path: '/plano',
    name: 'Plano',
    component: () => import('@/views/PlanoView.vue'),
    meta: {
      title: 'routes.plano',
      icon: 'mdi-medal',
      hotkey: 'cmd+shift+g',
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/products/ProductsView.vue'),
    redirect: { name: 'ProductsList' },
    meta: {
      title: 'routes.products.title',
      icon: 'mdi-package-variant-closed',
      hotkey: 'cmd+shift+p',
      requiresAuth: true,
      hasFilters: true,
      filterConfig: ClassDefinitions.queryFilterProducts.filters,
      defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
    },
    children: [
      {
        path: 'list',
        name: 'ProductsList',
        component: () => import('@/views/products/ProductListView.vue'),
        meta: {
          title: 'routes.products.children.list',
          icon: 'mdi-format-list-bulleted',
          hotkey: 'cmd+alt+p',
          requiresAuth: true,
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterProducts.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
        },
      },
    ],
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminView.vue'),
    redirect: { name: 'AdminUsers' },
    meta: {
      title: 'routes.adm.title',
      icon: 'mdi-shield-crown',
      hotkey: 'cmd+shift+a',
      requiresAuth: true,
      authorize: ['ADMIN'],
    },
    children: [
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          title: 'routes.adm.children.users',
          icon: 'mdi-account-group',
          hotkey: 'cmd+alt+u',
          requiresAuth: true,
          authorize: ['ADMIN'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterUsers.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterUsers.defaultFilter
        },
      },
    ],
  },
    {
    path: '/config',
    name: 'Configurações',
    component: () => import('@/views/ConfigView.vue'),
    meta: {
      title: 'routes.config',
      icon: 'mdi-cog',
      hotkey: 'cmd+shift+s',
      requiresAuth: true,
    },
  },
  {
    path: '/notificacoes',
    name: 'Notificações',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      title: 'routes.notificacoes',
      icon: 'mdi-bell',
      hotkey: 'cmd+shift+b',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'routes.login',
      hidden: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      title: 'routes.forgotPassword',
      hidden: true,
    },
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: ErrorsView,
    props: { type: '403' },
    meta: {
      hidden: true,
      title: 'routes.forbidden',
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound',
    },
  },
]
