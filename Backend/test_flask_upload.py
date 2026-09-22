import urllib.request
import uuid

url = "http://127.0.0.1:5000/api/resources/upload"

boundary = "----OGLBoundary" + uuid.uuid4().hex

with open("test.pdf", "rb") as file:
    file_data = file.read()

body = (
    f"--{boundary}\r\n"
    'Content-Disposition: form-data; name="file"; filename="test-flask.pdf"\r\n'
    "Content-Type: application/pdf\r\n"
    "\r\n"
).encode() + file_data + (
    f"\r\n--{boundary}--\r\n"
).encode()

request = urllib.request.Request(
    url,
    data=body,
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(request) as response:
        print("STATUS:", response.status)
        print("RESPONSE:")
        print(response.read().decode())

except Exception as error:
    print("UPLOAD TEST ERROR:")
    print(error)