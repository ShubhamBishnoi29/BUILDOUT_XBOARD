let magazines_url_arr = magazines.map((val) => {
    let json_url = "https://api.rss2json.com/v1/api.json?rss_url=" + val;
    return json_url;
});

async function fetchData(url) {
    try {
        let res = await fetch(url);
        let jsonData = await res.json();
        return jsonData;
    } catch (err) {
        throw new Error(err);
    }
}

async function getData(arr) {
    let jsonDataArr = [];
    for (let i = 0; i < arr.length; i++){
        let jsonData = await fetchData(arr[i]);
        jsonDataArr.push(jsonData);
    }
    return jsonDataArr;
}

function addCarouselToDOM(data, index) {

    let itemArray = data.items;
    let carousel_Id = "carousel_" + index;
    let carouselInner = document.getElementById(carousel_Id);

    for (let i = 0; i < itemArray.length; i++){

        let publishDate = new Date(itemArray[i].pubDate);

        let divElement = document.createElement('div');
        i == 0 ? divElement.classList.add('carousel-item', 'active') : divElement.classList.add('carousel-item');
        divElement.innerHTML = `
            <a  href=${itemArray[i].link} style="cursor: pointer; text-decoration: none;">
                <div class="card">
                    <img src=${itemArray[i].enclosure.link} class="card-img-top" alt=${itemArray[i].title}>
                    <div class="card-body">
                        <h5 class="card-title">${itemArray[i].title}</h5>
                            <div class="reporter-detail">
                                <p class="reporter-name">${itemArray[i].author}</p>
                                <div></div>
                                <p class="report-date">${publishDate.toLocaleDateString()}</p>
                            </div>
                            <p class="card-text">${itemArray[i].description}</p>
                        </div>
                </div>
            </a>
        `;

        carouselInner.append(divElement);
    }
}

function addAccordionToDOM(data) {

    let accordionDivElement = document.getElementById('accordionExample');
    
    for (let i = 0; i < data.length; i++){
        let accordionItemElement = document.createElement('div');
        accordionItemElement.classList.add('accordion-item');

        accordionItemElement.innerHTML = `
                <h2 class="accordion-header" id="heading_${i}">
                    <button id="heading_button_${i}" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${i}" aria-controls="collapse_${i}">
                        ${data[i].feed.title}
                    </button>
                </h2>
                <div id="collapse_${i}" class="accordion-collapse collapse" aria-labelledby="heading_${i}" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div id="carouselExampleControls_${i}" class="carousel carousel-dark slide" data-bs-ride="carousel">
                            <div id="carousel_${i}" class="carousel-inner">
                                                               
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls_${i}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls_${i}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        
        accordionDivElement.append(accordionItemElement);

        let buttonElement = document.getElementById(`heading_button_${i}`);
        let collapseElement = document.getElementById(`collapse_${i}`);
        if (i == 0) {
            buttonElement.setAttribute("aria-expanded", "true");
            collapseElement.classList.add('show');
        } else {
            buttonElement.classList.add('collapsed');
            buttonElement.setAttribute("aria-expanded", "false");
        }

        addCarouselToDOM(data[i], i);
    }
}

function addDataToDOM(data) {   
    addAccordionToDOM(data);
}

export {
  magazines_url_arr,
  getData,
  addDataToDOM,
};

