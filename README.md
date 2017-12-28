# Divemby API
-----------


- **hosting**: https://divemby-fb.firebaseapp.com
- **endpoint**: https://us-central1-divemby-fb.cloudfunctions.net/api/


## Verify and registration

- POST /verifyPhone
  
- POST /checkCode


## User methods [headers]

* POST /updateProfile \
  **header** \
  x-access-token = 'token' \
  **body** { \
     "createdDate" : "2017-12-21T19:32:57+03:00", \
     "lastVisitedAt" : "2017-12-21T19:32:57+03:00", \
     "name" : "Andrey", \
     "phone" : "9119028069", \
     "surname" : "Delov" \
  }
* POST /uploadImg \
  **header** \
  x-access-token = 'token' \
  **body** {}
* POST /getProfile \
  **header** \
  x-access-token = 'token' \
  **body** {}
## Order methods
- POST /setOrder \
  **header** \
  x-access-token = 'token' \
  **body** \
  `{
    desc: "Описание", \
    ds: "Дата и время начала", \
    de: "Дата и время конца", \
    pets_ids: "ids нескольких или одного животного" \
  }`
- POST /updateOrder \
  **header** \
  x-access-token = 'token' \
  **body** {
    order_key: '-L1RgE2MzHvtMG901M_D',
    desc: '',
    ds: '',
    de: '',
    pets_ids: ''
  }
- POST /getSittersByGeo \
  **header** \
  x-access-token = 'token' \
  **body** {}

