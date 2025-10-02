const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Sample categories to seed
const sampleCategories = [
  {
    name: "Web Development",
    description: "Learn modern web development technologies including HTML, CSS, JavaScript, React, Node.js and more"
  },
  {
    name: "Mobile Development", 
    description: "Build mobile applications for iOS and Android using React Native, Flutter, Swift, and Kotlin"
  },
  {
    name: "Data Science",
    description: "Master data analysis, machine learning, and artificial intelligence with Python, R, and popular frameworks"
  },
  {
    name: "Programming Languages",
    description: "Learn programming fundamentals and advanced concepts in various languages like Python, Java, C++, JavaScript"
  },
  {
    name: "Cloud Computing",
    description: "Understand cloud platforms like AWS, Azure, Google Cloud and learn DevOps practices"
  },
  {
    name: "Cybersecurity",
    description: "Learn about network security, ethical hacking, and protecting digital assets"
  },
  {
    name: "UI/UX Design",
    description: "Master user interface and user experience design principles and tools"
  },
  {
    name: "Database Management",
    description: "Learn SQL, NoSQL databases, and database design principles"
  },
  {
    name: "Artificial Intelligence",
    description: "Explore AI concepts, machine learning algorithms, and deep learning frameworks"
  },
  {
    name: "Game Development",
    description: "Create games using Unity, Unreal Engine, and other game development tools"
  }
];

// Seed function
const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Insert sample categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`Successfully seeded ${categories.length} categories:`);
    categories.forEach(cat => console.log(`- ${cat.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedCategories();
};

runSeeder();
