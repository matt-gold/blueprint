/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as jstz from "jstimezonedetect";
import { memoize } from "lodash-es";

/**
 * Gets the users current time zone, such as `"Europe/Oslo"`.
 *
 * At the time of this writing, this is backed by the browser or user computer's currently
 * configured time zone information,
 * but may be changed in the future to account for Foundry user or deployment settings.
 *
 * For browsers which don't support the Internationalization API the time zone is guessed from
 * the way that the Date() object is formatted. If the time zone can't be determined,
 * an empty string is returned.
 */
export const getTimeZone: () => string = memoize(guessTimeZone);

function guessTimeZone(): string {
    // Getting time zone from the Intl api is not supported in IE (it returns undefined)
    let timeZone: string | undefined = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone == null) {
        // Fall back to manual guessing. According to types this returns a string, but it could
        // in theory return an undefined (not very likely but we err on the side of caution here).
        timeZone = jstz.determine().name() as string | undefined;
    }
    return timeZone != null ? timeZone : "";
}
