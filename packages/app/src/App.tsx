import Root from "./Root";
import { WalletProvider, GraphQLProvider } from "@darwinia/app-providers";
import { i18nTranslationInit } from "@darwinia/app-locale";

i18nTranslationInit();

const App = () => {
  return (
    <WalletProvider>
      <GraphQLProvider>
        <Root />
      </GraphQLProvider>
    </WalletProvider>
  );
};

export default App;
