const affichageErreur = document.getElementById("affichageErreur");
const affichageSomme = document.getElementById("affichageSomme");
const tableBody = document.getElementById("tableBody");
const tableStats = document.getElementById("tableStats");
const chiffreAffaire = [];

chercherLesLiaisons();

function chercherLesLiaisons() {
	fetch("https://can.iutrs.unistra.fr/api/liaison/all")
		.then((response) => {
			response.json().then((data) => {
				for (let i = 0; i < Object.keys(data).length; i++) {
					const keys = Object.keys(data)[i];
					const liaisonId = data[keys].id;
					console.log(liaisonId);
					chercherChiffreDaffaire(
						Object.keys(data).length,
						liaisonId
					);
				}
			});
		})
		.catch((e) => {
			erreurTrouve(e);
		});
}

function chercherChiffreDaffaire(nbLiaisons, id) {
	fetch(`https://can.iutrs.unistra.fr/api/liaison/${id}/chiffreAffaire`)
		.then((response) => {
			response.json().then((data) => {
				console.log(data);
				afficherChiffreAffaire(nbLiaisons, data);
				calculerChiffreGlobal(nbLiaisons, data);
			});
		})
		.catch((e) => {
			erreurTrouve(e);
		});
}

function erreurTrouve(message) {
	affichageErreur.innerText = "Une erreur est survenue: " + message;
	tableStats.classList.remove("afficherTable");
}

function afficherChiffreAffaire(nbLiaisons, liaison) {
	const nom = liaison.nom;
	const nbPassagers = liaison.passagers.nombre;
	const chiffrePassagers =
		Math.round(liaison.passagers.chiffreAffaire * 100) / 100;
	const nbVehicule = liaison.vehicules.quantite;
	const chiffreVehicule =
		Math.round(liaison.vehicules.chiffreAffaire * 100) / 100;

	const ligneTable = document.createElement("tr");

	const caseNom = document.createElement("td");
	const caseNbPassager = document.createElement("td");
	const caseChiffrePassager = document.createElement("td");
	const caseNbVehicule = document.createElement("td");
	const caseChiffreVehicule = document.createElement("td");

	caseNom.innerText = nom;
	caseNbPassager.innerText = nbPassagers;
	caseChiffrePassager.innerText = chiffrePassagers;
	caseNbVehicule.innerText = nbVehicule;
	caseChiffreVehicule.innerText = chiffreVehicule;

	ligneTable.append(
		caseNom,
		caseNbPassager,
		caseChiffrePassager,
		caseNbVehicule,
		caseChiffreVehicule
	);
	tableBody.appendChild(ligneTable);
	if (tableBody.childElementCount === nbLiaisons)
		affichageErreur.innerText = "";
	tableStats.classList.add("afficherTable");
}

function calculerChiffreGlobal(nbLiaisons, data) {
	const chiffrePassager = data.passagers.chiffreAffaire;
	const chiffreVehicule = data.vehicules.chiffreAffaire;

	chiffreAffaire.push(chiffrePassager, chiffreVehicule);

	if (chiffreAffaire.length === nbLiaisons * 2) {
		const somme = chiffreAffaire.reduce((acc, current) => {
			acc += current;
			return acc;
		});
		affichageSomme.innerText = Math.round(somme * 100) / 100 + "€";
	}
}
