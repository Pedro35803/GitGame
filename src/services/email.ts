import nodemailer from "nodemailer";
import {
  EMAIL_SERVICE_SMTP,
  HOST_SERVICE_SMTP,
  PASS_SERVICE_SMTP,
  PORT_SERVICE_SMTP,
} from "../env";

const portSMTP = Number(PORT_SERVICE_SMTP);

const transporter = nodemailer.createTransport({
  host: HOST_SERVICE_SMTP,
  port: portSMTP,
  secure: portSMTP == 465,
  auth: {
    user: EMAIL_SERVICE_SMTP,
    pass: PASS_SERVICE_SMTP,
  },
});

export const sendCodeEmail = async (email: string, code: number) => {
  await transporter.sendMail({
    from: 'GitGame "Code for Recovery Password" <maddison53@ethereal.email>',
    to: email,
    subject: "Code verify for GitGame",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Redefinição de Senha</h2>
        <p>Você solicitou a redefinição da sua senha. Utilize o código abaixo para completar o processo:</p>
        <p style="font-size: 24px; font-weight: bold;">Código: <span style="color: blue;">${code}</span></p>
        <p>Este código é válido por 24 horas. Se você não solicitou esta alteração, ignore este e-mail.</p>
        <p>Obrigado,</p>
        <p>Equipe GitGame</p>
      </div>
    `,
  });
};
