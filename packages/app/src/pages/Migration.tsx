import MigrationProcess from "../components/MigrationProcess";
import MigrationStatus from "../components/MigrationStatus";
import { useWallet } from "@darwinia/app-providers";

const Migration = () => {
  const { isAccountMigrated } = useWallet();
  return isAccountMigrated ? <MigrationStatus /> : <MigrationProcess />;
};

export default Migration;
