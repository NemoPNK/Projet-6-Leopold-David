const gallery = document.querySelector(".gallery");
const filt = document.querySelector(".filter");

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

