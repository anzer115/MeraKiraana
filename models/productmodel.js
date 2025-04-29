const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://khananzar639:O2ecT9isgUgjfLVE@projects.lvqx6.mongodb.net/?retryWrites=true&w=majority&appName=Projects";  // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function fetchProductNames() {
    try {
        await client.connect();
        const database = client.db("test"); // Ensure the database name is correct
        const collection = database.collection("products"); // Ensure the collection name is correct

        // Fetch only the 'name' field and convert to an array of names
        const products = await collection.find({}, { projection: { _id: 0, name: 1 } }).toArray();

        return products.map(product => product.name); // Extract only names into an array
    } catch (error) {
        console.error("Error fetching product names:", error);
        return [];
    } finally {
        await client.close();
    }
}

module.exports = { fetchProductNames };
