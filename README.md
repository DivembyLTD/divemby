Divemby API
-----------


- **hosting**: https://divemby-fb.firebaseapp.com
- **endpoint**: https://us-central1-divemby-fb.cloudfunctions.net/api/


**methods:**

 ###### Verify and registration
  - POST /verifyPhone 
  - POST /checkCode

 ###### User methods
  - POST /updateProfile
   header: 'x-access-token'
  - POST /uploadImg
   header: 'x-access-token'
  - POST /getProfile
   header: 'x-access-token'

 ###### Order methods
  - POST /setOrder
  - POST /updateOrder
  - POST /getSittersByGeo
