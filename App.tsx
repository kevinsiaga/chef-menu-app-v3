import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export type CourseCategory = 'Starter' | 'Main Course' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: CourseCategory;
  price: number;
}

export default function App() {
  // State for menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Pan-Seared Scallops',
      description: 'Served with pea purée and crispy pancetta lardons.',
      category: 'Starter',
      price: 165,
    },
    {
      id: '2',
      name: 'Karoo Lamb Shank',
      description: 'Slow-braised with rosemary, garlic, and red wine jus.',
      category: 'Main Course',
      price: 295,
    },
    {
      id: '3',
      name: 'Malva Pudding',
      description: 'Traditional baked sponge pudding with warm custard.',
      category: 'Dessert',
      price: 95,
    },
  ]);

  // Form input states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CourseCategory>('Main Course');
  const [price, setPrice] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // --- PART 1 & 4: ADD / EDIT / DELETE MENU ITEMS ---
  const handleSaveItem = () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields before saving.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid numeric price greater than zero.');
      return;
    }

    if (editingId) {
      // Update existing item
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, name: name.trim(), description: description.trim(), category, price: numericPrice }
            : item
        )
      );
      setEditingId(null);
      Alert.alert('Success', 'Menu item updated successfully.');
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        category,
        price: numericPrice,
      };
      setMenuItems((prev) => [newItem, ...prev]);
      Alert.alert('Success', 'New menu item added successfully.');
    }

    // Reset form fields
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Main Course');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setCategory(item.category);
    setPrice(item.price.toString());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Main Course');
  };

  const handleDeleteItem = (id: string, dishName: string) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to remove "${dishName}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) handleCancelEdit();
          },
        },
      ]
    );
  };

  // --- PART 2: SEARCH AND FILTER LOGIC ---
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === 'All' || item.category === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [menuItems, searchQuery, selectedFilter]);

  const handleClearSearchAndFilter = () => {
    setSearchQuery('');
    setSelectedFilter('All');
  };

  // --- PART 3: MENU STATISTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalItems = menuItems.length;
    const totalPrice = menuItems.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;

    const counts = {
      Starter: menuItems.filter((i) => i.category === 'Starter').length,
      'Main Course': menuItems.filter((i) => i.category === 'Main Course').length,
      Dessert: menuItems.filter((i) => i.category === 'Dessert').length,
    };

    return { totalItems, averagePrice, counts };
  }, [menuItems]);

  const categories: ('All' | CourseCategory)[] = ['All', 'Starter', 'Main Course', 'Dessert'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chef's Menu Manager</Text>
        <Text style={styles.headerSubtitle}>Kitchen Operations Dashboard</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* --- PART 3: MENU STATISTICS DISPLAY --- */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Menu Overview Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>R {stats.averagePrice.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Average Price</Text>
            </View>
          </View>
          <View style={styles.courseCountsRow}>
            <Text style={styles.statDetail}>Starters: {stats.counts.Starter}</Text>
            <Text style={styles.statDetail}>Mains: {stats.counts['Main Course']}</Text>
            <Text style={styles.statDetail}>Desserts: {stats.counts.Dessert}</Text>
          </View>
        </View>

        {/* --- PART 1 & 4: ADD/EDIT FORM COMPONENT --- */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Dish Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description & Ingredients"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (R)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Category Selector Tabs */}
          <Text style={styles.label}>Select Course Category:</Text>
          <View style={styles.categoryPickerRow}>
            {(['Starter', 'Main Course', 'Dessert'] as CourseCategory[]).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catPickerButton, category === cat && styles.catPickerButtonActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catPickerText, category === cat && styles.catPickerTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formActionRow}>
            <TouchableOpacity
              style={[styles.saveButton, editingId ? styles.updateButtonColor : styles.addButtonColor]}
              onPress={handleSaveItem}
            >
              <Text style={styles.saveButtonText}>
                {editingId ? 'Update Menu Item' : 'Add to Menu'}
              </Text>
            </TouchableOpacity>

            {editingId && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- PART 2: SEARCH AND FILTER CONTROLS --- */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Search & Filter</Text>
          <TextInput
            style={styles.input}
            placeholder="Search dish by name..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabsRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterTab, selectedFilter === cat && styles.filterTabActive]}
                onPress={() => setSelectedFilter(cat)}
              >
                <Text style={[styles.filterTabText, selectedFilter === cat && styles.filterTabTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {(searchQuery !== '' || selectedFilter !== 'All') && (
            <TouchableOpacity style={styles.clearFilterButton} onPress={handleClearSearchAndFilter}>
              <Text style={styles.clearFilterButtonText}>Clear Search & Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- MENU LIST SECTION --- */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            Displayed Menu Items ({filteredItems.length})
          </Text>

          {filteredItems.length === 0 ? (
            <Text style={styles.noItemsText}>No menu items found matching your search or filter criteria.</Text>
          ) : (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardInfo}>
                  <View style={styles.row}>
                    <Text style={styles.dishName}>{item.name}</Text>
                    <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.categoryBadge}>{item.category}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>

                <View style={styles.cardActionColumn}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditItem(item)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteItem(item.id, item.name)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  courseCountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  statDetail: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  formContainer: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  catPickerButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginHorizontal: 3,
  },
  catPickerButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  catPickerText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  catPickerTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  formActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonColor: {
    backgroundColor: '#3b82f6',
  },
  updateButtonColor: {
    backgroundColor: '#10b981',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#475569',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  filterSection: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterTabsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterTab: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
  },
  filterTabActive: {
    backgroundColor: '#0284c7',
    borderColor: '#0284c7',
  },
  filterTabText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filterTabTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  clearFilterButton: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#334155',
    borderRadius: 6,
  },
  clearFilterButtonText: {
    fontSize: 12,
    color: '#f8fafc',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  noItemsText: {
    color: '#94a3b8',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f8fafc',
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38bdf8',
  },
  categoryBadge: {
    fontSize: 10,
    color: '#38bdf8',
    backgroundColor: '#0f172a',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
  },
  cardActionColumn: {
    justifyContent: 'center',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
  },
});