import "dotenv/config";
import mongoose from "mongoose";
import Service from "./models/Service.js";
import WebsiteProject from "./models/WebsiteProject.js";

const services = [
  { title: "Residential Construction", description: "Bungalows, apartments and row houses built with quality materials.", icon: "home", sortOrder: 1 },
  { title: "Commercial Buildings", description: "Offices, shops and showrooms delivered on time and on budget.", icon: "building", sortOrder: 2 },
  { title: "Industrial Construction", description: "Factories, warehouses and sheds with strong structural design.", icon: "factory", sortOrder: 3 },
  { title: "Renovation and Remodeling", description: "Upgrade your existing space with modern design and finishing.", icon: "wrench", sortOrder: 4 },
  { title: "Interior Works", description: "Complete interior planning, false ceiling, flooring and painting.", icon: "paint", sortOrder: 5 },
  { title: "Project Management", description: "End to end site supervision, planning and quality control.", icon: "clipboard", sortOrder: 6 },
];

const projects = [
  { title: "Sunrise Residential Tower", category: "residential", location: "Pune", description: "A 12 floor residential building with modern amenities.", status: "ongoing", isFeatured: true },
  { title: "City Business Center", category: "commercial", location: "Mumbai", description: "A modern commercial complex with offices and retail space.", status: "completed", completedYear: 2025, isFeatured: true },
  { title: "Green Valley Warehouse", category: "industrial", location: "Nashik", description: "A large warehouse with loading docks and office block.", status: "completed", completedYear: 2024, isFeatured: false },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(services);
    console.log("Services added");
  } else {
    console.log("Services already exist");
  }

  if ((await WebsiteProject.countDocuments()) === 0) {
    await WebsiteProject.insertMany(projects);
    console.log("Website projects added");
  } else {
    console.log("Website projects already exist");
  }

  await mongoose.disconnect();
};

run();