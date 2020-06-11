<template>
  <div>
      <b-table :items="users">
      </b-table>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
    apollo: {
        users: {
            query: gql`query {
                users(order_by:{userId: ASC}) {
                    name
                    userId
                }
            }`,
            subscribeToMore: {
                document: gql`subscription {
                    onUserCreated{
                        name
                        userId
                    }
                }`,
                updateQuery: (previousResult, { subscriptionData }) => {
                    previousResult.users.push(subscriptionData.data.onUserCreated)
                },
            },
        }
    }
};
</script>

<style></style>
