import mysql.connector as con

# Establish a connection to the MySQL database
mydb = con.connect(host='localhost', user='root', password='youtreatedmelikeshitlol05', database='menu')
cur = mydb.cursor()

# Function to display menu items for a specific category
def display_menu(category):
    query = "SELECT SL, ItemName, Price FROM " + category
    cur.execute(query)
    menu_items = cur.fetchall()

    print(category.capitalize() + " Menu:")
    for SL, ItemName, Price in menu_items:
        print(str(SL) + ". " + ItemName + " - Rs. " + str(Price))

# Function to place an order within a specific category1
def place_order_in_category(category):
    order = []
    total_price = 0

    while True:
        display_menu(category)
        item_id = int(input("Enter the item number you'd like to order (0 to finish): "))

        if item_id == 0:
            break

        query = "SELECT ItemName, Price FROM " + category + " WHERE SL = %s"
        cur.execute(query, (item_id,))
        item_data = cur.fetchone()

        if item_data:
            ItemName, Price = item_data
            quantity = int(input("Enter quantity for " + ItemName + ": "))
            order.append((ItemName, Price, quantity))
            total_price += (Price * quantity)
        else:
            print("Invalid item number. Please try again.")

    return order, total_price

# Function to place an order across all categories
def place_order():
    order = []
    total_price = 0

    while True:
        print("\nSelect a Category:")
        categories = [
            "beverages", "chatitem", "chineseitems", "curry", "dosaitem", "fruitjuice", "icecreams",
            "indianbreads", "mealcombo", "riceitem", "soup", "southindian", "starters", "sweets"
        ]
        for i, category in enumerate(categories, start=1):
            print(f"{i}. {category.capitalize()}")

        print("0. Finish Order")

        category_choice = input("Enter the category number: ")

        if category_choice == '0':
            break

        category_id = int(category_choice)

        if 1 <= category_id <= len(categories):
            category = categories[category_id - 1]
            category_order, category_total_price = place_order_in_category(category)
            order.extend(category_order)
            total_price += category_total_price
        else:
            print("Invalid category number. Please try again.")

    return order, total_price

# Function to run GUI interface
def run_gui():
    import tkinter as tk
    from tkinter import messagebox
    
    class RestaurantGUIConnector:
        def __init__(self, root):
            self.root = root
            self.root.title("Restaurant System")
            self.root.geometry("400x300")
            self.root.configure(bg='#f0f8ff')
            
            # Title
            title_label = tk.Label(
                root,
                text="🍽️ Restaurant Management",
                font=('Arial', 18, 'bold'),
                bg='#f0f8ff',
                fg='#2c3e50'
            )
            title_label.pack(pady=30)
            
            # Console Mode Button
            console_btn = tk.Button(
                root,
                text="📱 Console Mode",
                font=('Arial', 12, 'bold'),
                bg='#3498db',
                fg='white',
                width=20,
                height=2,
                command=self.run_console_mode,
                cursor='hand2'
            )
            console_btn.pack(pady=15)
            
            # Full GUI Mode Button
            gui_btn = tk.Button(
                root,
                text="🖥️ Full GUI Mode",
                font=('Arial', 12, 'bold'),
                bg='#27ae60',
                fg='white',
                width=20,
                height=2,
                command=self.run_full_gui,
                cursor='hand2'
            )
            gui_btn.pack(pady=15)
            
            # Exit Button
            exit_btn = tk.Button(
                root,
                text="🚪 Exit",
                font=('Arial', 12, 'bold'),
                bg='#e74c3c',
                fg='white',
                width=20,
                height=2,
                command=root.quit,
                cursor='hand2'
            )
            exit_btn.pack(pady=15)
        
        def run_console_mode(self):
            self.root.destroy()
            run_console_interface()
        
        def run_full_gui(self):
            self.root.destroy()
            import subprocess
            import sys
            subprocess.Popen([sys.executable, "simple_restaurant_gui.py"])
    
    root = tk.Tk()
    app = RestaurantGUIConnector(root)
    root.mainloop()

# Function to run console interface
def run_console_interface():
    while True:
        print("\nWelcome to Our Restaurant")
        print("1. Place an Order")
        print("2. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            final_order, final_total_price = place_order()
            print("\nOrder Summary:")
            for ItemName, Price, quantity in final_order:
                print(ItemName + " x" + str(quantity) + " - Rs. " + str(Price * quantity))
            print("Total Price: Rs. " + str(final_total_price))
        elif choice == '2':
            break
        else:
            print("Invalid choice. Please try again.")

# Main execution
if __name__ == "__main__":
    print("Choose interface mode:")
    print("1. GUI Mode")
    print("2. Console Mode")
    
    try:
        mode = input("Enter choice (1 or 2): ")
        if mode == '1':
            run_gui()
        else:
            run_console_interface()
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error: {e}")
        run_console_interface()

# Close the database connection when done
mydb.close()
