'use strict';

module.exports = ({ strapi }) => ({

  getChats: async (ctx, next) => {
    try {
      const queryParams = ctx.request.query;
      const pageSize = queryParams.size ? queryParams.size : 10;
      const page = queryParams.page ? queryParams.page : 0;
      const entries = await strapi.db.query('plugin::chat.chat').findPage({
        select: ['id', 'connection_id', 'content', 'seller_id', 'client_id', 'status', 'updatedAt'],
        orderBy: { updatedAt: 'desc' },
        page: page,
        pageSize: pageSize
      });

      const payload = {
        data: entries ? entries.results : [],
      }

      if (entries.pagination) {
        payload.pagination = entries.pagination;
      }

      ctx.body = payload;
    } catch (err) {
      ctx.body = `${err}`; 
    }
  },

  index: async (ctx, next) => {
    try {

      ctx.body = 'ok';
    } catch (err) {
      ctx.body = `${err}`; 
    }
  },
});
