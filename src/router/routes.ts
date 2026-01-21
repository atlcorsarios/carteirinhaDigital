import HomeView from '@/views/HomeView.vue'
import ErrorsView from '@/views/ErrorsView.vue'
import { ClassDefinitions } from '@/classes/ClassDefinitions'
import type { RouteRecordRaw } from 'vue-router';

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
      hotkey: 'cmd+i',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'routes.login.title',
      hidden: true
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: {
      title: 'routes.forgotPassword.title',
      hidden: true
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
      hotkey: 'cmd+n+t',
      requiresAuth: true,
      hasFilters: true,
      filterConfig: ClassDefinitions.getFilterColumnsNotifications
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products/ProductsView.vue'),
    redirect: { name: 'ProductsList' },
    meta: {
      title: 'routes.products.title',
      icon: 'mdi-package-variant-closed',
      hotkey: 'cmd+p',
      requiresAuth: true,
      hasFilters: true,
      filterConfig: ClassDefinitions.getFilterColumnsProducts
    },
    children: [
      {
        path: 'list',
        name: 'ProductsList',
        component: () => import('@/views/Products/ProductsListView.vue'),
        meta: {
          title: 'routes.products.children.list.title',
          icon: 'mdi-format-list-bulleted',
          hotkey: 'cmd+p+l',
          requiresAuth: true,
        },
      },
      {
        path: 'categories',
        name: 'ProductCategories',
        component: () => import('@/views/Products/ProductCategoriesView.vue'),
        meta: {
          title: 'routes.products.children.categories.title',
          icon: 'mdi-tag-text-outline',
          hotkey: 'cmd+p+c',
          requiresAuth: true,
        },
      },
      {
        path: 'revenues',
        name: 'ProductRevenues',
        component: () => import('@/views/Products/ProductRevenuesView.vue'),
        meta: {
          title: 'routes.products.children.revenues.title',
          icon: 'mdi-cash-multiple',
          hotkey: 'cmd+p+r',
          requiresAuth: true,
          authorize: ['ADMIN'],
        },
      },
      {
        path: 'ingredients',
        name: 'ProductIngredients',
        component: () => import('@/views/Products/ProductIngredientsView.vue'),
        meta: {
          title: 'routes.products.children.ingredients.title',
          icon: 'mdi-silverware-fork-knife',
          hotkey: 'cmd+p+i',
          requiresAuth: true,
        },
      },
      {
        path: 'stocks',
        name: 'ProductStocks',
        component: () => import('@/views/Products/ProductStocksView.vue'),
        meta: {
          title: 'routes.products.children.stock.title',
          icon: 'mdi-warehouse',
          hotkey: 'cmd+p+s',
          requiresAuth: true,
        },
      }
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
      hotkey: 'cmd+a',
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
          hotkey: 'cmd+a+u',
          requiresAuth: true,
          authorize: ['ADMIN'],
          hasFilters: true,
          filterConfig: ClassDefinitions.getFilterColumnsUsers
        },
      },
      {
        path: 'config',
        name: 'AdminConfig',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'routes.adm.children.settings.title',
          icon: 'mdi-cog',
          hotkey: 'cmd+a+c',
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
    }
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: ErrorsView,
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError.title',
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ErrorsView,
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound.title',
    }
  }
];
