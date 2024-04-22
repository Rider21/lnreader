import React, { useState } from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemeColors } from '../../theme/types';

interface SliderProps {
  value: number;
  label: string;
  description?: string;
  onSlidingComplete: (num: number) => void;
  area: [number, number];
  disabled: boolean;
  theme: ThemeColors;
  style?: StyleProp<ViewStyle>;
}

const SliderItem: React.FC<SliderProps> = ({
  value,
  label,
  description,
  onSlidingComplete,
  area,
  disabled,
  theme,
  style,
}) => {
  const [val, setVal] = useState(value);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={[{ color: theme.onSurface }, styles.label]}>
          {label + ': '}
        </Text>
        <Text style={[{ color: theme.onSurface }, styles.labelValue]}>
          {val}
        </Text>
      </View>
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.onSurfaceVariant }]}>
            {description}
          </Text>
        </View>
      )}
      <Slider
        value={value}
        minimumValue={area[0] || 0}
        maximumValue={area[1] || 10}
        step={1}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={'#000000'}
        thumbTintColor={theme.primary}
        onSlidingComplete={onSlidingComplete}
        onValueChange={num => setVal(num)}
        disabled={disabled}
      />
    </View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  labelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
  labelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 12,
    lineHeight: 20,
  },
  switch: {
    marginLeft: 8,
  },
});
