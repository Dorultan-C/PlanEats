import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Platform } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics'; 
import { format, addDays, startOfDay, isSameDay } from 'date-fns';

// 🎨 THEME CONFIG
const THEME = {
  primary: '#4CAF50',       
  primaryLight: '#81C784',  
  textDark: '#212121',      
  textGray: '#757575',      
};

// 🗓️ DATA GENERATION (+/- 60 Days)
const GENERATE_DAYS = 60; 
const START_INDEX = GENERATE_DAYS / 2;

const generateDates = () => {
  const today = startOfDay(new Date());
  const dates = [];
  for (let i = 0; i < GENERATE_DAYS; i++) {
    const date = addDays(today, i - START_INDEX);
    dates.push({
      id: i.toString(),
      date: date,
      dayName: format(date, 'EEE'), 
      dayNumber: format(date, 'd'), 
    });
  }
  return dates;
};

interface DateCarouselProps {
  onDateSelected?: (date: Date) => void;
  selectedDate?: Date; // ✅ NEW PROP: Listen for outside changes
}

export default function DateCarousel({ onDateSelected, selectedDate }: DateCarouselProps) {
  const [width, setWidth] = useState(0);
  const [data] = useState(generateDates());
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const ref = useRef<ICarouselInstance>(null);

  // 📐 Layout: Exactly 5 items per screen
  const itemWidth = width / 5;

  // ✅ THE FIX: Watch for external date changes (e.g. from DatePicker)
  useEffect(() => {
    if (selectedDate) {
      // Find the index of the selected date in our data array
      const index = data.findIndex(item => isSameDay(item.date, selectedDate));
      
      // If found and it's not the current one, scroll to it!
      if (index !== -1 && index !== currentIndex) {
        ref.current?.scrollTo({ index, animated: true });
        setCurrentIndex(index);
      }
    }
  }, [selectedDate]); // <--- Runs whenever 'selectedDate' changes

  return (
    <View 
      className="w-full h-32 justify-center mt-4 bg-transparent"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <Carousel
          ref={ref}
          loop={false}
          width={itemWidth} 
          height={120}
          style={{ width: width, justifyContent: 'center', alignItems: 'center' }}
          data={data}
          defaultIndex={START_INDEX}
          
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.85, 
            parallaxScrollingOffset: 8,  
          }}
          
          onSnapToItem={(index) => {
            setCurrentIndex(index);
            const date = data[index].date;
            
            if (Platform.OS !== 'web') {
              Haptics.selectionAsync();
            }
            // Only fire the event if the date actually changed to avoid infinite loops
            if (onDateSelected) {
              onDateSelected(date);
            }
          }}
          
          renderItem={({ item, index }) => {
            const isActive = index === currentIndex;

            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  ref.current?.scrollTo({ index, animated: true });
                }}
              >
                <View className="items-center justify-center h-full">
                  {isActive ? (
                    <LinearGradient
                      colors={[THEME.primaryLight, THEME.primary]}
                      className="items-center justify-center w-14 h-20 rounded-[24px]"
                      style={{
                        shadowColor: THEME.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 6,
                      }}
                    >
                      <Text className="text-xs font-bodoni text-white opacity-90 mb-0.5 uppercase tracking-wider">
                        {item.dayName}
                      </Text>
                      <Text className="text-2xl font-bodoni text-white font-bold">
                        {item.dayNumber}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View className="items-center justify-center w-full h-full bg-transparent">
                      <Text className="text-[10px] font-bodoni text-secondaryText mb-1 uppercase tracking-wider">
                        {item.dayName}
                      </Text>
                      <Text className="text-lg font-bodoni text-primaryText opacity-60">
                        {item.dayNumber}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      )}
    </View>
  );
}