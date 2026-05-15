import os
import smtplib
from email.message import EmailMessage
from flask import current_app


def send_new_animal_email(to_email: str, to_name: str, animal):
    smtp_host = current_app.config.get('SMTP_HOST') or os.getenv('SMTP_HOST') or 'smtp.gmail.com'
    smtp_port = int(current_app.config.get('SMTP_PORT') or os.getenv('SMTP_PORT') or 587)
    smtp_user = current_app.config.get('SMTP_USER') or os.getenv('SMTP_USER')
    smtp_password = current_app.config.get('SMTP_PASSWORD') or os.getenv('SMTP_PASSWORD')
    from_email = current_app.config.get('SMTP_FROM_EMAIL') or os.getenv('SMTP_FROM_EMAIL')
    use_tls = current_app.config.get('SMTP_USE_TLS')
    if use_tls is None:
        use_tls = os.getenv('SMTP_USE_TLS', 'true')
    use_tls = str(use_tls).lower() in ('1', 'true', 'yes')

    if not smtp_user or not smtp_password or not from_email:
        current_app.logger.warning('SMTP not configured - skipping email send')
        return

    frontend = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    subject = f"New animal added: {animal.name}"
    url = f"{frontend}/"
    html_content = (
        f"<p>Hi {to_name},</p>"
        f"<p>A new {animal.type} named <strong>{animal.name}</strong> was just added. "
        f"<a href=\"{url}\">View animals</a></p>"
    )

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_email
    msg['To'] = to_email
    msg.set_content(html_content, subtype='html')

    with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
        if use_tls:
            server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
