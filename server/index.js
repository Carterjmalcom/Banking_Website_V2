const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Initialize Express application
const app = express();

// Define paths
const clientPath = path.join(__dirname, '..', 'client/src');
const dataPath = path.join(__dirname, 'data', 'users.json');
const serverPublic = path.join(__dirname, 'public');

// Middleware setup
app.use(express.static(clientPath)); // Serve static files from client directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Routes

// Home route
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: clientPath });
});

app.get('/users', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');

        const users = JSON.parse(data);
        if (!users) {
            throw new Error("Error no users available");
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Problem getting users" + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});

app.post('/user-info', async (req, res) => {
    try {
        const {username} = req.body
        console.log(username)
        const data = await fs.readFile(dataPath, 'utf8');

        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.username === username );
        console.log(userIndex)
        if (!users) {
            throw new Error("Error no users available");
        }
        res.status(200).json(users[userIndex]);
    } catch (error) {
        console.error("Problem getting users" + error.message);
        res.status(500).json({ error: "Problem reading users" });
    }
});


// Form route
app.get('/home', (req, res) => {
    res.sendFile('pages/home.html', { root: serverPublic });
});

app.get('/money', (req, res) => {
    res.sendFile('pages/money.html', { root: serverPublic });
});

app.get('/sign-in-out', (req, res) => {
    res.sendFile('pages/sign-in-out.html', { root: serverPublic });
});

app.get('/sign-up', (req, res) => {
    res.sendFile('pages/sign-up.html', { root: serverPublic });
});

// Form submission route
app.post('/submit-form', async (req, res) => {
    try {
        const { name, powers } = req.body;

        // Read existing users from file
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, start with an empty array
            console.error('Error reading user data:', error);
            users = [];
        }

        // Find or create user
        let user = users.find(u => u.name === name);
        // if (user) {
        //     user.messages.push(message);
        // } else {
        user = { name, powers };
        users.push(user);


        // Save updated users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.redirect('/form');
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).send('An error occurred while processing your submission.');
    }
});

// Update user route (currently just logs and sends a response)
app.put('/update-user/:currentName/:currentPowers', async (req, res) => {
    try {
        const { currentName, currentPowers } = req.params;
        const { newName, newPowers } = req.body;
        console.log('Current user:', { currentName, currentPowers });
        console.log('New user data:', { newName, newPowers });
        const data = await fs.readFile(dataPath, 'utf8');
        if (data) {
            let users = JSON.parse(data);
            const userIndex = users.findIndex(user => user.name === currentName && user.powers === currentPowers);
            console.log(userIndex);
            if (userIndex === -1) {
                return res.status(404).json({ message: "User not found" })
            }
            users[userIndex] = { ...users[userIndex], name: newName, powers: newPowers };
            console.log(users);
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

            res.status(200).json({ message: `You sent ${newName} and ${newPowers}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
});

app.delete('/user/:name/:powers', async (req, res) => {
    try {
        const { name, powers } = req.params
        // initalize an empty array of 'users'
        let users = [];
        // try to read the users.json file and cache as data
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            return res.status(404).send('User data not found')
        }
        // cache the userIndex based on a matching name and email
        const userIndex = users.findIndex(user => user.name === name && user.powers === powers);
        console.log(userIndex);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        // splice the users array with the intended delete name and email
        users.splice(userIndex, 1);
        try {
            await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error("Failed to write to database")
        }
        // send a success deleted message
        res.send('User deleted successfully');
    } catch (error) {
        res.status(500).send('There was an error deleting user');
    }
});

// Updated Sign-Up Endpoint
app.post('/sign-up', async (req, res) => {
    const { username, password } = req.body;

    // Read existing users
    let users = [];
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        users = JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Add new user with a starting balance of 0
    const newUser = { username, password, balance: 0 };
    users.push(newUser);

    // Save users
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'User signed up successfully' });
});


app.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Read users from file
        const data = await fs.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find matching user
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Store user session (for simplicity, just returning the user info here)
        res.status(200).json({ message: 'Sign-in successful', user });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Failed to sign in' });
    }
});

// Sign-Out Endpoint
app.post('/sign-out', (req, res) => {
    // Clear the user session or authentication token
    req.session = null; // If you're using cookies or sessions
    res.status(200).json({ message: 'Signed out successfully' });
});


// Deposit Endpoint
app.post('/deposit', async (req, res) => {
    const { username, amount } = req.body;

    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find user
        const user = users.find((u) => u.username === username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update balance
        user.balance += amount;

        // Save users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).send('Error processing deposit.');
    }
});

// Withdraw Endpoint
app.post('/withdraw', async (req, res) => {
    const { username, amount } = req.body;

    try {
        const data = await fs.readFile(dataPath, 'utf8');
        const users = JSON.parse(data);

        // Find user
        const user = users.find((u) => u.username === username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for sufficient balance
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Update balance
        user.balance -= amount;

        // Save users
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).send('Error processing withdrawal.');
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});