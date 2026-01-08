const resevation = 1;
let passager;
let vehicule;

fetch(`https://can.iutrs.unistra.fr/api/reservation/${resevation}`).then(
	(reponse) => {
		reponse.json().then((data) => {
			traiterReservation(data);
			chercherPassagers(data.nbPassagers);
			chercherVehicules(data.nbVehicule);
		});
	}
);

const infoBateau = document.getElementById("infoBateau");
// const infoReservation = document.getElementById("")
const [gareDepart, gareArrivee, date, heureDepart, bateau] =
	infoBateau.querySelector(".valeur").children;

// console.log(gareDepart);

function traiterReservation(data) {
	heureDepart.innerHTML = data.portDepart;
	gareDepart.innerHTML = data.heure;
	date.innerHTML = data.date;
	gareArrivee.innerHTML = data.portArrivee;
	bateau.innerHTML = data.bateau;
}

function chercherPassagers(nbPassagers) {}

function chercherVehicules(nbVehicule) {}
