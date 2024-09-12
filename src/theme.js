import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#000',
        },
        primary: {
            main: '#d4a8d2',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        allVariants: {
            lineHeight: 1,
        },
    }
});

export default theme;