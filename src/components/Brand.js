import React from "react";
import {Image} from 'react-native';

export default () => {
  return (
    <Image 
    style={{ height: 200, width: 200}}
    source={require('../../assets/brand.png')} />
  );
}