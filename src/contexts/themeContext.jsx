import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material'
import { createContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function ThemeProvider(props) {
    const [theme, setTheme] = useState('light')
    const [themeMui, setThemeMui] = useState(
        createTheme({
            palette: {
                mode: 'light',
                black: {
                    main: '#000000',
                    light: '#000000',
                    dark: '#000000',
                    contrastText: '#ffffff',
                },
            },
            typography: {
                fontFamily: 'Aptos',
            },
        })
    )

    useEffect(() => {
        const color = theme === 'dark' ? '#ffffff' : '#000000'
        const contrastText = theme === 'dark' ? '#000000' : '#ffffff'

        setThemeMui(
            createTheme({
                palette: {
                    mode: theme,
                    black: {
                        main: color,
                        light: color,
                        dark: color,
                        contrastText: contrastText,
                    },
                },
                typography: {
                    fontFamily: 'Aptos',
                },
            })
        )
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <MuiThemeProvider theme={themeMui}>
                {props.children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}

export { ThemeContext, ThemeProvider }
