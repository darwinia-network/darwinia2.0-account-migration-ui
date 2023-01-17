import { gql } from "@apollo/client";
export const GET_LATEST_STAKING_REWARDS = gql`
  query stakingRewards($accountAddress: String!, $itemsCount: Int) {
    stakingStash(id: $accountAddress) {
      id
      totalRewarded
      rewardeds(first: $itemsCount, orderBy: BLOCK_TIME_DESC) {
        nodes {
          id
          blockTime
          blockNumber
          amount
        }
      }
    }
  }
`;

export const FIND_MIGRATION_BY_DESTINATION_ADDRESS = gql`
  query stakingRewards($accountAddress: String!) {
    stakingStash(id: $accountAddress) {
      id
      totalRewarded
    }
  }
`;
