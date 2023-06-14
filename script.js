var users = [
  { username: 'user1', password: 'pass1', balance: 100000 },
  { username: 'user2', password: 'pass2', balance: 2000 },
  { username: 'user3', password: 'pass3', balance: 500 },
  { username: 'a', password: 'a', balance: 100000 }
];

var currentUser = null;

function checkEnter(event) {
  if (event.keyCode === 13) {
    login();
  }
}

function login() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user = users.find(function(user) {
    return user.username === username && user.password === password;
  });
  if (user) {
    currentUser = user;
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('game-table').style.display = 'block';
    document.getElementById('logout-section').style.display = 'block';
    updateBalance();
  } else {
    alert('Invalid username or password. Please try again.');
  }
}

function logout() {
  currentUser = null;
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('game-table').style.display = 'none';
  document.getElementById('logout-section').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}


function updateBalance() {
  var balanceElement = document.getElementById('balance-value');
  balanceElement.textContent = '$' + currentUser.balance;
}

var deck = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 10 },
  { rank: 'Q', value: 10 },
  { rank: 'K', value: 10 },
  { rank: 'A', value: 11 }
];

var dealerHand = [];
var playerHand = [];

var cardImages = {
  '2': 'images/2.png',
  '3': 'images/3.png',
  '4': 'images/4.png',
  '5': 'images/5.png',
  '6': 'images/6.png',
  '7': 'images/7.png',
  '8': 'images/8.png',
  '9': 'images/9.png',
  '10': 'images/10.png',
  'J': 'images/J.png',
  'Q': 'images/Q.png',
  'K': 'images/K.png',
  'A': 'images/A.png'
};

function deal() {
  dealerHand = [];
  playerHand = [];
  
  shuffleDeck();
  
  dealerHand.push(drawCard());
  dealerHand.push(drawCard());
  playerHand.push(drawCard());
  playerHand.push(drawCard());
  
  displayHands();
  checkBlackjack();
}

function shuffleDeck() {
  for (var i = 0; i < deck.length; i++) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function drawCard() {
  return deck.pop();
}

function displayHands() {
  var dealerHandElement = document.getElementById('dealer-hand');
  var playerHandElement = document.getElementById('player-hand');
  var dealerHandValueElement = document.getElementById('dealer-hand-value');
  var playerHandValueElement = document.getElementById('player-hand-value');

  dealerHandElement.style.display = 'block';
  playerHandElement.style.display = 'block'

  var dealerPoints = 0;
  var playerPoints = 0;

  for (var i = 0; i < dealerHand.length; i++) {
    var cardElement = document.createElement('img');
    cardElement.className = 'card';
    cardElement.src = cardImages[dealerHand[i].rank];
    dealerHandElement.appendChild(cardElement);
    dealerPoints += dealerHand[i].value;
  }

  for (var i = 0; i < playerHand.length; i++) {
    var cardElement = document.createElement('img');
    cardElement.className = 'card';
    cardElement.src = cardImages[playerHand[i].rank];
    playerHandElement.appendChild(cardElement);
    playerPoints += playerHand[i].value;
  }

  dealerHandValueElement.textContent = "Dealer's Hand: " + dealerPoints;
  playerHandValueElement.textContent = "Player's Hand: " + playerPoints;
}



function checkBlackjack() {
  var dealerPoints = getPoints(dealerHand);
  var playerPoints = getPoints(playerHand);
  
  if (dealerPoints === 21 && playerPoints === 21) {
    setResult('Push! Both have blackjack.');
    endGame();
  } else if (dealerPoints === 21) {
    setResult('Dealer wins with blackjack!');
    endGame();
  } else if (playerPoints === 21) {
    setResult('You win with blackjack!');
    endGame();
  }
}

function getPoints(hand) {
  var points = 0;
  var hasAce = false;
  
  for (var i = 0; i < hand.length; i++) {
    points += hand[i].value;
    
    if (hand[i].rank === 'A') {
      hasAce = true;
    }
  }
  
  if (points > 21 && hasAce) {
    points -= 10;
  }
  
  return points;
}

function hit() {
  playerHand.push(drawCard());
  displayHands();
  
  var playerPoints = getPoints(playerHand);
  if (playerPoints > 21) {
    setResult('You busted! Dealer wins.');
    endGame();
  }
}

function stand() {
  var dealerPoints = getPoints(dealerHand);
  var playerPoints = getPoints(playerHand);
  
  while (dealerPoints < 17) {
    dealerHand.push(drawCard());
    dealerPoints = getPoints(dealerHand);
  }
  
  displayHands();
  
  if (dealerPoints > 21) {
    setResult('Dealer busted! You win.');
  } else if (dealerPoints === playerPoints) {
    setResult('Push! It\'s a tie.');
  } else if (dealerPoints > playerPoints) {
    setResult('Dealer wins.');
  } else {
    setResult('You win!');
  }
  
  endGame();
}
  
function setResult(message) {
  var resultElement = document.getElementById('result');
  resultElement.textContent = message;
}

function endGame() {
  var betAmount = document.getElementById('bet-amount').value;
  currentUser.balance -= parseInt(betAmount);
  updateBalance();
}

function register() {
  var newUsername = document.getElementById('new-username').value;
  var newPassword = document.getElementById('new-password').value;
  
  if (newUsername.trim() === '' || newPassword.trim() === '') {
    alert('Please enter a username and password.');
    return;
  }
  
  var userExists = users.some(function(user) {
    return user.username === newUsername;
  });
  
  if (userExists) {
    alert('Username already exists. Please choose a different username.');
    return;
  }
  
  var newUser = { username: newUsername, password: newPassword, balance: 1000 };
  users.push(newUser);
  
  currentUser = newUser;
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('game-table').style.display = 'block';
  document.getElementById('balance-value').textContent = currentUser.balance;
}

function openRegistrationPage() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('registration-section').style.display = 'block';
}

function openLoginPage() {
  document.getElementById('registration-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}








