const affichageDiv = document.getElementById("affichage"); // selection de la div où seront affichées les cartes d'embarquement
const cartes = []; // creation d'un tableau pour stocker les cartes une fois crées en javascript
const url = new URL(location.href); // on crée un objet URL avec le constucteur URL
const searchParams = new URLSearchParams(url.search); // on crée un objet searchParams
let carteSelectionne = 0; //on initialise la variable carteSelectionne à 0

const reservation = +searchParams.get("reservation"); // on récupère le numéro de la réservation contenue dans le paramètre de recherche "reservation"
if (reservation === "") {
	// on vérifie que le numéro de reservation n'est pas vide
	location.replace("./selectionReserv.html"); // au quel cas on renvoie l'utilisateur sur la page de selection de reserveration
}

fetch(`https://can.emerald-prism.fr/api/reservation/${reservation}`).then(
	// on effectue une requete au serveur pour récupérer les informations sur la reservation
	(reponse) => {
		reponse.json().then((data) => {
			//on convertit la requete json en objet js exploitable
			creerCartes(data.nbPassagers, data.nbVehicules, data); // la fonction "creerCartes" est appelée avec le nombre de passagers et le nombre de vehicules en paramètre
			afficherCarte(); //on affiche la fonction afficher carte
		});
	}
);

function creerCartes(nbPassagers, nbVehicule, data) {
	// la fonction creerCartes est déclarée
	const cartePassager = document.querySelector(".carte"); // elle récupère dans le DOM l'element de class carte et le stocke dans la variable cartePassager
	for (let i = 1; i < nbPassagers + 1; i++) {
		// pour chaque passager...
		const cloneCarte = cartePassager.cloneNode(true); // on créer une copie de l'element .carte
		chercherPassagers(i, cloneCarte); //on appelle la fonction chercherPasasgers on fournit l'element cloneCarte pour qu'il puisse etre modifé par la fonction
		traiterReservation(cloneCarte, data); //de même pour la fonction traiterReservation
		cartes.push(cloneCarte); //on garde ensuite les cartes qui sont des element html dans un tableau
	}

	//on refait la même chose mais pour les vehicules et on clone la carte des vehicules
	const carteVehicule = document.querySelector(".carteVehicule");
	for (let i = 1; i < nbVehicule + 1; i++) {
		const cloneCarte = carteVehicule.cloneNode(true);
		chercherVehicules(i, cloneCarte);
		traiterReservation(cloneCarte, data);
		cartes.push(cloneCarte);
	}
}

function traiterReservation(carte, data) {
	// la fonction va remplir les champs dans l'element carte avec les donnée sfournies dans data
	const infoBateau = carte.querySelector(".infoBateau");
	const personne = carte.querySelector(".personne");
	const [gareDepart, gareArrivee, date, heureDepart, bateau] =
		infoBateau.querySelector(".valeur").children;
	const [reservation, nom] = personne.querySelector(".valeur").children;

	//on change le contenu de tous les elements avec les données reçues
	gareDepart.innerHTML = data.portDepart;
	gareArrivee.innerHTML = data.portArrivee;
	date.innerHTML = data.date;
	heureDepart.innerHTML = data.heure;
	bateau.innerHTML = data.bateau;

	reservation.innerHTML = data.id;
	nom.innerHTML = data.nom;
}

function chercherPassagers(nbPassager, carte) {
	//la fonction envoie une requete pour obtenir les informations sur un passager
	fetch(
		`https://can.emerald-prism.fr/api/reservation/${reservation}/passager/${nbPassager}`
	).then((reponse) => {
		reponse.json().then((data) => {
			traiterPassager(carte, data); // et on envoie les données à la fonction traiterPassager avec l'element carte
		});
	});
}

function chercherVehicules(nbVehicule, carte) {
	fetch(
		`https://can.emerald-prism.fr/api/reservation/${reservation}/vehicule/${nbVehicule}`
	).then((reponse) => {
		//Note l'utilisation du .then() permet de ne pas bloquer l'execution du code en attendant la reponse du serveur ce qui permet d'envoyer et traiter les requetes en parallèle
		reponse.json().then((data) => {
			traiterVehicule(carte, data); // et on envoie les données à la fonction traiterVehicule avec l'element carte
		});
	});
}

function traiterPassager(carte, data) {
	//la fonction reçoit les données de l'api ainsi que la carte à modifier
	const [nom, prenom, categorie, prix] = carte
		.querySelector(".passagerInfo")
		.querySelector(".valeur").children; // on selectionne les champs dont nous avons besoin

	//et on ecrit les informations reçues dans les champs
	nom.innerHTML = data.nom;
	prenom.innerHTML = data.prenom;
	categorie.innerHTML = data.libelleCategorie;
	prix.innerHTML = data.price + "€";
}

function traiterVehicule(carte, data) {
	//la fonction reçoit les données de l'api ainsi que la carte à modifier
	const [categorie, nombre, prix] = carte
		.querySelector(".vehiculeInfo")
		.querySelector(".valeur").children; // on selectionne les champs dont nous avons besoin

	//et on ecrit les informations reçues dans les champs
	nombre.innerHTML = data.quantite;
	categorie.innerHTML = data.libelle;
	prix.innerHTML = data.prix * data.quantite + "€";
}

function afficherCarte() {
	//on affiche la carte selectionnée dans la div prévue à cet effet

	// on efface d'abord tous les elements qui pourraient etre dans la div
	const cartesEnfant = affichageDiv.children;
	for (let i = 0; i < cartesEnfant.length; i++) {
		const element = cartesEnfant[i];
		element.remove();
	}
	affichageDiv.append(cartes[carteSelectionne]); //on parente la carte selectionnée dans la div d'affichage
}

//on recupère les boutons qui servent à changer de carte
const btnGauche = document.getElementById("btnGauche");
const btnDroit = document.getElementById("btnDroit");

//on leurs applique des écouteurs pour executer une fonction quand ils sont cliqués
btnGauche.addEventListener("click", () => {
	// on verifie qu'on ne choisis pas une carte qui n'existe pas
	if (carteSelectionne >= 1) {
		carteSelectionne -= 1;
		afficherCarte();
	}
});

btnDroit.addEventListener("click", () => {
	// on verifie qu'on ne choisis pas une carte qui n'existe pas
	console.log(carteSelectionne, cartes);

	if (carteSelectionne + 1 < cartes.length) {
		carteSelectionne += 1;
		afficherCarte();
	}
});
