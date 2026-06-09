package victor.project.memoire.Modele;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;


@Entity
@Table(name = "etablissement")
public class Etablissement {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;


    private String nom;
    private String siret;
    private String adresse;
    private String ville;
    private String codePostal;


    @OneToMany(mappedBy = "etablissement")
    private List<Utilisateur> utilisateurs;


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
    }


    public String getNom() {
        return nom;
    }


    public void setNom(String nom) {
        this.nom = nom;
    }


    public String getSiret() {
        return siret;
    }


    public void setSiret(String siret) {
        this.siret = siret;
    }


    public String getAdresse() {
        return adresse;
    }


    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }


    public String getVille() {
        return ville;
    }


    public void setVille(String ville) {
        this.ville = ville;
    }


    public String getCodePostal() {
        return codePostal;
    }


    public void setCodePostal(String codePostal) {
        this.codePostal = codePostal;
    }


    public List<Utilisateur> getUtilisateurs() {
        return utilisateurs;
    }


    public void setUtilisateurs(List<Utilisateur> utilisateurs) {
        this.utilisateurs = utilisateurs;
    }
}



