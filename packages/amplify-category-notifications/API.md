## API Report File for "@aws-amplify/amplify-category-notifications"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { $TSAny } from 'amplify-cli-core';
import { $TSContext } from 'amplify-cli-core';
import { INotificationsResource } from 'amplify-cli-core';
import { IPluginAPIResponse } from 'amplify-cli-core';

// @public (undocumented)
const console_2: (context: $TSContext) => Promise<void>;
export { console_2 as console }

// @public (undocumented)
export const deletePinpointAppForEnv: (context: $TSContext, envName: string) => Promise<void>;

// @public (undocumented)
export const executeAmplifyCommand: (context: $TSContext) => Promise<void>;

// @public (undocumented)
export const handleAmplifyEvent: (__context: $TSContext, args: $TSAny) => void;

// @public (undocumented)
export const initEnv: (context: $TSContext) => Promise<void>;

// @public (undocumented)
export const migrate: (context: $TSContext) => Promise<void>;

// @public (undocumented)
export const notificationsAPIGetAvailableChannelNames: () => Promise<string[]>;

// @public (undocumented)
export const notificationsPluginAPIGetResource: (context: $TSContext) => Promise<INotificationsResource | undefined>;

// @public (undocumented)
export const notificationsPluginAPIRemoveApp: (context: $TSContext, appName: string) => Promise<IPluginAPIResponse | undefined>;

// (No @packageDocumentation comment for this package)

```
