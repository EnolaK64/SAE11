const liaisonSelect = document.getElementById("liaison");
const dateSelect = document.getElementById("date");
const tableLiaison = document.getElementById("tableauLiaison");
const affichageErreur = document.getElementById("erreur");

chercherLesLiaisons();

liaisonSelect.addEventListener("change", actualiserTableau);
dateSelect.addEventListener("change", actualiserTableau);

function actualiserTableau() {
	const liaisonValue = liaisonSelect.value;
	const dateValue = dateSelect.value;
	if (liaisonValue !== "" && dateValue !== "") {
		chercherUneLiaison(liaisonValue, dateValue);
	}
}

function chercherLesLiaisons() {
	fetch("https://can.iutrs.unistra.fr/api/liaison/all")
		.then((response) => {
			response.json().then((data) => {
				creerLiaison(data);
			});
		})
		.catch((e) => {
			erreurTrouve(e);
		});
}

function chercherUneLiaison(idLiaison, date) {
	fetch(
		`https://can.iutrs.unistra.fr/api/liaison/${idLiaison}/remplissage/${date}`
	).then((response) => {
		if (response.status === 404) {
			traverserInexistante();
		} else if (response.status !== 200) {
			erreurTrouve(response.status);
		} else {
			response.json().then((data) => {
				console.log(data);
				afficherLiaison(data);
			});
		}
	});
}

function creerLiaison(data) {
	for (let i = 0; i < Object.keys(data).length; i++) {
		const key = Object.keys(data)[i];
		const element = data[key];

		const option = document.createElement("option");

		option.innerText = element.nom;
		option.value = element.id;

		liaisonSelect.appendChild(option);
	}
}

const tableBody = document.getElementById("tableauLiaisonBody");

function afficherLiaison(data) {
	effacerContenu(tableBody);

	for (let i = 0; i < Object.keys(data).length; i++) {
		const key = Object.keys(data)[i];
		const value = data[key];

		const tauxPassagers = Math.round(
			(value.nbReservationPassagers / value.capacitePassagers) * 100
		);
		const tauxVoitures = Math.round(
			(value.nbReservationVoitures / value.capaciteVoitures) * 100
		);

		const ligneTable = document.createElement("tr");
		const caseHeure = document.createElement("td");
		const casePassager = document.createElement("td");
		const caseVehicule = document.createElement("td");

		caseHeure.innerText = value.heure;
		casePassager.innerText = tauxPassagers + "%";
		caseVehicule.innerText = tauxVoitures + "%";
		if (tauxPassagers < 50) {
			casePassager.classList.add("vert");
		} else if (tauxPassagers >= 50 && tauxPassagers < 75) {
			casePassager.classList.add("orange");
		} else if (tauxPassagers >= 75 && tauxPassagers < 100) {
			casePassager.classList.add("rouge");
		} else {
			casePassager.classList.add("fluo");
		}

		if (tauxVoitures < 50) {
			caseVehicule.classList.add("vert");
		} else if (tauxVoitures >= 50 && tauxVoitures < 75) {
			caseVehicule.classList.add("orange");
		} else if (tauxVoitures >= 75 && tauxVoitures < 100) {
			caseVehicule.classList.add("rouge");
		} else {
			caseVehicule.classList.add("fluo");
		}

		ligneTable.append(caseHeure, casePassager, caseVehicule);
		tableBody.appendChild(ligneTable);

		affichageErreur.innerText = "";
		tableLiaison.classList.add("afficherTable");
	}
}

function traverserInexistante() {
	affichageErreur.innerText = "Aucun traversée n'a était trouvé";
	tableLiaison.classList.remove("afficherTable");
}
function erreurTrouve(message) {
	affichageErreur.innerText = "Une erreur est survenue: " + message;
	tableLiaison.classList.remove("afficherTable");
}

function effacerContenu(element) {
	const enfants = element.children;
	const length = enfants.length;
	for (let i = 0; i < length; i++) {
		const element = enfants[0];
		element.remove();
	}
}
