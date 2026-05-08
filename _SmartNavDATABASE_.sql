-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2026 at 08:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_navigation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cached_routes`
--

CREATE TABLE `cached_routes` (
  `cache_id` int(11) NOT NULL,
  `source_location_id` int(11) DEFAULT NULL,
  `destination_location_id` int(11) DEFAULT NULL,
  `route_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`route_data`)),
  `calculated_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cached_routes`
--

INSERT INTO `cached_routes` (`cache_id`, `source_location_id`, `destination_location_id`, `route_data`, `calculated_time`) VALUES
(1, 2, 6, '[{\"route_id\":\"10\",\"total_distance\":\"4.30\",\"estimated_time\":\"123\",\"estimated_cost\":\"80.00\",\"source_name\":\"Banani\",\"dest_name\":\"Dhanmondi\",\"transport_chain\":\"Bus\"}]', '2026-04-25 04:34:21'),
(2, 2, 6, '[{\"route_id\":\"10\",\"total_distance\":\"4.30\",\"estimated_time\":\"123\",\"estimated_cost\":\"80.00\",\"source_name\":\"Banani\",\"dest_name\":\"Dhanmondi\",\"transport_chain\":\"Bus\"}]', '2026-04-25 04:49:56'),
(3, 2, 6, '[{\"route_id\":\"10\",\"total_distance\":\"4.30\",\"estimated_time\":\"123\",\"estimated_cost\":\"80.00\",\"source_name\":\"Banani\",\"dest_name\":\"Dhanmondi\",\"transport_chain\":\"Bus\"}]', '2026-04-25 04:51:06'),
(4, 2, 6, '[{\"route_id\":\"10\",\"total_distance\":\"4.30\",\"estimated_time\":\"123\",\"estimated_cost\":\"80.00\",\"source_name\":\"Banani\",\"dest_name\":\"Dhanmondi\",\"transport_chain\":\"Bus\"}]', '2026-04-25 04:54:15');

-- --------------------------------------------------------

--
-- Table structure for table `incident_report`
--

CREATE TABLE `incident_report` (
  `incident_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `incident_type` varchar(50) DEFAULT NULL,
  `severity` varchar(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incident_report`
--

INSERT INTO `incident_report` (`incident_id`, `user_id`, `location_id`, `incident_type`, `severity`, `timestamp`, `status`) VALUES
(1, 1, 3, 'Waterlogging', 'High', '2026-04-19 16:00:00', 'Resolved'),
(2, 2, 4, 'Accident', 'High', '2026-04-25 03:29:33', 'Active'),
(3, 1, 3, 'Traffic Jam', 'High', '2026-04-25 03:51:52', 'Under Review'),
(4, 1, 1, 'Road Work', 'Medium', '2026-04-25 03:51:52', 'Under Review'),
(5, 2, 2, 'Flood', 'Medium', '2026-04-25 05:26:42', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `area_zone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`location_id`, `location_name`, `latitude`, `longitude`, `area_zone`) VALUES
(1, 'Mirpur 10', 23.80520000, 90.36960000, 'North'),
(2, 'Banani', 23.79400000, 90.40430000, 'North'),
(3, 'Gulshan 1', 23.78060000, 90.41620000, 'Central'),
(4, 'Dhanmondi 27', 23.75330000, 90.37680000, 'Central'),
(5, 'Motijheel', 23.72890000, 90.41890000, 'South'),
(6, 'Dhanmondi', 23.74623000, 90.37456000, 'Central'),
(7, 'Gulshan', 23.78060000, 90.41445000, 'North'),
(8, 'Motijheel', 23.72892000, 90.41981000, 'Commercial'),
(9, 'Mirpur', 23.80609000, 90.36454000, 'North-West'),
(10, 'Uttara', 23.87401000, 90.39928000, 'North'),
(11, 'Banani', 23.79369000, 90.40418000, 'North'),
(12, 'Mohammadpur', 23.76279000, 90.35698000, 'West'),
(13, 'Rampura', 23.75780000, 90.43200000, 'East'),
(14, 'Farmgate', 23.75776000, 90.38900000, 'Central'),
(15, 'Shahbagh', 23.73826000, 90.39568000, 'Central');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` int(11) NOT NULL,
  `source_location_id` int(11) DEFAULT NULL,
  `destination_location_id` int(11) DEFAULT NULL,
  `total_distance` decimal(10,2) DEFAULT NULL,
  `estimated_time` int(11) DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `source_location_id`, `destination_location_id`, `total_distance`, `estimated_time`, `estimated_cost`) VALUES
(1, 1, 5, 12.50, 45, 120.00),
(2, 1, 5, 13.00, 60, 50.00),
(3, 1, 5, 12.00, 30, 200.00),
(4, 1, 2, 8.50, 35, 80.00),
(5, 1, 3, 6.20, 25, 55.00),
(6, 2, 5, 9.00, 30, 70.00),
(7, 4, 1, 10.30, 45, 90.00),
(8, 9, 10, 1.80, 10, 25.00),
(9, 1, 9, 2.50, 12, 30.00),
(10, 2, 6, 4.30, 123, 80.00);

-- --------------------------------------------------------

--
-- Table structure for table `route_segment`
--

CREATE TABLE `route_segment` (
  `segment_id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `transport_id` int(11) DEFAULT NULL,
  `start_location_id` int(11) DEFAULT NULL,
  `end_location_id` int(11) DEFAULT NULL,
  `segment_distance` decimal(10,2) DEFAULT NULL,
  `segment_time` int(11) DEFAULT NULL,
  `segment_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route_segment`
--

INSERT INTO `route_segment` (`segment_id`, `route_id`, `transport_id`, `start_location_id`, `end_location_id`, `segment_distance`, `segment_time`, `segment_cost`) VALUES
(1, 1, 1, 1, 9, 2.50, 15, 10.00),
(2, 1, 2, 9, 2, 6.00, 20, 70.00),
(3, 10, 1, 2, 6, 4.30, 140, 90.00);

-- --------------------------------------------------------

--
-- Table structure for table `traffic_data`
--

CREATE TABLE `traffic_data` (
  `traffic_id` int(11) NOT NULL,
  `location_id` int(11) DEFAULT NULL,
  `congestion_level` varchar(20) DEFAULT NULL,
  `avg_speed` decimal(5,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time_slot` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `traffic_data`
--

INSERT INTO `traffic_data` (`traffic_id`, `location_id`, `congestion_level`, `avg_speed`, `date`, `time_slot`) VALUES
(1, 1, 'Heavy', 10.50, '2026-04-19', '17:15:00'),
(2, 1, 'Heavy', 9.00, '2026-04-19', '17:45:00'),
(3, 2, 'Clear', 35.00, '2026-04-19', '17:30:00'),
(4, 1, 'Heavy', 18.50, '2026-04-25', '08:00:00'),
(5, 2, 'Moderate', 28.00, '2026-04-25', '08:00:00'),
(6, 3, 'Gridlock', 8.00, '2026-04-25', '09:00:00'),
(7, 1, 'Gridlock', 6.50, '2026-04-25', '17:00:00'),
(8, 2, 'Heavy', 15.00, '2026-04-25', '17:00:00'),
(9, 5, 'Clear', 42.00, '2026-04-25', '10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `transport_availability`
--

CREATE TABLE `transport_availability` (
  `availability_id` int(11) NOT NULL,
  `transport_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `available_count` int(11) DEFAULT 0,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_fare`
--

CREATE TABLE `transport_fare` (
  `fare_id` int(11) NOT NULL,
  `transport_id` int(11) DEFAULT NULL,
  `base_fare` decimal(10,2) DEFAULT NULL,
  `cost_per_km` decimal(8,4) DEFAULT NULL,
  `time_multiplier` decimal(5,2) DEFAULT 1.00,
  `area_zone` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transport_mode`
--

CREATE TABLE `transport_mode` (
  `transport_id` int(11) NOT NULL,
  `transport_type` varchar(50) NOT NULL,
  `average_speed` decimal(5,2) DEFAULT NULL,
  `base_fare` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_mode`
--

INSERT INTO `transport_mode` (`transport_id`, `transport_type`, `average_speed`, `base_fare`) VALUES
(1, 'Bus', 25.00, 10.00),
(2, 'CNG', 30.00, 40.00),
(3, 'Rickshaw', 12.00, 20.00),
(4, 'Metro', 45.00, 20.00),
(5, 'Uber', 35.00, 50.00);

-- --------------------------------------------------------

--
-- Table structure for table `transport_reviews`
--

CREATE TABLE `transport_reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `transport_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `route_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport_reviews`
--

INSERT INTO `transport_reviews` (`review_id`, `user_id`, `transport_id`, `rating`, `comment`, `timestamp`, `route_id`) VALUES
(3, 2, 1, 2, 'very bad', '2026-04-25 05:03:00', NULL),
(4, 2, 1, 2, 'very bad', '2026-04-25 05:06:58', NULL),
(5, 2, 1, 4, 'Works', '2026-04-25 05:07:55', 8);

-- --------------------------------------------------------

--
-- Table structure for table `trip_history`
--

CREATE TABLE `trip_history` (
  `trip_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `travel_time` int(11) DEFAULT NULL,
  `travel_cost` decimal(10,2) DEFAULT NULL,
  `trip_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trip_history`
--

INSERT INTO `trip_history` (`trip_id`, `user_id`, `route_id`, `travel_time`, `travel_cost`, `trip_date`) VALUES
(1, 2, 10, 140, 90.00, '2026-04-25 04:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `preferred_budget` decimal(10,2) DEFAULT NULL,
  `preferred_time` int(11) DEFAULT NULL,
  `comfort_level` int(11) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `password`, `preferred_budget`, `preferred_time`, `comfort_level`, `role`) VALUES
(1, 'Ahmed', 'ahmed@example.com', 'password123', 200.00, 60, 4, 'user'),
(2, 'Ahmed Abu Bakar', 'ahmedchad27@gmail.com', '$2y$10$ep0zGfyDE39ximdZJB/kQOS6sUE6Gilb01nQsU5nCaJTCjbyNPsfu', 30.00, 123, 1, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cached_routes`
--
ALTER TABLE `cached_routes`
  ADD PRIMARY KEY (`cache_id`),
  ADD KEY `source_location_id` (`source_location_id`),
  ADD KEY `destination_location_id` (`destination_location_id`);

--
-- Indexes for table `incident_report`
--
ALTER TABLE `incident_report`
  ADD PRIMARY KEY (`incident_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`),
  ADD KEY `source_location_id` (`source_location_id`),
  ADD KEY `destination_location_id` (`destination_location_id`);

--
-- Indexes for table `route_segment`
--
ALTER TABLE `route_segment`
  ADD PRIMARY KEY (`segment_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `transport_id` (`transport_id`),
  ADD KEY `start_location_id` (`start_location_id`),
  ADD KEY `end_location_id` (`end_location_id`);

--
-- Indexes for table `traffic_data`
--
ALTER TABLE `traffic_data`
  ADD PRIMARY KEY (`traffic_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `transport_availability`
--
ALTER TABLE `transport_availability`
  ADD PRIMARY KEY (`availability_id`),
  ADD KEY `transport_id` (`transport_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `transport_fare`
--
ALTER TABLE `transport_fare`
  ADD PRIMARY KEY (`fare_id`),
  ADD KEY `transport_id` (`transport_id`);

--
-- Indexes for table `transport_mode`
--
ALTER TABLE `transport_mode`
  ADD PRIMARY KEY (`transport_id`);

--
-- Indexes for table `transport_reviews`
--
ALTER TABLE `transport_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `transport_id` (`transport_id`),
  ADD KEY `fk_route_review` (`route_id`);

--
-- Indexes for table `trip_history`
--
ALTER TABLE `trip_history`
  ADD PRIMARY KEY (`trip_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cached_routes`
--
ALTER TABLE `cached_routes`
  MODIFY `cache_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `incident_report`
--
ALTER TABLE `incident_report`
  MODIFY `incident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `route_segment`
--
ALTER TABLE `route_segment`
  MODIFY `segment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `traffic_data`
--
ALTER TABLE `traffic_data`
  MODIFY `traffic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transport_availability`
--
ALTER TABLE `transport_availability`
  MODIFY `availability_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transport_fare`
--
ALTER TABLE `transport_fare`
  MODIFY `fare_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transport_mode`
--
ALTER TABLE `transport_mode`
  MODIFY `transport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transport_reviews`
--
ALTER TABLE `transport_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trip_history`
--
ALTER TABLE `trip_history`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cached_routes`
--
ALTER TABLE `cached_routes`
  ADD CONSTRAINT `cached_routes_ibfk_1` FOREIGN KEY (`source_location_id`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `cached_routes_ibfk_2` FOREIGN KEY (`destination_location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `incident_report`
--
ALTER TABLE `incident_report`
  ADD CONSTRAINT `incident_report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `incident_report_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `route_ibfk_1` FOREIGN KEY (`source_location_id`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `route_ibfk_2` FOREIGN KEY (`destination_location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `route_segment`
--
ALTER TABLE `route_segment`
  ADD CONSTRAINT `route_segment_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  ADD CONSTRAINT `route_segment_ibfk_2` FOREIGN KEY (`transport_id`) REFERENCES `transport_mode` (`transport_id`),
  ADD CONSTRAINT `route_segment_ibfk_3` FOREIGN KEY (`start_location_id`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `route_segment_ibfk_4` FOREIGN KEY (`end_location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `traffic_data`
--
ALTER TABLE `traffic_data`
  ADD CONSTRAINT `traffic_data_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `transport_availability`
--
ALTER TABLE `transport_availability`
  ADD CONSTRAINT `transport_availability_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_mode` (`transport_id`),
  ADD CONSTRAINT `transport_availability_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

--
-- Constraints for table `transport_fare`
--
ALTER TABLE `transport_fare`
  ADD CONSTRAINT `transport_fare_ibfk_1` FOREIGN KEY (`transport_id`) REFERENCES `transport_mode` (`transport_id`);

--
-- Constraints for table `transport_reviews`
--
ALTER TABLE `transport_reviews`
  ADD CONSTRAINT `fk_route_review` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transport_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `transport_reviews_ibfk_2` FOREIGN KEY (`transport_id`) REFERENCES `transport_mode` (`transport_id`);

--
-- Constraints for table `trip_history`
--
ALTER TABLE `trip_history`
  ADD CONSTRAINT `trip_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `trip_history_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
