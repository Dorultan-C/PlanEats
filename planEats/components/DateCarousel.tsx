import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Platform } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics'; 
import { format, addDays, startOfDay, isSameDay } from 'date-fns';

// 🎨 COLORS
const ACTIVE_GRADIENT = ['#81C784', '#4CAF50'] as const;

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
      dayNumber: format(date, 'dd'), 
    });
  }
  return dates;
};

interface DateCarouselProps {
  onDateSelected?: (date: Date) => void;
  selectedDate?: Date; 
}

export default function DateCarousel({ onDateSelected, selectedDate }: DateCarouselProps) {
  const [width, setWidth] = useState(0);
  const [data] = useState(generateDates());
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const ref = useRef<ICarouselInstance>(null);

  const itemWidth = width / 5;

  useEffect(() => {
    if (selectedDate) {
      const index = data.findIndex(item => isSameDay(item.date, selectedDate));
      if (index !== -1 && index !== currentIndex) {
        ref.current?.scrollTo({ index, animated: true });
        setCurrentIndex(index);
      }
    }
  }, [selectedDate]); 

  return (
    <View 
      className="w-full h-32 justify-center mt-4 bg-primaryBackground" // Ensure bg is transparent here
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
            parallaxScrollingScale: 1, // Slightly larger scale for inactive items
            parallaxScrollingOffset: 8, // Increases spacing between items
          }}
          onSnapToItem={(index) => {
            setCurrentIndex(index);
            const date = data[index].date;
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            if (onDateSelected) onDateSelected(date);
          }}
          renderItem={({ item, index }) => {
            const isActive = index === currentIndex;

            return (
              <TouchableWithoutFeedback
                onPress={() => ref.current?.scrollTo({ index, animated: true })}
              >
                {/* CONTAINER: centers the card within the carousel slot */}
                <View className="items-center justify-center h-full"> 
                  
                  {isActive ? (
                    // ✅ ACTIVE STATE: Green Pill
                    <LinearGradient
                      colors={ACTIVE_GRADIENT}
                      // 'w-16 h-24' defines the size. 'rounded-full' makes it a pill.
                      className="items-center justify-center w-20 h-24 rounded-full"
                      style={{
                        borderRadius: 50,
                        shadowColor: '#4CAF50',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 8,
                      }}
                    >
                      <Text className="text-2xl font-bodoni text-primaryBackground mb-1 tracking-wider">
                        {item.dayName}
                      </Text>
                      <Text className="text-2xl font-bodoni text-primaryBackground font-bold">
                        {item.dayNumber}
                      </Text>
                    </LinearGradient>
                  ) : (
                    // ✅ INACTIVE STATE: White Rounded Card
                    <View 
                      className="items-center justify-center w-12 h-16 bg-primaryBackground rounded-2xl border border-gray-100"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <Text className="text-[12px] font-bodoni text-secondaryText mb-1 tracking-wider">
                        {item.dayName}
                      </Text>
                      <Text className="text-lg font-bodoni text-primaryText opacity-80">
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