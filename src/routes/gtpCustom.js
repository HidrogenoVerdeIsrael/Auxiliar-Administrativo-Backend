
const express = require('express');
const { createGpt, queryGpt } = require('./gptController');
const routerGpt = express.Router();

router.post('/gpt/create', createGpt);
router.post('/gpt/query', queryGpt);

module.exports = routerGpt;
