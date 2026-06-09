package victor.project.memoire.Seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import victor.project.memoire.Modele.*;
import victor.project.memoire.Repository.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class UserSeed implements CommandLineRunner {

    private final EtablissementRepository etablissementRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PosteRepository posteRepository;
    private final ContratRepository contratRepository;
    private final FicheDePaieRepository ficheDePaieRepository;
    private final ElementPaieRepository elementPaieRepository;
    private final AbsenceRepository absenceRepository;
    private final CompteurCongeRepository compteurCongeRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserSeed(
            EtablissementRepository etablissementRepository,
            UtilisateurRepository utilisateurRepository,
            PosteRepository posteRepository,
            ContratRepository contratRepository,
            FicheDePaieRepository ficheDePaieRepository,
            ElementPaieRepository elementPaieRepository,
            AbsenceRepository absenceRepository,
            CompteurCongeRepository compteurCongeRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.etablissementRepository = etablissementRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.posteRepository = posteRepository;
        this.contratRepository = contratRepository;
        this.ficheDePaieRepository = ficheDePaieRepository;
        this.elementPaieRepository = elementPaieRepository;
        this.absenceRepository = absenceRepository;
        this.compteurCongeRepository = compteurCongeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        // Si des établissements existent déjà dans la base de données, cela signifie que la base est déjà initialisée.
        // Pour éviter d'insérer des doublons, on effectue uniquement une vérification et mise à jour des utilisateurs existants (BCrypt).
        if (etablissementRepository.count() > 0) {
            for (Utilisateur utilisateur : utilisateurRepository.findAll()) {
                if ("Alice".equalsIgnoreCase(utilisateur.getPrenom())) {
                    boolean modifie = false;
                    // S'assurer qu'Alice a bien l'identifiant/email 'admin'
                    if (!"admin".equals(utilisateur.getEmail())) {
                        utilisateur.setEmail("admin");
                        modifie = true;
                    }
                    // Hacher le mot de passe uniquement s'il n'est pas déjà encodé avec BCrypt (préfixe $2a$)
                    if (!utilisateur.getMotDePasse().startsWith("$2a$")) {
                        utilisateur.setMotDePasse(passwordEncoder.encode("admin"));
                        modifie = true;
                    }
                    if (modifie) {
                        utilisateurRepository.save(utilisateur);
                    }
                } else if ("Bob".equalsIgnoreCase(utilisateur.getPrenom())) {
                    // Hacher le mot de passe de Bob uniquement s'il n'est pas déjà encodé avec BCrypt
                    if (!utilisateur.getMotDePasse().startsWith("$2a$")) {
                        utilisateur.setMotDePasse(passwordEncoder.encode("hashed_password_2"));
                        utilisateurRepository.save(utilisateur);
                    }
                }
            }
            System.out.println("Données de test existantes : mots de passe vérifiés/réinitialisés en BCrypt.");
            return;
        }

        Etablissement etab1 = new Etablissement();
        etab1.setNom("TechCorp SAS");
        etab1.setSiret("12345678901234");
        etab1.setAdresse("12 Rue de la Paix");
        etab1.setVille("Paris");
        etab1.setCodePostal("75001");
        etablissementRepository.save(etab1);

        Etablissement etab2 = new Etablissement();
        etab2.setNom("Innovate SARL");
        etab2.setSiret("98765432109876");
        etab2.setAdresse("5 Avenue des Champs");
        etab2.setVille("Lyon");
        etab2.setCodePostal("69001");
        etablissementRepository.save(etab2);

        Utilisateur admin = new Utilisateur();
        admin.setPrenom("Alice");
        admin.setNom("Martin");
        admin.setEmail("admin");
        admin.setMotDePasse(passwordEncoder.encode("admin"));
        admin.setRole("RH");
        admin.setNsc("1234567890123");
        admin.setIban("FR7630006000011234567890189");
        admin.setAdresse("3 Rue Voltaire");
        admin.setVille("Paris");
        admin.setCodePostal("75011");
        admin.setTauxImposition(new BigDecimal("15.00"));
        admin.setEtablissement(etab1);
        admin.setDepartment("RH");
        admin.setAvatar("https://ui-avatars.com/api/?name=Alice+Martin");
        utilisateurRepository.save(admin);

        Utilisateur employe = new Utilisateur();
        employe.setPrenom("Bob");
        employe.setNom("Dupont");
        employe.setEmail("bob.dupont@techcorp.fr");
        employe.setMotDePasse(passwordEncoder.encode("hashed_password_2"));
        employe.setRole("EMPLOYE");
        employe.setNsc("9876543210987");
        employe.setIban("FR7630006000019876543210189");
        employe.setAdresse("7 Rue Gambetta");
        employe.setVille("Paris");
        employe.setCodePostal("75020");
        employe.setTauxImposition(new BigDecimal("10.50"));
        employe.setEtablissement(etab1);
        employe.setDepartment("R&D");
        employe.setAvatar("https://ui-avatars.com/api/?name=Bob+Dupont");
        utilisateurRepository.save(employe);

        Poste poste1 = new Poste();
        poste1.setTitre("Développeur Java");
        poste1.setDescription("Développement d'applications Spring Boot");
        poste1.setSalaireMin(new BigDecimal("2800.00"));
        poste1.setSalaireMax(new BigDecimal("4500.00"));
        posteRepository.save(poste1);

        Poste poste2 = new Poste();
        poste2.setTitre("Chef de projet");
        poste2.setDescription("Gestion et coordination des équipes techniques");
        poste2.setSalaireMin(new BigDecimal("3500.00"));
        poste2.setSalaireMax(new BigDecimal("6000.00"));
        posteRepository.save(poste2);

        Contrat contrat1 = new Contrat();
        contrat1.setUtilisateur(employe);
        contrat1.setPoste(poste1);
        contrat1.setTypeContrat("CDI");
        contrat1.setSalaireBaseMensuel(new BigDecimal("3200.00"));
        contrat1.setDateDebut(LocalDate.of(2023, 1, 15));
        contrat1.setStatut("ACTIF");
        contratRepository.save(contrat1);

        FicheDePaie fiche1 = new FicheDePaie();
        fiche1.setUtilisateur(employe);
        fiche1.setContrat(contrat1);
        fiche1.setPeriodeMoisAnnee("04-2025");
        fiche1.setSalaireBase(new BigDecimal("3200.00"));
        fiche1.setTotalBrut(new BigDecimal("3400.00"));
        fiche1.setTotalNet(new BigDecimal("2720.00"));
        fiche1.setStatut("VALIDEE");
        fiche1.setDateGeneration(LocalDateTime.now());
        ficheDePaieRepository.save(fiche1);

        ElementPaie prime = new ElementPaie();
        prime.setContrat(contrat1);
        prime.setFicheDePaie(fiche1);
        prime.setCode("PRIME_PERF");
        prime.setLibelle("Prime de performance");
        prime.setTypeElement("GAIN");
        prime.setNatureSaisie("MONTANT");
        prime.setValeur("200.00");
        prime.setQuantite(BigDecimal.ONE);
        prime.setDateDebut(LocalDate.of(2025, 4, 1));
        prime.setDateFin(LocalDate.of(2025, 4, 30));
        elementPaieRepository.save(prime);

        Absence absence1 = new Absence();
        absence1.setUtilisateur(employe);
        absence1.setTypeAbsence("CONGE_PAYE");
        absence1.setDateDebut(LocalDate.of(2025, 7, 14));
        absence1.setDateFin(LocalDate.of(2025, 7, 25));
        absence1.setStatut("APPROUVEE");
        absenceRepository.save(absence1);

        CompteurConge compteur1 = new CompteurConge();
        compteur1.setUtilisateur(employe);
        compteur1.setTypeConge("CONGE_PAYE");
        compteur1.setJoursAcquis(new BigDecimal("25.00"));
        compteur1.setJoursPris(new BigDecimal("10.00"));
        compteurCongeRepository.save(compteur1);

        System.out.println("Données d'exemple insérées avec succès !");
    }
}
