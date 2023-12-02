'use strict';

module.exports = ({ strapi }) => ({

  chatUpdate: async ({ message, uuid, chat_id, status, client_id, seller_id }) => {
    try {
      let entry = null;


      console.log("message service", message);
      // console.log("service message",{
      //   messages: message,
      //   uuid: uuid,
      //   client_id: client_id
      // });

      // Obter mensagens do banco e atualiza-las
      
      if (chat_id) {
        const data = await strapi.db.query('plugin::chat.chat').findOne({
          where: { id: chat_id }
        });

        if (data) {
          data.content.messages.push(message);

          if (seller_id) {
            data.seller_id = seller_id;
          }

          if (client_id) {
            data.client_id = client_id;
          }

          entry = await strapi.db.query('plugin::chat.chat').update({
            where: { id: chat_id },
            data: data
          });
  
          return {
            id: entry.id,
            type: 'communication',
            seller_id: entry.seller_id,
            client_id: entry.client_id,
            data: entry.content
          };
        }
      }
      else {
        const data = {
          content: { messages: [message] },
          connection_id: uuid,
          status: status,
          client_id: client_id,
          seller_id: seller_id
        };
  
        entry = await strapi.db.query('plugin::chat.chat').create({
          data: data
        });
  
        return {
          id: entry.id,
          type: 'configuration',
          seller_id: entry.seller_id,
          client_id: entry.client_id,
          data: entry.content
        }
      }

    } catch (error) {
      console.error(error);
      return null;
    }
  }
});
