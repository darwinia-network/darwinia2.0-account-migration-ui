import MigrationProcess from "../components/MigrationProcess";
import MigrationStatus from "../components/MigrationStatus";
import { useWallet } from "@darwinia/app-providers";
import { useQuery } from "@apollo/client";
import { FIND_MIGRATION_BY_SOURCE_ADDRESS } from "@darwinia/app-config";
import { useEffect, useState } from "react";

interface MigrationQuery {
  accountAddress: string;
}

export interface AccountMigration {
  id: string;
  blockNumber: number;
  blockTime: string;
  destination: string;
  parentHash: string;
  transactionHash: string;
}

interface MigrationResult {
  accountMigration?: AccountMigration;
}

const Migration = () => {
  const { isAccountMigratedJustNow, selectedAccount } = useWallet();
  const [accountMigrated, setAccountMigrated] = useState<boolean>();

  const {
    loading: isLoading,
    data: migrationResult,
    error,
  } = useQuery<MigrationResult, MigrationQuery>(FIND_MIGRATION_BY_SOURCE_ADDRESS, {
    variables: {
      accountAddress: selectedAccount?.address ?? "",
    },
  });

  useEffect(() => {
    if (!migrationResult || !migrationResult.accountMigration) {
      setAccountMigrated(false);
    } else {
      setAccountMigrated(true);
    }
  }, [migrationResult, isAccountMigratedJustNow]);

  return accountMigrated || isAccountMigratedJustNow ? (
    <MigrationStatus accountMigration={migrationResult?.accountMigration} />
  ) : (
    <MigrationProcess isCheckingMigrationStatus={isLoading} />
  );
};

export default Migration;
