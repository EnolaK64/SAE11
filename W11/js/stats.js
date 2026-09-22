//on recupere les elements dont nous aurons besoin
const affichageErreur = document.getElementById("affichageErreur");
const affichageSomme = document.getElementById("affichageSomme");
const tableBody = document.getElementById("tableBody");
const tableStats = document.getElementById("tableStats");
const chiffreAffaire = [];

chercherLesLiaisons(); // on appelle la fonction chercherLesLiaisons

function chercherLesLiaisons() {
	// la fonction envoie une requete à l'api pour recuperer les liaisons qui existent
	fetch("https://can.emerald-prism.fr/api/liaison/all")
		.then((response) => {
			response.json().then((data) => {
				for (let i = 0; i < Object.keys(data).length; i++) {
					const keys = Object.keys(data)[i];
					//pour chaque liaison on recupère l'id de la liaison
					const liaisonId = data[keys].id;

					chercherChiffreDaffaire(
						Object.keys(data).length,
						liaisonId
					); //on appelle la fonction chercherChiffreDaffaire
				}
			});
		})
		.catch((e) => {
			//en cas d'erreur dans la requete on appelle la fonction erreurTrouve
			erreurTrouve(e);
		});
}

function chercherChiffreDaffaire(nbLiaisons, id) {
	//la fonction fait une requete à l'api pour recuperer le chiffre d'affaire d'une liaison
	fetch(`https://can.emerald-prism.fr/api/liaison/${id}/chiffreAffaire`)
		.then((response) => {
			response.json().then((data) => {
				afficherChiffreAffaire(nbLiaisons, data);
				calculerChiffreGlobal(nbLiaisons, data);
			});
		})
		.catch((e) => {
			// en cas d'erreur dans la requete on appelle la fonction erreurTrouve
			erreurTrouve(e);
		});
}

function erreurTrouve(message) {
	//la fonction affiche le message reçu en parametre
	affichageErreur.innerText = "Une erreur est survenue: " + message;
	tableStats.classList.remove("afficherTable");
}

function afficherChiffreAffaire(nbLiaisons, liaison) {
	//la fonction remplit le tableau avec les données reçues

	const nom = liaison.nom;

	const nbPassagers = liaison.passagers.nombre;

	//on calcule le chiffre d'affaire par passager
	const chiffrePassagers =
		Math.round(liaison.passagers.chiffreAffaire * 100) / 100;

	const nbVehicule = liaison.vehicules.quantite;

	//on calcule le chiffre d'affaire par vehicule
	const chiffreVehicule =
		Math.round(liaison.vehicules.chiffreAffaire * 100) / 100;

	const ligneTable = document.createElement("tr"); //on crée un element de ligne de tableau

	//on crée les cases du tableau
	const caseNom = document.createElement("td");
	const caseNbPassager = document.createElement("td");
	const caseChiffrePassager = document.createElement("td");
	const caseNbVehicule = document.createElement("td");
	const caseChiffreVehicule = document.createElement("td");

	//on remplit ces cases
	caseNom.innerText = nom;
	caseNbPassager.innerText = nbPassagers;
	caseChiffrePassager.innerText = chiffrePassagers;
	caseNbVehicule.innerText = nbVehicule;
	caseChiffreVehicule.innerText = chiffreVehicule;

	// on les ajoute à la ligne du tableau
	ligneTable.append(
		caseNom,
		caseNbPassager,
		caseChiffrePassager,
		caseNbVehicule,
		caseChiffreVehicule
	);

	//on ajoute cette ligne au tableau
	tableBody.appendChild(ligneTable);

	//on verifie que le tableau contient autant d'enfants qu'il y a de liaisons
	//si c'est le cas on peut afficher le tableau et effacer tous les messages d'erreurs qu'il pourrait y avoir
	if (tableBody.childElementCount === nbLiaisons) {
		affichageErreur.innerText = "";
		tableStats.classList.add("afficherTable");
	}
}

function calculerChiffreGlobal(nbLiaisons, data) {
	//la fonction calcule le chiffre d'affaire global du mois
	const chiffrePassager = data.passagers.chiffreAffaire;
	const chiffreVehicule = data.vehicules.chiffreAffaire;
	//on ajoute tous les chiffres d'affaire dans la liste des chiffres d'affaire
	chiffreAffaire.push(chiffrePassager, chiffreVehicule);

	//si la liste contient tous les chiffres d'affaire
	if (chiffreAffaire.length === nbLiaisons * 2) {
		//on fait la somme du tableau
		const somme = chiffreAffaire.reduce((acc, current) => {
			acc += current;
			return acc;
		});
		//on affiche la somme à l'ecran
		affichageSomme.innerText = Math.round(somme * 100) / 100 + "€";
	}
}
