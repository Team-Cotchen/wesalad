FROM python:3.10

WORKDIR /backend-fastapi

COPY requirements.txt /backend-fastapi

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . /backend-fastapi

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]