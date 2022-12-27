-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: ETBPROCESS
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ETBPROCESS`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ETBPROCESS` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ETBPROCESS`;

--
-- Table structure for table `BROADCAST_CONTENT_INFO`
--

DROP TABLE IF EXISTS `BROADCAST_CONTENT_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BROADCAST_CONTENT_INFO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RecordSequenceNo` varchar(50) NOT NULL,
  `batch_processId` varchar(50) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('pending','success','failure') DEFAULT 'pending',
  `content_identifier` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(200) DEFAULT NULL,
  `contentName` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentDesc` varchar(5000) DEFAULT NULL,
  `Board` varchar(200) DEFAULT NULL,
  `Grade` varchar(200) DEFAULT NULL,
  `Subject` varchar(200) DEFAULT NULL,
  `Medium` varchar(200) DEFAULT NULL,
  `Topic` varchar(100) DEFAULT NULL,
  `ResourceType` varchar(100) DEFAULT NULL,
  `keywords` varchar(500) DEFAULT NULL,
  `Audience` varchar(100) DEFAULT NULL,
  `Attribution` varchar(255) NOT NULL,
  `IconPath` varchar(1000) DEFAULT NULL,
  `FilePath` varchar(1000) DEFAULT NULL,
  `FileFormat` varchar(1000) DEFAULT NULL,
  `Author` varchar(100) DEFAULT NULL,
  `Copyright` varchar(1000) DEFAULT NULL,
  `CopyrightYear` varchar(5) DEFAULT NULL,
  `License` varchar(200) DEFAULT NULL,
  `LicenseTerms` varchar(500) DEFAULT NULL,
  `ContentType` varchar(100) DEFAULT NULL,
  `failure_reason` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=780 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `BROADCAST_CONTENT_UPLOAD`
--

DROP TABLE IF EXISTS `BROADCAST_CONTENT_UPLOAD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BROADCAST_CONTENT_UPLOAD` (
  `id` int NOT NULL AUTO_INCREMENT,
  `processId` varchar(50) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `userId` varchar(300) NOT NULL,
  `frameworkId` varchar(20) NOT NULL,
  `excelPath` text NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('process','completed','failed') DEFAULT NULL,
  `failureReason` varchar(5000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userInfo` varchar(200) DEFAULT NULL,
  `executor_info` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CONSTANTS`
--

DROP TABLE IF EXISTS `CONSTANTS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONSTANTS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `field_name` varchar(50) NOT NULL,
  `field_value` text NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CONTENT_BULK_UPLOAD`
--

DROP TABLE IF EXISTS `CONTENT_BULK_UPLOAD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTENT_BULK_UPLOAD` (
  `id` int NOT NULL AUTO_INCREMENT,
  `processId` varchar(50) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `userId` varchar(300) NOT NULL,
  `frameworkId` varchar(20) NOT NULL,
  `excelPath` text NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('process','completed','failed') DEFAULT NULL,
  `failureReason` varchar(5000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userInfo` varchar(200) DEFAULT NULL,
  `executor_info` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=482 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CONTENT_INFO`
--

DROP TABLE IF EXISTS `CONTENT_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTENT_INFO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RecordSequenceNo` varchar(50) NOT NULL,
  `batch_processId` varchar(50) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('pending','success','failure') DEFAULT 'pending',
  `content_identifier` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(200) DEFAULT NULL,
  `contentName` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentDesc` varchar(5000) DEFAULT NULL,
  `Board` varchar(200) DEFAULT NULL,
  `Grade` varchar(200) DEFAULT NULL,
  `Subject` varchar(200) DEFAULT NULL,
  `Medium` varchar(200) DEFAULT NULL,
  `Topic` varchar(100) DEFAULT NULL,
  `ResourceType` varchar(100) DEFAULT NULL,
  `keywords` varchar(500) DEFAULT NULL,
  `Audience` varchar(100) DEFAULT NULL,
  `Attribution` varchar(255) NOT NULL,
  `IconPath` varchar(1000) DEFAULT NULL,
  `FilePath` varchar(1000) DEFAULT NULL,
  `FileFormat` varchar(1000) DEFAULT NULL,
  `Author` varchar(100) DEFAULT NULL,
  `Copyright` varchar(100) DEFAULT NULL,
  `CopyrightYear` varchar(5) DEFAULT NULL,
  `License` varchar(200) DEFAULT NULL,
  `LicenseTerms` varchar(500) DEFAULT NULL,
  `ContentType` varchar(100) DEFAULT NULL,
  `PrimaryCategory` varchar(500) DEFAULT NULL,
  `AdditionalCategories` varchar(500) DEFAULT NULL,
  `failure_reason` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3947 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `CONTENT_SHALLOW_COPY`
--

DROP TABLE IF EXISTS `CONTENT_SHALLOW_COPY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CONTENT_SHALLOW_COPY` (
  `id` int NOT NULL AUTO_INCREMENT,
  `processId` varchar(50) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `userId` varchar(300) NOT NULL,
  `frameworkId` varchar(20) NOT NULL,
  `excelPath` text NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('process','completed','failed') DEFAULT NULL,
  `failureReason` varchar(5000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userInfo` varchar(200) DEFAULT NULL,
  `executor_info` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MODULES`
--

DROP TABLE IF EXISTS `MODULES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MODULES` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `url` varchar(200) NOT NULL,
  `isVisible` tinyint(1) DEFAULT '1',
  `roles` varchar(200) NOT NULL,
  `icon` varchar(200) DEFAULT NULL,
  `isAdminModule` tinyint(1) DEFAULT '0',
  `isRootModule` tinyint(1) DEFAULT '0',
  `rootModuleId` smallint DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `createdOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedOn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `SHALLOW_CONTENT_INFO`
--

DROP TABLE IF EXISTS `SHALLOW_CONTENT_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SHALLOW_CONTENT_INFO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RecordSequenceNo` varchar(50) NOT NULL,
  `batch_processId` varchar(50) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `status` enum('pending','success','failure') DEFAULT 'pending',
  `content_identifier` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `contentOrigin` varchar(50) DEFAULT NULL,
  `Board` varchar(200) DEFAULT NULL,
  `Grade` varchar(200) DEFAULT NULL,
  `Subject` varchar(200) DEFAULT NULL,
  `Medium` varchar(200) DEFAULT NULL,
  `failure_reason` varchar(5000) DEFAULT NULL,
  `publishStatus` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3976 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USER_BULK_UPLOAD`
--

DROP TABLE IF EXISTS `USER_BULK_UPLOAD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_BULK_UPLOAD` (
  `id` int NOT NULL AUTO_INCREMENT,
  `batchId` varchar(50) NOT NULL,
  `processId` varchar(50) DEFAULT NULL,
  `adminEmail` varchar(50) NOT NULL,
  `channelId` varchar(50) NOT NULL,
  `existingUsersCsv` varchar(300) DEFAULT NULL,
  `invalidNewUsersCsv` varchar(300) DEFAULT NULL,
  `newUsersCSV` varchar(300) DEFAULT NULL,
  `comments` varchar(300) DEFAULT NULL,
  `status` enum('pending','success','fail') NOT NULL DEFAULT 'pending',
  `failureReason` varchar(2000) DEFAULT NULL,
  `CSVPath` varchar(300) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `xyz` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USER_INFO`
--

DROP TABLE IF EXISTS `USER_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_INFO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(1000) NOT NULL,
  `userName` varchar(1000) NOT NULL,
  `firstName` varchar(200) NOT NULL,
  `lastName` varchar(200) NOT NULL,
  `roles` varchar(1000) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `USER_SESSION`
--

DROP TABLE IF EXISTS `USER_SESSION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER_SESSION` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-13 16:10:42
