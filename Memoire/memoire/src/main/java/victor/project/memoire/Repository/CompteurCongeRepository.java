package victor.project.memoire.Repository;

import org.springframework.data.repository.CrudRepository;
import victor.project.memoire.Modele.CompteurConge;
import victor.project.memoire.Modele.Utilisateur;

public interface CompteurCongeRepository extends CrudRepository<CompteurConge, Integer> {
    Iterable<CompteurConge> findByUtilisateur(Utilisateur utilisateur);
}
