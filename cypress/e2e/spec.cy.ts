/* eslint-disable no-underscore-dangle */
/// <reference types="cypress" />

const DATA_TEST_ID = {
    menuButtonProfile: 'menu-button-profile',
    profileName: 'profile-name',
    profileSurname: 'profile-surname',
    profileAvatar: 'profile-avatar',
    profilePassword: 'profile-password',
    profileRepeatPassword: 'profile-repeat-password',
    profileEmail: 'profile-email',
    profileBirthday: 'profile-birthday',
    profileSubmit: 'profile-submit',
    bigFileErrorClose: 'big-file-error-close',
    alert: 'alert',
    headerSettings: 'header-settings',
    settingsBack: 'settings-back',
    proTarifCard: 'pro-tariff-card',
    activateTariffBtn: 'activate-tariff-btn',
    tariffTrainings: 'tariff-trainings',
    tariffTrainingsIcon: 'tariff-trainings-icon',
    tariffNotifications: 'tariff-notifications',
    tariffNotificationsIcon: 'tariff-notifications-icon',
    tariffTheme: 'tariff-theme',
    tariffThemeIcon: 'tariff-theme-icon',
    tariffSider: 'tariff-sider',
    tariffCost: 'tariff-cost',
    tariffSubmit: 'tariff-submit',
    tariffModalSuccess: 'tariff-modal-success',
    newReviewSubmitBtn: 'new-review-submit-button',
};

describe('Sprint 5', () => {
    const resolutionFull = [
        { width: 360, height: 740 },
        { width: 833, height: 900 },
        { width: 1440, height: 900 },
    ];
    const resolutionMobile = [{ width: 360, height: 740 }];
    const resolutionTablet = [{ width: 833, height: 900 }];
    const resolutionLaptop = [{ width: 1440, height: 900 }];

    function takeScreenshots(screenshotName, resolution = resolutionFull) {
        cy.wait(1000);
        for (let i = 0; i < resolution.length; i++) {
            cy.viewport(resolution[i].width, resolution[i].height);
            cy.screenshot(`${screenshotName}_${resolution[i].width}x${resolution[i].height}`, {
                capture: 'viewport',
            });
        }
    }

    function beforeEach(testName: string) {
        cy.visit('/');
        cy.intercept('POST', 'auth/login', { accessToken: 'SUPERUSER' }).as('login');
        cy.visit('/auth');
        cy.get('[data-test-id=login-email]').type('valadzkoaliaksei@tut.by');
        cy.get('[data-test-id=login-password]').type('1234qqQQ');
        cy.get('[data-test-id=login-submit-button]').click();

        if (testName === 'profile') {
            cy.intercept('GET', 'me', {
                statusCode: 200,
                body: {
                    email: 'valadzkoaliaksei@tut.by',
                    readyForJointTraining: false,
                    sendNotification: false,
                },
            }).as('getUser');
        }

        if (testName === 'profileGoogle') {
            cy.intercept('GET', 'me', {
                statusCode: 200,
                body: {
                    email: 'thebestdeveloperintheworld@gmail.com',
                    imgSrc: 'https://lh3.googleusercontent.com/a/ACg8ocK7Zxx6eMSuA-4_oUDsUIoh-RERhwB6mjReSs5L_kjQeg=s96-c',
                    readyForJointTraining: false,
                    sendNotification: false,
                },
            }).as('getUser');
        }

        if (testName === 'settingsPro') {
            cy.intercept('GET', 'me', {
                statusCode: 200,
                body: {
                    email: 'valadzkoaliaksei@tut.by',
                    readyForJointTraining: true,
                    sendNotification: false,
                    tariff: {
                        tariffId: '65df21ca9013cb64beacbd56',
                        expired: '2025-03-09T10:18:40.805Z',
                    },
                },
            }).as('getUser');
        }

        cy.url().should('include', '/main');
    }

    it('profile page', () => {
        // получение данных пользователя при входе
        beforeEach('profile');
        cy.wait('@getUser');

        // страница профиля без аватара
        cy.get(`[data-test-id=${DATA_TEST_ID.menuButtonProfile}]`).click();
        cy.url().should('include', '/profile');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileAvatar}]`).contains('Загрузить фото профиля');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileName}]`).invoke('val').should('equal', '');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSurname}]`).invoke('val').should('equal', '');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileBirthday}]`).invoke('val').should('equal', '');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`)
            .invoke('val')
            .should('equal', 'valadzkoaliaksei@tut.by');
        cy.get(`[data-test-id=${DATA_TEST_ID.profilePassword}]`).invoke('val').should('equal', '');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileRepeatPassword}]`)
            .invoke('val')
            .should('equal', '');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.disabled');
        takeScreenshots('default-profile-page', resolutionLaptop);

        // загрузка большого файла
        cy.get('input[type=file]').selectFile('cypress/fixtures/image.png', {
            force: true,
        });
        cy.intercept('POST', 'upload-image', {
            statusCode: 409,
            error: 'Conflict',
            message: 'Файл слишком большой',
        }).as('uploadBigFile');
        cy.wait('@uploadBigFile');
        takeScreenshots('modal-big-photo', resolutionLaptop);
        cy.get(`[data-test-id=${DATA_TEST_ID.bigFileErrorClose}`).click();
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.disabled');

        // загрузка файла
        cy.get('input[type=file]').selectFile('cypress/fixtures/image.png', {
            force: true,
        });
        cy.intercept('POST', 'upload-image', {
            statusCode: 200,
            body: {
                name: '65df1fc091548a261a8f8c97.png',
                url: '/media/avatar/65df1fc091548a261a8f8c97.png',
            },
        }).as('uploadFile');
        cy.wait('@uploadFile');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.enabled');

        // обновление всех полей
        cy.intercept('PUT', 'user', {
            statusCode: 200,
            body: {
                imgSrc: 'https://training-api.clevertec.ru/media/avatar/65df1fc091548a261a8f8c97.png',
                firstName: 'Клевертек',
                lastName: 'Клевертекович',
                birthday: '2000-02-05T17:18:46.204Z',
                email: 'thebestdeveloperintheworld@gmail.com',
            },
        }).as('updateUser');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileName}]`).type('Клевертек');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSurname}]`).type('Клевертекович');

        // валидация полей
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`).clear();
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`).type('thebestdeveloperintheworld');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`).should(
            'have.attr',
            'aria-invalid',
            'true',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`).type('{end}@gmail.com');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileEmail}]`).should(
            'not.have.attr',
            'aria-invalid',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profileBirthday}]`).click();
        cy.get(`[data-test-id=${DATA_TEST_ID.profileBirthday}]`).type('05.02.2000{enter}');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileBirthday}]`)
            .invoke('val')
            .should('equal', '05.02.2000');
        cy.get(`[data-test-id=${DATA_TEST_ID.profilePassword}]`).type('1234');
        cy.get(`[data-test-id=${DATA_TEST_ID.profilePassword}]`).should(
            'have.attr',
            'aria-invalid',
            'true',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profilePassword}]`).type('{end}qqQQ');
        cy.get(`[data-test-id=${DATA_TEST_ID.profilePassword}]`).should(
            'not.have.attr',
            'aria-invalid',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profileRepeatPassword}]`).type('1234qqQ');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileRepeatPassword}]`).should(
            'have.attr',
            'aria-invalid',
            'true',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profileRepeatPassword}]`).type('{end}Q');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileRepeatPassword}]`).should(
            'not.have.attr',
            'aria-invalid',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).click();
        cy.wait('@updateUser');
        cy.wait(1000);
        cy.get(`[data-test-id=${DATA_TEST_ID.alert}]`).contains('Данные профиля успешно обновлены');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.disabled');
        takeScreenshots('profile-modal-success', resolutionLaptop);
        cy.get(`[data-test-id=${DATA_TEST_ID.alert}]`).within(() => cy.get('button').click());

        // ошибка при отправке
        cy.intercept('PUT', 'user', {
            statusCode: 500,
            body: {
                error: '',
                message: '',
            },
        }).as('updateUserWithError');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileName}]`).clear();
        cy.get(`[data-test-id=${DATA_TEST_ID.profileName}]`).type('кетревлеК');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.enabled');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).click();
        cy.wait('@updateUserWithError');
        takeScreenshots('profile-modal-error', resolutionLaptop);
    });

    it('profile page with google photo', () => {
        beforeEach('profileGoogle');
        cy.wait('@getUser');
        cy.get(`[data-test-id=${DATA_TEST_ID.menuButtonProfile}]`).click();
        cy.url().should('include', '/profile');
        cy.get(`[data-test-id=${DATA_TEST_ID.profileAvatar}]`).within(() => {
            cy.get('img')
                .should('have.attr', 'src')
                .should(
                    'include',
                    'https://lh3.googleusercontent.com/a/ACg8ocK7Zxx6eMSuA-4_oUDsUIoh-RERhwB6mjReSs5L_kjQeg=s96-c',
                );
        });
        cy.get(`[data-test-id=${DATA_TEST_ID.profileSubmit}]`).should('be.disabled');

        // кнопка назад
        cy.get(`[data-test-id=${DATA_TEST_ID.headerSettings}]`).click();
        cy.url().should('include', '/settings');
        cy.get(`[data-test-id=${DATA_TEST_ID.settingsBack}]`).click();
        cy.url().should('include', '/profile');
    });

    it('settings page', () => {
        beforeEach('profile');
        cy.wait('@getUser');
        cy.intercept('GET', 'tariff-list', {
            statusCode: 200,
            body: [
                {
                    _id: '65df21ca9013cb64beacbd56',
                    name: 'Pro',
                    periods: [
                        {
                            text: '6 месяцев',
                            cost: 5.5,
                            days: 182,
                        },
                        {
                            text: '9 месяцев',
                            cost: 8.5,
                            days: 274,
                        },
                        {
                            text: '12 месяцев',
                            cost: 10,
                            days: 365,
                        },
                    ],
                },
            ],
        }).as('getTarifList');

        // кнопка назад
        cy.get(`[data-test-id=${DATA_TEST_ID.headerSettings}]`).click();
        cy.wait('@getTarifList');
        cy.url().should('include', '/settings');
        cy.get(`[data-test-id=${DATA_TEST_ID.settingsBack}]`).click();
        cy.url().should('include', '/main');
        cy.get(`[data-test-id=${DATA_TEST_ID.headerSettings}]`).click();

        // карточки
        cy.get(`[data-test-id=${DATA_TEST_ID.proTarifCard}]`).within(() => {
            cy.get(`[data-test-id=${DATA_TEST_ID.activateTariffBtn}]`).should('be.visible');
        });

        // опции
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainings}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotifications}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTheme}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTheme}]`).should('be.disabled');
        takeScreenshots('default-settings-page', resolutionLaptop);
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainingsIcon}]`).trigger('mouseover');
        cy.contains('включеная функция позволит участвовать в совместных тренировках').should(
            'be.visible',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainingsIcon}]`).trigger('mouseout');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotificationsIcon}]`).trigger('mouseover');
        cy.contains('включеная функция позволит получать уведомления об активностях').should(
            'be.visible',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotificationsIcon}]`).trigger('mouseout');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffThemeIcon}]`).trigger('mouseover');
        cy.contains('темная тема доступна для PRO tarif').should('be.visible');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffThemeIcon}]`).trigger('mouseout');

        // сайдер
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSider}]`).should('not.exist');
        cy.get(`[data-test-id=${DATA_TEST_ID.proTarifCard}]`).within(() => {
            cy.contains('Подробнее').click();
        });
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSider}]`).should('exist').should('be.visible');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('6 месяцев');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('9 месяцев');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('12 месяцев');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('5,5');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('8,5');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).contains('10');
        takeScreenshots('settings-page-with-sider', resolutionMobile);

        // отправить запрос, модалка
        cy.intercept('POST', 'tariff', {
            statusCode: 200,
            body: {},
        }).as('buyTarif');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSubmit}]`).should('be.disabled');
        cy.get('[data-test-id=tariff-10]').click();
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSubmit}]`).should('be.enabled');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSubmit}]`).click();
        cy.wait('@buyTarif');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffModalSuccess}]`)
            .contains('valadzkoaliaksei@tut.by')
            .should('be.visible');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSider}]`).should('not.exist');
        takeScreenshots('buy-tariff-success', resolutionLaptop);
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffModalSuccess}]`).within(() => {
            cy.get('button').first().click();
        });
        cy.url().should('include', '/auth');
    });

    it('settings page pro', () => {
        beforeEach('settingsPro');
        cy.intercept('GET', 'tariff-list', {
            statusCode: 200,
            body: [
                {
                    _id: '65df21ca9013cb64beacbd56',
                    name: 'Pro',
                    periods: [
                        {
                            text: '6 месяцев',
                            cost: 5.5,
                            days: 182,
                        },
                        {
                            text: '9 месяцев',
                            cost: 8.5,
                            days: 274,
                        },
                        {
                            text: '12 месяцев',
                            cost: 10,
                            days: 365,
                        },
                    ],
                },
            ],
        }).as('getTarifList');
        cy.wait('@getUser');
        cy.get(`[data-test-id=${DATA_TEST_ID.headerSettings}]`).click();

        // карточки
        cy.wait('@getTarifList');
        cy.get(`[data-test-id=${DATA_TEST_ID.proTarifCard}]`).within(() => {
            cy.contains('до 09.03').should('be.visible');
        });
        takeScreenshots('settings-pro-cards', resolutionMobile);

        // опции
        cy.intercept('PUT', 'user', {
            statusCode: 200,
            body: {
                email: 'valadzkoaliaksei@tut.by',
                readyForJointTraining: false,
                sendNotification: false,
                tariff: {
                    tariffId: '65df21ca9013cb64beacbd56',
                    expired: '2025-03-09T10:18:40.805Z',
                },
            },
        }).as('updateUserTrainings');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainings}]`).should(
            'have.attr',
            'aria-checked',
            'true',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotifications}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTheme}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTheme}]`).should('be.enabled');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainings}]`).click();
        cy.wait('@updateUserTrainings');
        cy.intercept('PUT', 'user', {
            statusCode: 200,
            body: {
                email: 'valadzkoaliaksei@tut.by',
                readyForJointTraining: false,
                sendNotification: true,
                tariff: {
                    tariffId: '65df21ca9013cb64beacbd56',
                    expired: '2025-03-09T10:18:40.805Z',
                },
            },
        }).as('updateUserNotifications');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffTrainings}]`).should(
            'have.attr',
            'aria-checked',
            'false',
        );
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotifications}]`).click();
        cy.wait('@updateUserNotifications');
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffNotifications}]`).should(
            'have.attr',
            'aria-checked',
            'true',
        );

        // сайдер
        cy.get(`[data-test-id=${DATA_TEST_ID.proTarifCard}]`).within(() => {
            cy.contains('Подробнее').click();
        });
        cy.get(`[data-test-id=${DATA_TEST_ID.tariffSider}]`)
            .should('exist')
            .should('be.visible')
            .within(() => {
                cy.contains('до 09.03').should('be.visible');
                cy.contains('Выбрать и оплатить').should('not.exist');
                cy.get(`[data-test-id=${DATA_TEST_ID.tariffCost}]`).should('not.exist');
            });
        takeScreenshots('settings-sider-pro', resolutionTablet);
    });

    it('feedbacks', () => {
        beforeEach('profile');
        cy.intercept('GET', 'tariff-list', {
            statusCode: 200,
            body: [
                {
                    _id: '65df21ca9013cb64beacbd56',
                    name: 'Pro',
                    periods: [
                        {
                            text: '6 месяцев',
                            cost: 5.5,
                            days: 182,
                        },
                        {
                            text: '9 месяцев',
                            cost: 8.5,
                            days: 274,
                        },
                        {
                            text: '12 месяцев',
                            cost: 10,
                            days: 365,
                        },
                    ],
                },
            ],
        }).as('getTarifList');
        cy.wait('@getUser');
        cy.get(`[data-test-id=${DATA_TEST_ID.headerSettings}]`).click();
        cy.wait('@getTarifList');
        cy.intercept('GET', 'feedback', {
            statusCode: 200,
            body: [
                {
                    id: '65e4568855c4a5796d525e57',
                    fullName: null,
                    imageSrc: null,
                    message: 'sadfsdafsd',
                    rating: 3,
                    createdAt: '2024-03-03T10:52:56.749Z',
                },
                {
                    id: '65e4568855c4a5796d525579',
                    fullName: 'Канье',
                    message: 'первый',
                    rating: 3,
                    imageSrc:
                        'https://training-api.clevertec.ru/media/avatar/65df1fc091548a261a8f8c97.png',
                    createdAt: '2021-03-03T10:52:58.749Z',
                },
                {
                    id: '65e4568855c4a5796d525e58',
                    fullName: 'Бабай Бабай',
                    imageSrc: null,
                    message: 'текст',
                    rating: 3,
                    createdAt: '2024-03-03T10:52:57.749Z',
                },
                {
                    id: '65e4566b55c4a5796d525bd7',
                    fullName: 'Гена Букин',
                    imageSrc:
                        'https://lh3.googleusercontent.com/a/ACg8ocIs5m7cLVsb2UqRVPpFTv_imE_EOSlNMdwidbUNPqE0=s96-c',
                    message: 'really cool app',
                    rating: 5,
                    createdAt: '2025-03-03T10:52:27.796Z',
                },
            ],
        }).as('getFeedbacks');

        cy.contains('Смотреть все отзывы').click();
        cy.url().should('include', '/feedbacks');
        cy.wait('@getFeedbacks');
        takeScreenshots('feedbacks with photo', resolutionLaptop);
        cy.go('back');

        cy.intercept('POST', 'feedback', {
            statusCode: 200,
            body: {},
        }).as('postFeedback');
        cy.contains('Написать отзыв').click();
        cy.get('.ant-modal ul li').eq(4).click();
        cy.get(`[data-test-id=${DATA_TEST_ID.newReviewSubmitBtn}]`).click();
        cy.wait('@postFeedback');
    });
});