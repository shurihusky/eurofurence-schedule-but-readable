import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#272932',
        },
        primary: {
            main: '#D1C5C0',
        },
        secondary: {
            main: '#710000',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        allVariants: {
            lineHeight: 1,
        },
        overline: {
            fontSize: '0.5rem',
            '@media (min-width:600)': {
                fontSize: '0.6rem',
            },
            '@media (min-width:800px)': {
                fontSize: '0.8rem',
            }
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#2F0743",
                    backgroundImage: "linear-gradient(to bottom, #190424, #2F0743)",
                },
            },
        },
    }
});

export default theme;