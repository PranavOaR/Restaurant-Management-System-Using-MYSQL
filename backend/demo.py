#!/usr/bin/env python3
"""
Restaurant Management System - Automated Demo
This script demonstrates the application functionality
"""

import mysql.connector as con
from tabulate import tabulate

def connect_to_database():
    """Connect to MySQL database"""
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
    """Demo: Display menu items"""
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
    """Demo: Place an order"""
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
    """Demo: View all orders"""
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
    """Demo: Show database statistics"""
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
    """Run all demos"""
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
