let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById('toy-collection');
  const toyForm = document.querySelector('.add-toy-form');

  function fetchToys() {
      fetch('http://localhost:3000/toys')
          .then(response => response.json())
          .then(toys => toys.forEach(renderToy));
  }

  function renderToy(toy) {
      const card = document.createElement('div');
      card.classList.add('card');
      
      const h2 = document.createElement('h2');
      h2.textContent = toy.name;

      const img = document.createElement('img');
      img.src = toy.image;
      img.classList.add('toy-avatar');

      const p = document.createElement('p');
      p.textContent = `${toy.likes} Likes`;

      const likeBtn = document.createElement('button');
      likeBtn.classList.add('like-btn');
      likeBtn.textContent = 'Like ❤️';
      likeBtn.dataset.id = toy.id;
      likeBtn.addEventListener('click', increaseLikes);

      card.appendChild(h2);
      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(likeBtn);

      toyCollection.appendChild(card);
  }

  toyForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = event.target.name.value;
      const image = event.target.image.value;

      fetch('http://localhost:3000/toys', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({
              name,
              image,
              likes: 0
          })
      })
      .then(response => response.json())
      .then(newToy => {
          renderToy(newToy);
          event.target.reset();
      });
  });


  function increaseLikes(event) {
      const toyId = event.target.dataset.id;
      const likeElement = event.target.previousElementSibling;
      const currentLikes = parseInt(likeElement.textContent);
      const newLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toyId}`, {
          method: 'PATCH',
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({
              likes: newLikes
          })
      })
      .then(response => response.json())
      .then(updatedToy => {
          likeElement.textContent = `${updatedToy.likes} Likes`;
      });
  }

  fetchToys();
});