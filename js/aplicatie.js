function preiaProdusele() {
    let url = "https://magazinelectronic-fa84a.firebaseio.com/produse.json";
    let zonaProduse = document.querySelector('#produse');
    zonaProduse.innerHTML = `
        <div class="loadingGif">
            <img src="img/gif/pyramidSpinning.gif">
            <p>Se încarcă produsele...</p>
        </div>
    `;
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
            setTimeout( () => {
                zonaProduse.innerHTML = '';
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
            }, 3000);
            
        })
        .catch(error => {
            console.log('There was an error: ', error);
            document.querySelector('#carusel').innerHTML = '';
            zonaProduse.innerHTML = `
                <div class="loadingGif">
                    <img src="img/gif/pyramidSpinning.gif">
                    <p class="eroare">Eroare la comunicarea cu serverul - verificați conexiunea la Internet...</p>
                </div>
            `;
        });
}

function incarcaProdus() {
    let id = window.location.search.split(/=/g)[1];
    let url = `https://magazinelectronic-fa84a.firebaseio.com/produse/${id}.json`;
    let zonaProdus = document.querySelector('#info');
    zonaProdus.innerHTML = `
        <div class="loadingGif">
            <img src="img/gif/spinningDiamond.gif">
            <p>Se încarcă produsul...</p>
        </div>
    `;
    return fetch(url)
        .then(response => {
            if(response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then(response => response.json())
        .then(produs => {
            //console.log(produs);
            setTimeout( () => {
                document.querySelector('#imagine').src = produs.imagine;
                zonaProdus.innerHTML = '';
                zonaProdus.innerHTML = `
                    <h2>${produs.nume}</h2>
                    <p>${produs.descriere}</p>
                    <p>${produs.pret}&nbsp;&euro;</p>
                    <p>În stoc: ${produs.stoc} buc.</p>
                    <p>Cantitate: <input type="number" value="1" min="1" max="${produs.stoc}"></p>
                    <button onclick="adaugaInCos('${id}', '${produs.nume}', ${produs.pret});">Adaugă în coș</button>
                `;
            }, 3000);
        })
        .catch(error => {
            console.log('There was an error: ', error);
            zonaProdus.innerHTML = `
                <div class="loadingGif">
                    <img src="img/gif/spinningDiamond.gif">
                    <p class="eroare">Eroare la comunicarea cu serverul - verificați conexiunea la Internet...</p>
                </div>
            `;
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
        let existaProdus = false;
        for(let i in produse) {
            if(produse[i].id === produs.id) {
                produse[i].cantitate = Number(produse[i].cantitate) + Number(produs.cantitate);
                produse[i].subtotal = produse[i].pret * produse[i].cantitate;
                existaProdus = true;
                break;
            }
        }
        if(!existaProdus) {
            produse.push(produs);
        }
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
                    <td><button onclick="stergeProdusCos(${i});" class="stergeDinCos">Șterge</button></td>
                </tr>
            `;
            total += produse[i].subtotal;
        }
        //colorăm alternativ rândurile și setăm CSS
        let linii = document.querySelectorAll('tbody tr');
        for(let j = 0; j < linii.length; j++) {
            if(j % 2 === 0) {
                linii[j].style.backgroundColor = '#EAF3F3';
            }
            linii[j].cells[2].style.textAlign = 'center';
            linii[j].cells[4].style.textAlign = 'center';
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
    //console.log(nume);
    let zonaModal = document.querySelector('#modalAdaugareProdus');
    zonaModal.innerHTML = `Produsul „${nume}” a fost adăugat în coș!`;
    zonaModal.style.display = 'block';
    setTimeout( () => {
        zonaModal.style.display = 'none';
    }, 2500);
}

//functii administrare

let idProdus = null;
let produse = [];

async function preiaProduseAdmin() {
    let url = "https://magazinelectronic-fa84a.firebaseio.com/produse.json";
    let zonaProduse = document.querySelector('#produse');
    zonaProduse.innerHTML = `
        <div class="loadingGif">
            <img src="img/gif/cubeSpinning.gif">
            <p>Se încarcă produsele...</p>
        </div>
    `;
    try {
        let raspuns = await fetch(url);
        if(!raspuns.ok) {
            throw new Error(raspuns.statusText);
        } else {
            produse = await raspuns.json();
            setTimeout( () => {
                zonaProduse.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Imagine</th>
                                <th>Nume</th>
                                <th>Preț</th>
                                <th>Cantitate</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                `;
                let tbody = document.querySelector('tbody');
                for(let id in produse) {
                    tbody.innerHTML += `
                        <tr>
                            <td><img src="${produse[id].imagine}" height="30px"></td>
                            <td><a href="#" onclick="afiseazaFormular('${id}');">${produse[id].nume}</a></td>
                            <td>${produse[id].pret}&nbsp;&euro;</td>
                            <td>${produse[id].stoc}</td>
                            <td><button onclick="stergeProdusAdmin('${id}','${produse[id].nume}');">Șterge</button></td>
                        </tr>
                    `;
                }
                //colorăm alternativ rândurile și setăm CSS
                let linii = document.querySelectorAll('tbody tr');
                for(let j = 0; j < linii.length; j++) {
                    if(j % 2 !== 0) {
                        linii[j].style.backgroundColor = '#CCF1FA';
                    }
                    linii[j].cells[4].style.textAlign = 'center';
                }
            }, 3000);
        }
    } catch(error) {
        console.log('Eroare: ', error);
        zonaProduse.innerHTML = `
            <div class="loadingGif">
                <img src="img/gif/cubeSpinning.gif">
                <p class="eroare">Eroare la comunicarea cu serverul - verificați conexiunea la Internet...</p>
            </div>
        `;
    }
}

function afiseazaFormular(id) {
    let formular = document.querySelector('form');
    if(id === null) {
        idProdus = null;
        document.querySelector('[type="submit"]').value = 'Adaugă';
        formular.reset();
    } else {
        idProdus = id;
        document.querySelector('[type="submit"]').value = 'Modifică';
        document.querySelector('[name="descriere"]').value = produse[id].descriere;
        document.querySelector('[name="imagine"]').value = produse[id].imagine;
        document.querySelector('[name="nume"]').value = produse[id].nume;
        document.querySelector('[name="pret"]').value = produse[id].pret;
        document.querySelector('[name="stoc"]').value = produse[id].stoc;
    }
    let stergeAntet = document.querySelector('#antet');
    stergeAntet.style.display = 'none';
    let tabel = document.querySelector('table');
    formular.style.display = ''; //stergem "display:none;" din admin.html
    tabel.style.display = 'none';
}

function afiseazaTabel() {
    let apareAntet = document.querySelector('#antet');
    apareAntet.style.display = 'flex';
    idProdus = null;
    document.querySelector('[type="submit"]').value = 'Adaugă';
    document.querySelector('form').style.display = 'none';
    document.querySelector('table').style.display = ''; //stergem "display:none;"
}

async function adaugaInBaza(event) {
    event.preventDefault();
    let stergeAntet = document.querySelector('#antet'); //poate fi sters
    stergeAntet.style.display = 'none'; //poate fi sters

    let produs = {};
    produs.descriere = document.querySelector('[name="descriere"]').value;
    produs.imagine = document.querySelector('[name="imagine"]').value;
    produs.nume = document.querySelector('[name="nume"]').value;
    produs.pret = document.querySelector('[name="pret"]').value;
    produs.stoc = document.querySelector('[name="stoc"]').value;
    if(produs.descriere && produs.imagine && produs.nume && produs.pret && produs.stoc) {
        if (idProdus === null) {
                let url = "https://magazinelectronic-fa84a.firebaseio.com/produse.json";
                try{
                    //adaugare produs nou
                    let raspuns = await fetch(url,{
                        method: "POST",
                        body: JSON.stringify(produs)
                    });
                    if(!raspuns.ok) {
                        throw new Error(raspuns.statusText);
                    }
                } catch(error) {
                    console.log('Eroare (POST): ', error);
                }
                afiseazaTabel();
                await preiaProduseAdmin();
        } else {
            let url = `https://magazinelectronic-fa84a.firebaseio.com/produse/${idProdus}.json`;
            try{
                //actualizare produs existent
                let raspuns = await fetch(url,{
                    method: "PUT",
                    body: JSON.stringify(produs)
                });
                if(!raspuns.ok) {
                    throw new Error(raspuns.statusText);
                }
            } catch(error) {
                console.log('Eroare (PUT): ', error);
            }
            afiseazaTabel();
            await preiaProduseAdmin();
        }
    } else {
        alert("Toate câmpurile din formular sunt obligatorii!");
    }
}

async function stergeProdusAdmin(id, nume) {
    if(window.confirm(`Stergeți produsul „${nume}” din baza de date a magazinului?`)) {
        let url = `https://magazinelectronic-fa84a.firebaseio.com/produse/${id}.json`;
        try{
            //stergere produs existent
            let raspuns = await fetch(url,{
                method: "DELETE"
            });
            if(!raspuns.ok) {
                throw new Error(raspuns.statusText);
            }
        } catch(error) {
            console.log('Eroare (DELETE): ', error);
        }
        await preiaProduseAdmin();
    }
}