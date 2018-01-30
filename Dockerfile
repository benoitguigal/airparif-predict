FROM python:3.6.4-jessie

ADD requirements.txt ./
RUN pip install -r requirements.txt

ADD ./ ./

ENV FLASK_APP "app/app.py"

EXPOSE 5000

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "app.app:app"]