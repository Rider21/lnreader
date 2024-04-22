import * as React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { Modal, Menu, TextInput, overlay } from 'react-native-paper';
import Slider from './Slider.tsx';
import SettingSwitch from './SettingSwitch';
import { useBoolean } from '@hooks';
import { useWSRV_Settings } from '@hooks/persisted';
import { getString } from '@strings/translations';
const availableFormats: string[] = ['JPEG', 'PNG', 'TIFF', 'WEBP'];

interface wsrvProps {
  theme: ThemeColors;
  displayModalVisible: boolean;
  setDisplayModal: () => void;
}

const WSRV: React.FC<wsrvProps> = ({
  theme,
  displayModalVisible,
  closeModal,
}) => {
  const {
    status,
    output,
    compressionLevel,
    quality,
    adaptiveFilter,
    progressive,
    lossless,
    setWSRV_Settings,
  } = useWSRV_Settings();

  const {
    value: isVisible,
    toggle: toggleCard,
    setFalse: closeCard,
  } = useBoolean();

  return (
    <Modal
      visible={displayModalVisible}
      style={{ flex: 1 }}
      onDismiss={closeModal}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: overlay(2, theme.surface) },
      ]}
    >
      <SettingSwitch
        label="WSRV"
        value={status}
        onPress={() => setWSRV_Settings({ status: !status })}
        theme={theme}
      />

      <View style={styles.pickerContainer}>
        <Menu
          style={{ flex: 1 }}
          visible={isVisible}
          contentStyle={{ backgroundColor: theme.surfaceVariant }}
          anchor={
            <Pressable style={{ flex: 1, width: '95%' }} onPress={toggleCard}>
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
                    {` Format image `}
                  </Text>
                }
                value={output}
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
                key={val}
                title={val}
                titleStyle={{ color: theme.onSurfaceVariant }}
                onPress={() => {
                  setWSRV_Settings({ output: val });
                  closeCard();
                }}
              />
            );
          })}
        </Menu>
      </View>
      {type === 'PNG' ? (
        <>
          <Slider
            value={compressionLevel}
            label={getString('wsrv.compress.label')}
            description={getString('wsrv.compress.description')}
            onSlidingComplete={value =>
              setWSRV_Settings({ compressionLevel: value })
            }
            area={[0, 9]}
            theme={theme}
          />
          <SettingSwitch
            value={adaptiveFilter}
            label={getString('wsrv.adaptiveFilter.label')}
            description={getString('wsrv.adaptiveFilter.description')}
            onPress={() =>
              setWSRV_Settings({ adaptiveFilter: !adaptiveFilter })
            }
            theme={theme}
          />
        </>
      ) : (
        <Slider
          value={quality}
          label={getString('wsrv.quality.label')}
          description={getString('wsrv.quality.description')}
          onSlidingComplete={value => setWSRV_Settings({ quality: value })}
          area={[1, 100]}
          theme={theme}
          disabled={lossless}
        />
      )}
      {(type === 'PNG' || type === 'JPEG') && (
        <SettingSwitch
          value={progressive}
          label={getString(`wsrv.progressive.${type}.label`)}
          description={getString(`wsrv.progressive.${type}.description`)}
          onPress={() => setWSRV_Settings({ progressive: !progressive })}
          theme={theme}
        />
      )}
      {type === 'WEBP' && (
        <SettingSwitch
          value={lossless}
          label={getString('wsrv.lossless.label')}
          description={getString('wsrv.lossless.description')}
          onPress={() => setWSRV_Settings({ lossless: !lossless })}
          theme={theme}
        />
      )}
    </Modal>
  );
};

export default WSRV;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 30,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 32,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
  },
});
