import smtplib
from email.mime.text import MIMEText

def error_message(str):
    return str.upper().replace(' ', '_')

class WesaladEmail:
    def __init__(self, from_email, to_email, mail_app_pwd):
        self.to_email = to_email
        self.from_email = from_email
        self.mail_app_pwd = mail_app_pwd
        
    def send_email(self):
        self.s = smtplib.SMTP('smtp.gmail.com', 587)
        self.s.starttls()
        self.s.login(self.from_email, self.mail_app_pwd)
        
        self.text = '원하는 프로젝트를 원하는 사람들과, Wesalad \n\nWesalad에 회원가입해 주셔서 감사합니다. \n회원님이 원하는 팀에서 목표를 이루시길 진심으로 응원합니다!!'
        
        self.msg = MIMEText(self.text)
        self.msg['Subject'] = 'Wesalad 회원가입을 축하드립니다.'
        
        self.s.sendmail(self.from_email, self.to_email, self.msg.as_string())
        self.s.quit()     