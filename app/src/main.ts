import Vue from "vue";
import App from "./App.vue";
import VueApollo from 'vue-apollo'
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueApollo)

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://localhost:5001/graphql',
})

const wsLink = new WebSocketLink({
  uri: 'wss://localhost:5001/graphql',
  options: {
    reconnect: true,
  },
})

// Cache implementation
const cache = new InMemoryCache()

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache,
  connectToDevTools: true
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
