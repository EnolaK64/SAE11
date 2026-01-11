const affichageDiv = document.getElementById("affichage");
const cartes = [];
const url = new URL(location.href); // on crée un objet URL avec le constucteur URL
const searchParams = new URLSearchParams(url.search); // on crée un objet searchParams

const reservation = +searchParams.get("reservation"); // on récupére le numéro de la réservation contenue dans le paramètre de recherche "reservation"
let carteSelectionne = 0;
if (reservation === "") {
	// on vérifie que le numéro de reservation n'est pas vide
	location.replace("./selectionReserv.html"); // dans quel cas on renvoie l'utilisateur sur la page de selection de reserveration
}

fetch(`https://can.iutrs.unistra.fr/api/reservation/${reservation}`).then(
	// on effectue un requete au serveur pour récupérer les informations sur la reservation
	(reponse) => {
		reponse.json().then((data) => {
			creerCartes(data.nbPassagers, data.nbVehicules, data); // la fonction "creerCartes" est appeler avec le nombre de passagers et le nombre de vehicules en paramètre
			afficherCarte();
		});
	}
);

function creerCartes(nbPassagers, nbVehicule, data) {
	// la fonction creerCartes est déclaré
	const cartePassager = document.querySelector(".carte"); // elle récupére dans le DOM l'element de class carte et le stocke dans la variable cartePassager
	for (let i = 1; i < nbPassagers; i++) {
		// pour chaque passagers...
		const cloneCarte = cartePassager.cloneNode(true); // on crée une copie de l'element .carte
		chercherPassagers(i, cloneCarte);
		traiterReservation(cloneCarte, data);
		cartes.push(cloneCarte);
	}

	//on refait la même chose mais pour les vehicules et on clone le carte des vehicules
	const carteVehicule = document.querySelector(".carteVehicule");
	for (let i = 1; i < nbVehicule; i++) {
		const cloneCarte = carteVehicule.cloneNode(true);
		chercherVehicules(i, cloneCarte);
		traiterReservation(cloneCarte, data);
		cartes.push(cloneCarte);
	}
}

function traiterReservation(carte, data) {
	const infoBateau = carte.querySelector(".infoBateau");
	const personne = carte.querySelector(".personne");
	const [gareDepart, gareArrivee, date, heureDepart, bateau] =
		infoBateau.querySelector(".valeur").children;
	const [reservation, nom] = personne.querySelector(".valeur").children;

	//et on change de le contenue de tout les element avec les données reçu
	gareDepart.innerHTML = data.portDepart;
	gareArrivee.innerHTML = data.portArrivee;
	date.innerHTML = data.date;
	heureDepart.innerHTML = data.heure;
	bateau.innerHTML = data.bateau;

	reservation.innerHTML = data.id;
	nom.innerHTML = data.nom;
}

function chercherPassagers(nbPassager, carte) {
	fetch(
		`https://can.iutrs.unistra.fr/api/reservation/${reservation}/passager/${nbPassager}`
	).then((reponse) => {
		reponse.json().then((data) => {
			traiterPassager(carte, data); // et on les envoie à la fonction traiterPassager
		});
	});
}

function chercherVehicules(nbVehicule, carte) {
	fetch(
		`https://can.iutrs.unistra.fr/api/reservation/${reservation}/vehicule/${nbVehicule}`
	).then((reponse) => {
		//Note l'utilisation du .then() permet de ne pas bloquer l'execution du code en attendant la reponse du serveur ce qui permet d'envoyer et traiter les requetes en parallèle
		reponse.json().then((data) => {
			traiterVehicule(carte, data); // et on les envoie à la fonction traiterVehicule
		});
	});
}

function traiterPassager(carte, data) {
	//on déclare la fonction traitrerPassager
	// const passagerInfo = document.querySelectorAll(".passagerInfo")[id - 1]; //on selection la carte du passagers dont on a reçu ses informations
	console.log(carte);
	// affichageDiv.appendChild(carte);
	const [nom, prenom, categorie, prix] = carte
		.querySelector(".passagerInfo")
		.querySelector(".valeur").children; // on selection les champs dont nous avons besoin

	//et on ecris les informations reçu dans les champs
	nom.innerHTML = data.nom;
	prenom.innerHTML = data.prenom;
	categorie.innerHTML = data.libelleCategorie;
	prix.innerHTML = data.price;
}

function traiterVehicule(carte, data) {
	//on déclare la fonction traitrerVehicule
	const [categorie, nombre, prix] = carte
		.querySelector(".vehiculeInfo")
		.querySelector(".valeur").children; // on selection les champs dont nous avons besoin

	//et on ecris les informations reçu dans les champs
	nombre.innerHTML = data.quantite;
	categorie.innerHTML = data.libelle;
	prix.innerHTML = data.prix;
}

function afficherCarte() {
	const cartesEnfant = affichageDiv.children;
	for (let i = 0; i < cartesEnfant.length; i++) {
		const element = cartesEnfant[i];
		element.remove();
	}
	affichageDiv.append(cartes[carteSelectionne]);
}

const btnGauche = document.getElementById("btnGauche");
const btnDroit = document.getElementById("btnDroit");

btnGauche.addEventListener("click", () => {
	if (carteSelectionne >= 1) {
		carteSelectionne -= 1;
	}
	afficherCarte();
});

btnDroit.addEventListener("click", () => {
	if (carteSelectionne < cartes.length) {
		carteSelectionne += 1;
	}
	afficherCarte();
});
