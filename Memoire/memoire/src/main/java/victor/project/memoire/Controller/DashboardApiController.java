package victor.project.memoire.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import victor.project.memoire.Modele.*;
import victor.project.memoire.Repository.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class DashboardApiController {

    private final UtilisateurRepository utilisateurRepository;
    private final ContratRepository contratRepository;
    private final CompteurCongeRepository compteurCongeRepository;
    private final ElementPaieRepository elementPaieRepository;
    private final FicheDePaieRepository ficheDePaieRepository;

    public DashboardApiController(
            UtilisateurRepository utilisateurRepository,
            ContratRepository contratRepository,
            CompteurCongeRepository compteurCongeRepository,
            ElementPaieRepository elementPaieRepository,
            FicheDePaieRepository ficheDePaieRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.contratRepository = contratRepository;
        this.compteurCongeRepository = compteurCongeRepository;
        this.elementPaieRepository = elementPaieRepository;
        this.ficheDePaieRepository = ficheDePaieRepository;
    }

    @GetMapping("/employees")
    public List<Map<String, Object>> getEmployees() {
        List<Map<String, Object>> employeesList = new ArrayList<>();
        Iterable<Utilisateur> utilisateurs = utilisateurRepository.findAll();

        for (Utilisateur user : utilisateurs) {
            // Exclure les utilisateurs ADMIN (anciennement RH) de la liste des salariés gérés dans la vue dashboard/employés
            if ("RH".equalsIgnoreCase(user.getRole()) || "ADMIN".equalsIgnoreCase(user.getRole())) {
                continue;
            }

            Map<String, Object> empMap = new HashMap<>();
            empMap.put("id", user.getId());
            empMap.put("firstName", user.getPrenom());
            empMap.put("lastName", user.getNom());
            empMap.put("establishment", user.getEtablissement() != null ? user.getEtablissement().getNom() : "Non spécifié");
            empMap.put("department", user.getDepartment() != null ? user.getDepartment() : "R&D");
            empMap.put("avatar", user.getAvatar() != null ? user.getAvatar() : "https://ui-avatars.com/api/?name=" + user.getPrenom() + "+" + user.getNom());

            // Informations du contrat
            BigDecimal baseSalary = BigDecimal.ZERO;
            String position = "Collaborateur";
            Iterable<Contrat> contrats = contratRepository.findByUtilisateur(user);
            Contrat activeContrat = null;
            for (Contrat c : contrats) {
                if ("ACTIF".equalsIgnoreCase(c.getStatut())) {
                    activeContrat = c;
                    baseSalary = c.getSalaireBaseMensuel();
                    if (c.getPoste() != null) {
                        position = c.getPoste().getTitre();
                    }
                    break;
                }
            }
            empMap.put("baseSalary", baseSalary);
            empMap.put("position", position);

            // Informations sur les congés (Leaves)
            double vacationTaken = 0.0;
            double vacationTotal = 25.0;
            Iterable<CompteurConge> compteurs = compteurCongeRepository.findByUtilisateur(user);
            for (CompteurConge cc : compteurs) {
                if ("CONGE_PAYE".equalsIgnoreCase(cc.getTypeConge())) {
                    if (cc.getJoursPris() != null) {
                        vacationTaken = cc.getJoursPris().doubleValue();
                    }
                    if (cc.getJoursAcquis() != null) {
                        vacationTotal = cc.getJoursAcquis().doubleValue();
                    }
                    break;
                }
            }
            empMap.put("vacationTaken", vacationTaken);
            empMap.put("vacationTotal", vacationTotal);

            // Variables personnalisées / Éléments de paie
            Map<String, Double> customValues = new HashMap<>();
            if (activeContrat != null) {
                Iterable<ElementPaie> elements = elementPaieRepository.findByContrat(activeContrat);
                for (ElementPaie ep : elements) {
                    try {
                        customValues.put(ep.getCode(), Double.parseDouble(ep.getValeur()));
                    } catch (Exception ex) {
                        customValues.put(ep.getCode(), 1.0);
                    }
                }
            }
            // Ajouter les valeurs par défaut de HEURES_SUP pour les calculs d'heures supplémentaires du tableau de bord si absentes
            if (!customValues.containsKey("HEURES_SUP")) {
                customValues.put("HEURES_SUP", 0.0);
            }
            empMap.put("customValues", customValues);

            employeesList.add(empMap);
        }

        return employeesList;
    }

    @GetMapping("/payslips")
    public List<Map<String, Object>> getPayslips() {
        List<Map<String, Object>> payslipsList = new ArrayList<>();
        Iterable<FicheDePaie> fiches = ficheDePaieRepository.findAll();

        for (FicheDePaie f : fiches) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("employeeId", f.getUtilisateur() != null ? f.getUtilisateur().getId() : null);
            map.put("period", f.getPeriodeMoisAnnee());
            map.put("baseSalary", f.getSalaireBase());
            map.put("grossSalary", f.getTotalBrut());
            map.put("netSalary", f.getTotalNet());
            map.put("statut", f.getStatut());
            map.put("dateGeneration", f.getDateGeneration() != null ? f.getDateGeneration().toString() : "");
            payslipsList.add(map);
        }

        return payslipsList;
    }

    @GetMapping("/variables")
    public List<Map<String, Object>> getVariables() {
        // Retourner une liste vide ou minimale de variables pour satisfaire les appels du frontend
        return new ArrayList<>();
    }

    @GetMapping("/departments")
    public List<Map<String, String>> getDepartments() {
        List<Map<String, String>> depts = new ArrayList<>();
        String[] names = {"R&D", "RH", "Marketing", "Sales"};
        for (String name : names) {
            Map<String, String> d = new HashMap<>();
            d.put("name", name);
            depts.add(d);
        }
        return depts;
    }
}
