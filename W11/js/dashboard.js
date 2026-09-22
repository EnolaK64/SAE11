// on recupère les element dont nous avons besoin
const liaisonSelect = document.getElementById("liaison");
const dateSelect = document.getElementById("date");
const tableLiaison = document.getElementById("tableauLiaison");
const affichageErreur = document.getElementById("erreur");

console.log("test");
chercherLesLiaisons(); // on appelle la fonction chercherLesLiaisons

//on applique des écouteurs sur les differents champs d'entrée pour appeler la fonction actualiserTableau quand une valeur est modifiée
liaisonSelect.addEventListener("change", actualiserTableau);
dateSelect.addEventListener("change", actualiserTableau);

function actualiserTableau() {
	// la fonction affiche les informations dans le tableau html
	const liaisonValue = liaisonSelect.value;
	const dateValue = dateSelect.value;
	// on verifie que les entrées en sont pas vides
	if (liaisonValue !== "" && dateValue !== "") {
		//si les entrées sont correctes on cherche la liaison choisie par l'utilisateur
		chercherUneLiaison(liaisonValue, dateValue);
	}
}

function chercherLesLiaisons() {
	//la fonction envoie une requete à l'api pour récuperer toutes les liaisons
	fetch("https://can.emerald-prism.fr/api/liaison/all")
		.then((response) => {
			response.json().then((data) => {
				creerLiaison(data); // on appelle la fonction suivante pour afficher
			});
		})
		.catch((e) => {
			//.catch est appelé en cas d'exception à l'envoi de la rêquete
			erreurTrouve(e);
		});
}

function chercherUneLiaison(idLiaison, date) {
	//la fonction envoie une requete à l'api pour recuperer les informations de la traversée saisie
	fetch(
		`https://can.emerald-prism.fr/api/liaison/${idLiaison}/remplissage/${date}`
	).then((response) => {
		if (response.status === 404) {
			//si le status est 404 alors la la traversée n'existe pas
			traverserInexistante();
		} else if (response.status === 200) {
			//si le status est 200 alors tout est ok
			response.json().then((data) => {
				console.log(data);
				afficherTraversee(data);
			});
		} else {
			// sinon une erreur est survenue on envoie alors le code correspondant
			erreurTrouver("code" + response.status);
		}
	});
}

function creerLiaison(data) {
	// la fonction traite toutes les liaisons pour en faire des options dans le menu deroulant dans le html
	for (let i = 0; i < Object.keys(data).length; i++) {
		//on commence par initialiser les variables key et element
		const key = Object.keys(data)[i];
		const liaison = data[key];

		//on crée un element option
		const option = document.createElement("option");

		//on lui donne un texte et une valeur
		option.innerText = liaison.nom;
		option.value = liaison.id;

		// on l'ajoute à liste des enfants de l'element liaisonSelect
		liaisonSelect.appendChild(option);
	}
}

const tableBody = document.getElementById("tableauLiaisonBody"); // on selectione le corps du tableau

function afficherTraversee(data) {
	//la fonction remplit le tableau avec la traversée reçu en parametre
	effacerContenu(tableBody); // on efface ce qu'il pourrait deja y avoir dans le corps

	for (let i = 0; i < Object.keys(data).length; i++) {
		const key = Object.keys(data)[i];
		const value = data[key];

		//on calcule le taux de remplissage pour les passagers et les Voitures
		const tauxPassagers = Math.round(
			(value.nbReservationPassagers / value.capacitePassagers) * 100
		);
		const tauxVoitures = Math.round(
			(value.nbReservationVoitures / value.capaciteVoitures) * 100
		);

		//on crée tous les elements à mettre dans le tableau
		const ligneTable = document.createElement("tr");

		const caseHeure = document.createElement("td");
		const casePassager = document.createElement("td");
		const caseVehicule = document.createElement("td");

		//on remplit le texte des cases
		caseHeure.innerText = value.heure;
		casePassager.innerText = tauxPassagers + "%";
		caseVehicule.innerText = tauxVoitures + "%";

		//on applique une classe qui donnera la couleur à la case selon taux de remplissage
		if (tauxPassagers < 50) {
			casePassager.classList.add("vert");
		} else if (tauxPassagers >= 50 && tauxPassagers < 75) {
			casePassager.classList.add("orange");
		} else if (tauxPassagers >= 75 && tauxPassagers < 100) {
			casePassager.classList.add("rouge");
		} else {
			casePassager.classList.add("fluo");
		}
		// de même pour les voitures
		if (tauxVoitures < 50) {
			caseVehicule.classList.add("vert");
		} else if (tauxVoitures >= 50 && tauxVoitures < 75) {
			caseVehicule.classList.add("orange");
		} else if (tauxVoitures >= 75 && tauxVoitures < 100) {
			caseVehicule.classList.add("rouge");
		} else {
			caseVehicule.classList.add("fluo");
		}

		//on ajoute les cases à la liste des enfants de la ligne
		ligneTable.append(caseHeure, casePassager, caseVehicule);
		// et on ajoute la ligne au tableau
		tableBody.appendChild(ligneTable);

		//si on est arrivé jusque là c'est que tout s'est bien passé
		//on peut donc supprimer tout message d'erreur qu'il pourrait y avoir
		affichageErreur.innerText = "";
		//et afficher le tableau
		tableLiaison.classList.add("afficherTable");
	}
}

// les deux fonctions suivantes affichent des messages d'erreur
function traverserInexistante() {
	affichageErreur.innerText = "Aucun traversée n'a était trouvé";
	tableLiaison.classList.remove("afficherTable");
}
function erreurTrouve(message) {
	affichageErreur.innerText = "Une erreur est survenue: " + message;
	tableLiaison.classList.remove("afficherTable");
}

function effacerContenu(element) {
	//la fonction supprime tous les enfants de l'element reçu en paramètre
	const enfants = element.children;
	const length = enfants.length;
	for (let i = 0; i < length; i++) {
		const element = enfants[0];
		element.remove();
	}
}
