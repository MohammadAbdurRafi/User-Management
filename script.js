function fetchUser() {
  fetch('https://randomuser.me/api/?results=10')
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      // Saving users to our local storage
      localStorage.setItem('users', JSON.stringify(data.results));
      const cardRow = document.getElementById('card-row');

      for (let user of data.results) {
        const name = `${user.name.title} ${user.name.first} ${user.name.last}`;
        const email = user.email;
        const image = user.picture.large;

        const cardElement = document.createElement('div');
        const columnElement = document.createElement('div');
        const imgElement = document.createElement('img');
        const cardBodyElement = document.createElement('div');
        const cardTitleElement = document.createElement('h5');
        const cardTextElement = document.createElement('p');
        const buttonElement = document.createElement('button');

        columnElement.className = 'col-4';
        cardElement.className = 'card mb-3';

        imgElement.className = 'card-img-top';
        imgElement.src = image;

        cardBodyElement.className = 'card-body';

        cardTitleElement.innerText = name;
        cardTextElement.innerText = email;

        buttonElement.innerText = 'Details';
        buttonElement.className = 'btn btn-secondary';
        buttonElement.addEventListener('click', function () {
          navigateToDetails(user.login.uuid);
        });

        cardBodyElement.appendChild(cardTitleElement);
        cardBodyElement.appendChild(cardTextElement);
        cardBodyElement.appendChild(buttonElement);

        cardElement.appendChild(imgElement);
        cardElement.appendChild(cardBodyElement);

        columnElement.appendChild(cardElement);
        cardRow.appendChild(columnElement);
      }
    })
    .catch((error) => {
      console.log('Error', error);
    });
}

function navigateToDetails(userId) {
  window.location.href = `details.html?userId=${userId}`;
}

function loadUserDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  const users = JSON.parse(localStorage.getItem('users'));

  const user = users.find((u) => u.login.uuid === userId);

  if (user) {
    const userDetailsContainer = document.getElementById('user-details');

    const nameElement = document.createElement('h2');
    nameElement.innerText = `${user.name.title} ${user.name.first} ${user.name.last}`;

    const emailElement = document.createElement('p');
    emailElement.innerHTML = `<strong>Email:</strong> ${user.email}`;

    const ageElement = document.createElement('p');
    ageElement.innerHTML = `<strong>Age:</strong> ${user.dob.age}`;

    const phoneElement = document.createElement('p');
    phoneElement.innerHTML = `<strong>Phone:</strong> ${user.phone}`;

    const nationalityElement = document.createElement('p');
    nationalityElement.innerHTML = `<strong>Nationality:</strong> ${user.nat}`;

    const imgElement = document.createElement('img');
    imgElement.className = 'user-image';
    imgElement.src = user.picture.large;

    userDetailsContainer.appendChild(imgElement);
    userDetailsContainer.appendChild(nameElement);
    userDetailsContainer.appendChild(emailElement);
    userDetailsContainer.appendChild(ageElement);
    userDetailsContainer.appendChild(phoneElement);
    userDetailsContainer.appendChild(nationalityElement);
  }
}

if (window.location.pathname === '/details.html') {
  loadUserDetails();
} else {
  fetchUser();
}
