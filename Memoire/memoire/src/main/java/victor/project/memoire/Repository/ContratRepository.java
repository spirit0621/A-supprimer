package victor.project.memoire.Repository;

import org.springframework.data.repository.CrudRepository;
import victor.project.memoire.Modele.Contrat;
import victor.project.memoire.Modele.Utilisateur;

public interface ContratRepository extends CrudRepository<Contrat, Integer> {
    Iterable<Contrat> findByUtilisateur(Utilisateur utilisateur);
}
