-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Ott 25, 2025 alle 16:01
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `financetracker`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `accounttype` enum('bancaintesa','revolut','paypal','portafogliocarte','portafogliomonete','musignacarte','musignamonete','sterline') NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `accounts`
--

INSERT INTO `accounts` (`id`, `userid`, `accounttype`, `balance`, `updatedat`) VALUES
(1, 1, 'bancaintesa', 210.00, '2025-10-25 13:34:43'),
(2, 1, 'revolut', 362.00, '2025-10-25 13:35:03'),
(3, 1, 'paypal', 0.00, '2025-10-24 14:25:28'),
(4, 1, 'portafogliocarte', 5.00, '2025-10-23 11:07:38'),
(5, 1, 'portafogliomonete', 0.00, '2025-10-23 10:24:27'),
(6, 1, 'musignacarte', 90.00, '2025-10-24 13:32:00'),
(7, 1, 'musignamonete', 91.10, '2025-10-25 13:35:17'),
(8, 1, 'sterline', 10.00, '2025-10-24 15:17:15'),
(41, 6, 'bancaintesa', 0.00, '2025-10-25 09:01:30'),
(42, 6, 'revolut', 0.00, '2025-10-25 09:01:30'),
(43, 6, 'paypal', 0.00, '2025-10-25 09:01:30'),
(44, 6, 'portafogliocarte', 0.00, '2025-10-25 09:01:30'),
(45, 6, 'portafogliomonete', 0.00, '2025-10-25 09:01:30'),
(46, 6, 'musignacarte', 0.00, '2025-10-25 09:01:30'),
(47, 6, 'musignamonete', 0.00, '2025-10-25 09:01:30'),
(48, 6, 'sterline', 0.00, '2025-10-25 09:01:30'),
(49, 7, 'bancaintesa', 0.00, '2025-10-25 13:38:48'),
(50, 7, 'revolut', 0.00, '2025-10-25 13:38:48'),
(51, 7, 'paypal', 0.00, '2025-10-25 13:38:48'),
(52, 7, 'portafogliocarte', 0.00, '2025-10-25 13:38:48'),
(53, 7, 'portafogliomonete', 0.00, '2025-10-25 13:38:48'),
(54, 7, 'musignacarte', 0.00, '2025-10-25 13:38:48'),
(55, 7, 'musignamonete', 0.00, '2025-10-25 13:38:48'),
(56, 7, 'sterline', 0.00, '2025-10-25 13:38:48');

-- --------------------------------------------------------

--
-- Struttura della tabella `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `paymentmethod` enum('carta','contanti') NOT NULL,
  `type` enum('ingresso','uscita') NOT NULL,
  `sourceaccount` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `account_snapshot` text DEFAULT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cumulative_balance` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `transactions`
--

INSERT INTO `transactions` (`id`, `userid`, `date`, `amount`, `paymentmethod`, `type`, `sourceaccount`, `description`, `account_snapshot`, `createdat`, `updatedat`, `cumulative_balance`) VALUES
(32, 1, '2025-10-23', 5.00, 'carta', 'uscita', 'bancaintesa', 'ciao\n', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"15.00\"},{\"accounttype\":\"revolut\",\"balance\":\"0.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"20.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-23 11:06:09', '2025-10-23 11:06:09', 0.00),
(33, 1, '2025-10-23', 5.00, 'contanti', 'uscita', 'portafogliocarte', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"15.00\"},{\"accounttype\":\"revolut\",\"balance\":\"0.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"15.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-23 11:06:22', '2025-10-23 11:06:22', 0.00),
(34, 1, '2025-10-23', 10.00, 'contanti', 'ingresso', 'musignacarte', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"15.00\"},{\"accounttype\":\"revolut\",\"balance\":\"0.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"15.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"100.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-23 11:06:34', '2025-10-23 11:06:34', 0.00),
(35, 1, '2025-10-23', 10.00, 'carta', 'ingresso', 'paypal', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"15.00\"},{\"accounttype\":\"revolut\",\"balance\":\"0.00\"},{\"accounttype\":\"paypal\",\"balance\":\"10.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"15.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"100.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-23 11:06:51', '2025-10-23 11:06:51', 0.00),
(37, 1, '2025-10-23', 10.00, 'contanti', 'uscita', 'portafogliocarte', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"16.00\"},{\"accounttype\":\"revolut\",\"balance\":\"0.00\"},{\"accounttype\":\"paypal\",\"balance\":\"10.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"100.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-23 11:07:38', '2025-10-23 11:07:38', 0.00),
(39, 1, '2025-10-24', 10.00, 'carta', 'uscita', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"0.00\"},{\"accounttype\":\"revolut\",\"balance\":\"9.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:23:53', '2025-10-24 14:23:53', 0.00),
(40, 1, '2025-10-24', 10.00, 'carta', 'uscita', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"190.00\"},{\"accounttype\":\"revolut\",\"balance\":\"10.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:24:34', '2025-10-24 14:24:34', 0.00),
(41, 1, '2025-10-24', 10.00, 'carta', 'uscita', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"180.00\"},{\"accounttype\":\"revolut\",\"balance\":\"10.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:25:02', '2025-10-24 14:25:02', 0.00),
(42, 1, '2025-10-24', 10.00, 'carta', 'uscita', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"170.00\"},{\"accounttype\":\"revolut\",\"balance\":\"10.00\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:25:09', '2025-10-24 14:25:09', 0.00),
(43, 1, '2025-10-24', 10.00, 'carta', 'uscita', 'paypal', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"170.00\"},{\"accounttype\":\"revolut\",\"balance\":\"10.00\"},{\"accounttype\":\"paypal\",\"balance\":\"-10.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:25:15', '2025-10-24 14:25:15', 0.00),
(44, 1, '2025-10-24', 100.00, 'carta', 'ingresso', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"270.00\"},{\"accounttype\":\"revolut\",\"balance\":\"30.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:33:55', '2025-10-24 14:33:55', 0.00),
(45, 1, '2025-10-24', 50.00, 'carta', 'uscita', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"220.00\"},{\"accounttype\":\"revolut\",\"balance\":\"30.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:34:07', '2025-10-24 14:34:07', 0.00),
(46, 1, '2025-10-24', 6.00, 'carta', 'ingresso', 'revolut', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"200.00\"},{\"accounttype\":\"revolut\",\"balance\":\"36.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:43:02', '2025-10-24 14:43:02', 0.00),
(47, 1, '2025-10-24', 5.00, 'carta', 'uscita', 'banca_intesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"200.00\"},{\"accounttype\":\"revolut\",\"balance\":\"36.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"0.00\"}]', '2025-10-24 14:43:36', '2025-10-24 14:43:36', 0.00),
(50, 1, '2025-10-24', 9.00, 'carta', 'ingresso', 'bancaintesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"209.00\"},{\"accounttype\":\"revolut\",\"balance\":\"36.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"10.00\"}]', '2025-10-25 07:55:22', '2025-10-25 08:19:17', 0.00),
(53, 1, '2025-10-25', 1.00, 'carta', 'uscita', 'banca_intesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"200.00\"},{\"accounttype\":\"revolut\",\"balance\":\"36.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"10.00\"}]', '2025-10-25 08:16:33', '2025-10-25 08:16:33', 0.00),
(54, 1, '2025-10-25', 9.00, 'carta', 'uscita', 'banca_intesa', '', '[{\"accounttype\":\"bancaintesa\",\"balance\":\"200.00\"},{\"accounttype\":\"revolut\",\"balance\":\"36.10\"},{\"accounttype\":\"paypal\",\"balance\":\"0.00\"},{\"accounttype\":\"portafogliocarte\",\"balance\":\"5.00\"},{\"accounttype\":\"portafogliomonete\",\"balance\":\"0.00\"},{\"accounttype\":\"musignacarte\",\"balance\":\"90.00\"},{\"accounttype\":\"musignamonete\",\"balance\":\"0.00\"},{\"accounttype\":\"sterline\",\"balance\":\"10.00\"}]', '2025-10-25 08:19:10', '2025-10-25 08:19:10', 0.00);

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `passwordhash` varchar(255) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `isadmin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `username`, `passwordhash`, `createdat`, `isadmin`) VALUES
(1, 'mario', '$2b$10$RoDVaZkelSMBqYeiCAdad.vY3TrOcJrK7JNEdrKJxeWDUfhXO9u3K', '2025-10-21 17:42:42', 1),
(6, 'prova', '$2b$10$WSgDXdYjMeSfzIy7WzvTAeucLmkBlLhsExuzuSP1coXfda.k7xZ8.', '2025-10-25 09:01:30', 0),
(7, 'ciaoc', '$2b$10$dxQovHiHwB3L1eKI6QSAvOCmypbhlv5CIIru9Q5zFGQasaIMdOGfC', '2025-10-25 13:38:48', 0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT per la tabella `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limiti per la tabella `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
