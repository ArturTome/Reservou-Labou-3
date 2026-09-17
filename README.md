# Reservou-Labou-3

- Banco de dados, rode isso antes de rodar o codigo.

-- ================================================
-- Banco de dados: reservaslabs
-- Gerado a partir dos Models Sequelize fornecidos
-- ================================================

CREATE DATABASE IF NOT EXISTS `reservaslabs`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `reservaslabs`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `Relatorio`;
DROP TABLE IF EXISTS `Reserva_Equipamento`;
DROP TABLE IF EXISTS `ReservaLaboratorio`;
DROP TABLE IF EXISTS `ReservaEquipamento`;
DROP TABLE IF EXISTS `Equip_DiasDispo`;
DROP TABLE IF EXISTS `Lab_DiasDispo`;
DROP TABLE IF EXISTS `Equipamento`;
DROP TABLE IF EXISTS `Laboratorio`;
DROP TABLE IF EXISTS `DiasDispo`;
DROP TABLE IF EXISTS `Usuario`;

SET FOREIGN_KEY_CHECKS = 1;

-- ========
-- USUARIO
-- ========

CREATE TABLE `Usuario` (
    `IdUser` INT NOT NULL AUTO_INCREMENT,
    `Login` VARCHAR(30) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `StatusADM` BOOLEAN DEFAULT FALSE,

    PRIMARY KEY (`IdUser`),
    UNIQUE KEY `uk_usuario_login` (`Login`)
) ENGINE=InnoDB;

-- ============
-- LABORATORIO
-- ============

CREATE TABLE `Laboratorio` (
    `IdLab` INT NOT NULL AUTO_INCREMENT,
    `NomeLab` VARCHAR(30) NOT NULL,
    `HoraEntrada` TIME NOT NULL,
    `HoraSaida` TIME NOT NULL,

    PRIMARY KEY (`IdLab`),
    UNIQUE KEY `uk_laboratorio_nome` (`NomeLab`)
) ENGINE=InnoDB;

-- ============
-- EQUIPAMENTO
-- ============

CREATE TABLE `Equipamento` (
    `IdEquip` INT NOT NULL AUTO_INCREMENT,
    `NomeEquip` VARCHAR(30) UNIQUE,
    `Durabilidade` VARCHAR(12),
    `Quantidade` INT,
    `HoraEntrada` TIME,
    `HoraSaida` TIME,

    PRIMARY KEY (`IdEquip`)
) ENGINE=InnoDB;

-- =================
-- DIAS DISPONIVEIS
-- =================

CREATE TABLE `DiasDispo` (
    `IdDia` INT NOT NULL AUTO_INCREMENT,
    `Dia` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`IdDia`)
) ENGINE=InnoDB;

-- ==================================
-- RELACIONAMENTO LABORATORIO x DIAS
-- ==================================

CREATE TABLE `Lab_DiasDispo` (
    `IdLab` INT NOT NULL,
    `IdDia` INT NOT NULL,

    PRIMARY KEY (`IdLab`, `IdDia`),

    CONSTRAINT `fk_labdias_lab`
        FOREIGN KEY (`IdLab`)
        REFERENCES `Laboratorio` (`IdLab`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT `fk_labdias_dia`
        FOREIGN KEY (`IdDia`)
        REFERENCES `DiasDispo` (`IdDia`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================================
-- RELACIONAMENTO EQUIPAMENTO x DIAS
-- ==================================

CREATE TABLE `Equip_DiasDispo` (
    `IdEquip` INT NOT NULL,
    `IdDia` INT NOT NULL,

    PRIMARY KEY (`IdEquip`, `IdDia`),

    CONSTRAINT `fk_equipdias_equip`
        FOREIGN KEY (`IdEquip`)
        REFERENCES `Equipamento` (`IdEquip`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT `fk_equipdias_dia`
        FOREIGN KEY (`IdDia`)
        REFERENCES `DiasDispo` (`IdDia`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =======================
-- RESERVA DE LABORATORIO
-- =======================

CREATE TABLE `ReservaLaboratorio` (
    `IdReservaLab` INT NOT NULL AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    `IdLab` INT NOT NULL,
    `DataReserva` DATE NOT NULL,
    `HoraEntrada` TIME NOT NULL,
    `HoraSaida` TIME NOT NULL,
    `QuantidadePessoas` INT NOT NULL,
    `DataCriacao` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`IdReservaLab`),

    CONSTRAINT `fk_reserva_lab_usuario`
        FOREIGN KEY (`IdUser`)
        REFERENCES `Usuario` (`IdUser`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_reserva_lab_laboratorio`
        FOREIGN KEY (`IdLab`)
        REFERENCES `Laboratorio` (`IdLab`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =======================
-- RESERVA DE EQUIPAMENTO
-- =======================

CREATE TABLE `ReservaEquipamento` (
    `IdReservaEquip` INT NOT NULL AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    `DataReserva` DATE NOT NULL,
    `HoraEntrada` TIME NOT NULL,
    `HoraSaida` TIME NOT NULL,
    `DataCriacao` DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`IdReservaEquip`),

    CONSTRAINT `fk_reserva_equip_usuario`
        FOREIGN KEY (`IdUser`)
        REFERENCES `Usuario` (`IdUser`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================
-- ITENS DA RESERVA DE EQUIPAMENTO
--
-- IMPORTANTE:
-- Esta e a unica tabela Reserva_Equipamento.
-- Os arquivos ReservaEquipamentoItem.js e
-- Rserva_Equipamento.js representam a mesma estrutura.
-- =====================================================

CREATE TABLE `Reserva_Equipamento` (
    `IdReservaEquip` INT NOT NULL,
    `IdEquip` INT NOT NULL,
    `Quantidade` INT DEFAULT 1,

    PRIMARY KEY (`IdReservaEquip`, `IdEquip`),

    CONSTRAINT `fk_reserva_item_reserva`
        FOREIGN KEY (`IdReservaEquip`)
        REFERENCES `ReservaEquipamento` (`IdReservaEquip`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT `fk_reserva_item_equipamento`
        FOREIGN KEY (`IdEquip`)
        REFERENCES `Equipamento` (`IdEquip`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ==========
-- RELATORIO
-- ==========

CREATE TABLE `Relatorio` (
    `IdRelatorio` INT NOT NULL AUTO_INCREMENT,
    `IdUser` INT NOT NULL,
    `IdReservaLab` INT NULL,
    `DataGeracao` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Descricao` TEXT,

    PRIMARY KEY (`IdRelatorio`),

    CONSTRAINT `fk_relatorio_usuario`
        FOREIGN KEY (`IdUser`)
        REFERENCES `Usuario` (`IdUser`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT `fk_relatorio_reserva_lab`
        FOREIGN KEY (`IdReservaLab`)
        REFERENCES `ReservaLaboratorio` (`IdReservaLab`)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============
-- DIAS PADRAO
-- ============

INSERT INTO `DiasDispo` (`Dia`) VALUES
('Domingo'),
('Segunda-feira'),
('Terca-feira'),
('Quarta-feira'),
('Quinta-feira'),
('Sexta-feira'),
('Sabado');

-- ====
-- FIM
-- ====
