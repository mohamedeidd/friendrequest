const apiBaseUrl = 'http://18.193.81.175'; 
let friendRequests = [];
let friends = [];

// Fetch friend requests from the API
async function fetchFriendRequests() {
    const response = await fetch(`${apiBaseUrl}/friends/requests`);
    friendRequests = await response.json();
    displayFriendRequests();
}

// Fetch friends from the API
async function fetchFriends() {
    const response = await fetch(`${apiBaseUrl}/friends`);
    friends = await response.json();
    displayFriends();
}

// Display friend requests
function displayFriendRequests() {
    const requestsList = document.getElementById('requests-list');
    requestsList.innerHTML = '';

    friendRequests.forEach(request => {
        const li = document.createElement('li');
        li.textContent = request; // Assuming request is a username
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.classList.add('accept');
        acceptButton.onclick = () => acceptRequest(request);
        
        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.classList.add('reject');
        rejectButton.onclick = () => rejectRequest(request);
        
        li.appendChild(acceptButton);
        li.appendChild(rejectButton);
        requestsList.appendChild(li);
    });
}

// Accept friend request
async function acceptRequest(requestUsername) {
    await fetch(`${apiBaseUrl}/friends/${requestUsername}/accept`, { method: 'POST' });
    await fetchFriendRequests(); // Refresh the requests list
    await fetchFriends(); // Refresh friends list
}

// Reject friend request
async function rejectRequest(requestUsername) {
    await fetch(`${apiBaseUrl}/friends/${requestUsername}/reject`, { method: 'POST' });
    await fetchFriendRequests(); // Refresh the requests list
}

// Display friends
function displayFriends() {
    const friendsList = document.getElementById('friends-list-ul');
    friendsList.innerHTML = '';

    friends.forEach(friend => {
        const li = document.createElement('li');
        li.textContent = friend; // Assuming friend is a username
        friendsList.appendChild(li);
    });
}

// Send friend request
async function sendFriendRequest() {
    const friendUsername = document.getElementById('friend-username').value;
    if (friendUsername) {
        await fetch(`${apiBaseUrl}/friends/${friendUsername}`, { method: 'PUT' });
        document.getElementById('friend-username').value = ''; // Clear input
        await fetchFriendRequests(); // Refresh the requests list
    } else {
        alert('Please enter a valid username.');
    }
}

// Event listener for sending friend request
document.getElementById('send-request').addEventListener('click', sendFriendRequest);

// Dynamic search for usernames
document.getElementById('friend-username').addEventListener('input', async function() {
    const query = this.value;
    if (query) {
        const response = await fetch(`${apiBaseUrl}/friends/suggest?query=${query}`);
        const suggestions = await response.json();
        displaySuggestions(suggestions);
    } else {
        document.getElementById('suggestions').innerHTML = '';
    }
});

// Display suggestions
function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = suggestion;
        div.classList.add('suggestion-item');
        div.onclick = () => {
            document.getElementById('friend-username').value = suggestion;
            suggestionsContainer.innerHTML = '';
        };
        suggestionsContainer.appendChild(div);
    });
}

// Initial fetch
fetchFriendRequests();
fetchFriends();