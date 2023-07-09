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
        // Creating user elements
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
    userDetailsContainer.innerHTML = '';

    const userInfoElement = document.createElement('div');
    userInfoElement.classList.add('user-info');

    const nameElement = document.createElement('h2');
    nameElement.innerText = `${user.name.title} ${user.name.first} ${user.name.last}`;
    userInfoElement.appendChild(nameElement);

    const imgElement = document.createElement('img');
    imgElement.className = 'user-image';
    imgElement.src = user.picture.large;
    userDetailsContainer.appendChild(imgElement);

    userDetailsContainer.appendChild(userInfoElement);

    const emailElement = document.createElement('p');
    emailElement.innerHTML = `<strong>Email:</strong> ${user.email}`;
    userInfoElement.appendChild(emailElement);

    const dobElement = document.createElement('p');
    dobElement.innerHTML = `<strong>Date of Birth:</strong> ${new Date(user.dob.date).toLocaleDateString()}`;
    userInfoElement.appendChild(dobElement);

    const addressElement = document.createElement('p');
    const { street, city, state, postcode } = user.location;
    addressElement.innerHTML = `<strong>Address:</strong> ${street.number} ${street.name}, ${city}, ${state}, ${postcode}`;
    userInfoElement.appendChild(addressElement);

    const phoneElement = document.createElement('p');
    phoneElement.innerHTML = `<strong>Phone:</strong> ${user.phone}`;
    userInfoElement.appendChild(phoneElement);

    const nationalityElement = document.createElement('p');
    nationalityElement.innerHTML = `<strong>Nationality:</strong> ${user.nat}`;
    userInfoElement.appendChild(nationalityElement);

    const registeredElement = document.createElement('p');
    if (user.registered.age > 1) {
      registeredElement.innerHTML = `<strong>Registered: </strong> ${user.registered.age} years ago`
    } else {
      registeredElement.innerHTML = `<strong>Registered: </strong> 1 year ago`
    }
    
    userInfoElement.appendChild(registeredElement)
  }
}

// Theoretically can be made with users whose been on the platform for less than a year
// This function didn't actually work, but should be looked into for all use cases
// function calculateRegistered () {
//   const urlParams = new URLSearchParams(window.location.search);
//   const userId = urlParams.get('userId');

//   const users = JSON.parse(localStorage.getItem('users'));

//   const user = users.find((u) => u.login.uuid === userId);

//   if (user) {
//     const currentDate = new Date()
//     if (user.registered.date.getYear() < currentDate.getYear()) {
//       const yearsRegistered = currentDate.getYear() - user.registered.date.getYear()
//       return `<strong>Registered:</strong> ${yearsRegistered} years ago`
//     } else if (user.registered.date.getMonth() < currentDate.getMonth()) {
//       const monthsRegistered = currentDate.getMonth() - user.registered.date.getMonth()
//       return `<strong>Registered:</strong> ${monthsRegistered} months ago`
//     } else {
//       const daysRegistered = currentDate.getDay() - user.registered.date.getDay()
//       return `<strong>Registered:</strong> ${daysRegistered} days ago`
//     }
//   }
// }

if (window.location.pathname === '/details.html') {
  loadUserDetails();
} else {
  fetchUser();
}
