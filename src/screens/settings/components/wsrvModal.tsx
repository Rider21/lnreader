import * as React from 'react';
import { Text, Pressable, View, useWindowDimensions } from 'react-native';
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv';
import { Modal, Menu, TextInput } from 'react-native-paper';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';

const availableFormats: string[] = ['jpg', 'png', 'tiff', 'webp'];

interface wsrvProps {
  theme: ThemeColors;
  displayModalVisible: boolean;
  hideDisplayModal: () => void;
}

const WSRV: React.FC<wsrvProps> = ({
  theme,
  displayModalVisible,
  hideDisplayModal,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const [type = availableFormats[0], setType] = useMMKVString('WSRV_TYPE');
  const [status = false, setStatus] = useMMKVBoolean('WSRV_STATUS');

  const {
    value: isVisible,
    toggle: toggleCard,
    setFalse: closeCard,
  } = useBoolean();

  return (
    <Modal
      visible={displayModalVisible}
      onRequestClose={() => hideDisplayModal(false)}
      animationType="slide"
    >
      <SettingSwitch
        label="WSRV"
        value={status}
        onPress={() => setStatus(prevVal => !prevVal)}
        theme={theme}
      />

      <View style={styles.pickerContainer}>
        <Menu
          style={{ flex: 1 }}
          visible={isVisible}
          contentStyle={{ backgroundColor: theme.surfaceVariant }}
          anchor={
            <Pressable
              style={{ flex: 1, width: screenWidth - 48 }}
              onPress={toggleCard}
            >
              <TextInput
                mode="outlined"
                label={
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isVisible ? theme.primary : theme.onSurface,
                        backgroundColor: theme.surface,
                      },
                    ]}
                  >
                    {` ${type} 1`}
                  </Text>
                }
                value={type || 'whatever'}
                editable={false}
                theme={{ colors: { background: 'transparent' } }}
                outlineColor={isVisible ? theme.primary : theme.onSurface}
                textColor={isVisible ? theme.primary : theme.onSurface}
                right={
                  <TextInput.Icon
                    icon={isVisible ? 'chevron-up' : 'chevron-down'}
                    color={isVisible ? theme.primary : theme.onSurface}
                  />
                }
              />
            </Pressable>
          }
          onDismiss={closeCard}
        >
          {availableFormats.map(val => {
            return (
              <Menu.Item
                title={val}
                titleStyle={{ color: theme.onSurfaceVariant }}
                onPress={() => {
                  setType(val);
                  closeCard();
                }}
              />
            );
          })}
        </Menu>
      </View>
    </Modal>
  );
};

export default WSRV;

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});
