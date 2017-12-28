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
  ###### Request
  **header** \
  x-access-token = 'token' \
  **body** {}
- POST /updateOrder \
  **header** \
  x-access-token = 'token' \
  **body** {}
- POST /getSittersByGeo \
  **header** \
  x-access-token = 'token' \
  **body** {}
  
