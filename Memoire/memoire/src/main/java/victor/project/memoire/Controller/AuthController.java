package victor.project.memoire.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import victor.project.memoire.Modele.Utilisateur;
import victor.project.memoire.Repository.UtilisateurRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UtilisateurRepository utilisateurRepository;
    private final AuthenticationManager authenticationManager;

    public AuthController(UtilisateurRepository utilisateurRepository, AuthenticationManager authenticationManager) {
        this.utilisateurRepository = utilisateurRepository;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        Optional<Utilisateur> userOpt = findUtilisateur(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            Utilisateur user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("fullName", user.getPrenom() + " " + user.getNom());
            response.put("email", user.getEmail());

            String role = user.getRole();
            if ("ADMIN".equalsIgnoreCase(role) || "RH".equalsIgnoreCase(role)) {
                response.put("role", "ADMIN");
            } else {
                response.put("role", "EMPLOYE");
                response.put("employeeId", user.getId());
            }

            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe incorrect");
        }
    }

    private Optional<Utilisateur> findUtilisateur(String username) {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(username);
        if (userOpt.isEmpty()) {
            userOpt = utilisateurRepository.findByPrenom(username);
        }

        if (userOpt.isEmpty() && "admin".equalsIgnoreCase(username)) {
            for (Utilisateur u : utilisateurRepository.findAll()) {
                if (u.getRole() != null && ("RH".equalsIgnoreCase(u.getRole()) || "ADMIN".equalsIgnoreCase(u.getRole()))) {
                    userOpt = Optional.of(u);
                    break;
                }
            }
        }

        return userOpt;
    }
}
