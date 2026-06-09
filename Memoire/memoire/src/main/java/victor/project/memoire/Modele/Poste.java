package victor.project.memoire.Modele;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.List;


@Entity
@Table(name = "poste")
public class Poste {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    private String titre;
    private String description;
    private BigDecimal salaireMin;
    private BigDecimal salaireMax;


    @OneToMany(mappedBy = "poste")
    private List<Contrat> contrats;


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public String getTitre() {
        return titre;
    }


    public void setTitre(String titre) {
        this.titre = titre;
    }


    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public BigDecimal getSalaireMin() {
        return salaireMin;
    }


    public void setSalaireMin(BigDecimal salaireMin) {
        this.salaireMin = salaireMin;
    }


    public BigDecimal getSalaireMax() {
        return salaireMax;
    }


    public void setSalaireMax(BigDecimal salaireMax) {
        this.salaireMax = salaireMax;
    }


    public List<Contrat> getContrats() {
        return contrats;
    }


    public void setContrats(List<Contrat> contrats) {
        this.contrats = contrats;
    }
}





