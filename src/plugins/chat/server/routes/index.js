module.exports = [
  {
    method: 'GET',
    path: '/chats',
    handler: 'chatController.getChats',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: 'chatController.index',
    config: {
      policies: [],
      auth: false
    },
  }
];
