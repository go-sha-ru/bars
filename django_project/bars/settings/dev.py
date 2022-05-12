from .base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

ALLOWED_HOSTS = [
    '127.0.0.1',
    'local.bars.ru',
]

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '..', 'static'),
]

AUTH_PASSWORD_VALIDATORS = []

DEBUG = True

FIXTURE_DIRS = [
    os.path.join(BASE_DIR, '..', '..', 'fixtures')
]
