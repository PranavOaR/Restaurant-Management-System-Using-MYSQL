#!/usr/bin/env python3
"""
Restaurant Management System - Test/Console Version
This version tests the database connectivity and displays menu items
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

def display_menu_category(category_name):
    """Display menu items for a specific category"""
    connection = connect_to_database()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        query = f"SELECT SL, ItemName, Price FROM {category_name} ORDER BY SL"
        cursor.execute(query)
        items = cursor.fetchall()
        
        if items:
            print(f"\n{'='*70}")
            print(f"📍 {category_name.upper()} MENU ({len(items)} items)")
            print(f"{'='*70}")
            headers = ['SL', 'Item Name', 'Price (Rs)']
            print(tabulate(items, headers=headers, tablefmt='grid'))
        else:
            print(f"No items found in {category_name}")
        
        cursor.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connection.close()

def display_all_categories():
    """Display all available categories"""
    categories = [
        "beverages", "chatitem", "chineseitems", "curry", "dosaitem",
        "fruitjuice", "icecreams", "indianbreads", "mealcombo",
        "riceitem", "soup", "southindian", "starters", "sweets"
    ]
    
    print(f"\n{'='*70}")
    print("🍽️  RESTAURANT MENU CATEGORIES")
    print(f"{'='*70}\n")
    
    for i, category in enumerate(categories, 1):
        print(f"{i:2d}. {category.capitalize()}")
    
    print(f"\n{'-'*70}")

def place_order():
    """Simple order placement system"""
    connection = connect_to_database()
    if not connection:
        return
    
    categories = [
        "beverages", "chatitem", "chineseitems", "curry", "dosaitem",
        "fruitjuice", "icecreams", "indianbreads", "mealcombo",
        "riceitem", "soup", "southindian", "starters", "sweets"
    ]
    
    cursor = connection.cursor()
    order_items = []
    total_price = 0
    
    try:
        while True:
            display_all_categories()
            
            try:
                choice = int(input("Select category (0 to checkout): "))
                if choice == 0:
                    break
                if 1 <= choice <= len(categories):
                    category = categories[choice - 1]
                    
                    # Display category items
                    display_menu_category(category)
                    
                    # Get item choice
                    try:
                        item_no = int(input(f"\nEnter item number (SL): "))
                        quantity = int(input("Enter quantity: "))
                        
                        # Get item details
                        query = f"SELECT ItemName, Price FROM {category} WHERE SL = %s"
                        cursor.execute(query, (item_no,))
                        result = cursor.fetchone()
                        
                        if result:
                            item_name, price = result
                            total_item_price = price * quantity
                            order_items.append((item_name, price, quantity, total_item_price))
                            total_price += total_item_price
                            print(f"\n✓ Added {quantity}x {item_name} - Rs. {total_item_price}")
                        else:
                            print("❌ Item not found!")
                    except ValueError:
                        print("❌ Please enter valid numbers!")
                else:
                    print("❌ Invalid category!")
            except ValueError:
                print("❌ Please enter a valid number!")
        
        # Display order summary
        if order_items:
            print(f"\n{'='*70}")
            print("📋 ORDER SUMMARY")
            print(f"{'='*70}\n")
            
            headers = ['Item', 'Price', 'Qty', 'Total']
            table_data = [(item[0], f"Rs.{item[1]}", item[2], f"Rs.{item[3]}") for item in order_items]
            print(tabulate(table_data, headers=headers, tablefmt='grid'))
            
            # Calculate taxes
            cgst = total_price * 0.025
            sgst = total_price * 0.025
            grand_total = total_price + cgst + sgst
            
            print(f"\n{'Subtotal:':<40} Rs. {total_price:.2f}")
            print(f"{'CGST (2.5%):':<40} Rs. {cgst:.2f}")
            print(f"{'SGST (2.5%):':<40} Rs. {sgst:.2f}")
            print(f"{'-'*50}")
            print(f"{'GRAND TOTAL:':<40} Rs. {grand_total:.2f}\n")
            
            # Save to database
            confirm = input("Confirm order? (y/n): ").lower()
            if confirm == 'y':
                for item_name, price, qty, total in order_items:
                    insert_query = "INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (%s, %s, %s, %s)"
                    cursor.execute(insert_query, (item_name, price, qty, total))
                connection.commit()
                print("\n✅ Order placed successfully!")
                print("🙏 Thank you for your order!")
            else:
                print("\n❌ Order cancelled!")
        else:
            print("\n❌ No items in order!")
    
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

def view_orders():
    """View all orders from database"""
    connection = connect_to_database()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT OrderID, ItemName, Price, Quantity, TotalPrice, OrderTime FROM orders ORDER BY OrderTime DESC LIMIT 20")
        orders = cursor.fetchall()
        
        if orders:
            print(f"\n{'='*100}")
            print("📊 RECENT ORDERS")
            print(f"{'='*100}\n")
            
            headers = ['Order ID', 'Item', 'Price', 'Qty', 'Total', 'Time']
            print(tabulate(orders, headers=headers, tablefmt='grid'))
        else:
            print("\n📭 No orders found!")
        
        cursor.close()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connection.close()

def main():
    """Main menu"""
    while True:
        print(f"\n{'='*70}")
        print("🍽️  RESTAURANT MANAGEMENT SYSTEM")
        print(f"{'='*70}\n")
        print("1. View Menu by Category")
        print("2. Place an Order")
        print("3. View All Orders")
        print("4. Exit")
        
        choice = input("\nSelect option (1-4): ")
        
        if choice == '1':
            display_all_categories()
            cat_choice = input("\nEnter category number: ")
            categories = [
                "beverages", "chatitem", "chineseitems", "curry", "dosaitem",
                "fruitjuice", "icecreams", "indianbreads", "mealcombo",
                "riceitem", "soup", "southindian", "starters", "sweets"
            ]
            try:
                if 1 <= int(cat_choice) <= len(categories):
                    display_menu_category(categories[int(cat_choice) - 1])
                else:
                    print("❌ Invalid choice!")
            except ValueError:
                print("❌ Please enter a valid number!")
        
        elif choice == '2':
            place_order()
        
        elif choice == '3':
            view_orders()
        
        elif choice == '4':
            print("\n👋 Thank you for using Restaurant Management System!")
            print("Have a great day!\n")
            break
        
        else:
            print("❌ Invalid option! Please try again.")

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🚀 Starting Restaurant Management System...")
    print("="*70)
    
    # Test database connection
    test_conn = connect_to_database()
    if test_conn:
        test_conn.close()
        print("✓ Database connected successfully!\n")
        main()
    else:
        print("✗ Failed to connect to database. Please check your MySQL setup.")
