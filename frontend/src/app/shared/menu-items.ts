// Import the Injectable decorator from the Angular core module, which allows this class to be injected as a service.
import { Injectable } from "@angular/core";


// Define an interface named "Menu" to represent the structure of menu items.
export interface Menu {
    state: string; // Represents the state/route associated with the menu item.
    name: string; // Represents the name or label of the menu item.
    icon: string; // Represents the name of the icon associated with the menu item.
    role: string; // Represents any role or permission associated with the menu item.
}

// Define an array of menu items for your application
const MENUITEMS = [
    {
        state: 'dashboard',
        name: 'Dashboard',
        icon: 'dashboard', 
        role: '' // The user role required to access this menu item (empty for unrestricted access).
    },

    {
        state: 'category',
        name: 'Manage Category',
        icon: 'category', 
        role: 'admin' // The user role required to access this menu item (in this case, 'admin').
    },

    {
        state: 'product',
        name: 'Manage Product',
        icon: 'inventory_2', 
        role: 'admin' // The user role required to access this menu item (in this case, 'admin').
    },
    {
        state: 'order',
        name: 'Manage Order',
        icon: 'list_alt', 
        role: '' // The user role required to access this menu item (empty for unrestricted access).
    },
    {
        state: 'bill',
        name: 'View Bill',
        icon: 'import_contacts', 
        role: '' // The user role required to access this menu item (empty for unrestricted access).
    },
    {
        state: 'user',
        name: 'View User',
        icon: 'people', 
        role: 'admin' // The user role required to access this menu item (in this case, 'admin').
    },



];

// Apply the Injectable decorator to the "MenuItems" class, marking it as an injectable service.
@Injectable()

// Define the "MenuItems" service class.
export class MenuItems {
    // Define a method named "getMenuItems" that returns an array of Menu items.
    getMenuitems(): Menu[] {
        return MENUITEMS; // Return the constant array of menu items.
    }
}
