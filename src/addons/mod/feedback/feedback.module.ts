// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { CoreContentLinksDelegate } from '@features/contentlinks/services/contentlinks-delegate';
import { CoreCourseHelper } from '@features/course/services/course-helper';
import { CoreCourseModuleDelegate } from '@features/course/services/module-delegate';
import { CoreCourseModulePrefetchDelegate } from '@features/course/services/module-prefetch-delegate';
import { CoreMainMenuTabRoutingModule } from '@features/mainmenu/mainmenu-tab-routing.module';
import { CorePushNotificationsDelegate } from '@features/pushnotifications/services/push-delegate';
import { CoreCronDelegate } from '@services/cron';
import { CORE_SITE_SCHEMAS } from '@services/sites';
import { OFFLINE_SITE_SCHEMA } from './services/database/feedback';
import { AddonModFeedbackAnalysisLinkHandler } from './services/handlers/analysis-link';
import { AddonModFeedbackCompleteLinkHandler } from './services/handlers/complete-link';
import { AddonModFeedbackIndexLinkHandler } from './services/handlers/index-link';
import { AddonModFeedbackListLinkHandler } from './services/handlers/list-link';
import { AddonModFeedbackModuleHandler } from './services/handlers/module';
import { AddonModFeedbackPrefetchHandler } from './services/handlers/prefetch';
import { AddonModFeedbackPrintLinkHandler } from './services/handlers/print-link';
import { AddonModFeedbackPushClickHandler } from './services/handlers/push-click';
import { AddonModFeedbackShowEntriesLinkHandler } from './services/handlers/show-entries-link';
import { AddonModFeedbackShowNonRespondentsLinkHandler } from './services/handlers/show-non-respondents-link';
import { AddonModFeedbackSyncCronHandler } from './services/handlers/sync-cron';
import { ADDON_MOD_FEEDBACK_COMPONENT, ADDON_MOD_FEEDBACK_PAGE_NAME } from './constants';

const routes: Routes = [
    {
        path: ADDON_MOD_FEEDBACK_PAGE_NAME,
        loadChildren: () => import('./feedback-lazy.module'),
    },
];

@NgModule({
    imports: [
        CoreMainMenuTabRoutingModule.forChild(routes),
    ],
    providers: [
        {
            provide: CORE_SITE_SCHEMAS,
            useValue: [OFFLINE_SITE_SCHEMA],
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            useValue: () => {
                CoreCourseModuleDelegate.registerHandler(AddonModFeedbackModuleHandler.instance);
                CoreCourseModulePrefetchDelegate.registerHandler(AddonModFeedbackPrefetchHandler.instance);
                CoreCronDelegate.register(AddonModFeedbackSyncCronHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackIndexLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackListLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackAnalysisLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackCompleteLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackPrintLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackShowEntriesLinkHandler.instance);
                CoreContentLinksDelegate.registerHandler(AddonModFeedbackShowNonRespondentsLinkHandler.instance);
                CorePushNotificationsDelegate.registerClickHandler(AddonModFeedbackPushClickHandler.instance);

                CoreCourseHelper.registerModuleReminderClick(ADDON_MOD_FEEDBACK_COMPONENT);
            },
        },
    ],
})
export class AddonModFeedbackModule {}
