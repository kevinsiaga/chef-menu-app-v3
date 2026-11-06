# chef-menu-app-v3
MAST POE PT2
# Chef's Menu Manager

## Overview
This is a cross platform mobile app developed using React Native, TypeScript & Expo. It has been created to give chefs & kitchen staff in restaurants a user-friendly platform to manage their menu items, track pricing & filter by course. It also allows them to keep track of what is in their kitchen.
---

## Change Log & Refactoring

The following features have been added to the project since part 2.
### 1. Features Added
Editing Menu Items:
An edit button has been implemented which will automatically populate the form with the information of the selected item. 
An update function has been implemented to allow users to update the name, description, course & price of their dishes. 
Search & Filter Menu Items:
A search bar has been implemented to allow users to search for specific menu items by name. 
Filter tabs have been implemented to allow users to filter their menu items by course. These tabs are scrollable so can be used with ease. The tabs include Starter, Main Course & Dessert. 
A Clear Search & filter button has been implemented which will show all menu items. 
Menu Stats:
A stats section has been added to the top of the dashboard. This shows how many menu items there are. 
An average price has been calculated based on the menu items. 
A count has been added for each course category to show how many menu items are available.

### 2. Refactoring
State Management:
The filtering functionality & stats has been refactored using useMemo from React to ensure optimal performance & no lag occurs when filtering.
Validation:
Extra validation has been added to ensure fields are not blank & prices are numerical & above 0.
User Experience:
A confirmation alert has been added using Alert.alert from native to ensure users are aware they are about to perform an action which may be destructive.
UI/UX:
Component organisation has been improved with strict interfaces defined using TypeScript. (MenuItem & CourseCategory)
Styling has been upgraded to use a dark theme with a professional look. (#0f172a & #1e293b).
