const passagersDiv = document.getElementById("passagers"); //on récupére la div nomé passagers
const vehiculesDiv = document.getElementById("vehicules"); //on récupére la div nomé véhicules
const url = new URL(location.href); // on crée un objet URL avec le constucteur URL
const searchParams = new URLSearchParams(url.search); // on crée un objet searchParams

const reservation = +searchParams.get("reservation"); // on récupére le numéro de la réservation contenue dans le paramètre de recherche "reservation"
let passager; // on déclare la variable passager
let vehicule; // on déclare la variable vehicule

if (reservation === "") {
	// on vérifie que le numéro de reservation n'est pas vide
	location.replace("./selectionReserv.html"); // dans quel cas on renvoie l'utilisateur sur la page de selection de reserveration
}

fetch(`https://can.iutrs.unistra.fr/api/reservation/${reservation}`).then(
	// on effectue un requete au serveur pour récupérer les informations sur la reservation
	(reponse) => {
		reponse.json().then((data) => {
			creerCartes(data.nbPassagers, data.nbVehicules); // la fonction "creerCartes" est appeler avec le nombre de passagers et le nombre de vehicules en paramètre
			traiterReservation(data); // on appele la fonction traiterReservation avec la reponse du serveur

			chercherPassagers(data.nbPassagers); // on appele la fonction chercherPassagers
			chercherVehicules(data.nbVehicules); // on appele la fonction chercherVehicules
		});
	}
);

function creerCartes(nbPassagers, nbVehicule) {
	// la fonction creerCartes est déclaré
	const cartePassager = document.querySelector(".carte"); // elle récupére dans le DOM l'element de class carte et le stocke dans la variable cartePassager
	for (let i = 1; i < nbPassagers; i++) {
		// pour chaque passagers...
		const cloneCarte = cartePassager.cloneNode(true); // on crée une copie de l'element .carte
		passagersDiv.appendChild(cloneCarte); // et on l'ajoute à la liste des enfants de la div Passagers
	}

	//on refait la même chose mais pour les vehicules et on clone le carte des vehicules
	const carteVehicule = document.querySelector(".carteVehicule");
	for (let i = 1; i < nbVehicule; i++) {
		const cloneCarte = carteVehicule.cloneNode(true);
		vehiculesDiv.appendChild(cloneCarte);
	}
}

function traiterReservation(data) {
	// on initialise la fonction traiterReservation qui prend data en paramètre
	for (let i = 0; i < data.nbPassagers + data.nbVehicules; i++) {
		//pour toutes les cartes crée
		const infoBateau = document.querySelectorAll(".infoBateau")[i]; // dans tout les elements de classe infoBateau on récupére l'element d'indice i
		const personne = document.querySelectorAll(".personne")[i]; // dans tout les elements de classe personne on récupére l'element d'indice i
		const [gareDepart, gareArrivee, date, heureDepart, bateau] =
			infoBateau.querySelector(".valeur").children; // on selection ensuite tout les champs qui nous interesse soit : gareDepart, gareArrivee, date, heureDepart et bateau
		const [reservation, nom] = personne.querySelector(".valeur").children; // de même pour les champs : reservation et nom

		//et on change de le contenue de tout les element avec les données reçu
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
	//on déclare la fonction chercherPassagers
	for (let i = 1; i < nbPassagers; i++) {
		// pour chaque passager
		// et on récupére ses informations
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${reservation}/passager/${i}`
		).then((reponse) => {
			reponse.json().then((data) => {
				traiterPassager(i, data); // et on les envoie à la fonction traiterPassager
			});
		});
	}
}

function chercherVehicules(nbVehicule) {
	//on déclare la fonction chercherPassagers
	for (let i = 1; i < nbVehicule; i++) {
		// pour chaque vehicule
		//et on récupére ses informations
		fetch(
			`https://can.iutrs.unistra.fr/api/reservation/${reservation}/vehicule/${i}`
		).then((reponse) => {
			//Note l'utilisation du .then() permet de ne pas bloquer l'execution du code en attendant la reponse du serveur ce qui permet d'envoyer et traiter les requetes en parallèle
			reponse.json().then((data) => {
				traiterVehicule(i, data); // et on les envoie à la fonction traiterVehicule
			});
		});
	}
}

function traiterPassager(id, data) {
	//on déclare la fonction traitrerPassager
	const passagerInfo = document.querySelectorAll(".passagerInfo")[id - 1]; //on selection la carte du passagers dont on a reçu ses informations
	const [nom, prenom, categorie, prix] =
		passagerInfo.querySelector(".valeur").children; // on selection les champs dont nous avons besoin

	//et on ecris les informations reçu dans les champs
	nom.innerHTML = data.nom;
	prenom.innerHTML = data.prenom;
	categorie.innerHTML = data.libelleCategorie;
	prix.innerHTML = data.price;
}

function traiterVehicule(id, data) {
	//on déclare la fonction traitrerVehicule
	const vehiculeInfo = document.querySelectorAll(".vehiculeInfo")[id - 1]; //on selection la carte du véhicule dont on a reçu ses informations
	const [categorie, nombre, prix] =
		vehiculeInfo.querySelector(".valeur").children; // on selection les champs dont nous avons besoin

	//et on ecris les informations reçu dans les champs
	nombre.innerHTML = data.quantite;
	categorie.innerHTML = data.libelle;
	prix.innerHTML = data.prix;
}
