import { gql } from "@apollo/client";

export const FIND_MIGRATION_BY_SOURCE_ADDRESS = gql`
  query migrationQuery($accountAddress: String!) {
    accountMigration(id: $accountAddress) {
      id
      destination
      parentHash
      transactionHash
      blockTime
      blockNumber
    }
  }
`;
