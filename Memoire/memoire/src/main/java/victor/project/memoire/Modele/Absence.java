package victor.project.memoire.Modele;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;


@Entity
@Table(name = "absence")
public class Absence {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;
    private String typeAbsence;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String statut = "EN_ATTENTE";


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public Utilisateur getUtilisateur() {
        return utilisateur;
    }


    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }


    public String getTypeAbsence() {
        return typeAbsence;
    }


    public void setTypeAbsence(String typeAbsence) {
        this.typeAbsence = typeAbsence;
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


    public String getStatut() {
        return statut;
    }


    public void setStatut(String statut) {
        this.statut = statut;
    }
}





