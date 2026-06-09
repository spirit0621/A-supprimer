package victor.project.memoire.Modele;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;


@Entity
@Table(name = "ligne_fiche_de_paie")
public class LigneFicheDePaie {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "fiche_de_paie_id", nullable = false)
    private FicheDePaie ficheDePaie;
    private String code;
    private String libelle;
    private String typeLigne;
    private BigDecimal baseCalcul;
    private BigDecimal tauxSalarial;
    private BigDecimal montantSalarial;
    private BigDecimal tauxPatronal;
    private BigDecimal montantPatronal;


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public FicheDePaie getFicheDePaie() {
        return ficheDePaie;
    }


    public void setFicheDePaie(FicheDePaie ficheDePaie) {
        this.ficheDePaie = ficheDePaie;
    }


    public String getCode() {
        return code;
    }


    public void setCode(String code) {
        this.code = code;
    }


    public String getLibelle() {
        return libelle;
    }


    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }


    public String getTypeLigne() {
        return typeLigne;
    }


    public void setTypeLigne(String typeLigne) {
        this.typeLigne = typeLigne;
    }


    public BigDecimal getBaseCalcul() {
        return baseCalcul;
    }


    public void setBaseCalcul(BigDecimal baseCalcul) {
        this.baseCalcul = baseCalcul;
    }


    public BigDecimal getTauxSalarial() {
        return tauxSalarial;
    }


    public void setTauxSalarial(BigDecimal tauxSalarial) {
        this.tauxSalarial = tauxSalarial;
    }


    public BigDecimal getMontantSalarial() {
        return montantSalarial;
    }


    public void setMontantSalarial(BigDecimal montantSalarial) {
        this.montantSalarial = montantSalarial;
    }


    public BigDecimal getTauxPatronal() {
        return tauxPatronal;
    }


    public void setTauxPatronal(BigDecimal tauxPatronal) {
        this.tauxPatronal = tauxPatronal;
    }


    public BigDecimal getMontantPatronal() {
        return montantPatronal;
    }


    public void setMontantPatronal(BigDecimal montantPatronal) {
        this.montantPatronal = montantPatronal;
    }
}



