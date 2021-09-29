import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  //searchble drop down component start
  menuContainer: {
    borderWidth: 1,
    maxHeight: 150,
    overflow: 'hidden',
    marginTop: -4,
    backgroundColor: 'lightgrey',
    borderColor: 'lightgrey'
  },
  menuItem: {
    borderBottomWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#d9d9d9'
  },
   menuTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize: 14,
    color: '#000',
  },
  subMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'column'
  }
});