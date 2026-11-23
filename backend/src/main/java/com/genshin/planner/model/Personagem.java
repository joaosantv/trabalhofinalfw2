package com.genshin.planner.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "personagens")
public class Personagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer raridade;

    @Column(nullable = false)
    private String armaEquipada;

    @Column(nullable = false)
    private Integer nivel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusBuild statusBuild;

    private String conjuntoArtefatos;

    private String statusAlvo;

    @Column(length = 1000)
    private String observacoes;

    private String imagemUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "elemento_id", nullable = false)
    private Elemento elemento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Personagem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getRaridade() {
        return raridade;
    }

    public void setRaridade(Integer raridade) {
        this.raridade = raridade;
    }

    public String getArmaEquipada() {
        return armaEquipada;
    }

    public void setArmaEquipada(String armaEquipada) {
        this.armaEquipada = armaEquipada;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public StatusBuild getStatusBuild() {
        return statusBuild;
    }

    public void setStatusBuild(StatusBuild statusBuild) {
        this.statusBuild = statusBuild;
    }

    public String getConjuntoArtefatos() {
        return conjuntoArtefatos;
    }

    public void setConjuntoArtefatos(String conjuntoArtefatos) {
        this.conjuntoArtefatos = conjuntoArtefatos;
    }

    public String getStatusAlvo() {
        return statusAlvo;
    }

    public void setStatusAlvo(String statusAlvo) {
        this.statusAlvo = statusAlvo;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public Elemento getElemento() {
        return elemento;
    }

    public void setElemento(Elemento elemento) {
        this.elemento = elemento;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
