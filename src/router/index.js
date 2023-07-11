// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
    path: '/',
    component: () =>
        import ('@/layouts/default/Default.vue'),
    children: [{
            path: '',
            name: 'Home',
            component: () =>
                import ('@/views/Home.vue'),
        },
        {
            path: '/movies',
            name: 'Movies',
            component: () =>
                import ('@/components/Movies.vue'),
        },
        {
            path: '/trending',
            name: 'Trending',
            component: () =>
                import ('@/views/Trending.vue'),
        },
        {
            path: '/series',
            name: 'Series',
            component: () =>
                import ('@/views/Series.vue'),
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('@/views/Login.vue'),
        },
    ],
}, ]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router