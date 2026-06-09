package victor.project.memoire.Modele;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "element_paie")
public class ElementPaie {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "contrat_id", nullable = false)
    private Contrat contrat;


    @ManyToOne
    @JoinColumn(name = "fiche_de_paie_id", nullable = false)
    private FicheDePaie ficheDePaie;
    private String code;
    private String libelle;
    private String typeElement;
    private String natureSaisie;
    private String valeur;
    private BigDecimal quantite = BigDecimal.ONE;
    private LocalDate dateDebut;
    private LocalDate dateFin;


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public Contrat getContrat() {
        return contrat;
    }


    public void setContrat(Contrat contrat) {
        this.contrat = contrat;
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


    public String getTypeElement() {
        return typeElement;
    }


    public void setTypeElement(String typeElement) {
        this.typeElement = typeElement;
    }


    public String getNatureSaisie() {
        return natureSaisie;
    }


    public void setNatureSaisie(String natureSaisie) {
        this.natureSaisie = natureSaisie;
    }


    public String getValeur() {
        return valeur;
    }


    public void setValeur(String valeur) {
        this.valeur = valeur;
    }


    public BigDecimal getQuantite() {
        return quantite;
    }


    public void setQuantite(BigDecimal quantite) {
        this.quantite = quantite;
    }


    public LocalDate getDateDebut() {
        return dateDebut;
    }


    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }


    public LocalDate getDateFin() {
        return dateFin;
    }


    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}



