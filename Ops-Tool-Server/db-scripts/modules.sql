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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MODULES`
--

LOCK TABLES `MODULES` WRITE;
/*!40000 ALTER TABLE `MODULES` DISABLE KEYS */;
INSERT INTO `MODULES` VALUES (1,'Organizations',' ','/organizations',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,1,NULL,0,'2020-12-01 23:56:46','2022-09-02 07:21:25'),(2,'List Users',' ','/users/list',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,41,0,'2020-12-01 23:57:30','2022-09-26 08:25:33'),(3,'Contents',NULL,'/contents/list',1,'SUPPORT READ, SUPPORT CRUD, SUPPORT ADMIN','',0,1,NULL,0,'2020-12-01 23:58:09','2020-12-01 23:58:09'),(4,'Contents Bulk Upload',' ','/contents/bulk-upload/list',1,'SUPPORT CRUD, SUPPORT ADMIN',NULL,0,1,NULL,0,'2020-12-01 23:59:08','2022-06-27 05:36:26'),(5,'Users Bulk Upload',' ','/users/bulk-upload/list',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,1,NULL,0,'2020-12-01 23:59:37','2022-06-07 13:55:32'),(6,'Support Users',' ','/admin/support-users/list',1,'SUPPORT ADMIN',NULL,1,1,NULL,0,'2020-12-02 00:00:09','2022-06-21 09:37:15'),(7,'Modules',NULL,'/admin/modules/list',1,'SUPPORT ADMIN','',1,1,NULL,0,'2020-12-13 22:02:51','2021-06-29 09:02:33'),(8,'Configurations','','/admin/constants/list',1,'SUPPORT ADMIN',NULL,1,1,NULL,0,'2020-12-15 01:30:12','2022-05-04 11:32:17'),(9,'Forms',' ','/forms/list',1,'SUPPORT CRUD,SUPPORT ADMIN',NULL,0,1,NULL,0,'2021-02-08 07:25:46','2022-11-11 10:09:17'),(10,'Certificates',' ','/certificates/list',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,1,NULL,0,'2021-06-29 15:14:03','2022-11-29 11:10:22'),(11,'Reports',' ','/reports/list',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,1,NULL,0,'2022-05-04 12:49:15','2022-07-01 09:46:35'),(12,'Course Reports',' ','/reports/course',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,17,0,'2022-05-04 12:55:21','2022-07-01 09:45:29'),(13,'Self Signup User Reports',' ','/reports/self-signup-users',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,17,0,'2022-05-05 09:43:47','2022-09-01 12:30:43'),(14,'Upload Users',' ','/users/bulk-upload/upload',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,5,0,'2022-06-07 09:45:57','2022-09-01 12:31:43'),(15,'User Upload Status',' ','/users/bulk-upload/upload-status',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,5,0,'2022-06-07 09:48:13','2022-09-01 12:31:55'),(16,'Batch Upload Lists',' ','/users/bulk-upload/batch-upload-list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,5,0,'2022-06-07 09:49:22','2022-09-01 12:27:50'),(17,'Upload Contents',' ','/contents/bulk-upload/upload',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,4,0,'2022-06-27 06:13:36','2022-09-01 12:36:59'),(18,'Content Upload Status',' ','/contents/bulk-upload/upload-status',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,4,0,'2022-06-27 06:14:28','2022-09-01 12:36:08'),(19,'Batch Upload Lists',' ','/contents/bulk-upload/batch-upload-list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,4,0,'2022-06-27 06:15:54','2022-09-01 12:36:05'),(20,'Broadcast Contents',' ','/contents/broadcast/list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,1,NULL,0,'2022-06-29 08:01:08','2022-06-29 08:08:52'),(21,'Upload Contents',' ','/contents/broadcast/upload',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,28,0,'2022-06-29 08:07:31','2022-09-01 12:31:29'),(22,'Content Upload Status',' ','/contents/broadcast/upload-status',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,28,0,'2022-06-29 10:03:28','2022-09-01 12:28:46'),(23,'Batch Upload Lists',' ','/contents/broadcast/batch-upload-list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,28,0,'2022-06-29 10:04:10','2022-09-01 12:27:31'),(24,'Contents Shallow Copy',' ','/contents/shallow-copy/list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,1,NULL,0,'2022-08-24 10:54:23','2022-08-24 11:00:48'),(25,'Upload Contents',' ','/contents/shallow-copy/upload',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,34,0,'2022-08-24 10:55:37','2022-09-02 08:33:36'),(26,'Content Upload Status',' ','/contents/shallow-copy/upload-status',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,34,0,'2022-08-24 10:56:28','2022-08-24 11:01:16'),(27,'Batch Upload Lists',' ','/contents/shallow-copy/batch-upload-list',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,34,0,'2022-08-24 10:57:01','2022-09-01 12:28:10'),(28,'List Organizations',' ','/organizations/list',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,1,0,'2022-09-02 07:22:24','2022-09-02 07:24:48'),(29,'Create Organizations',' ','/organizations/create',1,'SUPPORT ADMIN',NULL,0,0,1,0,'2022-09-02 07:23:31','2022-09-02 07:26:54'),(30,'Update Organizations',' ','/organizations/update',1,'SUPPORT ADMIN',NULL,0,0,1,0,'2022-09-02 07:24:24','2022-09-02 07:26:58'),(31,'Users',' ','/users',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,1,NULL,0,'2022-09-26 08:25:02','2022-09-26 08:25:14'),(32,'Create Users',' ','/users/create',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,0,41,0,'2022-09-26 10:11:14','2022-09-26 10:11:21'),(33,'Sub Role Configuration',' ','/subrole',1,'SUPPORT ADMIN,SUPPORT CRUD',NULL,0,1,NULL,0,'2022-10-26 10:09:43','2022-11-10 13:52:08'),(34,'User Certificates',' ','/certificates/user',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,14,0,'2022-11-29 11:11:30','2022-11-29 11:11:39'),(35,'Course Certificates',' ','/certificates/course',1,'SUPPORT ADMIN,SUPPORT CRUD,SUPPORT READ',NULL,0,0,14,0,'2022-11-29 11:12:10','2022-11-29 11:12:28');
/*!40000 ALTER TABLE `MODULES` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-16 15:49:15
