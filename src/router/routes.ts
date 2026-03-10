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
      title: 'routes.home.title',
      icon: 'mdi-home',
      hotkey: 'cmd+h',
    },
  },
  {
    path: '/carteirinha',
    name: 'Carteirinha',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      title: 'routes.carteirinha.title',
      icon: 'mdi-bell',
      hotkey: 'cmd+shift+m',
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
          title: 'routes.products.children.list.title',
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
          title: 'routes.adm.children.users.title',
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
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'routes.login.title',
      hidden: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      title: 'routes.forgotPassword.title',
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
      title: 'routes.forbidden.title',
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError.title',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound.title',
    },
  },
]
