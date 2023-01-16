import Root from "./Root";
import { WalletProvider, GraphQLProvider, StorageProvider } from "@darwinia/app-providers";
import { i18nTranslationInit } from "@darwinia/app-locale";

i18nTranslationInit();

const App = () => {
  return (
    <WalletProvider>
      <StorageProvider>
        <GraphQLProvider>
          <Root />
        </GraphQLProvider>
      </StorageProvider>
    </WalletProvider>
  );
};

export default App;
