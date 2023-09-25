const Order = require("../db/models/orders.js");

const getAll = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getStatus = async (req, res) => {
  try {
    const { s: statusQuery, startDate, endDate } = req.query;
    const orders = await Order.getStatus(statusQuery, startDate, endDate);
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getTotalSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const totalSales = await Order.getTotalSales(startDate, endDate);
    res.send({ total: totalSales });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOne = async (req, res) => {
  try {
    const order = await Order.getOne(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const create = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  try {
    const order = await Order.update(req.params.id, req.body);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const remove = async (req, res) => {
  try {
    const order = await Order.remove(req.params.id);
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getByCustomer = async (req, res) => {
  try {
    const orders = await Order.getByCustomer(req.params.id);
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getByStatus = async (req, res) => {
  try {
    const orders = await Order.getByStatus(req.params.status);
    res.send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAll,
  getStatus,
  getTotalSales,
  getOne,
  create,
  update,
  remove,
  getByCustomer,
  getByStatus
};
