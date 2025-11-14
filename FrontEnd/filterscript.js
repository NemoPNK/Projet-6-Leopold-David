const token = localStorage.getItem("token");
const gallery = document.querySelector(".gallery");
const filt = document.querySelector(".filter");

if (token) {
    const editmode = document.querySelector(".editmode");
    if (editmode) editmode.style.display = "flex";

    const filterBar = document.querySelector(".filter");
    if (filterBar) filterBar.style.display = "none";

    const loginLink = document.querySelector('nav li[onclick*="login.html"]');
    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.onclick = () => {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        };
    }

    const editProject = document.querySelector(".editproject");
    if (editProject) {
        const editp = document.createElement("p");
        editp.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>Modifier';
        editProject.appendChild(editp);
    }
}

let allWorks = [];

function filterGallery(works) {
    gallery.innerHTML = "";
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        allWorks = data;
        filterGallery(allWorks);
    })


fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const newButton = document.createElement("button");
        newButton.textContent = "Tous";
        newButton.dataset.category = "all";
        filt.appendChild(newButton);

        categories.forEach(cat => {
            const button = document.createElement("button");
            button.textContent = cat.name;
            button.dataset.category = cat.id;
            filt.appendChild(button);
        });

        const buttons = document.querySelectorAll('.filter button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.dataset.category;
                if (category === "all") {
                    filterGallery(allWorks);
                } else {
                    const filtered = allWorks.filter(work => work.categoryId == category);
                    filterGallery(filtered);
                }
            });
        });
    });


(() => {
    const modal = document.querySelector('.modale');
    const modalContent = document.querySelector('.modale-content');
    const btnClose = document.getElementById('modale-close');
    const opener = document.querySelector('.editproject');

    function openModal() {
        modal.classList.add('open');
        loadModalGallery();
        document.body.classList.add('modal-open');
    }

    function loadModalGallery() {
        const modalGallery = document.querySelector('.modale-img');
        if (!modalGallery) return;
        modalGallery.innerHTML = '';

        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                data.forEach(work => {
                    const figure = document.createElement('figure');
                    figure.classList.add('modal-figure');

                    const img = document.createElement('img');
                    img.src = work.imageUrl;
                    img.alt = work.title;

                    const del = document.createElement('i');
                    del.classList.add('fa-solid', 'fa-trash-can');
                    del.addEventListener('click', async (e) => {
                        try {
                          const res = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (res.ok || res.status === 204) {
                            figure.remove();
                            const mainGalleryImg = document.querySelector(`.gallery img[src="${work.imageUrl}"]`);
                            if (mainGalleryImg) {
                              mainGalleryImg.closest('figure').remove();
                            }
                          }
                        } catch (_) {}
                      });

                    figure.appendChild(img);
                    figure.appendChild(del);
                    modalGallery.appendChild(figure);
                });
            });
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
    }

    opener && opener.addEventListener('click', openModal);
    btnClose && btnClose.addEventListener('click', closeModal);

    modal && modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
})();
