import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import { Game } from './components/Game';
import { getThemeObject } from './store/ThemeSlice';
import type { RootState } from './store';

const ThemedApp = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);
  const theme = getThemeObject(currentTheme);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Game />
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}

export default App;
