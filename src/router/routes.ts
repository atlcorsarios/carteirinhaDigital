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
    path: '/system-info',
    name: 'SystemInfo',
    component: () => import('@/views/SystemInfoView.vue'),
    meta: {
      title: 'routes.about.title',
      icon: 'mdi-information-variant',
      hotkey: 'cmd+shift+i',
    },
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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'routes.dashboard.title',
      icon: 'mdi-view-dashboard',
      hotkey: 'cmd+d',
    },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: {
      title: 'routes.notifications.title',
      icon: 'mdi-bell',
      hotkey: 'cmd+shift+m',
      requiresAuth: true,
      hasFilters: true,
      filterConfig: ClassDefinitions.queryFilterNotifications.filters,
      defaultFilterConfig: ClassDefinitions.queryFilterNotifications.defaultFilter
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
      {
        path: 'categories',
        name: 'ProductCategories',
        component: () => import('@/views/products/ProductCategoriesView.vue'),
        meta: {
          title: 'routes.products.children.categories.title',
          icon: 'mdi-tag-text-outline',
          hotkey: 'cmd+alt+c',
          requiresAuth: true,
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterCategories.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterCategories.defaultFilter,
        },
      },
      {
        path: 'recipes',
        name: 'ProductRecipes',
        component: () => import('@/views/products/ProductRecipesView.vue'),
        meta: {
          title: 'routes.products.children.recipes.title',
          icon: 'mdi-silverware-variant',
          hotkey: 'cmd+alt+r',
          requiresAuth: true,
          authorize: ['ADMIN'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterRecipes.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterRecipes.defaultFilter,
        },
      },
      {
        path: 'ingredients',
        name: 'ProductIngredients',
        component: () => import('@/views/products/ProductIngredientsView.vue'),
        meta: {
          title: 'routes.products.children.ingredients.title',
          icon: 'mdi-shaker',
          hotkey: 'cmd+alt+i',
          requiresAuth: true,
        },
      },
      {
        path: 'stocks',
        name: 'Stocks',
        component: () => import('@/views/products/StocksView.vue'),
        meta: {
          title: 'routes.products.children.stock.title',
          icon: 'mdi-warehouse',
          hotkey: 'cmd+alt+s',
          requiresAuth: true,
          hasFilters: true,
          authorize: ['ADMIN'],
          filterConfig: ClassDefinitions.queryFilterStock.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterStock.defaultFilter,
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
      {
        path: 'config',
        name: 'AdminConfig',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'routes.adm.children.settings.title',
          icon: 'mdi-cog',
          hotkey: 'cmd+alt+c',
          requiresAuth: true,
          authorize: ['ADMIN'],
        },
      },
    ],
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
