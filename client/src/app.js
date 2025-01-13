// Switching between forms
document.getElementById('go-to-sign-up').addEventListener('click', () => {
    showForm('sign-up-form');
});
document.getElementById('go-to-sign-in').addEventListener('click', () => {
    showForm('sign-in-form');
});
document.getElementById('go-to-deposit').addEventListener('click', () => {
    showForm('deposit-form');
});
document.getElementById('go-to-withdraw').addEventListener('click', () => {
    showForm('withdraw-form');
});

// Show form function
function showForm(formId) {
    document.querySelectorAll('.form-container').forEach(form => form.classList.add('hidden'));
    document.getElementById(formId).classList.remove('hidden');
}

// Sign-Up Logic
document.querySelector('#sign-up-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('sign-up-username').value;
    const password = document.getElementById('sign-up-password').value;

    const response = await fetch('/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    document.getElementById('sign-up-message').innerText = result.message;
    //---//
});

// Sign-In Logic
document.querySelector('#sign-in-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;
    if (username) {
        currentUser = username;

        // Retrieve balance for this user or set it to 0 if they are new
        if (!userBalances[currentUser]) {
            userBalances[currentUser] = 0; // Initialize balance for new user
        }
        currentBalance = userBalances[currentUser];

        updateBalanceDisplay(); // Display the retrieved balance
        document.getElementById('sign-in-message').innerText = `Welcome, ${currentUser}!`;
    } else {
        alert('Please enter a username to sign in.');
    }
    const response = await fetch('/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (response.ok) {
        alert('Sign-in successful');
        document.getElementById('go-to-deposit').disabled = false;
        document.getElementById('go-to-withdraw').disabled = false;
    } else {
        document.getElementById('sign-in-message').innerText = result.message;
    }
});

// Sign Out Button Logic
document.getElementById('sign-out').addEventListener('click', () => {
    // Perform sign-out actions
    currentUser = null; // Clear the current user
    currentBalance = 0; // Reset the balance
    updateBalanceDisplay(); // Update the displayed balance
    alert('You have signed out successfully!');

    // Optional: Provide feedback that no user is signed in
    document.getElementById('sign-in-message').innerText = 'No user signed in.';
    fetch('/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => {
            if (response.ok) {
                alert('Signed out successfully.');
                // Disable restricted options
                document.getElementById('go-to-deposit').disabled = true;
                document.getElementById('go-to-withdraw').disabled = true;
                document.getElementById('sign-out').disabled = true;

                // Redirect user to the sign-in form
                showForm('sign-in-form');
            } else {
                alert('Error signing out. Please try again.');
            }
        })
        .catch((err) => console.error('Error:', err));
});

// Cache username and balance
let currentUser = null;
let currentBalance = 0;

// Object to store user balances
const userBalances = {};

// Show balance in the UI
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('balance-display');
    balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
}


// Deposit money
document.getElementById('deposit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('deposit-amount').value);

    const response = await fetch('/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, amount }),
    });

    if (response.ok) {
        const result = await response.json();
        currentBalance = result.balance;
        updateBalanceDisplay();
        alert('Deposit successful!');
    } else {
        alert('Error processing deposit');
    }
});

// Withdraw money
document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('withdraw-amount').value);

    const response = await fetch('/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, amount }),
    });

    if (response.ok) {
        const result = await response.json();
        currentBalance = result.balance;
        updateBalanceDisplay();
        alert('Withdrawal successful!');
    } else {
        const error = await response.json();
        alert(error.message || 'Error processing withdrawal');
    }
});

// After successful sign-in
document.querySelector('#sign-in-form form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('sign-in-username').value;
    const password = document.getElementById('sign-in-password').value;

    const response = await fetch('/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (response.ok) {
        alert('Sign-in successful');
        // Enable restricted options after sign-in
        document.getElementById('go-to-deposit').disabled = false;
        document.getElementById('go-to-withdraw').disabled = false;
        document.getElementById('sign-out').disabled = false; // Enable Sign Out button
        currentUser = username;
        currentBalance = result.balance;
        updateBalanceDisplay();
        alert('Sign-in successful');
    } else {
        document.getElementById('sign-in-message').innerText = 'Invalid credentials';
    }
});
