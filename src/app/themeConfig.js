
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: {
          light: 'white',  // customize light mode background color
          dark: 'gray.800'  // customize dark mode background color
        },
        color: {
          light: 'gray.800',  // customize light mode text color
          dark: 'white'  // customize dark mode text color
        }
      }
    }
  },
  colors: {
    // You can customize your color palette here
    brand: {
      50: '#f7fafc',
      100: '#edf2f7',
      // ... add more shades as needed
    },
  },
});

export default theme;
