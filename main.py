from fastapi import FastAPI, File, Request, UploadFile, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
import requests
import jwt
import tensorflow as tf
from dotenv import load_dotenv
import os
load_dotenv()

app = FastAPI()

MODEL_URL = os.getenv('MODEL_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

classOutput = [
  {
    "class": 0,
    "name": "Actinic keratosis",
    "link": "https://www.halodoc.com/kesehatan/actinic-keratosis",
    "step": "Pemberian obat-obatan dan terapi intervensi merupakan metode yang dilakukan oleh dokter untuk mengobati actinic keratosis. Dokter akan memilih rekomendasi terapi berdasarkan keluhan dan kondisi kulit pengidap. Pengobatan dengan obat-obatan umumnya dengan menggunakan salep untuk mengurangi gejala.\nSementara terapi intervensi yang dapat dilakukan, antara lain:\n1. Cryosurgery. Terapi ini disebut juga dengan krioterapi yang dilakukan dengan cara menggunakan nitrogen cair untuk membekukan pertumbuhan kulit. Biasanya, terapi ini membutuhkan waktu penyembuhan selama 7-14 hari.\n2. Kuretase dan electrosurgery, yaitu dengan mengikis pertumbuhan kulit abnormal.\n3. Shave excision. Tindakan ini dilakukan untuk mengangkat pertumbuhan kulit dan dilakukan pemeriksaan untuk kemungkinan keganasan.\n4. Laser resurfacing. Dilakukan penembakan cahaya laser untuk menghancurkan lapisan kulit yang paling atas dan diharapkan akan tumbuh kembali jaringan kulit normal.\n5. Chemical Peeling. Prosedur ini melibatkan pengelupasan lapisan yang tidak diinginkan di lapisan atas kulit. Dalam beberapa hari pertama, area yang ditangani dengan chemical peeling akan terasa sakit dan merah. Saat kulit sembuh, lapisan kulit baru yang sehat akan tumbuh.\n6. Terapi fotodinamik. Jika kamu memiliki beberapa kondisi actinic keratosis, atau actinic keratosis kambuh lagi setelah perawatan, dokter mungkin merekomendasikan terapi fotodinamik. Perawatan ini menggunakan krim dan terapi cahaya khusus untuk menghancurkan sel kulit yang bermasalah. Namun setelah perawatan, kamu harus menghindari sinar matahari selama beberapa hari selama kulit yang dirawat pulih.\n"
  },
  {
    "class": 1,
    "name": "Basal cell carcinoma",
    "link": "https://www.alodokter.com/karsinoma-sel-basal",
    "step": "Beberapa metode yang dapat dilakukan untuk menangani karsinoma sel basal adalah:\n1. Pemotongan dengan jarum elektrik\nDokter akan mengikis sel kanker di permukaan kulit, kemudian membakar sel kanker yang tersisa dengan jarum elektrik. Prosedur ini umum dilakukan pada kanker yang berukuran kecil.\n2. Pemotongan dengan pisau bedah\nDokter akan memotong area kulit yang terkena kanker dan jaringan kulit yang sehat di sekitarnya. Setelah itu, dokter akan memeriksa kulit dengan mikroskop guna memastikan tidak ada sel kanker yang tersisa. Prosedur ini dilakukan bila ukuran kanker cukup besar.\n3. Krioterapi\nDokter akan menggunakan cairan khusus yang mengandung nitrogen untuk membekukan dan membunuh sel kanker. Krioterapi atau cryosurgery biasa digunakan untuk mengatasi kanker yang tipis dan tidak terlalu dalam ke kulit.\n4. Operasi Mohs\nDokter akan mengangkat lapisan kulit yang bermasalah sedikit demi sedikit, sambil memeriksanya di bawah mikroskop untuk memastikan tidak ada sel kanker yang tertinggal. Metode ini digunakan untuk mengatasi karsinoma sel basal yang sering kambuh, berukuran cukup besar, atau terdapat di wajah.\n5. Terapi fotodinamik\nProsedur ini dilakukan dengan mengoleskan obat ke permukaan kulit yang terkena karsinoma sel basal. Setelah itu, dokter akan menyinari bagian kulit tersebut dengan sinar khusus untuk menghancurkan sel kanker.\n6. Terapi radiasi (radioterapi)\nProsedur ini biasanya digunakan pada pasien yang tidak dapat menjalani operasi. Radioterapi juga bisa dilakukan setelah operasi untuk mencegah kekambuhan.\n7. Kemoterapi\nKemoterapi dilakukan jika kanker telah menyebar ke organ lain.\n"
  },
  {
    "class": 2,
    "name": "Benign keratosis-like lesions",
    "link": "https://hellosehat.com/penyakit-kulit/kulit-lainnya/pengangkatan-lesi-kulit-jinak/",
    "step": "Pengobatan lesi dapat dilakukan dengan menggunakan obat topikal yang dioleskan langsung ke kulit untuk mengurangi iritasi dan peradangan pada area yang bermasalah. Selain itu, dapat dlakukan operasi untuk mengatasi lesi kulit yang terinfeksi dengan prosedur bedah minor untuk memcahkan lesi berisi cairan atau nanah. \n"
  },
  {
    "class": 3,
    "name": "Dermatofibroma",
    "link": "https://www.honestdocs.id/dermatofibroma",
    "step": "Biasanya, dermatofibroma bersifat kronis dan tidak dapat sembuh sendiri secara spontan. Tetapi kondisi ini tidak berbahaya, dan perawatan biasanya semata-mata hanya bertujuan untuk alasan kosmetik. Pilihan pengobatan untuk dermatofibroma meliputi:\n1. Pembekuan / cryotherapy (dengan nitrogen cair)\n2. Injeksi kortikosteroid terlokalisasi\n3. Terapi laser\n4. Skin peeler\nTerapi ini mungkin tidak dapat menghilangkan dermatofibroma sepenuhnya, karena jaringan dapat terakumulasi kembali di dalam lesi dan kembali ke ukuran sebelum dilakukan terapi.\nSebuah dermatofibroma dapat sepenuhnya dihilangkan dengan eksisi bedah, tetapi ada juga kemungkinan pembentukan jaringan parut yang mungkin dianggap lebih tidak sedap dipandang daripada dermatofibroma itu sendiri.\nJangan pernah mencoba memotong atau menghilangkan dermatofibroma sendiri di rumah. Jika Anda mencoba menghilangkannya sendiri di rumah, terutama menggunakan alat-alat yang tidak steril, maka dapat menyebabkan infeksi, jaringan parut, dan perdarahan berlebih.\n"
  },
  {
    "class": 4,
    "name": "Melanocytic Nevus",
    "link": "https://www.klikdokter.com/penyakit/masalah-kulit/nevus",
    "step": "Umumnya nevus tidak memerlukan terapi, kecuali bila pasien ingin bercak berwarna itu diangkat, atau dokter mencurigai perubahan ke arah keganasan.Terapi yang dapat dipilih pada kondisi tersebut untuk adalah eksisi sederhana nevus yang dicurigai ganas.\nEksisi adalah operasi kecil dengan melakukan anastesi setempat. Prosedur ini dapat dilakukan oleh dokter umum tanpa masuk ke kamar operasi. Tindakan ini cukup aman dengan standar operasional dan tingkat kesterilan yang baik, sehingga tidak terjadi efek samping yang mengkhawatirkan pascaoperasi.\n"
  },
  {
    "class": 5,
    "name": "Melanoma",
    "link": "https://www.halodoc.com/kesehatan/melanoma",
    "step": "Pengobatan kanker kulit mirip dengan pengobatan kanker lainnya. Namun tidak seperti kebanyakan kanker di dalam tubuh, lebih mudah untuk mengakses jaringan kanker dan menghilangkannya sepenuhnya. Untuk alasan ini, operasi adalah pilihan pengobatan standar untuk melanoma.\nJika penyakit ini dapat bermetastasis atau menyebar ke organ lain, dokter akan merekomendasikan perawatan tergantung di mana melanoma telah menyebar. Hal ini termasuk:\n1. Kemoterapi, dengan menggunakan obat yang menargetkan sel kanker.\n2. Imunoterapi, dengan menggunakan obat yang bekerja dengan sistem kekebalan untuk membantu melawan kanker.\n3. Terapi bertarget, menggunakan obat-obatan yang mengidentifikasi dan menargetkan gen atau protein tertentu yang spesifik untuk kondisi ini.\n"
  },
  {
    "class": 6,
    "name": "Vascular lesions",
    "link": "https://skinsight.com/skin-conditions/laser-vascular-lesion-treatment/#:~:text=Laser%20treatment%20is%20usually%20the,inserted%20into%20larger%20blood%20vessels",
    "step": "1. Pengobatan menggunakan laser merupakan opsi terbaik untuk vascular lesions di area wajah.\n2. Sedangkan untuk vascular lesion di daerah kaki, lebih baik menggunakan injeksi obat.\n3. Vascular lesions yang lebih kronis, dianjurkan untuk melakukan tindakan bedah atau laser kecil.\n"
  }  
]


def load_model_from_url(url):
    response = requests.get(url)
    response.raise_for_status()  # Ensure we notice bad responses
    with open("model.h5", "wb") as f:
        f.write(response.content)
    model = load_model("model.h5")
    return model

model = load_model_from_url(MODEL_URL)

def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size) 
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        response = {
            "status":"fail",
            "message":"token is expired",
        }
        raise HTTPException(status_code=500, detail="token is expired")
    except jwt.InvalidTokenError:
        response = {
            "status":"fail",
            "message":"token is invalid",
        }
        raise HTTPException(status_code=500, detail="token is invalid")
    
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "fail", "message": exc.detail}
    )

@app.post("/predict")
async def predict(image: UploadFile = File(...), token: dict = Depends(verify_token)):
    try:
        contents = await image.read()
        imageBuf = Image.open(io.BytesIO(contents))
        preprocessed_image = preprocess_image(imageBuf, target_size=(224, 224))
        prediction = model.predict(preprocessed_image)
        predicted_class = np.argmax(prediction[0])
        response = {
            "status":"success",
            "message":"successfully predict request",
            "data": classOutput[predicted_class]
        }
        return JSONResponse(content=response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="failed to predict request")


# PAY ATTENTION ON THE PORT
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
