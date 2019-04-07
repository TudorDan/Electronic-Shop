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
            //console.log(produse);
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

function incarcaProdus() {
    let id = window.location.search.split(/=/g)[1];
    let url = `https://magazinelectronic-fa84a.firebaseio.com/produse/${id}.json`;
    fetch(url)
        .then(response => {
            if(response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(produs => {
            console.log(produs);
            document.querySelector('#imagine').src = produs.imagine;
            let zonaProdus = document.querySelector('#info');
            zonaProdus.innerHTML = `
                <h2>${produs.nume}</h2>
                <p>${produs.descriere}</p>
                <p>${produs.pret}&nbsp;&euro;</p>
                <p>În stoc: ${produs.stoc} buc.</p>
                <p>Cantitate: <input type="number" value="1" min="1" max="${produs.stoc}"></p>
                <button onclick="adaugaInCos(${id}, '${produs.nume}', ${produs.pret});">Adaugă în coș</button>
            `;
        })
        .catch(error => {
            console.log('There was an error: ', error)
        });
}

function adaugaInCos(id, nume, pret) {
    let cantitate = document.querySelector('#info input').value;
    let produs = {
        'id': id,
        'nume': nume,
        'pret': pret,
        'cantitate': cantitate
    };
    let key = 'id' + id;
    window.localStorage.setItem(key, JSON.stringify(produs));
    deschideModal(produs.nume);
}

function deschideModal(nume) {
    console.log(nume);
    let zonaModal = document.querySelector('#modalAdaugareProdus');
    zonaModal.innerHTML = `Produsul „${nume}” a fost adăugat în coș!`;
    zonaModal.style.display = 'block';
    setTimeout( () => {
        zonaModal.style.display = 'none';
    }, 3500);
}