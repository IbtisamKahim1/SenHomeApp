const bcrypt = require('bcrypt');
const { User } = require('./database');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Required for serving static files
require('dotenv').config();

const app = express(); // Initialize app here
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Middleware for JSON payloads
app.use(express.urlencoded({ extended: true })); // Middleware for form-urlencoded payloads
app.use(require('cors')());

// Serve Static Files from the Public Folder
app.use(express.static(path.join(__dirname, '../public')));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection failed:", err));

// Serves Consultation Page
app.get('/html/Consultation_page.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/Consultation_page.html'));
});

// Handle POST request for consultation form
app.post('/submit-consultation', (req, res) => {
  const { name, email, date, time } = req.body; // Extract form data
  console.log('Consultation Request Received:');
  console.log(`Name: ${name}, Email: ${email}, Date: ${date}, Time: ${time}`);

  // Respond to the client (you can also save to the database here)
  res.send('Thank you! Your consultation request has been submitted.');
});

// Serves Service page
app.use(express.json()); // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data

//handles the post request for service 
app.post('/submit-service-request', (req, res) => {
  const { name, email, serviceType, details } = req.body;
  console.log(`New Service Request - Name: ${name}, Email: ${email}, Service: ${serviceType}, Details: ${details}`);
  res.send('Service request submitted successfully!');
});

//handles payment
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handles post payment
app.post('/submit-payment', (req, res) => {
    const { name, email, amount, paymentMethod } = req.body;
    console.log(`Payment Received - Name: ${name}, Email: ${email}, Amount: £${amount}, Method: ${paymentMethod}`);
    
    // Respond to the client
    res.send('Your payment has been successfully processed!');
});

// Root Route - Serve index.html
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/html/index.html'))); // Serves the homepage

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "User already registered with this email." });
      }

      // Create a new user document if not exists
      const bcrypt = require('bcrypt'); 

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      
      res.json({ message: "Registration successful", redirect: "user_profile.html" });
  } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ error: "Error registering user" });
  }
});
 
  
//Login
app.post('/api/login', async (req, res) => {
  console.log("Login request received:", req.body); // ✅ Debugging Log

  const { email, password } = req.body;

  try {
      if (!email || !password) {
          console.error("Missing login fields:", { email, password });
          return res.status(400).json({ error: "All fields are required." });
      }

      // Find user in MongoDB
      const user = await User.findOne({ email });
      if (!user) {
          console.error("User not found:", email);
          return res.status(400).json({ error: "Invalid email or password." });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.error("Password mismatch for:", email);
          return res.status(400).json({ error: "Invalid email or password." });
      }

      console.log("Login successful for:", email);
      res.json({ message: "Login successful!", username: user.username });

  } catch (error) {
      console.error("Error during login:", error); // ✅ Logs the real error
      res.status(500).json({ error: "Internal server error during login." });
  }
});


//user-profile
app.get("/user-profile", async (req, res) => {
  const email = req.query.email;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({
          username: user.username,
          email: user.email,
          joinDate: user.createdAt.toISOString().split('T')[0] // Format join date
      });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});



// Personal Info Route
app.post('/personal-info', (req, res) => {
  const { phone, address, postcode, county } = req.body;
  console.log("Personal Info:", phone, address, postcode, county);
  // Save personal info to MongoDB (optional)
  res.send("Personal information saved!");
});

// Checkout Route
app.post('/checkout', (req, res) => {
  const { paymentMethod } = req.body;
  console.log("Payment Method:", paymentMethod);
  res.send("Order placed successfully!");
});

// Room Callback Request Route
app.post('/request-callback', (req, res) => {
  const { roomName, email } = req.body;
  console.log(`Callback requested for ${roomName} by ${email}`);
  res.send(`Callback request received for ${roomName}.`);
});

// Training Booking Route
app.post('/submit-training-booking', (req, res) => {
  console.log(req.body); // Logs form data
  res.send('Training Booking received!'); 
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
