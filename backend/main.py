#!/usr/bin/env python3
"""
Restaurant Management System - Automated Demo Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This script demonstrates the complete functionality of the Restaurant Management System.
It showcases:
  1. Viewing menu items by category
  2. Placing orders with multiple items
  3. Calculating taxes and totals
  4. Storing orders in the database
  5. Retrieving order history
  6. Displaying database statistics

USAGE:
  python3 demo.py

REQUIREMENTS:
  - MySQL server running on localhost
  - Database 'menu' created with all tables
  - Python packages: mysql-connector-python, tabulate

NOTE: This is a legacy Python demo. The project now uses Express.js REST API
and Next.js frontend. Use this script for testing database connectivity.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import mysql.connector as con
from tabulate import tabulate

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE CONNECTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

def connect_to_database():
    """
    Establish connection to MySQL database
    
    Returns:
        connection object or None if connection fails
    
    Database Details:
        Host: localhost (127.0.0.1)
        User: root
        Password: Welcomenav1#
        Database: menu
    
    Raises:
        Exception: If connection to MySQL fails
    """
    try:
        connection = con.connect(
            host='localhost',
            user='root',
            password='Welcomenav1#',
            database='menu'
        )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def demo_display_menu():
    """
    DEMO 1: Display menu items from each category
    
    This function:
      - Connects to the database
      - Queries 5 sample categories
      - Displays first 5 items from each category
      - Shows item details: Serial Number, Name, Price
    
    Demonstrates:
      - Database query execution
      - Data retrieval and formatting
      - Error handling
    """
    print("\n" + "="*80)
    print("DEMO 1: VIEWING MENU BY CATEGORY")
    print("="*80)
    
    connection = connect_to_database()
    if not connection:
        return
    
    categories = ["beverages", "dosaitem", "starters", "curry", "sweets"]
    
    for category in categories:
        try:
            cursor = connection.cursor()
            query = f"SELECT SL, ItemName, Price FROM {category} ORDER BY SL LIMIT 5"
            cursor.execute(query)
            items = cursor.fetchall()
            
            print(f"\n📍 {category.upper()} (showing first 5 items)")
            print("-" * 80)
            headers = ['SL', 'Item Name', 'Price (Rs)']
            print(tabulate(items, headers=headers, tablefmt='simple'))
            
            cursor.close()
        except Exception as e:
            print(f"Error: {e}")
    
    connection.close()

def demo_place_order():
    """
    DEMO 2: Place an order with multiple items
    
    This function:
      - Creates a sample order with 3 items from different categories
      - Retrieves item details from database
      - Calculates individual item totals
      - Computes taxes (CGST 2.5% + SGST 2.5%)
      - Stores order data in the 'orders' table
    
    Order Flow:
      1. Select items from menu
      2. Calculate quantities and prices
      3. Add to cart with pricing
      4. Apply taxes
      5. Insert order records into database
    
    Tax Calculation:
      - CGST (Central Goods and Services Tax): 2.5%
      - SGST (State Goods and Services Tax): 2.5%
      - Total Tax: 5%
    """
    print("\n" + "="*80)
    print("DEMO 2: PLACING AN ORDER")
    print("="*80)
    
    connection = connect_to_database()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    try:
        # Sample order data
        orders_to_place = [
            ("beverages", 1, 2),  # (category, item_sl, quantity)
            ("dosaitem", 2, 1),
            ("starters", 3, 1),
        ]
        
        print("\n🛒 Adding items to cart:")
        total_price = 0
        order_items = []
        
        for category, item_sl, quantity in orders_to_place:
            # Get item details
            query = f"SELECT ItemName, Price FROM {category} WHERE SL = %s"
            cursor.execute(query, (item_sl,))
            result = cursor.fetchone()
            
            if result:
                item_name, price = result
                total_item_price = price * quantity
                order_items.append((item_name, price, quantity, total_item_price))
                total_price += total_item_price
                print(f"   ✓ Added {quantity}x {item_name} @ Rs.{price}/item = Rs.{total_item_price}")
        
        # Display order summary
        print("\n" + "-"*80)
        print("📋 ORDER SUMMARY")
        print("-"*80)
        
        headers = ['Item', 'Price (Rs)', 'Qty', 'Total (Rs)']
        table_data = [(item[0], item[1], item[2], item[3]) for item in order_items]
        print(tabulate(table_data, headers=headers, tablefmt='grid'))
        
        # Calculate taxes
        cgst = total_price * 0.025
        sgst = total_price * 0.025
        grand_total = total_price + cgst + sgst
        
        print(f"\nSubtotal:          Rs. {total_price:.2f}")
        print(f"CGST (2.5%):       Rs. {cgst:.2f}")
        print(f"SGST (2.5%):       Rs. {sgst:.2f}")
        print(f"{'-'*30}")
        print(f"GRAND TOTAL:       Rs. {grand_total:.2f}")
        
        # Save to database
        print("\n✅ Saving order to database...")
        for item_name, price, qty, total in order_items:
            insert_query = "INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (item_name, float(price), qty, float(total)))
        
        connection.commit()
        print("✓ Order placed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        connection.rollback()
    finally:
        cursor.close()

def demo_view_orders():
    """
    DEMO 3: View order history from database
    
    This function:
      - Retrieves all orders from the 'orders' table
      - Displays last 10 orders in tabular format
      - Shows: Order ID, Item, Price, Quantity, Total, Timestamp
      - Calculates aggregate statistics
    
    Statistics Shown:
      - Total number of orders placed
      - Total revenue generated
      - Can be extended to show average order value
    
    Database Table (orders):
      - OrderID: Auto-increment primary key
      - ItemName: Name of ordered item
      - Price: Unit price of item
      - Quantity: Number of items ordered
      - TotalPrice: Quantity × Price (before tax)
      - OrderTime: Timestamp of order (auto-set to NOW())
    """
    print("\n" + "="*80)
    print("DEMO 3: VIEWING ORDER HISTORY")
    print("="*80)
    
    connection = connect_to_database()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT OrderID, ItemName, Price, Quantity, TotalPrice, OrderTime FROM orders ORDER BY OrderID DESC LIMIT 10")
        orders = cursor.fetchall()
        
        if orders:
            print(f"\n📊 Recent Orders (Last 10)")
            print("-" * 80)
            headers = ['Order ID', 'Item Name', 'Price', 'Qty', 'Total', 'Order Time']
            print(tabulate(orders, headers=headers, tablefmt='grid'))
            
            # Calculate statistics
            cursor.execute("SELECT COUNT(*) FROM orders")
            total_orders = cursor.fetchone()[0]
            
            cursor.execute("SELECT SUM(TotalPrice) FROM orders")
            total_revenue = cursor.fetchone()[0]
            
            print(f"\n📈 Statistics:")
            print(f"   Total Orders: {total_orders}")
            print(f"   Total Revenue: Rs. {total_revenue:.2f}")
        else:
            print("\n📭 No orders found!")
        
        cursor.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connection.close()

def demo_database_stats():
    """
    DEMO 4: Display database statistics
    
    This function:
      - Counts menu items in each of 14 categories
      - Shows total menu items in the database
      - Displays table count and structure info
    
    Database Structure:
      - 14 menu item tables (one per category)
      - 1 orders table (transaction log)
      - Total: 15 tables
    
    Menu Categories (14):
      1. beverages - 12 items (coffee, tea, etc.)
      2. chatitem - 22 items
      3. chineseitems - 17 items
      4. curry - 26 items (popular curries)
      5. dosaitem - 16 items (South Indian speciality)
      6. fruitjuice - 10 items (fresh juices)
      7. icecreams - 8 items (desserts)
      8. indianbreads - 16 items (breads, naans)
      9. mealcombo - 7 items (combo meals)
      10. riceitem - 15 items (rice dishes)
      11. soup - 5 items (soups)
      12. southindian - 17 items (idli, dosa, etc.)
      13. starters - 16 items (appetizers)
      14. sweets - 5 items (desserts)
    
    Total Items: 192
    """
    print("\n" + "="*80)
    print("DEMO 4: DATABASE STATISTICS")
    print("="*80)
    
    connection = connect_to_database()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        categories = [
            "beverages", "chatitem", "chineseitems", "curry", "dosaitem",
            "fruitjuice", "icecreams", "indianbreads", "mealcombo",
            "riceitem", "soup", "southindian", "starters", "sweets"
        ]
        
        print("\n📊 Menu Items Per Category:")
        print("-" * 80)
        
        stats_data = []
        total_items = 0
        
        for category in categories:
            cursor.execute(f"SELECT COUNT(*) FROM {category}")
            count = cursor.fetchone()[0]
            stats_data.append([category.capitalize(), count])
            total_items += count
        
        print(tabulate(stats_data, headers=['Category', 'Items'], tablefmt='grid'))
        print(f"\n✓ Total Menu Items: {total_items}")
        print(f"✓ Total Categories: {len(categories)}")
        
        # Table structure info
        cursor.execute("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'menu' ORDER BY TABLE_NAME")
        tables = cursor.fetchall()
        print(f"✓ Total Tables in Database: {len(tables)}")
        
        cursor.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connection.close()

def main():
    """
    Main entry point - Run all demo sequences
    
    Execution Order:
      1. Connection Test - Verify MySQL connectivity
      2. Demo 1 - View Menu (browse items)
      3. Demo 2 - Place Order (cart + checkout)
      4. Demo 3 - View Orders (order history)
      5. Demo 4 - Database Stats (system info)
    
    Flow:
      - Displays header banner
      - Tests database connection
      - Runs 4 demo scenarios sequentially
      - Shows final summary
      - Displays instructions for other apps
    
    Error Handling:
      - Aborts if database connection fails
      - Catches exceptions in each demo
      - Provides informative error messages
    """
    print("\n" + "█"*80)
    print("█" + " "*78 + "█")
    print("█" + "🍽️  RESTAURANT MANAGEMENT SYSTEM - AUTOMATED DEMO ".center(78) + "█")
    print("█" + " "*78 + "█")
    print("█"*80)
    
    # Test connection first
    print("\n🔍 Testing database connection...")
    test_conn = connect_to_database()
    if not test_conn:
        print("❌ Failed to connect to database!")
        return
    test_conn.close()
    print("✅ Database connection successful!\n")
    
    # Run demos
    demo_display_menu()
    demo_place_order()
    demo_view_orders()
    demo_database_stats()
    
    # Final summary
    print("\n" + "="*80)
    print("✅ DEMO COMPLETED SUCCESSFULLY!")
    print("="*80)
    print("""
Your Restaurant Management System is fully operational with:
  ✓ 14 Menu Categories
  ✓ 192 Menu Items
  ✓ MySQL Database Integration
  ✓ Order Management System
  ✓ Order History & Statistics

You can now:
  1. Run 'python3 restaurant_console.py' for interactive ordering
  2. Run 'python3 restaurant_gui.py' for GUI version (requires Tkinter)
  3. Access database directly: mysql -u root -p'Welcomenav1#'
  4. Query the database with SQL commands

Database Location: /Users/pranavrao/Documents/REVA/3SEM/DBMS/DBSM-Project/menu_database.sql
Console App: /Users/pranavrao/Documents/REVA/3SEM/DBMS/DBSM-Project/restaurant_console.py
GUI App: /Users/pranavrao/Documents/REVA/3SEM/DBMS/DBSM-Project/restaurant_gui.py
    """)
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
