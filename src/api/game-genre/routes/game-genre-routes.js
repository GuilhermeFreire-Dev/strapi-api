module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/v1/genre/:genreId/games',
      handler: 'game-genre-controller.getGamesByGenre',
    },
    {
      method: 'GET',
      path: '/v1/genres',
      handler: 'game-genre-controller.getGenres',
    }
  ]
};