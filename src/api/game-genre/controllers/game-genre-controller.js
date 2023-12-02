'use strict';

/**
* A set of functions called "actions" for `game-genre-controller`
*/

module.exports = {
  getGenres: async (ctx, next) => {
    try {
      const entries = await strapi.db.query('api::game-genre.game-genre').findMany({
        select: ['id', 'genre'],
        orderBy: { genre: 'asc' },
      });

      const payload = {
        data: entries ? entries : [],
      }
      ctx.body = payload;
    } catch (err) {
      ctx.body = err;
    }
  },

  getGenre: async (ctx, next) => {
    try {
      
    } catch (err) {
      ctx.body = err;
    }
  },

  getGamesByGenre: async (ctx, next) => {
    try {
      const { genreId } = ctx.params;
      const entries= await strapi.db.query('api::game-genre.game-genre').findOne({
        select: ['id', 'genre'],
        where: { id: genreId },
        populate: {
          games: {
            select: ['id', 'name', 'image_url', 'last_price', 'current_price'],
          }
        },
      });

      const payload = {
        data: entries ? entries : [],
      }
      ctx.body = payload;
    } catch (err) {
      ctx.body = err;
    }
  }
};