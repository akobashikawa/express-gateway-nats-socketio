const express = require('express');
const router = express.Router();

const nats = require('./nats-publisher');

const Service = require('./service');
const service = new Service({ nats });

const Controller = require('./controller');
const controller = new Controller({ service });

router.all('/hello', async (req, res) => controller.hello(req, res) );

router.all('/productos', async (req, res) => controller.productos(req, res) );
router.all('/personas', async (req, res) => controller.personas(req, res) );
router.all('/ventas', async (req, res) => controller.ventas(req, res) );

module.exports = router;