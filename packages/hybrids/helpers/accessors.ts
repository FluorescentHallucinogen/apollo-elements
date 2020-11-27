import type { DocumentNode } from '@apollo/client/core';
import type { ApolloElementElement } from '../apollo-element';
import { getDescriptor } from '@apollo-elements/lib/prototypes';
import { hookPropertyIntoHybridsCache } from './cache';

export const __testing_escape_hatch__ = Symbol('__testing_escape_hatch__');

const VALUES = new WeakMap<ApolloElementElement, DocumentNode|null|undefined>();

interface Options<T> {
  host: T,
  document?: DocumentNode,
  // can't be helped as hybrids' types are set
  // eslint-disable-next-line @typescript-eslint/ban-types
  invalidate: Function,
  defaults?: Partial<Record<keyof T, T[keyof T]>>
}

export function initDocument<T extends ApolloElementElement>(opts: Options<T>): () => void {
  const { host, document, invalidate, defaults = {} } = opts;

  for (const [key, init] of Object.entries(defaults))
    hookPropertyIntoHybridsCache({ host, key, init }); /* c8 ignore next */ // this is certaily being called

  // @ts-expect-error: it's just for tests
  host?.[__testing_escape_hatch__]?.(host);

  const mo = new MutationObserver(() => invalidate());

  mo.observe(host, { characterData: true, childList: true, subtree: true });

  // If we don't do this, `parentNode.append(host)` will not preserve the value of `document`
  host.document ??= VALUES.get(host) ?? document ?? null;

  getDescriptor(host).connectedCallback.value.call(host);

  if (VALUES.has(host))
    host.documentChanged?.(host.document); /* c8 ignore next */ // covered

  if (!VALUES.has(host))
    VALUES.set(host, document);

  return () => {
    VALUES.set(host, host.document);
    mo.disconnect();
    getDescriptor(host).disconnectedCallback?.value?.call?.(host);
  };
}