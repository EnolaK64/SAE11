const passagersDiv = document.getElementById("passagers");
const vehiculesDiv = document.getElementById("vehicules");

const resevation = 1;
let passager;
let vehicule;

fetch(`https://can.iutrs.unistra.fr/api/reservation/${resevation}`).then(
	(reponse) => {
		reponse.json().then((data) => {
			creerCartes(data.nbPassagers, data.nbVehicules);
			traiterReservation(data);

			chercherPassagers(data.nbPassagers);
			chercherVehicules(data.nbVehicules);
		});
	}
);

function creerCartes(nbPassagers, nbVehicule) {
	const cartePassager = document.querySelector(".carte");
	for (let i = 1; i < nbPassagers; i++) {
		const cloneCarte = cartePassager.cloneNode(true);
		passagersDiv.appendChild(cloneCarte);
	}

	const carteVehicule = document.querySelector(".carteVehicule");
	for (let i = 1; i < nbVehicule; i++) {
		const cloneCarte = carteVehicule.cloneNode(true);
		vehiculesDiv.appendChild(cloneCarte);
	}
	// carte.remove();
}

function traiterReservation(data) {
	for (let i = 0; i < data.nbPassagers + data.nbVehicules; i++) {
		const infoBateau = document.querySelectorAll(".infoBateau")[i];
		const personne = document.querySelectorAll(".personne")[i];
		const [gareDepart, gareArrivee, date, heureDepart, bateau] =
			infoBateau.querySelector(".valeur").children;
		const [reservation, nom] = personne.querySelector(".valeur").children;
		// ajouter boucle pour changer de carte

		gareDepart.innerHTML = data.portDepart;
		gareArrivee.innerHTML = data.portArrivee;
		date.innerHTML = data.date;
		heureDepart.innerHTML = data.heure;
		bateau.innerHTML = data.bateau;

		reservation.innerHTML = data.id;
		nom.innerHTML = data.nom;
	}
}

function chercherPassagers(nbPassagers) {
	for (let i = 1; i < nbPassagers; i++) {
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${resevation}/passager/${i}`
		).then((reponse) => {
			reponse.json().then((data) => {
				traiterPassager(i, data);
			});
		});
	}
}

function chercherVehicules(nbVehicule) {
	for (let i = 1; i < nbVehicule; i++) {
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${resevation}/vehicule/${i}`
		).then((reponse) => {
			reponse.json().then((data) => {
				traiterVehicule(i, data);
			});
		});
	}
}

function traiterPassager(id, data) {
	const passagerInfo = document.querySelectorAll(".passagerInfo")[id - 1];
	const [nom, prenom, categorie, prix] =
		passagerInfo.querySelector(".valeur").children;

	nom.innerHTML = data.nom;
	prenom.innerHTML = data.prenom;
	categorie.innerHTML = data.libelleCategorie;
	prix.innerHTML = data.price;
}

function traiterVehicule(id, data) {
	const vehiculeInfo = document.querySelectorAll(".vehiculeInfo")[id - 1];
	const [categorie, nombre, prix] =
		vehiculeInfo.querySelector(".valeur").children;
	nombre.innerHTML = data.quantite;
	categorie.innerHTML = data.libelle;
	prix.innerHTML = data.prix;
}
