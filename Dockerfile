FROM python:3.6.4-jessie

ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD ./ ./

ENV FLASK_APP "app/app.py"

EXPOSE 5000

CMD ["flask", "run", "--host", "0.0.0.0"]