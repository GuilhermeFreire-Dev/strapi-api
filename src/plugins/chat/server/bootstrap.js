'use strict';

module.exports = ({ strapi }) => {
  // bootstrap phase
  let { Server } = require("socket.io");

  let io = new Server(strapi.server.httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

  io.on("connection", async (socket) => {
    try {
      let messages = [];
      console.log("A user connected: ", socket.id);

      /**
       * Receber a conexão do cliente, gerar um novo registro para esse cliente
       * Depois devolver para o cliente o seu id
       */

      socket.on("clientSendMsg", async (msgs) => {

        // client -> seller

        console.log("lista de mensagens", messages);

        console.log("received to front", msgs);

        const { chatService } = strapi.plugins.chat.services;
  
        const message = {
          uuid: socket.id,
          content: msgs.content,
          time: new Date(),
          origin: msgs.origin
        };
  
        const msg = await chatService.chatUpdate({
          message: message,
          uuid: socket.id,
          chat_id: msgs.chat_id,
          status: msgs.status,
          client_id: msgs.client_id,
        });
  
        console.log("msg", msg);
  
        io.to(msg.client_id).emit("clientReceiveMsg", msg);
        io.to(msg.seller_id).emit("sellerReceiveMsg", msg);
      });

      
      socket.on("sellerSendMsg", async (msgs) => {

        // seller -> client
        console.log("lista de mensagens", messages);

        console.log("received to front", msgs);

        const { chatService } = strapi.plugins.chat.services;
  
        const message = {
          uuid: socket.id,
          content: msgs.content,
          time: new Date(),
          origin: msgs.origin
        };
  
        const msg = await chatService.chatUpdate({
          message: message,
          uuid: socket.id,
          chat_id: msgs.chat_id,
          status: msgs.status,
          seller_id: msgs.seller_id,
        });
  
        console.log("msg", msg);
        
        io.to(msg.seller_id).emit("sellerReceiveMsg", msg);
        io.to(msg.client_id).emit("clientReceiveMsg", msg);
      });

      socket.on("sellerOn", (data) => {

        // Enviar ID do seller para o client

        io.to(data.client_id).emit("sellerOk", data.seller_id);
      })
  
      socket.on("disconnected", () => {
        console.log("A user disconnected: ", socket.id);
      });

    } catch (error) {
      console.error(error);
    }
  });

  strapi.io = io;
  
};
