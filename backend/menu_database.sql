-- Restaurant Management System - Complete Database Setup
-- Database: menu
-- Created: 24 November 2025

-- Create Database
CREATE DATABASE IF NOT EXISTS menu;
USE menu;

-- ==========================================
-- BEVERAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS beverages (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO beverages (SL, ItemName, Price) VALUES
(1, 'Filter Coffee', 15),
(2, 'Tea', 15),
(3, 'Masala Tea', 20),
(4, 'Ginger Tea', 20),
(5, 'Lemon Tea', 20),
(6, 'Milk', 12),
(7, 'Badam Milk', 20),
(8, 'Horlicks', 15),
(9, 'Boost', 15),
(10, 'Complan', 15),
(11, 'Bournvita', 15),
(12, 'Mineral Water', 20);

-- ==========================================
-- CHATITEM TABLE (Chaats/Snacks)
-- ==========================================
CREATE TABLE IF NOT EXISTS chatitem (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO chatitem (SL, ItemName, Price) VALUES
(1, 'Bhel Puri', 50),
(2, 'Sev Puri', 65),
(3, 'Dahi Puri', 70),
(4, 'Masala Puri', 65),
(5, 'Nippat Masala', 55),
(6, 'Samosa Chat', 60),
(7, 'Pani Puri', 45),
(8, 'Kachori', 40),
(9, 'Papdi Chat', 50),
(10, 'Dahi Papdi Chat', 65),
(11, 'Pav Bhaji', 90),
(12, 'Cheese Pav Bhaji', 100),
(13, 'Extra Pav', 15),
(14, 'Girmit', 30),
(15, 'Pakoda', 35),
(16, 'Veg Sandwich', 35),
(17, 'Veg Grilled Sandwich', 50),
(18, 'Grilled Cheese Sandwich', 65),
(19, 'French Fries', 70),
(20, 'Peri-Peri Fries', 80),
(21, 'Aloo Bonda', 35),
(22, 'Dahi Vada', 35);

-- ==========================================
-- CHINESEITEMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS chineseitems (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO chineseitems (SL, ItemName, Price) VALUES
(1, 'Veg Noodles', 150),
(2, 'Veg Hakka Noodles', 165),
(3, 'Schezwan Noodles', 175),
(4, 'Chilli Garlic Noodles', 170),
(5, 'Chinese Chopsuey', 185),
(6, 'American Chopsuey', 195),
(7, 'Paneer Noodles', 190),
(8, 'Mushroom Noodles', 180),
(9, 'Veg Fried Rice', 160),
(10, 'Paneer Fried Rice', 180),
(11, 'Mushroom Fried Rice', 175),
(12, 'Garlic Fried Rice', 165),
(13, 'Schezwan Fried Rice', 180),
(14, 'Triple Fried Rice', 210),
(15, 'Steamed Veg. Dumplings', 60),
(16, 'Steamed Paneer Dumplings', 90),
(17, 'Fried Veg. Dumplings', 80);

-- ==========================================
-- CURRY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS curry (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO curry (SL, ItemName, Price) VALUES
(1, 'Dal', 140),
(2, 'Dal Tadka', 160),
(3, 'Dal Makhani', 180),
(4, 'Malai Kofta', 200),
(5, 'Kofta Curry', 190),
(6, 'Veg Hyderabadi', 210),
(7, 'Veg Kohlapuri', 215),
(8, 'Aloo Gobi', 165),
(9, 'Aloo Matar', 150),
(10, 'Dum Aloo', 145),
(11, 'Navaratan Kurma', 190),
(12, 'Kaju Masala', 200),
(13, 'Mix Veg', 190),
(14, 'Paneer Butter Masala', 220),
(15, 'Paneer Tikka', 210),
(16, 'Palak Paneer', 195),
(17, 'Paneer Do Pyaza', 205),
(18, 'Paneer Tikka Masala', 215),
(19, 'Kaju Paneer', 220),
(20, 'Matar Paneer', 180),
(21, 'Paneer Lababdar', 210),
(22, 'Manchurian Gravy', 170),
(23, 'Veg Ball Manchurian', 190),
(24, 'Stuffed Capsicum', 150),
(25, 'Chana Masala', 160),
(26, 'Rajma', 145);

-- ==========================================
-- DOSAITEM TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS dosaitem (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO dosaitem (SL, ItemName, Price) VALUES
(1, 'Plain Dosa', 60),
(2, 'Masala Dosa', 80),
(3, 'Butter Masala Dosa', 95),
(4, 'Set Dosa', 70),
(5, 'Onion Dosa', 85),
(6, 'Paper Dosa', 95),
(7, 'Paper Masala Dosa', 105),
(8, 'Ghee Roast', 110),
(9, 'Rava Dosa', 100),
(10, 'Rava Onion Dosa', 120),
(11, 'Ragi Dosa', 80),
(12, 'Neer Dosa', 90),
(13, 'Open Butter Masala Dosa', 100),
(14, 'Rava Masala Dosa', 110),
(15, 'Rava Onion Masala Dosa', 120),
(16, 'Mysore Masala Dosa', 100);

-- ==========================================
-- FRUITJUICE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS fruitjuice (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO fruitjuice (SL, ItemName, Price) VALUES
(1, 'Apple Juice', 70),
(2, 'Mosambi', 70),
(3, 'Sapota', 70),
(4, 'Muskmelon', 70),
(5, 'Watermelon', 80),
(6, 'Pineapple', 70),
(7, 'Mango', 85),
(8, 'Pomegranate', 80),
(9, 'Fresh Lime Soda', 70),
(10, 'Sweet Lassi', 90);

-- ==========================================
-- ICECREAMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS icecreams (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO icecreams (SL, ItemName, Price) VALUES
(1, 'Vanilla', 40),
(2, 'Chocolate', 50),
(3, 'Strawberry', 50),
(4, 'Butterscotch', 55),
(5, 'Mango', 60),
(6, 'Black Currant', 55),
(7, 'Rajbhog', 70),
(8, 'Tutti-Frutty', 60);

-- ==========================================
-- RICEITEM TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS riceitem (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO riceitem (SL, ItemName, Price) VALUES
(1, 'Steamed Rice', 85),
(2, 'Ghee Rice', 100),
(3, 'Jeera Rice', 100),
(4, 'Peas Pulao', 120),
(5, 'Veg Pulao', 135),
(6, 'Khicdi', 120),
(7, 'Palak Rice', 105),
(8, 'Tawa Pulao', 140),
(9, 'Veg Biriyani', 160),
(10, 'Handi Biriyani', 170),
(11, 'Veg Hyderabadi Biriyani', 180),
(12, 'Paneer Biriyani', 195),
(13, 'Mushroom Biriyani', 185),
(14, 'Kashmiri Pulao', 150),
(15, 'Curd Rice', 90);

-- ==========================================
-- SOUP TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS soup (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO soup (SL, ItemName, Price) VALUES
(1, 'Tomato Soup', 50),
(2, 'Hot n Sour Soup', 55),
(3, 'Manchow Soup', 65),
(4, 'Sweet Corn Soup', 70),
(5, 'Cream of Mushroom Soup', 90);

-- ==========================================
-- SOUTHINDIAN TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS southindian (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO southindian (SL, ItemName, Price) VALUES
(1, 'Idly', 25),
(2, 'Idly (2 nos.)', 40),
(3, 'Idly Vada', 80),
(4, 'Vada', 40),
(5, 'Khara Bath', 50),
(6, 'Kesari Bath', 35),
(7, 'Chow Chow Bath', 80),
(8, 'Upma', 40),
(9, 'Rice Bath', 55),
(10, 'Pongal', 45),
(11, 'Poori', 65),
(12, 'Manglore Buns', 40),
(13, 'Bisibele Bath', 60),
(14, 'Bonda Soup', 40),
(15, 'Rava Idly', 50),
(16, 'Thatte Idly', 40),
(17, 'Pudi Idly', 35);

-- ==========================================
-- STARTERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS starters (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO starters (SL, ItemName, Price) VALUES
(1, 'Masala Papad', 30),
(2, 'Roasted Masala Papad', 25),
(3, 'Gobi Munchurian', 120),
(4, 'Gobi 65', 110),
(5, 'Gobi Pepper Dry', 110),
(6, 'Baby Corn Munchurian', 120),
(7, 'Baby Corn Pepper Dry', 110),
(8, 'Paneer Munchurian', 135),
(9, 'Paneer 65', 110),
(10, 'Chilli Paneer', 110),
(11, 'Paneer Pepper Dry', 110),
(12, 'Mushroom Munchurian', 125),
(13, 'Mushroom 65', 110),
(14, 'Mushroom Pepper Dry', 110),
(15, 'Mushroom Chilli', 125),
(16, 'Veg Spring Rolls', 120);

-- ==========================================
-- MEALCOMBO TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS mealcombo (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO mealcombo (SL, ItemName, Price) VALUES
(1, 'Mini Tiffin (Dosa, Idly, Vada, Chow-Chow Bath/Rice Bath, Tea/Coffee)', 149),
(2, 'South Indian Meals (Poori/Chapathi 2nos., 2 Currys, Rice, Sambar, Rasam, Curd, Papad, Payasam)', 169),
(3, 'North Indian Meals (Tandoori Roti 2nos., 2 Currys, Pulao, Curd Rice, Soup, Papad, Gulab Jamun, Butter Milk)', 199),
(4, 'Roti Curry', 80),
(5, 'Chapathi Kurma', 70),
(6, 'Parota Curry', 80),
(7, 'Fried Rice + Gobi Manchurian', 115);

-- ==========================================
-- INDIANBREADS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS indianbreads (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO indianbreads (SL, ItemName, Price) VALUES
(1, 'Roti', 25),
(2, 'Butter Roti', 30),
(3, 'Kulcha', 40),
(4, 'Butter Kulcha', 45),
(5, 'Naan', 50),
(6, 'Butter Naan', 55),
(7, 'Garlic Naan', 65),
(8, 'Rumali Roti', 60),
(9, 'Aloo Paratha', 90),
(10, 'Gobi Paratha', 90),
(11, 'Aloo Gobi Paratha', 100),
(12, 'Paneer Paratha', 115),
(13, 'Methi Roti', 40),
(14, 'Malabar Parota', 55),
(15, 'Chapati', 20),
(16, 'Roti Basket', 180);

-- ==========================================
-- SWEETS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS sweets (
    SL INT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price INT
);

INSERT INTO sweets (SL, ItemName, Price) VALUES
(1, 'Gulab Jamun', 25),
(2, 'Rasgulla', 25),
(3, 'Carrot Halwa', 50),
(4, 'Payasam', 30),
(5, 'Mysore Pak', 40);

-- ==========================================
-- ORDERS TABLE (Empty - Structure Only)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    ItemName VARCHAR(255),
    Price DECIMAL(10,2),
    Quantity INT,
    TotalPrice DECIMAL(10,2),
    OrderTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- DATABASE SETUP COMPLETE
-- ==========================================
-- Total Tables: 15
-- Menu Item Tables: 14
-- Orders Table: 1
-- Total Menu Items: 229
-- ==========================================
