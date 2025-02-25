const mongoose = require("../db.js");
const { queryDateRange } = require("../../helpers/queryDateRange.js");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "MenuItems"
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.set("toJSON", {
  virtuals: true
});
orderSchema.statics.calcTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

// order model
const Order = mongoose.model("Order", orderSchema);

const getAll = async () => {
  // populate each item
  const orders = await Order.find().populate("items.item");

  return orders;
};

const getStatus = async (status, startDate, endDate) => {
  try {
    const queryCondition = {
      status,
      ...queryDateRange(startDate, endDate)
    };

    const orders = await Order.find(queryCondition).populate("items.item");
    return orders;
  } catch (error) {
    return error;
  }
};

const getTotalSales = async (startDate, endDate) => {
  try {
    const matchCondition = queryDateRange(startDate, endDate);

    const result = await Order.aggregate([
      { $match: matchCondition },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.item",
          foreignField: "_id",
          as: "menuItems"
        }
      },
      {
        $project: {
          orderId: "$_id",
          itemTotal: {
            $multiply: [
              { $arrayElemAt: ["$menuItems.price", 0] },
              "$items.quantity"
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$itemTotal" }
        }
      }
    ]).exec();

    const totalSales = result[0] ? result[0].totalSales : 0;
    return totalSales;
  } catch (error) {
    return error;
  }
};

const getOne = async (id) => {
  const order = await Order.findById(id).populate("items.item");
  return order;
};

const create = async (body) => {
  const order = await Order.create(body);
  return order;
};

const update = async (id, body) => {
  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order.id;
};

const getByStatus = async (status) => {
  const orders = await Order.find({ status }).populate("items");
  return orders;
};

module.exports = {
  getAll,
  getStatus,
  getTotalSales,
  getOne,
  create,
  update,
  remove,
  getByStatus,
  Order
};
