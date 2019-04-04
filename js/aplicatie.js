function preiaProdusele() {
    let url = "https://magazinelectronic-fa84a.firebaseio.com/produse.json";
        fetch(url)
            .then(response => {
                if(response.ok) {
                    return response;
                }
                throw Error(response.statusText);
            })
            .then(response => response.json())
            .then(produse => {
                console.log(produse);
                let zonaProduse = document.querySelector('#produse');
                for(id in produse) {
                    zonaProduse.innerHTML += `
                        <div class="articolComercial">
                            <img src="${produse[id].imagine}">
                            <h2>${produse[id].nume}</h2>
                            <p>${produse[id].pret}&nbsp;&euro;</p>
                            <button>
                                <a href="details.html?id=${id}">Detalii</a>
                            </button>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.log('There was an error: ', error)
            });
}