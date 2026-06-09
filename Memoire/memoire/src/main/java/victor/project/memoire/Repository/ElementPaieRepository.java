package victor.project.memoire.Repository;

import org.springframework.data.repository.CrudRepository;
import victor.project.memoire.Modele.Contrat;
import victor.project.memoire.Modele.ElementPaie;

public interface ElementPaieRepository extends CrudRepository<ElementPaie, Integer> {
    Iterable<ElementPaie> findByContrat(Contrat contrat);
}
