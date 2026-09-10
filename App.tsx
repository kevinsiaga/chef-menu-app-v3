import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';

// Type definition for a Menu Item
interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: number;
}

// Fixed course categories for chef selection
const COURSES = ['Starters', 'Mains', 'Desserts', 'Beverages'];

export default function App() {
  // Input State
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('Mains');
  const [price, setPrice] = useState<string>('');

  // Main Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Validation / Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Adding a Dish
  const handleAddDish = () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Validation Check
    if (!dishName.trim() || !description.trim() || !price.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage('Please enter a valid price amount.');
      return;
    }

    // 2. Create Dish Object
    const newDish: MenuItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: parsedPrice,
    };

    // 3. Update Menu List
    setMenuItems((prev) => [newDish, ...prev]);

    // 4. Success Alert / Clear Fields
    setSuccessMessage(`Added "${newDish.dishName}" to the menu!`);
    setDishName('');
    setDescription('');
    setPrice('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👨‍🍳 Chef's Menu Manager</Text>
        <Text style={styles.headerSubtitle}>Version 3.0 — Mobile Suite</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {/* Section 1: Add Dish Form */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Add New Dish</Text>

            {/* Dish Name */}
            <Text style={styles.inputLabel}>Dish Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Creamy Mushroom Alfredo"
              placeholderTextColor="#94A3B8"
              value={dishName}
              onChangeText={setDishName}
            />

            {/* Course Selector Buttons */}
            <Text style={styles.inputLabel}>Course *</Text>
            <View style={styles.courseBadgeRow}>
              {COURSES.map((courseOption) => {
                const isActive = selectedCourse === courseOption;
                return (
                  <TouchableOpacity
                    key={courseOption}
                    style={[styles.courseChip, isActive && styles.courseChipActive]}
                    onPress={() => setSelectedCourse(courseOption)}
                  >
                    <Text style={[styles.courseChipText, isActive && styles.courseChipTextActive]}>
                      {courseOption}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="e.g., Fettuccine pasta tossed in rich parmesan sauce..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Price */}
            <Text style={styles.inputLabel}>Price (R) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 145.00"
              placeholderTextColor="#94A3B8"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            {/* Error & Success Banners */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {successMessage && (
              <View style={styles.successBanner}>
                <Text style={styles.successBannerText}>✅ {successMessage}</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddDish} activeOpacity={0.8}>
              <Text style={styles.submitBtnText}>+ Add Dish to Menu</Text>
            </TouchableOpacity>
          </View>

          {/* Section 2: Display Menu */}
          <View style={styles.card}>
            <View style={styles.listHeaderContainer}>
              <Text style={styles.cardHeader}>Active Menu</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{menuItems.length} items</Text>
              </View>
            </View>

            {menuItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No menu items created yet</Text>
                <Text style={styles.emptySubText}>
                  Fill out the form above to populate your menu list.
                </Text>
              </View>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.dishCard}>
                    <View style={styles.dishCardHeader}>
                      <Text style={styles.dishTitle}>{item.dishName}</Text>
                      <Text style={styles.dishPrice}>R{item.price.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.dishTag}>{item.course}</Text>
                    <Text style={styles.dishDesc}>{item.description}</Text>
                  </View>
                )}
              />
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styling Theme (Navy Blue & Emerald accent theme)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    fontSize: 19,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 15,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  courseBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  courseChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  courseChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  courseChipText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  courseChipTextActive: {
    color: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#451A03',
    borderColor: '#78350F',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  errorBannerText: {
    color: '#FDBA74',
    fontSize: 13,
  },
  successBanner: {
    backgroundColor: '#064E3B',
    borderColor: '#065F46',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  successBannerText: {
    color: '#6EE7B7',
    fontSize: 13,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  dishCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dishCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 10,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  dishTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 6,
  },
  dishDesc: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
});