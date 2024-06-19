# HOW TO CC-FASTAPI
## API DOCUMENTATION

### PREDICTION API

- method: POST
- path: `/predict`
- content-type: multipart/form-data
- Header: `Authorization: Bearer <USER TOKEN>`
- body:
    - image : `<image file>`
- expected response:
  ```json
  {
    "status": "success",
    "message": "successfully predict request",
    "data": {
        "class": 5,
        "name": "Melanoma",
        "link": "https://www.halodoc.com/kesehatan/melanoma",
        "step": "Pengobatan kanker kulit mirip dengan pengobatan kanker lainnya...",
        "confidence": 0.9907734394073486
    }
  }
  ```
