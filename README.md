# HOW TO CC
## API DOCUMENTATION

### REGISTER USER

**INFO:** Password akan dihash for security reason

- method: POST
- path: `/register`
- content-type: application/json
- body:
  ```json
  {
      "email": "email",
      "password": "password",
      "nama": "nama",
      "role": "customer/doctor"
  }
  ```
- expected response:
  ```json
  {
      "status": "success",
      "message": "successfully registered new user"
  }
  ```

### USER LOGIN

**important:** setelah login berhasil akan mendapat response **USER TOKEN** yang mana penting dan esensial untuk identifier user pada API request lainnya. User token memiliki expiration time (default 1 jam) untuk re-login kembali.

- method: POST
- path: `/login`
- content-type: application/json
- body:
  ```json
  {
      "email": "email@gmail.com",
      "password": "password"
  }
  ```
- expected response:
  ```json
  {
      "status": "success",
      "data": {
          "token": "token"
      }
  }
  ```

### USER DELETE

- method: DEL
- path: `/delete`
- content-type: application/json
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body: **NO BODY**
- expected response:
  ```json
  {
    "status": "success",
    "message": "successfully delete user"
  }
  ```

### USER UPDATE

- method: PATCH
- path: `/update`
- content-type: multipart/form-data
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body (optional only for changes):
     - image: <image file NO URL>
     - data: <JSON for new attributes values>
- expected response:
  ```json
  {
    "status": "success",
    "data": {
        "id": <id>,
        "email": <email>,
        "nama": <nama>,
        "foto": <url foto>,
        "role": <role>,
        "subscriber": <bool subs>
    }
  }
  ```

### GET DOCTORS

- method: GET
- path: `/doctors`
- content-type: application/json
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body: **No body**
- expected response:
  ```json
  {
    "status": "success",
    "data": {
        "doctors": []
     }
  }
  ```

### GET HOSPITALS

- method: GET
- path: `/hospitals`
- parameter (optional): kota; example `/hospitals?kota=Surabaya`
- content-type: application/json
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body: **No body**
- expected response:
  ```json
  {
    "status": "success",
    "data": {
        "hospitals": []
     }
  }
  ```

### POST HASIL SCAN

- method: POST
- path: `/prediction`
- content-type: multipart/form-data
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body:
  ```json
   {
      "name": "Dermatofibroma",
      "link": "https://www.honestdocs.id/dermatofibroma",
      "step": "Biasanya, dermatofibroma bersifat kronis dan tidak dapat sembuh sendiri secara spontan."
   }
  ```
- expected response:
  ```json
  {
    "status": "success",
    "message": ""
  }
  ```

### GET HASIL SCAN

- method: GET
- path: `/scans`
- content-type: application/json
- Header:
  `Authorization: Bearer <USER TOKEN>`
- body: **NO BODY**
- expected response:
  ```json
  {
    "status": "success",
    "data": [
      {
        "S_ID": <id scan>,
        "S_link": <link gambar>,
        "S_diagnosis": <text diagnosis penyakit>,
        "S_referensi": <link referensi artikel>,
        "S_deskripsi": <teks deskripsi penanganan awal>,
        "S_waktu": <timestamp data tersimpan>,
        "user_U_ID": <id use pemilik data scan>,
      }
    ]
  }
  ```
