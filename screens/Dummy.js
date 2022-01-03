import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import img from '../images/img.jpeg';
import {normalize, vh, vw} from '../dimensions';

const Dummy = () => {
  const DATA = [
  
    {
      title: ['This Month'],
      data: [
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
      ],
    },
    {
      title: 'August',
      data: [
        {name: 'Dipawli Awsor', city: 'Chennai Tamil Nadu', price: '₹551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Deepak Mukharjee', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Khushi Rout', city: 'Delhi', price: '₹1551'},
        {img: img, name: 'Dipali Shanker', city: 'Delhi', price: '₹1551'},
      ],
    },
  ];
  const Item = ({title, data}) => {
  console.log('title------->',title);
    return(
    
      <View style={{flexDirection: 'row',}}>
        <View style={styles.item}>
          <Image
            source={img}
            style={{width: vh(35), height: vw(35), borderRadius: 30}}
          />
            <Text style={styles.name}>{title.name}</Text>
        </View>
        <View style={styles.item2} >
            <Text style={styles.price}>{title.price}</Text>
        </View>
      </View>
   ) }
  
        console.log(DATA.filter((x)=>console.log(x)));
  return (
    <View style={{flex: 1, backgroundColor: 'rgb(245,247,249)'}}>
      <View style={styles.TextView}>
        <Text style={styles.DummyTxt}>
          Total Donation in Shiv Shakti sangathan -Uttar pradesh{' '}
        </Text>
        <LinearGradient
          colors={['rgb(71,183,79)', 'rgb(98,210,110)']}
          start={{x: 0.5, y: 1.0}}
          end={{x: 1.0, y: 0.925}}
          style={styles.DummyBT}>
          <TouchableOpacity>
            <Text style={styles.DummyTxt2}>₹ 25K</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View style={{marginTop: 10}}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => <Item title={item} />}
          renderSectionHeader={({section: {title}}) => (
            <View style={styles.headerView}>
              <Text style={styles.header}>{title}</Text>
              <LinearGradient
                colors={['rgb(71,183,79)', 'rgb(98,210,110)']}
                style={styles.headerTouch}>
                <TouchableOpacity>
                  <Text>₹5K</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        />
      </View>
    </View>
  );
};
export default Dummy;

const styles = StyleSheet.create({
  TextView: {
    paddingTop: vh(30),
    paddingLeft: vh(20),
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  item: {
    paddingRight: vh(20),
    paddingLeft: vh(20),
    flexDirection: 'row',
    margin: 10,
    width:'70%'
  },
  item2:{
    flexDirection: 'column',
    width:'30%',
    marginTop: 13,
  },
  DummyTxt: {
    fontSize: 16,
    width: '50%',
    marginTop: vh(20),
    fontWeight: 'bold',
  },
  DummyBT: {
    width: vh(150),
    height: vw(60),
    backgroundColor: 'rgb(86,174,106)',
    borderRadius: vw(15),
    margin: vh(10),
    marginTop: vh(20),
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  DummyTxt2: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    marginTop: vh(12),
  },
  header: {
    fontSize: 14,
    backgroundColor: '#fff',
    fontWeight: '300',
    marginTop: 10,
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: vh(15),
    backgroundColor: 'white',
    height: vh(35),
    paddingRight: vh(15),
  },
  headerTouch: {
    width: vw(50),
    backgroundColor: 'rgb(86,174,106)',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: vh(10),
  },
  name: {
    fontWeight: '700',
    marginTop:vh(10),
    marginLeft: 10,
  },
  city: {
    fontWeight: '200',
    marginLeft: vh(80),
  },
  price: {
    color: 'rgb(86,174,106)',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: vh(20),
    marginTop:vh(10),
  },
});
