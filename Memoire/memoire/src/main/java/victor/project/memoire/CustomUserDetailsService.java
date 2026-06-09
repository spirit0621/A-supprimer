package victor.project.memoire;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import victor.project.memoire.Modele.Utilisateur;
import victor.project.memoire.Repository.UtilisateurRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;

    public CustomUserDetailsService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(username);

        if (userOpt.isEmpty()) {
            userOpt = utilisateurRepository.findByPrenom(username);
        }

        if (userOpt.isEmpty() && "admin".equalsIgnoreCase(username)) {
            for (Utilisateur utilisateur : utilisateurRepository.findAll()) {
                if (utilisateur.getRole() != null && (
                        "ADMIN".equalsIgnoreCase(utilisateur.getRole()) ||
                        "RH".equalsIgnoreCase(utilisateur.getRole()))) {
                    userOpt = Optional.of(utilisateur);
                    break;
                }
            }
        }

        Utilisateur utilisateur = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("Utilisateur introuvable : " + username));

        Set<GrantedAuthority> authorities = new HashSet<>();
        String role = utilisateur.getRole();
        if (role != null && ("ADMIN".equalsIgnoreCase(role) || "RH".equalsIgnoreCase(role))) {
            authorities.add(new SimpleGrantedAuthority("ROLE_RH"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_EMPLOYE"));
        }

        String principalName = utilisateur.getEmail();
        if (principalName == null || principalName.isBlank()) {
            principalName = utilisateur.getPrenom();
        }

        return User.withUsername(principalName)
                .password(utilisateur.getMotDePasse())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
