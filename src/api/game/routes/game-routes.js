
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/v1/games',
      handler: 'game-controller.getGames',
    },
    {
      method: 'GET',
      path: '/v1/game/:gameId',
      handler: 'game-controller.getGame',
    },
    {
      method: 'GET',
      path: '/v1/games/promotions',
      handler: 'game-controller.getPromotions',
    },
    {
      method: 'GET',
      path: '/v1/games/popular-games',
      handler: 'game-controller.getPopularGames',
    },
    {
      method: 'GET',
      path: '/v1/games/similar-games/:gameId',
      handler: 'game-controller.getSimilarGames',
    },
    {
      method: 'GET',
      path: '/v1/test',
      handler: 'game-controller.test',
    },
    {
      method: 'GET',
      path: '/v1/games/find',
      handler: 'game-controller.findGames',
    }
  ]
};