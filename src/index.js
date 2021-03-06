/* eslint-disable */
import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
// Internationalization
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import de from 'react-intl/locale-data/de';
import ru from 'react-intl/locale-data/ru';
import { IntlProvider } from 'react-intl';
import { addLocaleData } from 'react-intl';
import { ConnectedRouter } from 'connected-react-router';
import { Logger } from './utils/helperFunctions';
import configureStore, { history } from './redux/configureStore';
import ReactPiwik from 'react-piwik';
import { fetchApiKeys } from './apis';

export const store = configureStore();

addLocaleData([...en, ...fr, ...es, ...de, ...ru]);

// Disable console.* in production mode
Logger();

function mapStateToProps(store) {
  return {
    locale: store.settings.prefLanguage,
  };
}

let ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider);

let piwik = null,
  matomoSiteId,
  matomoUrl;

let usepiwik = false;
fetchApiKeys().then(payload => {
  matomoSiteId = payload.keys.matomoSiteId || '';
  matomoUrl = payload.keys.matomoUrl || '';
  piwik = new ReactPiwik({
    url: matomoUrl || '',
    siteId: matomoSiteId || '',
    trackErrors: true,
  });
  usepiwik = true;
});

ReactDOM.render(
  <Provider store={store} key="provider">
    <ConnectedIntlProvider>
      <ConnectedRouter
        history={
          matomoSiteId !== '' && matomoUrl !== '' && !piwik && usepiwik
            ? piwik.connectToHistory(history)
            : history
        }
      >
        <App />
      </ConnectedRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(NextApp);
  });
}
