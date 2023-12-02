'use strict';

/**
 * A set of functions called "actions" for `game-controller`
 */

module.exports = {
  getGames: async (ctx, next) => {
    try {
      const queryParams = ctx.request.query;
      const pageSize = queryParams.size ? queryParams.size : 10;
      const page = queryParams.page ? queryParams.page : 0;
      const games = queryParams.games ? queryParams.games.split(' ') : null;
      const [entries, count] = await strapi.db.query('api::game.game').findWithCount({
        where: games ? { id: games } : {},
        offset: page,
        limit: pageSize
      });

      const payload = {
        data: entries ? entries : [],
        pagination: {
          pageSize: pageSize,
          page: page,
          total: count
        }
      }
      ctx.body = payload;
    } catch (err) {
      ctx.body = err;
    }
  },

  getGame: async (ctx, next) => {
    try {
      const { gameId } = ctx.params;
      const entries = await strapi.db.query('api::game.game').findOne({
        where: { id: gameId },
        populate: ['game_medias', 'game_genres', 'game_recommended_spec', 'game_minimum_spec']
      });
      ctx.body = entries ? entries : {};
    } catch (err) {
      ctx.body = err; 
    }
  },

  getPromotions: async (ctx, next) => {
    try {
      const queryParams = ctx.request.query;
      const pageSize = queryParams.size ? queryParams.size : 10;
      const page = queryParams.page ? queryParams.page : 0;
      const price = queryParams.price ? queryParams.price : 1000;
      const genres = queryParams.genres ? queryParams.genres.split(' ') : [];
      const entries = await strapi.db.query('api::game.game').findMany({
        select: ['id', 'name', 'image_url', 'last_price', 'current_price'],
        where: { 
          current_price: {
            $lte: price
          }
        },
        orderBy: { popularity: 'desc' },
        populate: {
          game_genres: {
            select: ['id', 'genre'],
            where: genres.length ? { genre: genres } : {}
          }
        },
        offset: page,
        limit: pageSize
      });

      let gamesInPromotion = entries.filter(function(game) {
        return game.last_price > game.current_price;
      });

      if (genres.length) {
        gamesInPromotion = gamesInPromotion.filter(function(game) {
          return game.game_genres.length > 0;
        });
      }

      const payload = {
        data: gamesInPromotion ? gamesInPromotion : [],
        pagination: {
          pageSize: pageSize,
          page: page,
        }
      }
      ctx.body = payload;
    } catch (err) {
      ctx.body = err;
    }
  },

  getPopularGames: async (ctx, next) => {
    try {
      const queryParams = ctx.request.query;
      const pageSize = queryParams.size ? queryParams.size : 10;
      const page = queryParams.page ? queryParams.page : 0;
      const [entries, count] = await strapi.db.query('api::game.game').findWithCount({
        select: ['id', 'name', 'image_url', 'last_price', 'current_price'],
        orderBy: { popularity: 'desc' },
        offset: page,
        limit: pageSize
      });

      const payload = {
        data: entries ? entries : [],
        pagination: {
          pageSize: pageSize,
          page: page,
          total: count
        }
      }
      ctx.body = payload;
    } catch (err) {
      ctx.body = err;
    }
  },

  getSimilarGames: async (ctx, next) => {
    try {
      const { gameId } = ctx.params;
      const queryParams = ctx.request.query;
      const genres = queryParams.genres.split(' ');
      const games = await strapi.db.query('api::game.game').findMany({
        select: ['id', 'name', 'image_url', 'last_price', 'current_price'],
        where: { 
          id: {
            $ne: gameId
          }
        },
        populate: { 
          game_genres: {
            select: ['id', 'genre'],
            where: {
              id: {
                $in: genres
              }
            }
          }
        },
        limit: 20
      });

      const similarGames = games.filter(function(game) {
        if (game.game_genres.length) {
          return game;
        }
      });

      const payload = {
        data: similarGames ? similarGames : [],
      }
      ctx.body = payload;

    } catch (err) {
      ctx.body = err; 
    }
  },

  findGames: async (ctx, next) => {
    try {
      const queryParams = ctx.request.query;
      const search = queryParams.term ? queryParams.term : "";
      const entries = await strapi.db.query('api::game.game').findMany({
        select: ['id', 'name', 'image_url', 'current_price'],
        where: {
          name: {
            $containsi: search
          }
        },
        orderBy: { popularity: 'desc' }
      });
      ctx.body = entries ? entries : {};
    } catch (err) {
      ctx.body = err; 
    }
  },

  test: async (ctx, next) => {
    try {
      ctx.body = ctx.request.query;
    } catch (err) {
      ctx.body = err;
    }
  }
};

