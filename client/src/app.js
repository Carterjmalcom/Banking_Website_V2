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
        document.getElementById('go-to-profile').addEventListener('click', () => {
            showForm('profile-page');
        });
        document.getElementById('go-to-update').addEventListener('click', () => {
            showForm('update-form')
        })

                // Cache username and balance
                let currentUser = null;
        
                let currentBalance = 0;
                
                // Object to store user balances
                const userBalances = {};
        
        
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
                let currentUser = username;
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
                document.getElementById('go-to-profile').disabled = false;
                document.getElementById('balance-display').classList.remove('hidden');
                document.getElementById('go-to-sign-in').disabled = true
                document.getElementById('go-to-sign-up').disabled = true
                const userResponse = await fetch('/user-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username }),
                });
                if (userResponse.ok) {
                    const depositResult = await userResponse.json();
                    let currentBalance = depositResult.balance
                    console.log(depositResult)
                    const balanceElement = document.getElementById('balance-display');
                    balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
                    let transactions = depositResult.transactions
        
        
                    const profilePage = document.getElementById('profile-page')
                    const transactionContainer = document.getElementById("transaction-container");
                    transactionContainer.classList.add("transaction-container")
                    profilePage.appendChild(transactionContainer)
                    let values = []
                    let labels = []
                    for (let i = 0; i < transactions.length; i++) {
                        const div = document.createElement("div");
                        div.classList.add("transaction-div")
                        // ID
                        const idP = document.createElement("p");
                        const idNode = document.createTextNode(`ID: ${transactions[i].id}`);
                        idP.appendChild(idNode);
                        div.appendChild(idP)
                        // NAME
                        const nameP = document.createElement("p");
                        const nameNode = document.createTextNode(`Name: ${transactions[i].name}`);
                        nameP.appendChild(nameNode);
                        div.appendChild(nameP)
                        // CATEGORY
                        const categoryP = document.createElement("p");
                        const categoryNode = document.createTextNode(`Category: ${transactions[i].category}`);
                        categoryP.appendChild(categoryNode);
                        div.appendChild(categoryP)
                        labels.push(transactions[i].category)
                        // PRICE
                        const priceP = document.createElement("p");
                        const priceNode = document.createTextNode(`Price: ${transactions[i].price}`);
                        priceP.appendChild(priceNode);
                        div.appendChild(priceP)
                        values.push(transactions[i].price)
                        // DATE
                        const dateP = document.createElement("p");
                        const dateNode = document.createTextNode(`Date: ${transactions[i].date}`);
                        dateP.appendChild(dateNode);
                        div.appendChild(dateP)
                        //CONTAINER
                        transactionContainer.appendChild(div)
        
        
                    }
                    TESTER = document.getElementById('tester');
                    var data = [{
                        values: values,
                        labels: labels,
                        type: 'pie'
                    }];
        
        
                    var layout = {
                        height: 400,
                        width: 500
                    };
        
        
                    Plotly.newPlot(TESTER, data);
                }
        
        
        
        
            } else {
                document.getElementById('sign-in-message').innerText = result.message;
            }
        });
        
        

        
        // Show balance in the UI
        function updateBalanceDisplay() {
            const balanceElement = document.getElementById('balance-display');
            balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
        }
        
        
        // Deposit money
        document.getElementById('deposit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('deposit-amount').value);
            
            currentUser = "test"
            console.log(currentUser)
            const response = await fetch('/deposit-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({currentUser, amount}),
            });
        
            if (response.ok) {
                const result = await response.json();
                currentBalance = result.balance;
                const balanceElement = document.getElementById('balance-display');
                balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
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
                const balanceElement = document.getElementById('balance-display');
                balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
                alert('Withdrawal successful!');
            } else {
                const error = await response.json();
                alert(error.message || 'Error processing withdrawal');
            }
        });
        
        // Update
        document
        .getElementById("update-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("currentUsername").value;
            const newUser = document.getElementById("newUser").value;
            console.log('Current user:', { currentUser});
        console.log('New user data:', { newUser});
          try {
            const response = await fetch(`/update-user/${username}`,{
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, newUser }),
            });
            const data = await response.json();
            console.log(data);
            // renderUsers();
            // alert("Message is: " + data.message);
          } catch (error) {
            alert("Error updating user: " + error.message);
          }
        });
        
        const hamburger = document.getElementById('burger-icon');
        const menu = document.getElementById('my-links');
        
        // Toggle the hamburger menu
        document.getElementById('burger-icon').addEventListener('click', (e) => {
            const menu = document.getElementById('my-links');
            menu.classList.toggle('active');
            e.stopPropagation(); // Prevent the click from bubbling up to the document
        });
        
        // Close the menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('my-links');
            const burgerIcon = document.getElementById('burger-icon');
        
            // Check if the clicked element is not the menu or the burger icon
            if (!menu.contains(e.target) && !burgerIcon.contains(e.target)) {
                menu.classList.remove('active'); // Close the menu
            }
        });
        
        // Close the menu when clicking on a navigation link
        document.querySelectorAll('#my-links button').forEach((link) => {
            link.addEventListener('click', () => {
                const menu = document.getElementById('my-links');
                menu.classList.remove('active'); // Close the menu
            });
        });
        