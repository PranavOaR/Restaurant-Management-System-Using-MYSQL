import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import mysql.connector as con
from tabulate import tabulate
from datetime import datetime

class RestaurantGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Restaurant Management System")
        self.root.geometry("800x600")
        self.root.configure(bg='#f0f0f0')
        
        # Database connection
        try:
            self.mydb = con.connect(
                host='localhost', 
                user='root', 
                password='youtreatedmelikeshitlol05', 
                database='menu'
            )
            self.cur = self.mydb.cursor()
        except Exception as e:
            messagebox.showerror("Database Error", f"Failed to connect to database: {str(e)}")
            return
        
        # Current order
        self.current_order = []
        self.total_price = 0
        
        # Categories
        self.categories = [
            "beverages", "chatitem", "chineseitems", "curry", "dosaitem", 
            "fruitjuice", "icecreams", "indianbreads", "mealcombo", 
            "riceitem", "soup", "southindian", "starters", "sweets"
        ]
        
        self.create_main_interface()
    
    def create_main_interface(self):
        """Create the main interface with welcome screen"""
        # Clear any existing widgets
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Main frame
        main_frame = tk.Frame(self.root, bg='#f0f0f0')
        main_frame.pack(expand=True, fill='both', padx=20, pady=20)
        
        # Title
        title_label = tk.Label(
            main_frame, 
            text="Welcome to Our Restaurant", 
            font=('Arial', 24, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        title_label.pack(pady=30)
        
        # Buttons frame
        buttons_frame = tk.Frame(main_frame, bg='#f0f0f0')
        buttons_frame.pack(expand=True)
        
        # Customer button
        customer_btn = tk.Button(
            buttons_frame,
            text="Place an Order",
            font=('Arial', 16, 'bold'),
            bg='#4CAF50',
            fg='white',
            width=20,
            height=2,
            command=self.show_customer_interface,
            cursor='hand2'
        )
        customer_btn.pack(pady=20)
        
        # Admin button
        admin_btn = tk.Button(
            buttons_frame,
            text="Admin Panel",
            font=('Arial', 16, 'bold'),
            bg='#2196F3',
            fg='white',
            width=20,
            height=2,
            command=self.show_admin_login,
            cursor='hand2'
        )
        admin_btn.pack(pady=20)
        
        # Exit button
        exit_btn = tk.Button(
            buttons_frame,
            text="Exit",
            font=('Arial', 16, 'bold'),
            bg='#f44336',
            fg='white',
            width=20,
            height=2,
            command=self.root.quit,
            cursor='hand2'
        )
        exit_btn.pack(pady=20)
    
    def show_customer_interface(self):
        """Show the customer ordering interface"""
        # Clear current interface
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Create main container
        main_container = tk.Frame(self.root, bg='#f0f0f0')
        main_container.pack(expand=True, fill='both', padx=10, pady=10)
        
        # Top frame for title and back button
        top_frame = tk.Frame(main_container, bg='#f0f0f0')
        top_frame.pack(fill='x', pady=(0, 10))
        
        # Back button
        back_btn = tk.Button(
            top_frame,
            text="← Back",
            font=('Arial', 12),
            bg='#757575',
            fg='white',
            command=self.create_main_interface,
            cursor='hand2'
        )
        back_btn.pack(side='left')
        
        # Title
        title_label = tk.Label(
            top_frame,
            text="Select Categories and Items",
            font=('Arial', 18, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        title_label.pack(side='left', padx=(20, 0))
        
        # Current order button
        order_btn = tk.Button(
            top_frame,
            text=f"Current Order ({len(self.current_order)} items)",
            font=('Arial', 12),
            bg='#FF9800',
            fg='white',
            command=self.show_current_order,
            cursor='hand2'
        )
        order_btn.pack(side='right', padx=(0, 10))
        
        # Finish order button (if cart has items)
        if self.current_order:
            finish_btn = tk.Button(
                top_frame,
                text="🛒 Finish Order",
                font=('Arial', 12, 'bold'),
                bg='#4CAF50',
                fg='white',
                command=self.quick_finish_order,
                cursor='hand2'
            )
            finish_btn.pack(side='right')
        
        # Main content frame
        content_frame = tk.Frame(main_container, bg='#f0f0f0')
        content_frame.pack(expand=True, fill='both')
        
        # Categories frame
        categories_frame = tk.LabelFrame(
            content_frame,
            text="Select a Category",
            font=('Arial', 14, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        categories_frame.pack(side='left', fill='both', expand=True, padx=(0, 10))
        
        # Categories listbox with scrollbar
        cat_scroll_frame = tk.Frame(categories_frame)
        cat_scroll_frame.pack(fill='both', expand=True, padx=10, pady=10)
        
        cat_scrollbar = tk.Scrollbar(cat_scroll_frame)
        cat_scrollbar.pack(side='right', fill='y')
        
        self.categories_listbox = tk.Listbox(
            cat_scroll_frame,
            font=('Arial', 12),
            yscrollcommand=cat_scrollbar.set,
            bg='white',
            selectbackground='#4CAF50'
        )
        self.categories_listbox.pack(side='left', fill='both', expand=True)
        cat_scrollbar.config(command=self.categories_listbox.yview)
        
        # Populate categories
        for category in self.categories:
            self.categories_listbox.insert(tk.END, category.capitalize())
        
        self.categories_listbox.bind('<<ListboxSelect>>', self.on_category_select)
        
        # Menu items frame
        self.menu_frame = tk.LabelFrame(
            content_frame,
            text="Menu Items",
            font=('Arial', 14, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        self.menu_frame.pack(side='right', fill='both', expand=True)
        
        # Initially show message
        initial_label = tk.Label(
            self.menu_frame,
            text="Please select a category to view menu items",
            font=('Arial', 12),
            bg='#f0f0f0',
            fg='#666666'
        )
        initial_label.pack(expand=True)
    
    def on_category_select(self, event):
        """Handle category selection"""
        selection = self.categories_listbox.curselection()
        if selection:
            category_index = selection[0]
            category = self.categories[category_index]
            self.show_menu_items(category)
    
    def show_menu_items(self, category):
        """Display menu items for selected category"""
        # Clear menu frame
        for widget in self.menu_frame.winfo_children():
            widget.destroy()
        
        # Update frame title
        self.menu_frame.config(text=f"{category.capitalize()} Menu")
        
        try:
            # Fetch menu items
            query = "SELECT SL, ItemName, Price FROM " + category
            self.cur.execute(query)
            menu_items = self.cur.fetchall()
            
            if not menu_items:
                no_items_label = tk.Label(
                    self.menu_frame,
                    text="No items available in this category",
                    font=('Arial', 12),
                    bg='#f0f0f0',
                    fg='#666666'
                )
                no_items_label.pack(expand=True)
                return
            
            # Create scrollable frame for menu items
            canvas = tk.Canvas(self.menu_frame, bg='#f0f0f0')
            scrollbar = tk.Scrollbar(self.menu_frame, orient="vertical", command=canvas.yview)
            scrollable_frame = tk.Frame(canvas, bg='#f0f0f0')
            
            scrollable_frame.bind(
                "<Configure>",
                lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
            )
            
            canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
            canvas.configure(yscrollcommand=scrollbar.set)
            
            # Add menu items
            for sl, item_name, price in menu_items:
                item_frame = tk.Frame(scrollable_frame, bg='white', relief='raised', bd=1)
                item_frame.pack(fill='x', padx=5, pady=2)
                
                # Item info
                info_frame = tk.Frame(item_frame, bg='white')
                info_frame.pack(side='left', fill='x', expand=True, padx=10, pady=5)
                
                item_label = tk.Label(
                    info_frame,
                    text=f"{item_name}",
                    font=('Arial', 12, 'bold'),
                    bg='white',
                    anchor='w'
                )
                item_label.pack(anchor='w')
                
                price_label = tk.Label(
                    info_frame,
                    text=f"Rs. {price}",
                    font=('Arial', 11),
                    bg='white',
                    fg='#4CAF50',
                    anchor='w'
                )
                price_label.pack(anchor='w')
                
                # Add button
                add_btn = tk.Button(
                    item_frame,
                    text="Add to Order",
                    font=('Arial', 10),
                    bg='#4CAF50',
                    fg='white',
                    command=lambda n=item_name, p=price: self.add_item_to_order(n, p),
                    cursor='hand2'
                )
                add_btn.pack(side='right', padx=10, pady=5)
            
            canvas.pack(side="left", fill="both", expand=True)
            scrollbar.pack(side="right", fill="y")
            
        except Exception as e:
            messagebox.showerror("Database Error", f"Failed to load menu items: {str(e)}")
    
    def quick_finish_order(self):
        """Quick finish order without showing full summary"""
        if not self.current_order:
            messagebox.showinfo("Order", "Your order is empty!")
            return
        
        # Create confirmation dialog
        confirm_msg = f"Finish your order?\n\nItems: {len(self.current_order)}\nTotal: Rs. {self.total_price}"
        
        if messagebox.askyesno("Finish Order", confirm_msg):
            try:
                # Insert order details into the 'orders' table
                for item_name, price, quantity in self.current_order:
                    query = "INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (%s, %s, %s, %s)"
                    self.cur.execute(query, (item_name, price, quantity, price * quantity))
                
                self.mydb.commit()
                
                messagebox.showinfo(
                    "Order Placed",
                    f"Your order has been placed successfully!\nTotal Amount: Rs. {self.total_price}\n\nThank you for your order!"
                )
                
                # Clear current order
                self.current_order = []
                self.total_price = 0
                
                self.create_main_interface()
                
            except Exception as e:
                messagebox.showerror("Database Error", f"Failed to place order: {str(e)}")
    
    def add_item_to_order(self, item_name, price):
        """Add item to current order"""
        # Ask for quantity
        quantity = simpledialog.askinteger(
            "Quantity",
            f"Enter quantity for {item_name}:",
            minvalue=1,
            maxvalue=100
        )
        
        if quantity:
            self.current_order.append((item_name, price, quantity))
            self.total_price += price * quantity
            messagebox.showinfo(
                "Added to Order",
                f"{quantity}x {item_name} added to your order!"
            )
            
            # Update current order button
            self.update_order_button()
    
    def update_order_button(self):
        """Update the current order button text"""
        # Find and update the order button
        for widget in self.root.winfo_children():
            if isinstance(widget, tk.Frame):
                for child in widget.winfo_children():
                    if isinstance(child, tk.Frame):
                        for grandchild in child.winfo_children():
                            if isinstance(grandchild, tk.Button) and "Current Order" in grandchild.cget('text'):
                                grandchild.config(text=f"Current Order ({len(self.current_order)} items)")
    
    def show_current_order(self):
        """Show current order summary"""
        if not self.current_order:
            messagebox.showinfo("Order", "Your order is empty!")
            return
        
        # Create order window
        order_window = tk.Toplevel(self.root)
        order_window.title("Current Order")
        order_window.geometry("500x400")
        order_window.configure(bg='#f0f0f0')
        
        # Title
        title_label = tk.Label(
            order_window,
            text="Order Summary",
            font=('Arial', 16, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        title_label.pack(pady=10)
        
        # Order items frame
        items_frame = tk.Frame(order_window, bg='#f0f0f0')
        items_frame.pack(fill='both', expand=True, padx=20)
        
        # Headers
        headers_frame = tk.Frame(items_frame, bg='#4CAF50')
        headers_frame.pack(fill='x', pady=(0, 5))
        
        tk.Label(headers_frame, text="Item", font=('Arial', 12, 'bold'), bg='#4CAF50', fg='white', width=20).pack(side='left', padx=5, pady=5)
        tk.Label(headers_frame, text="Price", font=('Arial', 12, 'bold'), bg='#4CAF50', fg='white', width=8).pack(side='left', padx=5, pady=5)
        tk.Label(headers_frame, text="Qty", font=('Arial', 12, 'bold'), bg='#4CAF50', fg='white', width=5).pack(side='left', padx=5, pady=5)
        tk.Label(headers_frame, text="Total", font=('Arial', 12, 'bold'), bg='#4CAF50', fg='white', width=10).pack(side='left', padx=5, pady=5)
        
        # Order items
        for item_name, price, quantity in self.current_order:
            item_frame = tk.Frame(items_frame, bg='white', relief='raised', bd=1)
            item_frame.pack(fill='x', pady=1)
            
            tk.Label(item_frame, text=item_name, font=('Arial', 10), bg='white', width=20, anchor='w').pack(side='left', padx=5, pady=3)
            tk.Label(item_frame, text=f"Rs. {price}", font=('Arial', 10), bg='white', width=8).pack(side='left', padx=5, pady=3)
            tk.Label(item_frame, text=str(quantity), font=('Arial', 10), bg='white', width=5).pack(side='left', padx=5, pady=3)
            tk.Label(item_frame, text=f"Rs. {price * quantity}", font=('Arial', 10), bg='white', width=10).pack(side='left', padx=5, pady=3)
        
        # Total
        total_frame = tk.Frame(order_window, bg='#f0f0f0')
        total_frame.pack(fill='x', padx=20, pady=10)
        
        total_label = tk.Label(
            total_frame,
            text=f"Total Amount: Rs. {self.total_price}",
            font=('Arial', 14, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        total_label.pack()
        
        # Buttons
        buttons_frame = tk.Frame(order_window, bg='#f0f0f0')
        buttons_frame.pack(pady=20)
        
        place_order_btn = tk.Button(
            buttons_frame,
            text="Place Order",
            font=('Arial', 12, 'bold'),
            bg='#4CAF50',
            fg='white',
            width=15,
            command=lambda: self.place_final_order(order_window),
            cursor='hand2'
        )
        place_order_btn.pack(side='left', padx=10)
        
        clear_order_btn = tk.Button(
            buttons_frame,
            text="Clear Order",
            font=('Arial', 12, 'bold'),
            bg='#f44336',
            fg='white',
            width=15,
            command=lambda: self.clear_order(order_window),
            cursor='hand2'
        )
        clear_order_btn.pack(side='left', padx=10)
        
        close_btn = tk.Button(
            buttons_frame,
            text="Continue Shopping",
            font=('Arial', 12, 'bold'),
            bg='#757575',
            fg='white',
            width=15,
            command=order_window.destroy,
            cursor='hand2'
        )
        close_btn.pack(side='left', padx=10)
    
    def place_final_order(self, order_window):
        """Place the final order and save to database"""
        try:
            # Insert order details into the 'orders' table
            for item_name, price, quantity in self.current_order:
                query = "INSERT INTO orders (ItemName, Price, Quantity, TotalPrice) VALUES (%s, %s, %s, %s)"
                self.cur.execute(query, (item_name, price, quantity, price * quantity))
            
            self.mydb.commit()
            
            messagebox.showinfo(
                "Order Placed",
                f"Your order has been placed successfully!\nTotal Amount: Rs. {self.total_price}"
            )
            
            # Clear current order
            self.current_order = []
            self.total_price = 0
            
            order_window.destroy()
            self.create_main_interface()
            
        except Exception as e:
            messagebox.showerror("Database Error", f"Failed to place order: {str(e)}")
    
    def clear_order(self, order_window):
        """Clear the current order"""
        result = messagebox.askyesno("Clear Order", "Are you sure you want to clear your order?")
        if result:
            self.current_order = []
            self.total_price = 0
            order_window.destroy()
            messagebox.showinfo("Order Cleared", "Your order has been cleared!")
    
    def show_admin_login(self):
        """Show admin login dialog"""
        login_window = tk.Toplevel(self.root)
        login_window.title("Admin Login")
        login_window.geometry("300x200")
        login_window.configure(bg='#f0f0f0')
        login_window.grab_set()  # Make window modal
        
        # Center the window
        login_window.transient(self.root)
        login_window.grab_set()
        
        # Title
        title_label = tk.Label(
            login_window,
            text="Admin Login",
            font=('Arial', 16, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        title_label.pack(pady=20)
        
        # Username
        tk.Label(login_window, text="Username:", font=('Arial', 12), bg='#f0f0f0').pack()
        username_entry = tk.Entry(login_window, font=('Arial', 12), width=20)
        username_entry.pack(pady=5)
        
        # Password
        tk.Label(login_window, text="Password:", font=('Arial', 12), bg='#f0f0f0').pack()
        password_entry = tk.Entry(login_window, font=('Arial', 12), width=20, show='*')
        password_entry.pack(pady=5)
        
        # Buttons
        buttons_frame = tk.Frame(login_window, bg='#f0f0f0')
        buttons_frame.pack(pady=20)
        
        login_btn = tk.Button(
            buttons_frame,
            text="Login",
            font=('Arial', 12, 'bold'),
            bg='#4CAF50',
            fg='white',
            command=lambda: self.admin_login(username_entry.get(), password_entry.get(), login_window),
            cursor='hand2'
        )
        login_btn.pack(side='left', padx=10)
        
        cancel_btn = tk.Button(
            buttons_frame,
            text="Cancel",
            font=('Arial', 12, 'bold'),
            bg='#757575',
            fg='white',
            command=login_window.destroy,
            cursor='hand2'
        )
        cancel_btn.pack(side='left', padx=10)
        
        # Bind Enter key to login
        login_window.bind('<Return>', lambda e: self.admin_login(username_entry.get(), password_entry.get(), login_window))
        
        username_entry.focus()
    
    def admin_login(self, username, password, login_window):
        """Handle admin login"""
        if username in ['omkumar', 'pranav', 'pavan'] and password == 'weareadmins':
            login_window.destroy()
            self.show_admin_panel()
        else:
            messagebox.showerror("Login Failed", "Invalid admin credentials. Access denied.")
    
    def show_admin_panel(self):
        """Show admin panel with order history"""
        # Clear current interface
        for widget in self.root.winfo_children():
            widget.destroy()
        
        # Create admin interface
        admin_frame = tk.Frame(self.root, bg='#f0f0f0')
        admin_frame.pack(expand=True, fill='both', padx=20, pady=20)
        
        # Top frame
        top_frame = tk.Frame(admin_frame, bg='#f0f0f0')
        top_frame.pack(fill='x', pady=(0, 20))
        
        # Back button
        back_btn = tk.Button(
            top_frame,
            text="← Back to Main",
            font=('Arial', 12),
            bg='#757575',
            fg='white',
            command=self.create_main_interface,
            cursor='hand2'
        )
        back_btn.pack(side='left')
        
        # Title
        title_label = tk.Label(
            top_frame,
            text="Admin Panel - Today's Orders",
            font=('Arial', 18, 'bold'),
            bg='#f0f0f0',
            fg='#333333'
        )
        title_label.pack(side='left', padx=(20, 0))
        
        try:
            # Fetch today's orders
            self.cur.execute("SELECT * FROM orders WHERE DATE(OrderTime) = CURDATE()")
            orders = self.cur.fetchall()
            
            if not orders:
                no_orders_label = tk.Label(
                    admin_frame,
                    text="No orders found for today.",
                    font=('Arial', 14),
                    bg='#f0f0f0',
                    fg='#666666'
                )
                no_orders_label.pack(expand=True)
            else:
                # Create treeview for orders
                columns = ('OrderID', 'ItemName', 'Price', 'Quantity', 'TotalPrice', 'OrderTime')
                tree = ttk.Treeview(admin_frame, columns=columns, show='headings', height=15)
                
                # Define headings
                tree.heading('OrderID', text='Order ID')
                tree.heading('ItemName', text='Item Name')
                tree.heading('Price', text='Price')
                tree.heading('Quantity', text='Quantity')
                tree.heading('TotalPrice', text='Total Price')
                tree.heading('OrderTime', text='Order Time')
                
                # Configure column widths
                tree.column('OrderID', width=80)
                tree.column('ItemName', width=150)
                tree.column('Price', width=100)
                tree.column('Quantity', width=80)
                tree.column('TotalPrice', width=100)
                tree.column('OrderTime', width=150)
                
                # Insert data
                total_revenue = 0
                for order in orders:
                    tree.insert('', tk.END, values=order)
                    total_revenue += float(order[4])  # TotalPrice is at index 4
                
                # Add scrollbar
                scrollbar = ttk.Scrollbar(admin_frame, orient=tk.VERTICAL, command=tree.yview)
                tree.configure(yscrollcommand=scrollbar.set)
                
                tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
                scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
                
                # Revenue summary
                revenue_frame = tk.Frame(self.root, bg='#f0f0f0')
                revenue_frame.pack(fill='x', padx=20, pady=(0, 20))
                
                revenue_label = tk.Label(
                    revenue_frame,
                    text=f"Total Revenue Today: Rs. {total_revenue:.2f}",
                    font=('Arial', 14, 'bold'),
                    bg='#f0f0f0',
                    fg='#4CAF50'
                )
                revenue_label.pack()
                
        except Exception as e:
            messagebox.showerror("Database Error", f"Failed to load orders: {str(e)}")
    
    def __del__(self):
        """Cleanup database connection"""
        try:
            if hasattr(self, 'mydb'):
                self.mydb.close()
        except:
            pass

if __name__ == "__main__":
    root = tk.Tk()
    app = RestaurantGUI(root)
    root.mainloop()