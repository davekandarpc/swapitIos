import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput,FlatList, SafeAreaView } from 'react-native';
import { styles } from './styles.js';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

FontAwesome.loadFont()
AntDesign.loadFont()

export const SectionDropDown = ({
  placeholder='Select an item',
  menuData,
  subData,
  value,
  onSelectItem,
  DropdownPropStyle
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showArrow, setShowArrow] =  useState(false);
  return (
    <View style={DropdownPropStyle}>
      <TouchableOpacity
        style={{backgroundColor: '#d9d9d9', height: 35, marginTop: 16,  
          alignItems: 'center', borderRadius: 5,flexDirection: 'row', 
          width: '100%', justifyContent: 'space-between', paddingHorizontal: 12}}
          onPress={() => {
            setShowMenu(true)
            setShowArrow(true)
          }}
        >
          
            <Text style={{flex: 1, textAlign: 'center',fontSize: 14}}>{value !== null ? value : placeholder}</Text>
            
            {showArrow ? 
              <MaterialIcons name="keyboard-arrow-up" size={25}/> 
              :
              <MaterialIcons name="keyboard-arrow-down" size={25}/> 
            } 
      </TouchableOpacity>
      {
        showMenu ?
          <View style={styles.menuContainer}>
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="always">
              {
                menuData.length > 0 ? menuData.map((item) => {
                  return (
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
              
                        setShowArrow(false)
                      }}
                    >
                      <Text style={styles.menuTitle}>{item.name}</Text>
                      {
                        item.child != undefined &&
                        item.child.length > 0 ? item.child.map((childItem) => {
                          return (
                            <TouchableOpacity
                              style={styles.subMenuItem}
                              onPress={() => {
                                setShowArrow(false);
                                onSelectItem(childItem.name, childItem.id)
                                setShowMenu(false);
                              }}
                              >
                              <Text style={styles.subTitle}>{childItem.name.trim()}</Text>
                              
                            </TouchableOpacity>  
                          )
                        })
                        :
                        <View
                          style={styles.menuItem}>
                            <Text style={styles.menuTitle}>No Data Found</Text>
                        </View>
                      }
                    </TouchableOpacity>
                  )
                })
                  :
                  <View
                    style={styles.menuItem}
                  >
                    <Text style={styles.menuTitle}>No Data Found</Text>
                  </View>
              }
            </ScrollView>
          </View>
          :
          null
      }
    </View >
  );
};
