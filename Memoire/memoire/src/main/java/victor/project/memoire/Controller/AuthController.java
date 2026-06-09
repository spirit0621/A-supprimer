package victor.project.memoire.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import victor.project.memoire.Modele.Utilisateur;
import victor.project.memoire.Repository.UtilisateurRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UtilisateurRepository utilisateurRepository, BCryptPasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        Optional<Utilisateur> userOpt = Optional.empty();

        // 1. Essayer de trouver par e-mail
        userOpt = utilisateurRepository.findByEmail(username);

        // 2. Essayer de trouver par prénom
        if (userOpt.isEmpty()) {
            userOpt = utilisateurRepository.findByPrenom(username);
        }

        // 3. Cas particulier pour le raccourci d'identifiant "admin"
        if (userOpt.isEmpty() && username.equalsIgnoreCase("admin")) {
            for (Utilisateur u : utilisateurRepository.findAll()) {
                if ("RH".equalsIgnoreCase(u.getRole()) || "ADMIN".equalsIgnoreCase(u.getRole())) {
                    userOpt = Optional.of(u);
                    break;
                }
            }
        }

        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            // Vérifier le mot de passe à l'aide de la correspondance BCrypt
            if (passwordEncoder.matches(password, user.getMotDePasse())) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("fullName", user.getPrenom() + " " + user.getNom());
                response.put("email", user.getEmail());

                // Standardiser le rôle à RH s'il s'agit d'un ADMIN ou d'un RH
                String role = user.getRole();
                if ("ADMIN".equalsIgnoreCase(role) || "RH".equalsIgnoreCase(role)) {
                    response.put("role", "RH");
                } else {
                    response.put("role", "EMPLOYE");
                    response.put("employeeId", user.getId());
                }

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Identifiant ou mot de passe incorrect");
    }
}
