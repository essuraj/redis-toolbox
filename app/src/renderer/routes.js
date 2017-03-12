export default [
  {
    path: '/',
    name: 'home-page',
    component: require('components/Home')
  },
  {
    path: '*',
    redirect: '/'
  }
]
