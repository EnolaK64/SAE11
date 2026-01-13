//on initialise les variables vehicule et passager
const vehicule = [];
const passager = [];
const url = new URL(location.href); // on crée un objet URL avec le constucteur URL
const searchParams = new URLSearchParams(url.search); // on crée un objet searchParams

const reservation = searchParams.get("reservation"); // on recupère le numero de réservation contenue dans l'url

const prixPersonnes = document.getElementById("prixPersonnes");
const prixVehicule = document.getElementById("prixVehicules");

fetch(`https://can.iutrs.unistra.fr/api/reservation/${reservation}`).then(
	(response) => {
		response.json().then((data) => {
			completerReservation(data);
			//on verifie que le nombre de passager n'est pas 0
			if (data.nbPassagers > 0) {
				compterCategoriePersonne(data.nbPassagers);
			} else {
				//sinon on ajoute false à la liste des sousTotaux
				sousTotaux.push(false);
				//et on affiche 0 pour le sous total des passagers
				prixPersonnes.innerText = "0.00€";
			}
			//on verifie que le nombre de véhicule n'est pas 0
			if (data.nbVehicules > 0) {
				compterCategorieVehicule(data.nbVehicules);
			} else {
				//sinon on ajoute false à la liste des sousTotaux
				sousTotaux.push(false);
				//et on affiche 0 pour le sous total des véhicule
				prixVehicule.innerText = "0.00€";
			}
		});
	}
);

function completerReservation(data) {
	//la fonction remplis les champs relatifs aux informations général de la réservation
	//on selectionne les elements concerné
	const [reservationE, nomReservationE] = document
		.querySelector(".infoReservation")
		.querySelectorAll("span");

	//on remplis leurs contenu
	reservationE.innerText = reservation;
	nomReservationE.innerText = data.nom;

	//on selectionne les elements concerné
	const [traveree, date, depart, bateau] = document
		.querySelector(".infoVoyage")
		.querySelectorAll("span");

	//on remplis leurs contenu
	traveree.innerText = data.portDepart + " - " + data.portArrivee;
	date.innerText = data.date;
	depart.innerText = data.heure;
	bateau.innerText = data.bateau;

	const dateFacture = document.querySelector(".dateFacture");
	dateFacture.innerText = data.date;
}

function compterCategoriePersonne(nbPassagers) {
	//la fonction compte combien de fois revient une categorie dans la reservation
	for (let i = 1; i < nbPassagers + 1; i++) {
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${reservation}/passager/${i}`
		).then((response) => {
			response.json().then((data) => {
				passager.push(data); // chaque personne est ajouté à la liste passager
				if (passager.length === nbPassagers) {
					// si la liste contient autant de passagers qu'il y a de passagers dans la reservation alors
					const nbCat = {}; //on initialise un objet nbCat
					const dicoPrix = new Map(); // on initialise un dictionnaire dicoPrix

					// on trie la liste du prix décroissant
					passager.sort((a, b) => {
						return a.price < b.price;
					});

					//pour chaque passager dans la liste
					passager.map((data) => {
						//on recupère la categorie dans categ
						const categ = data.libelleCategorie;

						// on regarde si la categorie est deja apparue
						if (nbCat[categ] !== undefined) {
							//si oui on incremente son nombre d'apparition
							nbCat[categ] += 1;
						} else {
							//sinon on le met à 1 et on ajoute son prix unitaire au dictionnaire
							nbCat[categ] = 1;
							dicoPrix.set(categ, data.price);
						}
					});
					remplireTableauPersonne(nbCat, dicoPrix); //on remplis le tableau avec le informations traité
				}
			});
		});
	}
}
function compterCategorieVehicule(nbVehicules) {
	// la fonction fait la même chose que la fonction compterCategoriePersonne mais avec le vehicule
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
	// la fontion replis le tableau des personnes avec les donnée reçu
	const tablePersonne = document.getElementById("personne"); // on recupère le tableau

	let sousTotal = 0; // initilise le sousTotal à 0

	for (let i = 0; i < Object.keys(nbCat).length; i++) {
		//pour chaque categories
		//on recupère le libellé de la categorie
		const cat = Object.keys(nbCat)[i];

		const ligne = document.createElement("tr"); // on crée un element tr qui est une ligne de tableau

		//on crée les case d'une ligne du tableau
		const caseCat = document.createElement("td");
		const nb = document.createElement("td");
		const prixU = document.createElement("td");
		const prixLE = document.createElement("td");

		// on calcule le prix de la ligne
		const prixL = dicoPrix.get(cat) * nbCat[cat];

		// on mette le text correspondant à chaque case
		caseCat.innerText = cat;
		nb.innerText = nbCat[cat];
		prixU.innerText = dicoPrix.get(cat) + "€";
		prixLE.innerText = prixL + "€";

		// on incrémente le sousTotal par le prix de la ligne
		sousTotal += prixL;

		//on ajoute à la ligne les cases
		ligne.append(caseCat, nb, prixU, prixLE);

		// et on fini par ajouter la ligne au tableau
		tablePersonne.append(ligne);
	}

	// on recupère l'element pour le sous total du tableau

	//on lui donne le sous total
	prixPersonnes.innerText = sousTotal + "€";

	//ajoute le sous total à la liste des sous totaux pour en faire la somme
	sousTotaux.push(sousTotal);
	// on calcule la somme des sous totaux
	calculerTotal();
}

function remplireTableauVehicule(nbCat, dicoPrix) {
	// la fonction fait la même chose que la fonction remplireTableauPersonne mais pour les véhicules
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
	prixVehicule.innerText = sousTotal + "€";
	sousTotaux.push(sousTotal);
	calculerTotal();
}

let sousTotaux = []; // on initialise la variable sous Totaux qui va contenir tout les sous totaux pour en faire la somme
function calculerTotal() {
	// la fonction parcours tout le tableau soustotaux pour en faire la somme et l'affiche
	if (sousTotaux.length === 2) {
		const totalE = document.querySelector(".totalFacture");
		totalE.innerText = sousTotaux[0] = sousTotaux[1] + "€";
	}
}
