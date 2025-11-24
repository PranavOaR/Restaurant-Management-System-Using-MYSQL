#!/usr/bin/env python3
"""
Database Setup Script for Restaurant Management System
This script creates the MySQL database and all necessary tables with sample data
"""

import mysql.connector as con
from mysql.connector import Error
import sys

def create_connection():
    """Create connection to MySQL server without specifying database"""
    try:
        connection = con.connect(
            host='localhost',
            user='root',
            password='youtreatedmelikeshitlol05'
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def create_database_and_tables():
    """Create database and all tables"""
    connection = create_connection()
    if connection is None:
        return False
    
    cursor = connection.cursor()
    
    try:
        # Create database
        print("Creating database 'menu'...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS menu")
        connection.commit()
        print("✓ Database 'menu' created successfully!")
        
        # Select the database
        cursor.execute("USE menu")
        
        # Create menu tables
        menu_tables = {
            'beverages': [
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
                (12, 'Mineral Water', 20)
            ],
            'southindian': [
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
                (17, 'Pudi Idly', 35)
            ],
            'dosaitem': [
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
                (16, 'Mysore Masala Dosa', 100)
            ],
            'starters': [
                (1, 'Masala Papad', 30),
                (2, 'Roasted Masala Papad', 25),
                (3, 'Gobi Munchurian', 120),
                (4, 'Gobi 65', 100),
                (5, 'Gobi Pepper Dry', 110),
                (6, 'Baby Corn Munchurian', 110),
                (7, 'Baby Corn Pepper Dry', 125),
                (8, 'Paneer Munchurian', 135),
                (9, 'Paneer 65', 120),
                (10, 'Chilli Paneer', 110),
                (11, 'Paneer Pepper Dry', 110),
                (12, 'Mushroom Munchurian', 125),
                (13, 'Mushroom 65', 120),
                (14, 'Mushroom Pepper Dry', 110),
                (15, 'Mushroom Chilli', 135),
                (16, 'Veg Spring Rolls', 120)
            ],
            'soup': [
                (1, 'Tomato Soup', 50),
                (2, 'Hot n Sour Soup', 55),
                (3, 'Manchow Soup', 65),
                (4, 'Sweet Corn Soup', 70),
                (5, 'Cream of Mushroom Soup', 90)
            ],
            'indianbreads': [
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
                (16, 'Roti Basket', 180)
            ],
            'curry': [
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
                (26, 'Rajma', 145)
            ],
            'riceitem': [
                (1, 'Steamed Rice', 85),
                (2, 'Ghee Rice', 100),
                (3, 'Jeera Rice', 100),
                (4, 'Peas Pulao', 120),
                (5, 'Veg Pulao', 135),
                (6, 'Kichidi', 120),
                (7, 'Palak Rice', 105),
                (8, 'Tawa Pulao', 140),
                (9, 'Veg Biriyani', 160),
                (10, 'Handi Biriyani', 170),
                (11, 'Veg Hyderabadi Biriyani', 180),
                (12, 'Paneer Biriyani', 195),
                (13, 'Mushroom Biriyani', 185),
                (14, 'Kashmiri Pulao', 150),
                (15, 'Curd Rice', 90)
            ],
            'chineseitems': [
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
                (14, 'Triple Fried Rice', 210)
            ],
            'chatitem': [
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
                (22, 'Dahi Vada', 35)
            ],
            'sweets': [
                (1, 'Gulab Jamun', 25),
                (2, 'Rasgulla', 25),
                (3, 'Carrot Halwa', 50),
                (4, 'Payasam', 30),
                (5, 'Mysore Pak', 40)
            ],
            'icecreams': [
                (1, 'Vanilla', 40),
                (2, 'Chocolate', 50),
                (3, 'Strawberry', 50),
                (4, 'Butterscotch', 55),
                (5, 'Mango', 60),
                (6, 'Black Currant', 55),
                (7, 'Rajbhog', 70),
                (8, 'Tutti-Frutty', 60)
            ],
            'fruitjuice': [
                (1, 'Apple Juice', 70),
                (2, 'Mosambi', 70),
                (3, 'Sapota', 70),
                (4, 'Muskmelon', 70),
                (5, 'Watermelon', 80),
                (6, 'Pineapple', 80),
                (7, 'Mango', 85),
                (8, 'Pomegranate', 80),
                (9, 'Fresh Lime Soda', 70),
                (10, 'Sweet Lassi', 90)
            ],
            'mealcombo': [
                (1, 'Mini Tiffin', 149),
                (2, 'South Indian Meals', 169),
                (3, 'North Indian Meals', 199),
                (4, 'Roti Curry', 80),
                (5, 'Chapathi Kurma', 70),
                (6, 'Parota Curry', 80),
                (7, 'Fried Rice + Gobi Manchurian', 115)
            ]
        }
        
        # Create menu item tables
        for table_name, items in menu_tables.items():
            print(f"Creating table '{table_name}'...")
            
            create_table_query = f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                SL INT PRIMARY KEY,
                ItemName VARCHAR(255) NOT NULL,
                Price INT NOT NULL
            )
            """
            
            cursor.execute(create_table_query)
            
            # Insert data
            insert_query = f"INSERT IGNORE INTO {table_name} (SL, ItemName, Price) VALUES (%s, %s, %s)"
            cursor.executemany(insert_query, items)
            connection.commit()
            print(f"✓ Table '{table_name}' created with {len(items)} items!")
        
        # Create orders table
        print("\nCreating orders table...")
        create_orders_table = """
        CREATE TABLE IF NOT EXISTS orders (
            OrderID INT AUTO_INCREMENT PRIMARY KEY,
            ItemName VARCHAR(255) NOT NULL,
            Price INT NOT NULL,
            Quantity INT NOT NULL,
            TotalPrice INT NOT NULL,
            OrderTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        cursor.execute(create_orders_table)
        connection.commit()
        print("✓ Orders table created!")
        
        print("\n" + "="*60)
        print("Database Setup Completed Successfully! ✓")
        print("="*60)
        print("\nDatabase: menu")
        print("Tables created: 14 menu item tables + 1 orders table")
        print("\nConnection Details:")
        print("  Host: localhost")
        print("  User: root")
        print("  Password: youtreatedmelikeshitlol05")
        print("  Database: menu")
        print("\nYou can now run the restaurant_gui.py application!")
        
        return True
        
    except Error as e:
        print(f"Error creating database/tables: {e}")
        return False
    
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    print("Restaurant Management System - Database Setup")
    print("="*60)
    print("\nThis script will create the MySQL database and tables")
    print("Required: MySQL Server running on localhost")
    print("\nMake sure MySQL is running before proceeding...\n")
    
    try:
        success = create_database_and_tables()
        if success:
            sys.exit(0)
        else:
            print("\n❌ Database setup failed!")
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
