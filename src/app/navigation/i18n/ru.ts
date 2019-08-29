export const locale = {
    lang: 'ru',
    data: {
        'NAV': {
            'APPLICATIONS': 'Saphir Cloud Box',
            'CLIENTS': 'Клиенты',
            'DEPARTMENTS': 'Отделы',
            'USERS': 'Пользователи',
            'ROLES': 'Роли',
            'FILEMANAGER': 'Проводник',
            'HELP': 'Помощь',
            'FAQ': 'Faq',
            'FEEDBACK': 'Обратная связь'
        },
        'PAGES': {
            'APPS': {
                'CLIENTS': {
                    'NAME': 'Название',
                    'CREATEDATE': 'Дата создания',
                    'UPDATEDATE': 'Дата изменения',
                    'ADD': 'Добавить клиента',
                    'ADDSUCCESS': 'Клиент добавлен',
                    'EDIT': 'Изменить клиента',
                    'EDITSUCCESS': 'Клиент изменен',
                    'REMOVEQUESTION': 'Вы уверены, что хотите удалить данного клиента?',
                    'REMOVESUCCESS': 'Клиент удален',
                    'NOT_FOUND': 'Клиент не найден',
                    'SAME_OBJECT': 'Клиент с таким же названием уже есть',
                    'EXIST_DEPENDENCY_OBJECTS': 'К данному клиенту привязаны пользователи и/или департаменты'
                },
                'DEPARTMENTS': {
                    'NAME': 'Название',
                    'CLIENT': 'Клиент',
                    'CREATEDATE': 'Дата создания',
                    'UPDATEDATE': 'Дата изменения',
                    'ADD': 'Добавить отдел',
                    'ADDSUCCESS': 'Отдел добавлен',
                    'EDIT': 'Изменить отдел',
                    'EDITSUCCESS': 'Отдел изменен',
                    'REMOVEQUESTION': 'Вы уверены, что хотите удалить данный отдел?',
                    'REMOVESUCCESS': 'Отдел удален',
                    'NOT_FOUND': 'Отдел не найден',
                    'SAME_OBJECT': 'Отдел с таким же названием уже есть',
                    'EXIST_DEPENDENCY_OBJECTS': 'К данному отделу привязаны пользователи',
                    'NOT_FOUND_DEPENDENCY_OBJECT': 'Не найден клиент'
                },
                'ROLES': {
                    'NAME': 'Название',
                    'ADD': 'Добавить роль',
                    'ADDSUCCESS': 'Роль добавлена',
                    'EDIT': 'Изменить роль',
                    'EDITSUCCESS': 'Роль изменена',
                    'REMOVEQUESTION': 'Вы уверены, что хотите удалить данную роль?',
                    'REMOVESUCCESS': 'Роль удалена',
                    'SAME_OBJECT': 'Роль с таким же названием уже есть',
                    'NOT_FOUND': 'Роль не найдена',
                    'EXIST_DEPENDENCY_OBJECTS': 'К данной роли привязаны пользователи',
                    'ERROR': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время'
                },
                'USERS': {
                    'USERNAME': 'Имя',
                    'EMAIL': 'Почта',
                    'CLIENT': 'Клиент',
                    'DEPARTMENT': 'Отдел',
                    'ROLE': 'Роль',
                    'CREATEDATE': 'Дата создания',
                    'UPDATEDATE': 'Дата изменения',
                    'ADD': 'Добавить пользователя',
                    'ADDSUCCESS': 'Пользователь добавлен',
                    'EDIT': 'Изменить пользователя',
                    'EDITSUCCESS': 'Пользователь изменен',
                    'REMOVEQUESTION': 'Вы уверены, что хотите удалить выбранного пользователя?',
                    'REMOVESUCCESS': 'Пользователь удален',
                    'SAME_OBJECT': 'Пользователь с таким именем уже существует',
                    'NOT_FOUND': 'Выбранный пользователь не найден',
                    'NOT_FOUND_DEPENDENCY_OBJECT': 'Не найдены клиент и/или отдел',
                    'ERROR': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время'
                },
                'FILEMANAGER': {
                    'ADDFOLDER': 'Добавить папку',
                    'EDITED': 'Редактор',
                    'INFO': 'Информация',
                    'TYPE': 'Тип',
                    'OWNER': 'Владелец',
                    'MODIFIEDBY': 'Изменен',
                    'MODIFIEDDATE': 'Дата изменения',
                    'CREATEBY': 'Создан',
                    'CREATEDATE': 'Дата создания',
                    'SIZE': 'Размер',
                    'NAME': 'Название',
                    'VIEWRIGHT': 'Право просмотра',
                    'FOLDERREMOVEQUESTION': 'Вы уверены, что хотите удалить данную папку?',
                    'FOLDERREMOVESUCCESS': 'Папка успешно удалена',
                    'FOLDER_NOT_FOUND': 'Папка не найдена',
                    'FOLDER_SAME_OBJECT': 'Папка с таким же названием уже есть',
                    'FOLDER_NO_ACCESS': 'У вас нет прав на данную папку',
                    'UPDATEFOLDER': 'Изменить папку',
                    'ADDFILE': 'Добавить файл',
                    'UPDATEFILE': 'Изменить файл',
                    'FILE_NOT_FOUND': 'Файл не найден',
                    'FILE_SAME_OBJECT': 'Файл с таким же названием уже есть',
                    'FILE_NOT_FOUND_DEPENDENCY_OBJECT': 'Файл не найден',
                    'FILE': 'Файл',
                    'FILE_NO_ACCESS': 'У вас нет прав на данный файл',
                    'FILEREMOVEQUESTION': 'Вы уверены, что хотите удалить данную папку?',
                    'FILEREMOVESUCCESS': 'Папка успешно удалена',
                    'ADDPERMISSION': 'Добавить доступ',
                    'PERMISSIONADDSUCCESS': 'Доступ успешно создан',
                    'PERMISSIONADD_ERROR': 'Вы не можете дать доступ другому пользователю',
                    'PERMISSIONNOT_FOUND_USER': 'Не найден пользователь с данной почтой',
                    'READONLYPERMISSION': 'Только чтение',
                    'READANDWRITEPERMISSION': 'Чтение и запись',
                    'REMOVECURRENTFOLDER': 'Удалить текущую папку',
                    'UPDATECURRENTFOLDER': 'Изменить текущую папку',
                    'PERMISSION_SAME_OBJECT': 'Пользователь уже имеет права',
                    'EDITPERMISSION': 'Изменить доступ',
                    'PERMISSIONEDITSUCCESS': 'Доступ успешно изменен',
                    'PERMISSIONREMOVEQUESTION': 'Вы уверены, что хотите удалить данный доступ?',
                    'PERMISSIONREMOVESUCCESS' : 'Доступ успешно удален',
                    'PERMISSION_NO_ACCESS': 'Вы не можете изменять доступы',
                    'PERMISSION_NOT_FOUND_USER': 'Не найден пользователь',
                    'PERMISSION_NOT_FOUND': 'Не найден доступ',
                    'PICK': 'Выберите',
                    'ALLCLIENTS': 'Все клиенты',
                    'ALLUSERS': 'Все пользователи'
                },
                'FEEDBACK': {
                    'USEREMAIL': 'Ваша почта',
                    'USERNAME': 'Ваше имя',
                    'THEME': 'Тема',
                    'MESSAGE': 'Сообщение',
                    'SEND': 'Отправить',
                    'SUCCESS': 'Сообщение отправлено успешно',
                    'NOT_FOUNT': 'Пользователь с данной почтой не найден',
                    'SERVER_ERROR': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время'
                }
            },
            'AUTH': {
                'LOGINTITLE': 'ВХОД В ТВОЙ АККАУНТ',
                'LOGIN': 'ВХОД',
                'EMAIL': 'Email',
                'PASSWORD': 'Пароль',
                'DONTHAVEACCOUNT': 'У Вас нет аккаунта?',
                'CREATEACCOUNT': 'Создайте аккаунт',
                'CREATEACCOUNTTITLE': 'РЕГИСТРАЦИЯ',
                'USERNAME': 'Имя',
                'CLIENT': 'Клиент',
                'DEPARTMENT': 'Отдел',
                'PASSWORDCONFIRM': 'Подтверждение пароля',
                'HAVEACCOUNT': 'У Вас уже есть аккаунт?',
                'TOLOGIN': 'Войдите',
                'LOGOUT': 'Выход',
                'OOPS': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время',
                'RECOVERPASSWORD': 'ВОССТАНОВИТЕ СВОЙ ПАРОЛЬ',
                'SENDRESETLINK': 'ОТПРАВИТЬ ПИСЬМО',
                'BACKTOLOGIN': 'Вернуться к входу',
                'EMPTYEMAIL': 'Email обязателен',
                'INVALIDEMAIL': 'Email некорректен',
                'EMPTYPASSWORD': 'Пароль обязателен',
                'FORGOTPASSQORDQUESTION': 'Забыли пароль?',
                'CREATENEWPASSOWRD': 'Создать новый пароль',
                'CONFIRMEMAIL': 'Ваш Email подтвержден!',
                'CONFIRMEMAIL1': 'Письмо с подтверждением было отправлено на адрес',
                'CONFIRMEMAIL2': 'Проверьте свой почтовый ящик и нажмите на ссылку «Подтвердить мой адрес электронной почты», чтобы подтвердить свой адрес электронной почты.',
                'RESETPASSWORD': 'СБРОС ПАРОЛЯ',
                'EMPTYPASSWORDCONFIRM': 'Подтверждение пароля обязательно',
                'INVALIDPASSWORDCONFIRM': 'Пароли должны совпадать',
                'EMPTYUSERNAME': 'Имя обязательно',
                'REMOVECURRENTFOLDER': 'Удалить текущую папку',
                'NOT_FOUND_USER': 'Не найден пользователь с введенным паролем и/или почтой',
                'ERROR': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время',
                'SAME_USER': 'Пользователь с такой же почтой уже существует',
                'NOT_FOUND_ROLE': 'Не найдена роль'
            }
        },
        'COMMONACTIONS': {
            'EDIT': 'Изменить',
            'REMOVE': 'Удалить',
            'ADD': 'Добавить',
            'SAVE': 'Сохранить',
            'YES': 'Да',
            'NO': 'Нет',
            'BOTH': 'Все',
            'CONFIRM': 'Подтверждение',
            'CANCEL': 'Отмена',
            'ALL': 'Все',
            'INFO': 'Информация',
            'DOWNLOAD': 'Скачать',
            'OOPS': 'Упс! Что-то пошло не так. Пожалуйста, свяжитесь со службой поддержки, и мы постараемся исправить это в ближайшее время'
        }
    }
};
