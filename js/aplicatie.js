function preiaProdusele() {
    let url = "https://magazinelectronic-fa84a.firebaseio.com/produse.json";
    return fetch(url)
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
            for(let i in produse) {
                zonaProduse.innerHTML += `
                    <div class="articolComercial">
                        <img src="${produse[i].imagine}">
                        <h2>${produse[i].nume}</h2>
                        <p>${produse[i].pret}&nbsp;&euro;</p>
                        <button>
                            <a href="details.html?id=${i}">Detalii</a>
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
    return fetch(url)
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
        'cantitate': cantitate,
        'subtotal': pret*cantitate
    };
    let produse = JSON.parse(localStorage.getItem('produse'));
    if(produse) {
        produse.push(produs);
    } else {
        produse = [produs];
    }
    //console.log(produse);
    window.localStorage.setItem('produse',JSON.stringify(produse));
    deschideModal(produs.nume);
}

function afiseazaCos() {
    let produse = JSON.parse(localStorage.getItem('produse'));
    //console.log(produse);
    if(produse) {
        let tabel = document.querySelector('#infoCos tbody');
        let total = 0;
        tabel.innerHTML = '';
        for(let i in produse) {
            tabel.innerHTML += `
                <tr>
                    <td><a href="details.html?id=${produse[i].id}">${produse[i].nume}</a></td>
                    <td>${produse[i].pret} &euro;</td>
                    <td>
                        <button onclick="scadeCantitate(${i});">-</button> 
                        ${produse[i].cantitate} 
                        <button onclick="cresteCantitate(${i});">+</button> 
                    </td>
                    <td>${produse[i].subtotal} &euro;</td>
                    <td><button onclick="stergeProdusCos(${i});">Șterge</button></td>
                </tr>
            `;
            total += produse[i].subtotal;
        }
        let info = document.querySelector('#totalAjax');
        info.innerHTML = `
            <p>Număr produse: ${produse.length}</p>
            <p>TVA: 0%</p>
            <p>Transport: 0 &euro;</p>
            <p>TOTAL: ${total} &euro;</p>
        `;
    } else {
        console.log('cos gol');
    }
}

function scadeCantitate(i) {
    let produse = JSON.parse(localStorage.getItem('produse'));
    if(produse) {
        if(produse[i].cantitate > 0) {
            produse[i].cantitate--;
            produse[i].subtotal = produse[i].cantitate * produse[i].pret;
            window.localStorage.setItem('produse',JSON.stringify(produse));
            afiseazaCos();
        }
    }
}

function cresteCantitate(i) {
    let produse = JSON.parse(localStorage.getItem('produse'));
    if(produse) {
        produse[i].cantitate++;
        produse[i].subtotal = produse[i].cantitate * produse[i].pret;
        window.localStorage.setItem('produse',JSON.stringify(produse));
        afiseazaCos();
    }
}

function stergeProdusCos(i) {
    let produse = JSON.parse(localStorage.getItem('produse'));
    if(produse) {
        produse.splice(i,1);
        window.localStorage.setItem('produse',JSON.stringify(produse));
        afiseazaCos();
    }    
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