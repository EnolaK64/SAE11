const vehicule = [];
const passager = [];
const url = new URL(location.href); // on crée un objet URL avec le constucteur URL
const searchParams = new URLSearchParams(url.search); // on crée un objet searchParams

const reservation = searchParams.get("reservation");
console.log(reservation);

fetch(`https://can.iutrs.unistra.fr/api/reservation/${reservation}`).then(
	(response) => {
		response.json().then((data) => {
			console.log(data);
			completerReservation(data);
			compterCategoriePersonne(data.nbPassagers);
			compterCategorieVehicule(data.nbVehicules);
		});
	}
);

function completerReservation(data) {
	const [reservationE, nomReservationE] = document
		.querySelector(".infoReservation")
		.querySelectorAll("span");

	reservationE.innerText = reservation;
	nomReservationE.innerText = data.nom;

	const [traveree, date, depart, bateau] = document
		.querySelector(".infoVoyage")
		.querySelectorAll("span");

	traveree.innerText = data.portDepart + " - " + data.portArrivee;
	date.innerText = data.date;
	depart.innerText = data.heure;
	bateau.innerText = data.bateau;

	const dateFacture = document.querySelector(".dateFacture");
	dateFacture.innerText = data.date;
}

function compterCategoriePersonne(nbPassagers) {
	for (let i = 1; i < nbPassagers + 1; i++) {
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${reservation}/passager/${i}`
		).then((response) => {
			response.json().then((data) => {
				passager.push(data);
				if (passager.length === nbPassagers) {
					const nbCat = {};
					const dicoPrix = new Map();
					passager.sort((a, b) => {
						return a.price < b.price;
					});

					passager.map((data) => {
						const code = data.libelleCategorie;

						if (nbCat[code] === undefined) {
							nbCat[code] = 1;
							dicoPrix.set(code, data.price);
						} else {
							nbCat[code] += 1;
						}
					});
					console.log(nbCat, dicoPrix);
					remplireTableauPersonne(nbCat, dicoPrix);
				}
			});
		});
	}
}
function compterCategorieVehicule(nbVehicules) {
	for (let i = 1; i < nbVehicules + 1; i++) {
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${reservation}/vehicule/${i}`
		).then((response) => {
			response.json().then((data) => {
				vehicule.push(data);
				if (vehicule.length === nbVehicules) {
					const nbCat = {};
					const dicoPrix = new Map();
					vehicule.sort((a, b) => {
						return a.prix < b.prix;
					});

					vehicule.map((data) => {
						const code = data.libelle;

						if (nbCat[code] === undefined) {
							nbCat[code] = 1;
							dicoPrix.set(code, data.prix);
						} else {
							nbCat[code] += 1;
						}
					});
					console.log(nbCat, dicoPrix);
					remplireTableauVehicule(nbCat, dicoPrix);
				}
			});
		});
	}
}

function remplireTableauPersonne(nbCat, dicoPrix) {
	const tablePersonne = document.getElementById("personne");
	let sousTotal = 0;
	for (let i = 0; i < Object.keys(nbCat).length; i++) {
		const ligne = document.createElement("tr");

		const cat = Object.keys(nbCat)[i];

		const caseCat = document.createElement("td");
		const nb = document.createElement("td");
		const prixU = document.createElement("td");
		const prixLE = document.createElement("td");

		caseCat.innerText = cat;
		nb.innerText = nbCat[cat];
		prixU.innerText = dicoPrix.get(cat) + "€";

		const prixL = dicoPrix.get(cat) * nbCat[cat];
		prixLE.innerText = prixL + "€";
		sousTotal += prixL;

		ligne.append(caseCat, nb, prixU, prixLE);

		tablePersonne.append(ligne);
	}
	const prixVehicule = document.getElementById("prixPersonnes");
	prixVehicule.innerText = sousTotal + "€";
	sousTotaux.push(sousTotal);
	calculerTotal();
}

function remplireTableauVehicule(nbCat, dicoPrix) {
	const tablePersonne = document.getElementById("vehicule");
	let sousTotal = 0;
	for (let i = 0; i < Object.keys(nbCat).length; i++) {
		const ligne = document.createElement("tr");

		const cat = Object.keys(nbCat)[i];

		const caseCat = document.createElement("td");
		const nb = document.createElement("td");
		const prixU = document.createElement("td");
		const prixLE = document.createElement("td");

		caseCat.innerText = cat;
		nb.innerText = nbCat[cat];
		prixU.innerText = dicoPrix.get(cat) + "€";

		const prixL = dicoPrix.get(cat) * nbCat[cat];
		prixLE.innerText = prixL + "€";
		sousTotal += prixL;

		ligne.append(caseCat, nb, prixU, prixLE);

		tablePersonne.append(ligne);
	}
	const prixVehicule = document.getElementById("prixVehicules");
	prixVehicule.innerText = sousTotal + "€";
	sousTotaux.push(sousTotal);
	calculerTotal();
}
let sousTotaux = [];
function calculerTotal() {
	if (sousTotaux.length === 2) {
		const totalE = document.querySelector(".totalFacture");
		totalE.innerText = sousTotaux[0] = sousTotaux[1] + "€";
	}
}
