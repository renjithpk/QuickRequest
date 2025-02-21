FROM python:3.9
WORKDIR /app
COPY . /app
RUN pip3.9 install --no-cache-dir --upgrade pip && \
    pip3.9 install --no-cache-dir fastapi uvicorn sqlalchemy
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
