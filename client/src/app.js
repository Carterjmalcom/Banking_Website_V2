        async function updateProfile(){
            const userResponse = await fetch('/user-info-current', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentUser }),
            });
            if (userResponse.ok) {
                const depositResult = await userResponse.json();
                let currentBalance = depositResult.balance
                const balanceElement = document.getElementById('balance-display');
                let transactions = depositResult.transactions
                let deposits = depositResult.deposits
                const profilePage = document.getElementById('profile-page')
                let transactionContainer = document.getElementById("transaction-container");
                let depositContainer = document.getElementById("deposit-container");
                transactionContainer.innerHTML = '';
                depositContainer.innerHTML = '';
                transactionContainer.classList.add("transaction-container")
                depositContainer.classList.add("transaction-container")
                profilePage.appendChild(transactionContainer)
                let values = []
                let labels = []
                let totalEarned = 0
                let totalSpent = 0
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
                    totalSpent += parseFloat(transactions[i].price)
                    // DATE
                    const dateP = document.createElement("p");
                    const dateNode = document.createTextNode(`Date: ${transactions[i].date}`);
                    dateP.appendChild(dateNode);
                    div.appendChild(dateP)
                    //CONTAINER
                    transactionContainer.appendChild(div)
                    

                }
                for (let i = 0; i < deposits.length; i++) {
                    const div = document.createElement("div");
                    div.classList.add("transaction-div")
                    // ID
                    const idP = document.createElement("p");
                    const idNode = document.createTextNode(`ID: ${deposits[i].id}`);
                    idP.appendChild(idNode);
                    div.appendChild(idP)
                    // AMOUNT
                    const amountP = document.createElement("p");
                    const amountNode = document.createTextNode(`Amount: ${deposits[i].amount}`);
                    amountP.appendChild(amountNode);
                    div.appendChild(amountP)
                    totalEarned += parseFloat(deposits[i].amount)
                    // DATE
                    const dateP = document.createElement("p");
                    const dateNode = document.createTextNode(`Date: ${deposits[i].date}`);
                    dateP.appendChild(dateNode);
                    div.appendChild(dateP)
                    // DATE
                    const typeP = document.createElement("p");
                    const typeNode = document.createTextNode(`Type: ${deposits[i].type}`);
                    typeP.appendChild(typeNode);
                    div.appendChild(typeP)
                    //CONTAINER
                    depositContainer.appendChild(div)
                }
                TESTER = document.getElementById('tester');
                var data = [{
                    values: values,
                    labels: labels,
                    type: 'pie'
                }];
                Plotly.newPlot(TESTER, data);
            balanceElement.innerText = `Current Balance: $${(totalEarned-totalSpent).toFixed(2)}`;
            }
        }
        
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
            updateProfile()
        });
        document.getElementById('go-to-update').addEventListener('click', () => {
            showForm('update-form')
        })
        document.getElementById('go-to-delete').addEventListener('click', () => {
            showForm('delete-form')
        })

        
        let currentBalance = 0;

        let currentUser;
        
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
                currentUser = username;
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
                document.getElementById('sign-out').disabled = false;
                updateProfile()
            } else {
                document.getElementById('sign-in-message').innerText = result.message;
            }
        });
        
        
        // Cache username and balance

        
        // Show balance in the UI
        function updateBalanceDisplay() {
            const balanceElement = document.getElementById('balance-display');
            balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
        }
        
        
        // Deposit money
        document.getElementById('deposit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('deposit-amount').value;
            const date = document.getElementById('deposit-date').value;
            const type = document.getElementById('deposit-type').value;
        
            const response = await fetch('/deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({currentUser, amount, date, type }),
            });
        
            if (response.ok) {
                const result = await response.json();
                // currentBalance = result.balance;
                // const balanceElement = document.getElementById('balance-display');
                // balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
                updateProfile()
                alert('Deposit successful!');
            } else {
                alert('Error processing deposit');
            }
        });
        
        // Withdraw money
        document.getElementById('withdraw-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('transaction-name').value;
            const category = document.getElementById('transaction-category').value;
            const price = document.getElementById('transaction-price').value;
            const date = document.getElementById('transaction-date').value;
            console.log(name)
            console.log(category)
            console.log(price)
            console.log(date)
        
            const response = await fetch('/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({currentUser, name, category, price, date }),
            });
        
            if (response.ok) {
                const result = await response.json();
                currentBalance = result.balance;
                const balanceElement = document.getElementById('balance-display');
                balanceElement.innerText = `Current Balance: $${currentBalance.toFixed(2)}`;
                updateProfile()
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
            const password = document.getElementById("currentPassword").value;
            const newUser = document.getElementById("newUser").value;
            const newPassword = document.getElementById("newPassword").value;
            console.log('Current user:', { currentUser});
        console.log('New user data:', { newUser});

          try {
            const response = await fetch(`/update-user/${username}/${password}`,{
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, newUser, password, newPassword }),
            });
            if (response.ok) {
                alert('Update successful');

            const result = await response.json();
            document.getElementById('update-message').innerText = result.message;
            }
            const data = await response.json();
            console.log(data);
            // renderUsers();
            // alert("Message is: " + data.message);
          } catch (error) {
            alert("Error updating user: " + error.message);
          }
        });

        // Delete
        document
        .getElementById("delete-form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const username = document.getElementById("delete-username").value;
          const password = document.getElementById("delete-password").value;
          try {
            const response = await fetch(`/user/${username}/${password}`, {
              method: "DELETE",
            });

            if (response.ok) {
              alert("User deleted successfully");
            }
            else {
                throw new Error("Error with network");
            }
            const data = await response.text();
            console.log(data);
            renderUsers();
          } catch (error) {
            console.error("something went wrong" + error.message);
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
        
        // Sign Out

        // document.getElementById('sign-out').addEventListener('click', () => {
        //     if (currentUser) {
        //         // Save the current user's balance before signing out
        //         userBalances[currentUser] = currentBalance;
        
        //         currentUser = null; // Clear the current user
        //         currentBalance = 0; // Reset the balance
        //         updateBalanceDisplay(); // Update the displayed balance
        //         document.getElementById('sign-in-message').innerText = 'No user signed in.';
        //         alert('You have signed out successfully!');
        //     } else {
        //         alert('No user is signed in.');
        //     }
        // });

        document.getElementById('sign-out').addEventListener('click', () => {
            if (true) {
            currentUser = null; // Clear the current user
            currentBalance = 0; // Reset the balance
            updateBalanceDisplay();
            document.getElementById('sign-in-message').innerText = 'No user signed in.';
            alert('You have signed out successfully!');
            document.getElementById('go-to-sign-in').disabled = false;
            document.getElementById('go-to-sign-up').disabled = false;
            document.getElementById('go-to-deposit').disabled = true;
            document.getElementById('go-to-withdraw').disabled = true;
            document.getElementById('go-to-profile').disabled = true;
            document.getElementById('balance-display').classList('hidden');
            document.getElementById('sign-out').disabled = true;
            }
        });
       