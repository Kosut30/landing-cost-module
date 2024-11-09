import React, { useState } from 'react';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const FloatingMenu = () => {
  const [open, setOpen] = useState(false); // Manage the open/close state of the menu
  const navigation = useNavigation(); // React Navigation to navigate between screens

  return (
    <FAB.Group
      open={open}
      icon={open ? 'close' : 'menu'}
      actions={[
        {
          icon: 'view-dashboard',
          label: 'Dashboard',
          onPress: () => navigation.navigate('Dashboard'),
        },
        {
          icon: 'plus',
          label: 'Imports Management',
          onPress: () => navigation.navigate('ImportsManagement'),
        },
        {
          icon: 'chart-bar',
          label: 'Analytics',
          onPress: () => navigation.navigate('Analytics'),
        },
      ]}
      onStateChange={({ open }) => setOpen(open)}
    />
  );
};

export default FloatingMenu;
