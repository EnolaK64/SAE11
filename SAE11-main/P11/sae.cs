using System;
using System.Collections.Generic;
using System.Web.Script.Serialization; // inclue avec mono
using SAE_P11_Horraires;

namespace SAE_P11
{
    class Program
    {
        // ----------------- STRUCTURES -----------------

        // ----------------- RÉSERVATION -----------------
        struct Reservation
        {
            public string nom;
            public int idLiaison;
            public string date;
            public string heure;
            public string horodatage; // horodatage de création

            public Reservation(string nom, int idLiaison, string date, string heure)
            {
                this.nom = nom; // this. : précise qu'on parle de la strucutre car le parametre a le meme nom 
                this.idLiaison = idLiaison;
                this.date = date;
                this.heure = heure;
                this.horodatage = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"); // automatique
            }
        }

        // ----------------- PASSAGER -----------------
        struct Passager
        {
            public string nom;
            public string prenom;
            public string codeCategorie;
        }

        // ----------------- VEHICULE -----------------
        struct Vehicule
        {
            public string codeCategorie;
            public int quantite;
        }

        // ----------------- STRUCTURE JSON FINAL -----------------
        struct ReservationJson
        {
            public Reservation reservation;
            public List<Passager> passagers;
            public List<Vehicule> vehicules;

            public ReservationJson(Reservation res, List<Passager> passagers, List<Vehicule> vehicules)
            {
                reservation = res;
                this.passagers = passagers; 
                this.vehicules = vehicules;
            }
        }

        // ----------------- LISTES -----------------
        static List<Reservation> ListeReservations = new List<Reservation>();
        static List<Passager> ListePassagers = new List<Passager>();
        static List<Vehicule> ListeVehicules = new List<Vehicule>();

        // ----------------- TARIFS PASSAGERS -----------------
        static Dictionary<string, double> TarifGroix = new Dictionary<string, double>()
        {
            {"adu26p", 18.75}, {"jeu1825", 13.80}, {"enf417", 11.25}, {"bebe", 0}, {"ancomp", 3.35}
        };
        static Dictionary<string, double> TarifBelleIle = new Dictionary<string, double>()
        {
            {"adu26p", 18.80}, {"jeu1825", 14.10}, {"enf417", 11.65}, {"bebe", 0}, {"ancomp", 3.35}
        };

        // ----------------- TARIFS VEHICULES -----------------
        static Dictionary<string, double> TarifVehiculeGroix = new Dictionary<string, double>()
        {
            {"trot", 4.70}, {"velo", 8.20}, {"velec", 11.00}, {"cartand", 16.45}, {"mobil", 23.10},
            {"moto", 66.05}, {"cat1", 96.05}, {"cat2", 114.80}, {"cat3", 174.45}, {"cat4", 210.90}, {"camp", 330.20}
        };
        static Dictionary<string, double> TarifVehiculeBelleIle = new Dictionary<string, double>()
        {
            {"trot", 4.70}, {"velo", 8.20}, {"velec", 11.00}, {"cartand", 16.45}, {"mobil", 23.35},
            {"moto", 66.40}, {"cat1", 98.50}, {"cat2", 117.20}, {"cat3", 176.90}, {"cat4", 213.35}, {"camp", 332.70}
        };

        // ----------------- MAIN -----------------
        static void Main()
        {
            bool continuer = true;
            Console.WriteLine("=== Application de réservation de traversée ===");

            while (continuer)
            {
                Console.WriteLine("\n--- Menu ---");
                Console.WriteLine("1 - Ajouter une réservation");
                Console.WriteLine("2 - Afficher toutes les réservations");
                Console.WriteLine("3 - Quitter");
                Console.Write("Choix : ");

                string choix = Console.ReadLine();

                switch (choix)
                {
                    case "1":
                        AjouterReservation();
                        break;
                    case "2":
                        AfficherReservations();
                        break;
                    case "3":
                        continuer = false;
                        Console.WriteLine("Au revoir !");
                        break;
                    default:
                        Console.WriteLine("Choix invalide !");
                        break;
                }
            }
        }

        // ----------------- AJOUTER UNE RÉSERVATION -----------------
        static void AjouterReservation()
        {
            Console.Write("Nom de la réservation : ");
            string nom = Console.ReadLine();

            // ID LIAISON
            Console.WriteLine();
            Console.WriteLine("ID de la liaison  : ");
            Console.WriteLine(" - 1 : Lorient - Groix ");
            Console.WriteLine(" - 2 : Groix - Lorient ");
            Console.WriteLine(" - 3 : Quiberon - Belle-Ile ");
            Console.WriteLine(" - 4 : Belle-Ile - Quiberon ");
            Console.Write("Choix : ");
            int idLiaison;
            if (!int.TryParse(Console.ReadLine(), out idLiaison) || idLiaison < 1 || idLiaison > 4)
            {
                Console.WriteLine("ID de liaison invalide !");
                return;
            }

            // DATE
            Console.Write("Date de la traversée (yyyy-mm-dd) : ");
            string date = Console.ReadLine();
            DateTime dateTrav;
            if (!DateTime.TryParse(date, out dateTrav) || dateTrav.Month != 11 || dateTrav.Year != 2025)
            {
                Console.WriteLine("Date invalide. Seules les traversées de novembre 2025 sont autorisées !");
                return;
            }

            // HORAIRES
            if (Horaires.TousLesHoraires.ContainsKey(idLiaison))
            {
                Console.WriteLine("Horaires disponibles :");
                Dictionary<int, List<string>> horairesLiaison = Horaires.TousLesHoraires[idLiaison];
                int jour = dateTrav.Day;

                if (horairesLiaison.ContainsKey(jour))
                {
                    List<string> horairesJour = horairesLiaison[jour];
                    foreach (string horaire in horairesJour)
                    {
                        Console.WriteLine(horaire);
                    }
                }
                else
                {
                    Console.WriteLine("Aucun horaire disponible pour ce jour !");
                    return;
                }
            }
            else
            {
                Console.WriteLine("Liaison invalide !");
                return;
            }

            Console.Write("Heure choisie : ");
            string heure = Console.ReadLine();

            Reservation res = new Reservation(nom, idLiaison, date, heure);
            ListeReservations.Add(res);

            // ----------------- PASSAGERS -----------------
            ListePassagers.Clear();
            Console.WriteLine("\n--- Informations passagers ---");
            bool ajouterPassager = true;
            while (ajouterPassager)
            {
                Passager p = new Passager();
                Console.Write("Nom : ");
                p.nom = Console.ReadLine();
                Console.Write("Prénom : ");
                p.prenom = Console.ReadLine();

                Console.WriteLine("Catégorie :");
                Console.WriteLine("1 - Adulte 26 ans et plus");
                Console.WriteLine("2 - Jeune 18 à 25 ans");
                Console.WriteLine("3 - Enfant 4 à 17 ans");
                Console.WriteLine("4 - Bébé moins de 4 ans");
                Console.WriteLine("5 - Animal de compagnie");
                Console.Write("Choix : ");
                string catChoix = Console.ReadLine();

                switch (catChoix)
                {
                    case "1": p.codeCategorie = "adu26p"; break;
                    case "2": p.codeCategorie = "jeu1825"; break;
                    case "3": p.codeCategorie = "enf417"; break;
                    case "4": p.codeCategorie = "bebe"; break;
                    case "5": p.codeCategorie = "ancomp"; break;
                    default:
                        Console.WriteLine("Catégorie invalide, par défaut Adulte 26+");
                        p.codeCategorie = "adu26p";
                        break;
                }

                ListePassagers.Add(p);

                Console.Write("Ajouter un autre passager ? (O/N) : ");
                string rep = Console.ReadLine();
                if (rep != "O" && rep != "o")
                {
                    ajouterPassager = false;
                }
            }

            // ----------------- VEHICULES -----------------
            ListeVehicules.Clear();
            Console.WriteLine("\n--- Informations véhicules ---");
            bool ajouterVehicule = true;
            while (ajouterVehicule)
            {
                Vehicule v = new Vehicule();

                Console.WriteLine("Catégorie véhicule :");
                Console.WriteLine("1 - Trottinette électrique");
                Console.WriteLine("2 - Vélo ou remorque à vélo");
                Console.WriteLine("3 - Vélo électrique");
                Console.WriteLine("4 - Vélo cargo ou tandem");
                Console.WriteLine("5 - Deux-roues <=125 cm3");
                Console.WriteLine("6 - Deux-roues >125 cm3");
                Console.WriteLine("7 - Voiture <4 m");
                Console.WriteLine("8 - Voiture 4-4.39 m");
                Console.WriteLine("9 - Voiture 4.40-4.79 m");
                Console.WriteLine("10 - Voiture >=4.80 m");
                Console.WriteLine("11 - Camping-car >2.10 m");
                Console.Write("Choix : ");
                string vehChoix = Console.ReadLine();

                switch (vehChoix)
                {
                    case "1": v.codeCategorie = "trot"; break;
                    case "2": v.codeCategorie = "velo"; break;
                    case "3": v.codeCategorie = "velec"; break;
                    case "4": v.codeCategorie = "cartand"; break;
                    case "5": v.codeCategorie = "mobil"; break;
                    case "6": v.codeCategorie = "moto"; break;
                    case "7": v.codeCategorie = "cat1"; break;
                    case "8": v.codeCategorie = "cat2"; break;
                    case "9": v.codeCategorie = "cat3"; break;
                    case "10": v.codeCategorie = "cat4"; break;
                    case "11": v.codeCategorie = "camp"; break;
                    default:
                        Console.WriteLine("Catégorie invalide, par défaut Trottinette");
                        v.codeCategorie = "trot";
                        break;
                }

                Console.Write("Quantité : ");
                int q;
                if (!int.TryParse(Console.ReadLine(), out q) || q < 1)
                {
                    q = 1;
                }
                v.quantite = q;
                ListeVehicules.Add(v);

                Console.Write("Ajouter un autre véhicule ? (O/N) : ");
                string repVeh = Console.ReadLine();
                if (repVeh != "O" && repVeh != "o")
                {
                    ajouterVehicule = false;
                }
            }

            // ----------------- CALCUL DU PRIX -----------------
            double prixTotal = 0.0;

            foreach (Passager p in ListePassagers)
            {
                switch (res.idLiaison)
                {
                    case 1:
                    case 2: prixTotal += TarifGroix[p.codeCategorie]; break;
                    case 3:
                    case 4: prixTotal += TarifBelleIle[p.codeCategorie]; break;
                }
            }

            foreach (Vehicule v in ListeVehicules)
            {
                switch (res.idLiaison)
                {
                    case 1:
                    case 2: prixTotal += TarifVehiculeGroix[v.codeCategorie] * v.quantite; break;
                    case 3:
                    case 4: prixTotal += TarifVehiculeBelleIle[v.codeCategorie] * v.quantite; break;
                }
            }

            // ----------------- AFFICHAGE RÉCAP -----------------
            Console.WriteLine("\n--- Récapitulatif réservation ---");
            Console.WriteLine("Nom réservation : " + res.nom);
            Console.WriteLine("Liaison : " + res.idLiaison);
            Console.WriteLine("Date : " + res.date);
            Console.WriteLine("Heure : " + res.heure);
            Console.WriteLine("Créée le : " + res.horodatage);

            Console.WriteLine("\nPassagers :");
            foreach (Passager p in ListePassagers)
            {
                Console.WriteLine("Nom : " + p.nom + ", Prénom : " + p.prenom + ", Catégorie : " + p.codeCategorie);
            }

            Console.WriteLine("\nVéhicules :");
            foreach (Vehicule v in ListeVehicules)
            {
                Console.WriteLine("Catégorie : " + v.codeCategorie + ", Quantité : " + v.quantite);
            }

            Console.WriteLine("\nPrix total : " + prixTotal + " €");

            // ----------------- GÉNÉRATION DU JSON -----------------
                    // On crée un objet ReservationJson qui contient la réservation, la liste des passagers et la liste des véhicules
                    ReservationJson resJson = new ReservationJson(res, ListePassagers, ListeVehicules);

                    // On place cette réservation dans une liste pour que le JSON final soit un tableau [] pour d'éventuels autre réservation ou un retour
                    List<ReservationJson> listeJson = new List<ReservationJson>() { resJson };

                    // On crée un sérialiseur pour convertir les objets C# en JSON
                    JavaScriptSerializer serializer = new JavaScriptSerializer();

                    // On convertit la liste d'objets ReservationJson en chaîne JSON
                    string jsonString = serializer.Serialize(listeJson);

                    // On écrit cette chaîne JSON dans le fichier "reservation.json" sur le disque en local |un nouveau fichier se crée 
                    System.IO.File.WriteAllText("reservation.json", jsonString);
        }

        // ----------------- AFFICHER RÉSERVATIONS -----------------
        static void AfficherReservations()
        {
            if (ListeReservations.Count == 0)
            {
                Console.WriteLine("Aucune réservation pour l'instant.");
                return;
            }

            Console.WriteLine("\n--- Liste des réservations ---");
            for (int i = 0; i < ListeReservations.Count; i++)
            {
                Reservation res = ListeReservations[i];
                Console.WriteLine("Réservation n°" + (i + 1));
                Console.WriteLine("Nom : " + res.nom);
                Console.WriteLine("Liaison : " + res.idLiaison);
                Console.WriteLine("Date : " + res.date);
                Console.WriteLine("Heure : " + res.heure);
                Console.WriteLine("Créée le : " + res.horodatage);
                Console.WriteLine("---------------------------");
            }
        }
    }
}
