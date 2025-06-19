-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: xagm
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `xagm`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `xagm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `xagm`;

--
-- Table structure for table `agm_history`
--

DROP TABLE IF EXISTS `agm_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agm_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agm` json DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agm_history`
--

LOCK TABLES `agm_history` WRITE;
/*!40000 ALTER TABLE `agm_history` DISABLE KEYS */;
INSERT INTO `agm_history` VALUES (13,'[[\"28\", \"5\", \"37\", \"5\", \"9\", \"5\", \"2025-05-22T12:29:33.510Z\", \"2025-05-22T12:29:33.576Z\"], [\"29\", \"5\", \"49\", \"13\", \"9\", \"2\", \"2025-05-22T12:29:36.510Z\", \"2025-05-22T12:29:36.695Z\"], [\"25\", \"3\", \"42\", \"13\", \"10\", \"9\", \"2025-05-22T12:29:37.511Z\", \"2025-05-22T12:29:37.571Z\"], [\"25\", \"5\", \"22\", \"7\", \"7\", \"4\", \"2025-05-22T12:29:38.511Z\", \"2025-05-22T12:29:38.567Z\"], [\"29\", \"5\", \"15\", \"17\", \"8\", \"8\", \"2025-05-22T12:29:39.511Z\", \"2025-05-22T12:29:39.590Z\"], [\"30\", \"3\", \"50\", \"8\", \"6\", \"6\", \"2025-05-22T12:29:40.512Z\", \"2025-05-22T12:29:40.590Z\"], [\"28\", \"4\", \"36\", \"16\", \"6\", \"7\", \"2025-05-22T12:29:41.512Z\", \"2025-05-22T12:29:41.571Z\"], [\"28\", \"3\", \"44\", \"19\", \"8\", \"2\", \"2025-05-22T12:29:42.512Z\", \"2025-05-22T12:29:42.573Z\"], [\"25\", \"4\", \"55\", \"7\", \"10\", \"2\", \"2025-05-22T12:29:43.513Z\", \"2025-05-22T12:29:43.561Z\"]]','2025-05-22 12:29:43'),(14,'[[\"28\", \"5\", \"23\", \"13\", \"6\", \"4\", \"2025-05-23T04:37:42.936Z\", \"2025-05-23T04:37:42.939Z\"], [\"29\", \"4\", \"18\", \"12\", \"5\", \"2\", \"2025-05-23T04:37:43.937Z\", \"2025-05-23T04:37:43.939Z\"], [\"27\", \"5\", \"42\", \"14\", \"9\", \"2\", \"2025-05-23T04:37:44.937Z\", \"2025-05-23T04:37:44.940Z\"], [\"26\", \"5\", \"54\", \"17\", \"8\", \"4\", \"2025-05-23T04:37:45.938Z\", \"2025-05-23T04:37:45.940Z\"], [\"27\", \"4\", \"52\", \"8\", \"9\", \"10\", \"2025-05-23T04:37:46.938Z\", \"2025-05-23T04:37:46.940Z\"], [\"25\", \"5\", \"58\", \"13\", \"6\", \"6\", \"2025-05-23T04:37:47.938Z\", \"2025-05-23T04:37:47.942Z\"], [\"29\", \"3\", \"59\", \"8\", \"7\", \"2\", \"2025-05-23T04:37:48.938Z\", \"2025-05-23T04:37:48.940Z\"], [\"25\", \"5\", \"25\", \"17\", \"5\", \"9\", \"2025-05-23T04:37:49.939Z\", \"2025-05-23T04:37:49.940Z\"], [\"27\", \"3\", \"30\", \"6\", \"5\", \"10\", \"2025-05-23T04:37:50.939Z\", \"2025-05-23T04:37:50.941Z\"], [\"27\", \"5\", \"45\", \"15\", \"8\", \"8\", \"2025-05-23T04:37:51.940Z\", \"2025-05-23T04:37:51.941Z\"], [\"30\", \"4\", \"58\", \"8\", \"7\", \"4\", \"2025-05-23T04:37:52.940Z\", \"2025-05-23T04:37:52.942Z\"], [\"25\", \"5\", \"25\", \"18\", \"9\", \"8\", \"2025-05-23T04:37:53.940Z\", \"2025-05-23T04:37:53.941Z\"], [\"30\", \"5\", \"55\", \"8\", \"8\", \"6\", \"2025-05-23T04:37:54.941Z\", \"2025-05-23T04:37:54.943Z\"], [\"27\", \"3\", \"18\", \"8\", \"10\", \"2\", \"2025-05-23T04:37:55.941Z\", \"2025-05-23T04:37:55.943Z\"]]','2025-05-23 04:37:56'),(15,'[[\"0.00\", \"0\", \"0.0\", \"0.00\", \"0.0\", \"2025-06-05T12:43:09.009Z\", \"2025-06-05T12:43:09.040Z\"], [\"0.48\", \"29\", \"5220.0\", \"5.22\", \"522.0\", \"2025-06-05T12:43:11.090Z\", \"2025-06-05T12:43:11.121Z\"], [\"0.00\", \"0\", \"0.0\", \"0.00\", \"0.0\", \"2025-06-05T12:43:39.618Z\", \"2025-06-05T12:43:39.660Z\"], [\"0.48\", \"29\", \"5220.0\", \"5.22\", \"522.0\", \"2025-06-05T12:43:41.702Z\", \"2025-06-05T12:43:41.738Z\"], [\"0.72\", \"43\", \"7740.0\", \"7.74\", \"774.0\", \"2025-06-05T12:43:43.704Z\", \"2025-06-05T12:43:43.739Z\"], [\"1.43\", \"86\", \"15480.0\", \"15.48\", \"1548.0\", \"2025-06-05T12:43:45.864Z\", \"2025-06-05T12:43:45.898Z\"], [\"1.67\", \"100\", \"18000.0\", \"18.00\", \"1800.0\", \"2025-06-05T12:43:47.867Z\", \"2025-06-05T12:43:47.901Z\"], [\"2.38\", \"143\", \"25740.0\", \"25.74\", \"2574.0\", \"2025-06-05T12:43:50.047Z\", \"2025-06-05T12:43:50.087Z\"], [\"2.62\", \"157\", \"28260.0\", \"28.26\", \"2826.0\", \"2025-06-05T12:43:52.027Z\", \"2025-06-05T12:43:52.067Z\"], [\"3.33\", \"200\", \"36000.0\", \"36.00\", \"3600.0\", \"2025-06-05T12:43:54.193Z\", \"2025-06-05T12:43:54.243Z\"], [\"3.33\", \"200\", \"36000.0\", \"36.00\", \"3600.0\", \"2025-06-05T12:43:56.198Z\", \"2025-06-05T12:43:56.251Z\"], [\"2.62\", \"157\", \"28260.0\", \"28.26\", \"2826.0\", \"2025-06-05T12:43:58.364Z\", \"2025-06-05T12:43:58.404Z\"], [\"2.38\", \"143\", \"25740.0\", \"25.74\", \"2574.0\", \"2025-06-05T12:44:00.365Z\", \"2025-06-05T12:44:00.404Z\"], [\"1.67\", \"100\", \"18000.0\", \"18.00\", \"1800.0\", \"2025-06-05T12:44:02.532Z\", \"2025-06-05T12:44:02.572Z\"], [\"1.43\", \"86\", \"15480.0\", \"15.48\", \"1548.0\", \"2025-06-05T12:44:04.533Z\", \"2025-06-05T12:44:04.574Z\"], [\"0.95\", \"57\", \"10260.0\", \"10.26\", \"1026.0\", \"2025-06-05T12:44:06.536Z\", \"2025-06-05T12:44:06.577Z\"], [\"0.48\", \"29\", \"5220.0\", \"5.22\", \"522.0\", \"2025-06-05T12:44:08.540Z\", \"2025-06-05T12:44:08.581Z\"], [\"0.00\", \"0\", \"0.0\", \"0.00\", \"0.0\", \"2025-06-05T12:44:10.543Z\", \"2025-06-05T12:44:10.585Z\"], [\"0.23\", \"14\", \"2520.0\", \"2.52\", \"252.0\", \"2025-06-05T12:44:12.547Z\", \"2025-06-05T12:44:12.587Z\"], [\"0.72\", \"43\", \"7740.0\", \"7.74\", \"774.0\", \"2025-06-05T12:44:14.889Z\", \"2025-06-05T12:44:14.929Z\"]]','2025-06-05 12:44:15'),(16,'[[\"3.10\", \"186\", \"33480.0\", \"33.48\", \"3348.0\", \"2025-06-05T12:45:28.763Z\", \"2025-06-05T12:45:28.798Z\"], [\"3.33\", \"200\", \"36000.0\", \"36.00\", \"3600.0\", \"2025-06-05T12:45:30.939Z\", \"2025-06-05T12:45:30.966Z\"], [\"2.85\", \"171\", \"30780.0\", \"30.78\", \"3078.0\", \"2025-06-05T12:45:33.072Z\", \"2025-06-05T12:45:33.100Z\"], [\"2.38\", \"143\", \"25740.0\", \"25.74\", \"2574.0\", \"2025-06-05T12:45:35.150Z\", \"2025-06-05T12:45:35.176Z\"], [\"1.90\", \"114\", \"20520.0\", \"20.52\", \"2052.0\", \"2025-06-05T12:45:37.239Z\", \"2025-06-05T12:45:37.265Z\"], [\"1.43\", \"86\", \"15480.0\", \"15.48\", \"1548.0\", \"2025-06-05T12:45:39.328Z\", \"2025-06-05T12:45:39.353Z\"], [\"0.95\", \"57\", \"10260.0\", \"10.26\", \"1026.0\", \"2025-06-05T12:45:41.411Z\", \"2025-06-05T12:45:41.441Z\"]]','2025-06-05 12:45:43'),(17,'[[\"0.95\", \"57\", \"10260.0\", \"10.26\", \"1026.0\", null, \"2025-06-05T13:40:39.420Z\"], [\"0.48\", \"29\", \"5220.0\", \"5.22\", \"522.0\", null, \"2025-06-05T13:40:41.404Z\"], [\"0.00\", \"0\", \"0.0\", \"0.00\", \"0.0\", null, \"2025-06-05T13:40:43.415Z\"], [\"0.23\", \"14\", \"2520.0\", \"2.52\", \"252.0\", null, \"2025-06-05T13:40:45.412Z\"], [\"0.72\", \"43\", \"7740.0\", \"7.74\", \"774.0\", null, \"2025-06-05T13:40:47.410Z\"], [\"1.18\", \"71\", \"12780.0\", \"12.78\", \"1278.0\", null, \"2025-06-05T13:40:49.426Z\"], [\"1.43\", \"86\", \"15480.0\", \"15.48\", \"1548.0\", null, \"2025-06-05T13:40:51.417Z\"], [\"1.90\", \"114\", \"20520.0\", \"20.52\", \"2052.0\", null, \"2025-06-05T13:40:53.420Z\"], [\"2.38\", \"143\", \"25740.0\", \"25.74\", \"2574.0\", null, \"2025-06-05T13:40:55.423Z\"], [\"2.85\", \"171\", \"30780.0\", \"30.78\", \"3078.0\", null, \"2025-06-05T13:40:57.426Z\"], [\"3.33\", \"200\", \"36000.0\", \"36.00\", \"3600.0\", null, \"2025-06-05T13:40:59.430Z\"], [\"3.10\", \"186\", \"33480.0\", \"33.48\", \"3348.0\", null, \"2025-06-05T13:41:01.445Z\"], [\"2.62\", \"157\", \"28260.0\", \"28.26\", \"2826.0\", null, \"2025-06-05T13:41:03.451Z\"]]','2025-06-05 13:41:04');
/*!40000 ALTER TABLE `agm_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversion_factors`
--

DROP TABLE IF EXISTS `conversion_factors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversion_factors` (
  `id` int NOT NULL,
  `alpha` varchar(45) DEFAULT NULL,
  `mRhr` varchar(45) DEFAULT NULL,
  `uSvhr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversion_factors`
--

LOCK TABLES `conversion_factors` WRITE;
/*!40000 ALTER TABLE `conversion_factors` DISABLE KEYS */;
INSERT INTO `conversion_factors` VALUES (1,'0.004','0.025','0.018');
/*!40000 ALTER TABLE `conversion_factors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_list`
--

DROP TABLE IF EXISTS `users_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_list` (
  `name` varchar(15) NOT NULL,
  `password` varchar(45) NOT NULL,
  `UID` varchar(45) NOT NULL,
  `membership` int NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `access_level` int NOT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `loggedIn` tinyint DEFAULT NULL,
  PRIMARY KEY (`name`,`password`,`UID`,`email`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `UID_UNIQUE` (`UID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_list`
--

LOCK TABLES `users_list` WRITE;
/*!40000 ALTER TABLE `users_list` DISABLE KEYS */;
INSERT INTO `users_list` VALUES ('Admin Noki','admin1','d752ea0f-dd0b-4048-952e-50c16f40a0d1',1,NULL,3,'','admin@noki.com',0),('SupportNoki','support','e7ac6765-fb47-414c-a8db-8e0bc87ca253',1,NULL,1,'','support@noki.com',0),('UID1011','engineer','6c2e852d-820f-4c42-9f31-bb5b9db638cd',1,NULL,3,'','engineer@noki.com',NULL);
/*!40000 ALTER TABLE `users_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `medlabx`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `medlabx` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `medlabx`;

--
-- Table structure for table `users_list`
--

DROP TABLE IF EXISTS `users_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_list` (
  `name` varchar(15) NOT NULL,
  `password` varchar(45) NOT NULL,
  `UID` varchar(45) NOT NULL,
  `membership` int NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `access_level` int NOT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `loggedIn` tinyint DEFAULT NULL,
  PRIMARY KEY (`name`,`password`,`UID`,`email`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `UID_UNIQUE` (`UID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_list`
--

LOCK TABLES `users_list` WRITE;
/*!40000 ALTER TABLE `users_list` DISABLE KEYS */;
INSERT INTO `users_list` VALUES ('Admin Noki','admin1','d752ea0f-dd0b-4048-952e-50c16f40a0d1',1,NULL,3,'','admin@noki.com',0),('SupportNoki','support','e7ac6765-fb47-414c-a8db-8e0bc87ca253',1,NULL,1,'','support@noki.com',0),('UID1011','engineer','6c2e852d-820f-4c42-9f31-bb5b9db638cd',1,NULL,3,'','engineer@noki.com',NULL);
/*!40000 ALTER TABLE `users_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `xsurvey`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `xsurvey` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `xsurvey`;

--
-- Table structure for table `agm_history`
--

DROP TABLE IF EXISTS `agm_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agm_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `agm` json DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agm_history`
--

LOCK TABLES `agm_history` WRITE;
/*!40000 ALTER TABLE `agm_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `agm_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversion_factors`
--

DROP TABLE IF EXISTS `conversion_factors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversion_factors` (
  `id` int NOT NULL,
  `alpha` varchar(45) DEFAULT NULL,
  `mRhr` varchar(45) DEFAULT NULL,
  `uSvhr` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversion_factors`
--

LOCK TABLES `conversion_factors` WRITE;
/*!40000 ALTER TABLE `conversion_factors` DISABLE KEYS */;
INSERT INTO `conversion_factors` VALUES (1,'0.004','0.025','0.018');
/*!40000 ALTER TABLE `conversion_factors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_list`
--

DROP TABLE IF EXISTS `users_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_list` (
  `name` varchar(15) NOT NULL,
  `password` varchar(45) NOT NULL,
  `UID` varchar(45) NOT NULL,
  `membership` int NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `access_level` int NOT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `loggedIn` tinyint DEFAULT NULL,
  PRIMARY KEY (`name`,`password`,`UID`,`email`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `UID_UNIQUE` (`UID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_list`
--

LOCK TABLES `users_list` WRITE;
/*!40000 ALTER TABLE `users_list` DISABLE KEYS */;
INSERT INTO `users_list` VALUES ('Admin Noki','admin1','d752ea0f-dd0b-4048-952e-50c16f40a0d1',1,NULL,3,'','admin@noki.com',0),('SupportNoki','support','e7ac6765-fb47-414c-a8db-8e0bc87ca253',1,NULL,1,'','support@noki.com',0),('UID1011','engineer','6c2e852d-820f-4c42-9f31-bb5b9db638cd',1,NULL,3,'','engineer@noki.com',NULL);
/*!40000 ALTER TABLE `users_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 17:56:07
