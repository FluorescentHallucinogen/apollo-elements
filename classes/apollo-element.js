export { html } from '@polymer/lit-element';
import { LitElement } from '@polymer/lit-element';
import { ApolloElementMixin } from '../mixins/apollo-element-mixin.js';

/**
 * # ApolloElement
 *
 * Custom Element base class for apollo custom elements.
 *
 * @extends LitElement
 * @appliesMixin ApolloElementMixin
 */
export class ApolloElement extends ApolloElementMixin(LitElement) {
  static get properties() {
    return {
      /**
       * The Apollo client.
       * See https://github.com/bennypowers/lit-apollo#-bundling
       * @type {Object}
       */
      client: { type: Object },

      /**
       * The latest data for the query from the Apollo cache
       * @type {Object}
       */
      data: { type: Object },

      /**
       * The latest error for the query from the Apollo cache
       * @type {Object}
       */
      error: { type: Object },

      /**
       * If the query is currently in-flight.
       * @type {Object}
       */
      loading: { type: Boolean },
    };
  }
}