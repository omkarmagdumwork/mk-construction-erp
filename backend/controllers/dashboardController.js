import Project from "../models/Project.js";
import Client from "../models/Client.js";
import Employee from "../models/Employee.js";
import Task from "../models/Task.js";
import Enquiry from "../models/Enquiry.js";
import Material from "../models/Material.js";
import Expense from "../models/Expense.js";
import Purchase from "../models/Purchase.js";

const sumField = async (Model, field) => {
  const result = await Model.aggregate([
    { $group: { _id: null, total: { $sum: `$${field}` } } },
  ]);
  return result.length ? result[0].total : 0;
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      statusGroups,
      totalClients,
      activeEmployees,
      pendingTasks,
      overdueTasks,
      newEnquiries,
      lowStockMaterials,
      totalExpenses,
      totalPurchases,
      recentProjects,
      recentEnquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Client.countDocuments(),
      Employee.countDocuments({ status: "active" }),
      Task.countDocuments({ status: { $ne: "done" } }),
      Task.countDocuments({ status: { $ne: "done" }, dueDate: { $lt: new Date() } }),
      Enquiry.countDocuments({ status: "new" }),
      Material.countDocuments({ $expr: { $lte: ["$stockQuantity", "$minStockLevel"] } }),
      sumField(Expense, "amount"),
      sumField(Purchase, "totalAmount"),
      Project.find().populate("client", "name").sort({ createdAt: -1 }).limit(5),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Make sure every status is present, even when count is 0
    const projectsByStatus = {
      planning: 0,
      "in-progress": 0,
      "on-hold": 0,
      completed: 0,
    };
    statusGroups.forEach((group) => {
      projectsByStatus[group._id] = group.count;
    });

    res.json({
      counts: {
        totalProjects,
        totalClients,
        activeEmployees,
        pendingTasks,
        overdueTasks,
        newEnquiries,
        lowStockMaterials,
      },
      projectsByStatus,
      spending: {
        expenses: totalExpenses,
        purchases: totalPurchases,
        total: totalExpenses + totalPurchases,
      },
      recentProjects,
      recentEnquiries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};