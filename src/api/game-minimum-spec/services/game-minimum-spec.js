'use strict';

/**
 * game-minimum-spec service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-minimum-spec.game-minimum-spec');
