# HOW TO CC

## DEV MODE
0. Pastikan sudah menginstal NodeJS.
1. Download XAMPP atau database lokal favorit kalian, nyalakan service tersebut.
2. Clone branch ini ke lokal.
3. Buat database baru bernama `bangkit_skin_app` pada database lokal lalu gunakan import dengan script SQL pada [`./database/bangkit_capstone_Physical_Export_create.sql`](https://github.com/stevengregori92/CAPSTONE_GACOR/blob/cc/database/bangkit_capstone_Physical_Export_create.sql)
4. Jalankan `npm i` untuk install node modules berdasarkan package yg dibutuhkan.
5. Buat `.env` lalu isi sesuai konfigurasi DB lokal kalian (tanpa tanda petik):
   ```
   DB_NAME=
   DB_PASS=
   DB_USER=
   DB_HOST=
   ```
6. Jalankan node dengan command `npm run dev`.

## API DOCUMENTATION

### REGISTER USER

**warning:** Password akan dihash for security reason

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
  ```
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
  ```
  {
    "status": "success",
    "message": "successfully delete user"
  }
  ```

### USER PREDICT

- method: POST
- path: `/upload`
- **content-type: multipart/form-data**
- Header:
  `Authorization: Bearer <USER TOKEN>`
- **body: `FORM-DATA {key: image; value: <IMAGE> }`**
- expected response:
  ```
  {
    "status": "success",
    "message": "successfully upload a scan image",
    "data": {
        "imageUrl": "https://storage.googleapis.com/example-bucket-test-cc-trw/<IMAGE_BUCKET_ID>.<IMG_EXTENSION>"
    }
   }
   ```
