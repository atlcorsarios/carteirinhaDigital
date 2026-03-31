import HomeView from '@/views/HomeView.vue'
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
    path: '/perfil',
    name: 'Perfil',
    component: () => import('@/views/PerfilView.vue'),
    meta: {
      title: 'routes.perfil',
      excludeNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/carteirinha',
    name: 'Carteirinha',
    component: () => import('@/views/CarteirinhaView.vue'),
    meta: {
      title: 'routes.carteirinha',
      icon: 'mdi-card-account-details',
      hotkey: 'cmd+shift+c',
      requiresAuth: true,
      authorize: [
        'associado',
        'diretoria'
      ],
    },
  },
  {
    path: '/parceiros',
    name: 'Parceiros',
    component: () => import('@/views/ParceirosView.vue'),
    meta: {
      title: 'routes.parceiros',
      icon: 'mdi-handshake-outline',
      hotkey: 'cmd+shift+p',
      hasFilters: true,
      filterConfig: ClassDefinitions.queryFilterParceiros.filters,
      defaultFilterConfig: ClassDefinitions.queryFilterParceiros.defaultFilter,
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
    path: '/produtos',
    name: 'Produtos',
    component: () => import('@/views/produtos/ProdutosView.vue'),
    redirect: { name: 'ListaProdutos' },
    meta: {
      title: 'routes.products.title',
      icon: 'mdi-package-variant-closed',
      hotkey: 'cmd+alt+p',
      requiresAuth: true,
      hasFilters: true,
      filterConfig: ClassDefinitions.queryFilterProducts.filters,
      defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
    },
    children: [
      {
        path: 'lista',
        name: 'ListaProdutos',
        component: () => import('@/views/produtos/ProdutosListaView.vue'),
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
      {
        path: 'cadastro',
        name: 'CadastroProdutos',
        component: () => import('@/views/produtos/ProdutosCadastroView.vue'),
        meta: {
          title: 'routes.products.children.register',
          icon: 'mdi-package',
          hotkey: 'cmd+alt+c',
          requiresAuth: true,
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterProducts.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
        },
      },
      {
        path: 'beneficios',
        name: 'Beneficios',
        component: () => import('@/views/produtos/BeneficiosView.vue'),
        meta: {
          title: 'routes.products.children.beneficios',
          icon: 'mdi-clipboard-text',
          hotkey: 'cmd+alt+b',
          requiresAuth: true,
          authorize: [
            'diretoria',
            'parceiro'
          ],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterProducts.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
        },
      },
      {
        path: 'promocoes',
        name: 'Promoções',
        component: () => import('@/views/produtos/PromocoesView.vue'),
        meta: {
          title: 'routes.products.children.promocoes',
          icon: 'mdi-sale',
          hotkey: 'cmd+alt+l',
          requiresAuth: true,
          authorize: [
            'diretoria',
            'parceiro'
          ],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterProducts.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterProducts.defaultFilter,
        },
      },
      {
        path: 'descontos',
        name: 'Descontos',
        component: () => import('@/views/produtos/DescontosView.vue'),
        meta: {
          title: 'routes.products.children.descontos',
          icon: 'mdi-tag-multiple',
          hotkey: 'cmd+alt+d',
          requiresAuth: true,
          authorize: [
            'diretoria',
            'parceiro'
          ],
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
      hotkey: 'cmd+alt+u',
      requiresAuth: true,
      authorize: ['diretoria'],
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
          authorize: ['diretoria'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterUsers.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterUsers.defaultFilter
        },
      },
      {
        path: 'planos',
        name: 'Planos',
        component: () => import('@/views/admin/PlanosView.vue'),
        meta: {
          title: 'routes.adm.children.planos',
          icon: 'mdi-medal',
          hotkey: 'cmd+alt+m',
          requiresAuth: true,
          authorize: ['diretoria'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterUsers.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterUsers.defaultFilter
        },
      },
      {
        path: 'assinaturas',
        name: 'Assinaturas',
        component: () => import('@/views/admin/AssinaturasManagerView.vue'),
        meta: {
          title: 'routes.adm.children.assinaturas',
          icon: 'mdi-credit-card-outline',
          hotkey: 'cmd+alt+a',
          requiresAuth: true,
          authorize: ['diretoria'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterUsers.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterUsers.defaultFilter
        },
      },
      {
        path: 'otp',
        name: 'Gerar OTP',
        component: () => import('@/views/admin/OTPManagerView.vue'),
        meta: {
          title: 'routes.adm.children.otp',
          icon: 'mdi-shield-key',
          hotkey: 'cmd+alt+o',
          requiresAuth: true,
          authorize: ['diretoria'],
          hasFilters: true,
          filterConfig: ClassDefinitions.queryFilterUsers.filters,
          defaultFilterConfig: ClassDefinitions.queryFilterUsers.defaultFilter
        },
      },
    ],
  },
  {
    path: '/configuracoes',
    name: 'Configurações',
    component: () => import('@/views/ConfigurationsView.vue'),
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
      excludeNav: true
      // icon: 'mdi-bell',
      // hotkey: 'cmd+shift+b',
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
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: {
      title: 'routes.onboarding',
      hidden: true,
      requiresAuth: true
    }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ErrorsView.vue'),
    props: { type: '403' },
    meta: {
      hidden: true,
      title: 'routes.forbidden',
    },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/views/ErrorsView.vue'),
    props: { type: '500' },
    meta: {
      hidden: true,
      title: 'routes.serverError',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/ErrorsView.vue'),
    props: { type: '404' },
    meta: {
      hidden: true,
      title: 'routes.notFound',
    },
  },
]
