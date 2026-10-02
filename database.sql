CREATE DATABASE IF NOT EXISTS nicode
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nicode;

CREATE TABLE IF NOT EXISTS service_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  service VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_service_requests_created_at (created_at)
) ENGINE=InnoDB;
